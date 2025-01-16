// types/dashboardMetrics.ts
export interface TimeMetrics {
  peak_hours: Record<string, number>;
  weekday_distribution: Record<string, number>;
  avg_response_time_by_model: Record<string, number[]>;
  hourly_success_rate: Record<string, { success: number; total: number }>;
}

export interface EngagementMetrics {
  users_24h: string[];
  users_7d: string[];
  new_users: string[];
  returning_users: string[];
  sessions_by_user: Record<string, number>;
  total_unique_users: number;
  active_users: number;
}

export interface ModelMetrics {
  model_error_rates: Record<string, { errors: number; total: number }>;
  model_latencies: Record<string, number[]>;
  token_usage_by_model: Record<string, number>;
  cost_by_model: Record<string, number>;
}

export interface QueryMetrics {
  query_lengths: number[];
  query_complexity: Record<string, number>;
  query_types: Record<string, number>;
  success_by_length: Record<string, { success: number; total: number }>;
  avg_query_length: number;
}

export interface DashboardMetrics {
  timestamp: Date;
  metrics: {
    usage: Record<
      string,
      {
        success: number;
        total: number;
      }
    >;
    models: Record<string, number>;
    companies: string[];
    total_duration: number;
    error_count: number;
    time_metrics: TimeMetrics;
    engagement_metrics: EngagementMetrics;
    model_metrics: ModelMetrics;
    query_metrics: QueryMetrics;
    average_response_time: number;
    error_rate: number;
  };
  time_period: {
    start: string;
    end: string;
  };
  processing_time: number;
}
