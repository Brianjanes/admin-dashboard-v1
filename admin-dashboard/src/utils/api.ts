// utils/api.ts
interface ChatHistoryResponse {
  chat_history: {
    timestamp: string;
    question: string;
    response: string;
    error: string | null;
    runtime: number | null;
  }[];
}

interface UsageMetrics {
  total_tokens: number;
  input_tokens: number;
  output_tokens: number;
  model_usage: Record<string, number>;
  cost: number;
}

const API_BASE_URL = "http://localhost:8000/api";

export const fetchChatHistory = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<ChatHistoryResponse> => {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("start_date", startDate);
  if (endDate) queryParams.append("end_date", endDate);

  const response = await fetch(
    `${API_BASE_URL}/chat-history/${userId}?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const fetchUsageMetrics = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<UsageMetrics> => {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("start_date", startDate);
  if (endDate) queryParams.append("end_date", endDate);

  const response = await fetch(
    `${API_BASE_URL}/usage-metrics/${userId}?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Example usage in a component:
// pages/dashboard/[userId].tsx
import { useEffect, useState } from "react";
import { fetchChatHistory, fetchUsageMetrics } from "@/utils/api";

export default function UserDashboard({ userId }: { userId: string }) {
  const [chatHistory, setChatHistory] = useState<ChatHistoryResponse | null>(
    null
  );
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [chatData, metricsData] = await Promise.all([
          fetchChatHistory(userId),
          fetchUsageMetrics(userId),
        ]);

        setChatHistory(chatData);
        setUsageMetrics(metricsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Render your dashboard components using chatHistory and usageMetrics */}
    </div>
  );
}
