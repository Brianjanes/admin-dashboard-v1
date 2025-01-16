// models/DashboardMetrics.ts
import mongoose from "mongoose";
import type { DashboardMetrics } from "@/types/dashboardMetrics";

const dashboardMetricsSchema = new mongoose.Schema<DashboardMetrics>(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    metrics: {
      usage: { type: Map, of: mongoose.Schema.Types.Mixed },
      models: { type: Map, of: Number },
      companies: [String],
      total_duration: Number,
      error_count: Number,
      time_metrics: {
        peak_hours: { type: Map, of: Number },
        weekday_distribution: { type: Map, of: Number },
        avg_response_time_by_model: { type: Map, of: [Number] },
        hourly_success_rate: {
          type: Map,
          of: new mongoose.Schema({
            success: Number,
            total: Number,
          }),
        },
      },
      engagement_metrics: {
        users_24h: [String],
        users_7d: [String],
        new_users: [String],
        returning_users: [String],
        sessions_by_user: { type: Map, of: Number },
        total_unique_users: Number,
        active_users: Number,
      },
      model_metrics: {
        model_error_rates: {
          type: Map,
          of: new mongoose.Schema({
            errors: Number,
            total: Number,
          }),
        },
        model_latencies: { type: Map, of: [Number] },
        token_usage_by_model: { type: Map, of: Number },
        cost_by_model: { type: Map, of: Number },
      },
      query_metrics: {
        query_lengths: [Number],
        query_complexity: { type: Map, of: Number },
        query_types: { type: Map, of: Number },
        success_by_length: {
          type: Map,
          of: new mongoose.Schema({
            success: Number,
            total: Number,
          }),
        },
        avg_query_length: Number,
      },
      average_response_time: Number,
      error_rate: Number,
    },
    time_period: {
      start: String,
      end: String,
    },
    processing_time: Number,
  },
  {
    timestamps: true,
  }
);

export const DashboardMetricsModel =
  mongoose.models.DashboardMetrics ||
  mongoose.model<DashboardMetrics>("DashboardMetrics", dashboardMetricsSchema);
