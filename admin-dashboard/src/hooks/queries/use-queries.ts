// src/hooks/queries/use-queries.ts
"use client";

import { useState, useEffect } from "react";
import type { QueryResponse } from "@/types/query";

export function useQueries(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    userId?: string;
    status?: "completed" | "error" | "in_progress";
  } = {}
) {
  const [data, setData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchQueries() {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);
        if (params.userId) searchParams.set("userId", params.userId);
        if (params.status) searchParams.set("status", params.status);

        const response = await fetch(`/api/queries?${searchParams}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch queries: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (e) {
        console.error("Query fetch error:", e);
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchQueries();
  }, [params.page, params.limit, params.search, params.userId, params.status]);

  return { data, loading, error };
}
