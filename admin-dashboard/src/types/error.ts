// src/types/error.ts
import { ObjectId } from "mongodb";

export interface ErrorEvent {
  _id: ObjectId;
  eventId: string;
  userId: string;
  title: string;
  type: string;
  status: "unresolved" | "resolved" | "ignored";
  environment: string;
  level: "error" | "warning" | "info";
  message: string;
  stacktrace?: string;
  context?: Record<string, string | number | boolean>;
  metadata?: Record<string, string | number | boolean>;
  tags?: string[];
  user?: {
    id: string;
    email?: string;
    username?: string;
  };
  request?: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    data?: Record<string, string | number | boolean | null>;
  };
  breadcrumbs?: Array<{
    type: string;
    category: string;
    message: string;
    timestamp: Date;
  }>;
  firstSeen: Date;
  lastSeen: Date;
  count: number;
  release?: string;
}
