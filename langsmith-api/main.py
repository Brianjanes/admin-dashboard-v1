from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from langsmith import Client
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Tuple
import os
from dotenv import load_dotenv
import asyncio
from collections import defaultdict
from cachetools import TTLCache
import time
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_TIMEOUT = 30
MAX_PARALLEL_REQUESTS = 3 
PAGE_SIZE = 100

client = Client(api_key=os.getenv("LANGCHAIN_API_KEY"))

if not os.getenv("LANGCHAIN_PROJECT"):
    raise ValueError("LANGCHAIN_PROJECT environment variable is not set")

runs_cache = TTLCache(maxsize=128, ttl=300)
executor = ThreadPoolExecutor(max_workers=MAX_PARALLEL_REQUESTS)

def get_cache_key(start_time: datetime, end_time: datetime, page: int, user_id: str = None) -> str:
    return f"{start_time.isoformat()}_{end_time.isoformat()}_{page}_{user_id if user_id else 'all'}"

def fetch_runs(start_time: datetime, end_time: datetime, page: int, user_id: str = None) -> List[dict]:
    """Fetch only root runs with caching"""
    cache_key = get_cache_key(start_time, end_time, page, user_id)
    
    if cache_key in runs_cache:
        return runs_cache[cache_key]
        
    print(f"Fetching page {page}, range: {start_time.date()} to {end_time.date()}")
    
    filter_dict = {
    "$or": [
        {"is_root": True},
        {"parent_run_id": None}
    ]
}
    
    if user_id:
        filter_dict["$or"] = [
            {"metadata.user_id": user_id},
            {"inputs.user_profile.userId": user_id}
        ]
        
    runs = list(client.list_runs(
        project_name=os.getenv("LANGCHAIN_PROJECT"),
        start_time=start_time,
        end_time=end_time,
        limit=PAGE_SIZE,
        offset=page * PAGE_SIZE,
        filter_=filter_dict
    ))
    
    runs_cache[cache_key] = runs
    return runs

async def fetch_runs_with_retry(start_time: datetime, end_time: datetime, page: int, user_id: str = None) -> Tuple[List[dict], bool]:
    """Fetch runs with retry logic and root run filtering"""
    cache_key = get_cache_key(start_time, end_time, page, user_id)
    
    if cache_key in runs_cache:
        return runs_cache[cache_key], True

    retries = 3
    for attempt in range(retries):
        try:
            filter_dict = {
                "is_root": True  # Only root runs
            }
            
            if user_id:
                filter_dict["$or"] = [
                    {"metadata.user_id": user_id},
                    {"inputs.user_profile.userId": user_id}
                ]

            loop = asyncio.get_event_loop()
            runs = await loop.run_in_executor(
                executor,
                lambda: list(client.list_runs(
                    project_name=os.getenv("LANGCHAIN_PROJECT"),
                    start_time=start_time,
                    end_time=end_time,
                    limit=PAGE_SIZE,
                    offset=page * PAGE_SIZE,
                    filter_=filter_dict
                ))
            )

            if runs:
                print("Sample Run Data:")
                print(f"Run ID: {runs[0].id if hasattr(runs[0], 'id') else 'No ID'}")
                print(f"Inputs: {runs[0].inputs if hasattr(runs[0], 'inputs') else 'No inputs'}")
                print(f"Extra: {runs[0].extra if hasattr(runs[0], 'extra') else 'No extra'}")
            
            runs_cache[cache_key] = runs
            return runs, True
            
        except Exception as e:
            if attempt == retries - 1:
                print(f"Failed to fetch runs after {retries} attempts: {str(e)}")
                return [], False
            await asyncio.sleep(1 * (attempt + 1))

