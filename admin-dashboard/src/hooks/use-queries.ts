// src/hooks/use-queries.ts
"use client";

import { useState, useEffect } from "react";
import type { Query, QueryResponse } from "@/types/query";

interface Stats {
  totalQueries: number;
  activeUsers: number;
  avgTokens: number;
}

export function useQueries(
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}
) {
  const [data, setData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchQueries() {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);

        const response = await fetch(`/api/queries?${searchParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch queries");
        }

        const responseData = await response.json();
        // console.log("API Response:", responseData);
        setData(responseData);
      } catch (e) {
        console.error("Query fetch error:", e);
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchQueries();
  }, [params.page, params.limit, params.search]);

  return { data, loading, error };
}
