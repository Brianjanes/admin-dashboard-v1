// src/types/query.ts
import type { User } from "@/types/user";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    tokensUsed?: number;
    modelUsed?: string;
    processingTime?: number;
    // Add any other message-specific metadata
  };
}

export interface Query {
  _id: string;
  userId: string;
  prompt: string; // Initial prompt
  modelUsed: string; // Overall model used
  tokensUsed: number; // Total tokens for the conversation
  date: string; // Start time of conversation
  status: "completed" | "error" | "in_progress";
  messages: Message[]; // Full conversation history
  metadata?: {
    totalProcessingTime?: number;
    error?: string;
    context?: {
      documents?: string[]; // References to documents used
      apps?: string[]; // Connected apps used
    };
    // Any other conversation-level metadata
  };
}

export interface QueryDetailResponse {
  query: Query;
  user: User | null;
  relatedQueries: Query[];
}

export interface QueryResponse {
  queries: Query[];
  stats: {
    totalQueries: number;
    activeUsers: number;
    avgTokens: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