async def fetch_all_runs_parallel(start_time: datetime, end_time: datetime, user_id: str = None) -> List[dict]:
    all_runs = []
    page = 0
    tasks = []
    
    initial_runs, success = await fetch_runs_with_retry(start_time, end_time, 0, user_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to fetch initial data")
    
    all_runs.extend(initial_runs)
    
    if len(initial_runs) == PAGE_SIZE:
        page = 1
        while True:
            if len(tasks) >= MAX_PARALLEL_REQUESTS:
                done, tasks = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
                for task in done:
                    runs, success = await task
                    if success and runs:
                        all_runs.extend(runs)
                    if not runs:
                        break
            
            if len(initial_runs) < PAGE_SIZE:
                break
                
            tasks.add(asyncio.create_task(fetch_runs_with_retry(start_time, end_time, page, user_id)))
            page += 1
        
        if tasks:
            done, _ = await asyncio.wait(tasks)
            for task in done:
                runs, success = await task
                if success and runs:
                    all_runs.extend(runs)
    
    return all_runs

async def process_metrics_batch(runs: List[dict]) -> Dict:
   """Process a batch of runs for metrics with improved data extraction"""
   print(f"Processing {len(runs)} runs...")
   
   current_time = datetime.now(timezone.utc)
   one_day_ago = current_time - timedelta(days=1)
   seven_days_ago = current_time - timedelta(days=7)

   def ensure_timezone(dt):
    """Ensure datetime is timezone-aware"""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt
   
   metrics = {
       "usage": {},
       "unique_users": set(),
       "models": defaultdict(int),
       "companies": set(),
       "total_duration": 0,
       "error_count": 0,
       "time_metrics": {
           "peak_hours": defaultdict(int),
           "weekday_distribution": defaultdict(int),
           "avg_response_time_by_model": defaultdict(list),
           "hourly_success_rate": defaultdict(lambda: {"success": 0, "total": 0})
       },
       "engagement_metrics": {
           "users_24h": set(),
           "users_7d": set(),
           "new_users": set(),
           "returning_users": set(),
           "sessions_by_user": defaultdict(int),
           "total_unique_users": 0,
           "active_users": 0
       },
       "model_metrics": {
           "model_error_rates": defaultdict(lambda: {"errors": 0, "total": 0}),
           "model_latencies": defaultdict(list),
           "token_usage_by_model": defaultdict(int),
           "cost_by_model": defaultdict(float)
       },
       "query_metrics": {
           "query_lengths": [],
           "query_complexity": defaultdict(int),
           "query_types": defaultdict(int),
           "success_by_length": defaultdict(lambda: {"success": 0, "total": 0}),
           "avg_query_length": 0
       }
   }
   
   seen_users = set()
   first_seen_times = {}
   
   for run in runs:
       try:
           # Extract user and company info from metadata
           user_id = None
           company = None
           model = None
           
           if hasattr(run, 'extra') and isinstance(run.extra, dict):
               metadata = run.extra.get('metadata', {})
               if isinstance(metadata, dict):
                   # Get user info
                   user_id = metadata.get('user_id')
                   company = metadata.get('company')
                   
                   # Get model info
                   model = metadata.get('ls_model_name')
                   if model:
                       metrics["models"][model] += 1
                       
                       # Get token usage
                       token_usage = metadata.get('token_usage', {})
                       if isinstance(token_usage, dict):
                           input_tokens = token_usage.get('prompt_tokens', 0)
                           output_tokens = token_usage.get('completion_tokens', 0)
                           total_tokens = input_tokens + output_tokens
                           metrics["model_metrics"]["token_usage_by_model"][model] += total_tokens
                           
                           # Calculate costs
                           cost_per_token = {
                               "gpt-4o-mini": 0.00001,
                               "gpt-4o": 0.00003,
                               "llama3-70b-8192": 0.00001
                           }.get(model, 0.00001)
                           
                           metrics["model_metrics"]["cost_by_model"][model] += total_tokens * cost_per_token
           
           # Backup user extraction from inputs if not in metadata
           if not user_id and hasattr(run, 'inputs'):
               inputs = run.inputs
               if isinstance(inputs, dict):
                   user_profile = inputs.get('user_profile', {})
                   if isinstance(user_profile, dict):
                       user_id = user_profile.get('userId')
                       if not company:
                           company = user_profile.get('company')
           
           # Process user metrics if we found a user
           if user_id:
               user_id = str(user_id)  # Ensure string format
               metrics["unique_users"].add(user_id)
               
               # Track user engagement
               if hasattr(run, 'start_time'):
                   start_time = run.start_time
                   if isinstance(start_time, str):
                       start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
                   start_time = ensure_timezone(start_time)  # Make sure it's timezone-aware
                   
                   if start_time >= ensure_timezone(one_day_ago):
                       metrics["engagement_metrics"]["users_24h"].add(user_id)
                   if start_time >= ensure_timezone(seven_days_ago):
                       metrics["engagement_metrics"]["users_7d"].add(user_id)
                   
                   if user_id not in first_seen_times:
                       first_seen_times[user_id] = start_time
                       metrics["engagement_metrics"]["new_users"].add(user_id)
                   elif start_time > first_seen_times[user_id]:
                       metrics["engagement_metrics"]["returning_users"].add(user_id)
                       
               metrics["engagement_metrics"]["sessions_by_user"][user_id] += 1

           # Process company info
           if company:
               metrics["companies"].add(str(company))

           # In the company extraction part:
           if company:
               # Clean up company name
               company = str(company).strip()
               if 'atlantiq' in company.lower():
                  company = 'Atlantiq AI'
               metrics["companies"].add(company)

           # Process timing metrics
           if hasattr(run, 'start_time'):
               start_time = run.start_time
               if isinstance(start_time, str):
                   start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
                   
               hour = start_time.strftime('%H:00')
               weekday = start_time.strftime('%A')
               metrics["time_metrics"]["peak_hours"][hour] += 1
               metrics["time_metrics"]["weekday_distribution"][weekday] += 1
               
               if hasattr(run, 'end_time') and run.end_time:
                   end_time = run.end_time
                   if isinstance(end_time, str):
                       end_time = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
                       
                   duration = (end_time - start_time).total_seconds()
                   metrics["total_duration"] += duration
                   
                   if model:
                       metrics["time_metrics"]["avg_response_time_by_model"][model].append(duration)
                       metrics["model_metrics"]["model_latencies"][model].append(duration)

           # Process query metrics
           if hasattr(run, 'inputs') and isinstance(run.inputs, dict):
               query = None
               # Try multiple possible locations for the query
               if 'user_input' in run.inputs:
                   query = run.inputs['user_input']
               elif 'user_q' in run.inputs:
                   query = run.inputs['user_q']
               elif 'input' in run.inputs:
                   query = run.inputs['input']
               
               if isinstance(query, str) and query.strip():  # Only process non-empty queries
                   query_length = len(query)
                   metrics["query_metrics"]["query_lengths"].append(query_length)
                   
                   complexity = "short" if query_length < 100 else "medium" if query_length < 500 else "long"
                   metrics["query_metrics"]["query_complexity"][complexity] += 1
                   
                   length_bucket = query_length // 100 * 100
                   metrics["query_metrics"]["success_by_length"][length_bucket]["total"] += 1
                   if not hasattr(run, 'error') or not run.error:
                       metrics["query_metrics"]["success_by_length"][length_bucket]["success"] += 1

           # Handle error counting
           if hasattr(run, 'error') and run.error:
               metrics["error_count"] += 1
               if model:
                   metrics["model_metrics"]["model_error_rates"][model]["errors"] += 1
           if model:
               metrics["model_metrics"]["model_error_rates"][model]["total"] += 1

       except Exception as e:
           print(f"Error processing run: {str(e)}")
           continue

   # Calculate final engagement metrics
   metrics["engagement_metrics"]["total_unique_users"] = len(metrics["unique_users"])
   metrics["engagement_metrics"]["active_users"] = len(metrics["engagement_metrics"]["users_7d"])
   
   # Calculate average query length if we have queries
   if metrics["query_metrics"]["query_lengths"]:
       non_zero_lengths = [l for l in metrics["query_metrics"]["query_lengths"] if l > 0]
       if non_zero_lengths:
           metrics["query_metrics"]["avg_query_length"] = sum(non_zero_lengths) / len(non_zero_lengths)
   
   return metrics

@app.get("/api/dashboard/overview")
async def get_dashboard_overview(
    days: int = Query(default=7, ge=1, le=30)
):
    try:
        start_time = time.time()
        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)
        
        print(f"Fetching overview data for {days} days...")
        all_runs = await fetch_all_runs_parallel(start_date, end_date)
        print(f"Processing {len(all_runs)} runs...")
        
        metrics = await process_metrics_batch(all_runs)
        
        total_runs = len(all_runs)
        if total_runs > 0:
            metrics["average_response_time"] = round(metrics["total_duration"] / total_runs, 3)
            metrics["error_rate"] = round((metrics["error_count"] / total_runs) * 100, 2)
        
        metrics["unique_users"] = list(metrics["unique_users"])
        metrics["companies"] = list(metrics["companies"])
        metrics["engagement_metrics"]["users_24h"] = list(metrics["engagement_metrics"]["users_24h"])
        metrics["engagement_metrics"]["users_7d"] = list(metrics["engagement_metrics"]["users_7d"])
        metrics["engagement_metrics"]["new_users"] = list(metrics["engagement_metrics"]["new_users"])
        metrics["engagement_metrics"]["returning_users"] = list(metrics["engagement_metrics"]["returning_users"])
        
        if metrics["query_metrics"]["query_lengths"]:
            metrics["query_metrics"]["avg_query_length"] = sum(metrics["query_metrics"]["query_lengths"]) / len(metrics["query_metrics"]["query_lengths"])
        
        end_time = time.time()
        processing_time = round(end_time - start_time, 2)
        
        return {
            "metrics": metrics,
            "time_period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "processing_time": processing_time
        }

    except Exception as e:
        print(f"Error in dashboard overview: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error in dashboard overview: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)