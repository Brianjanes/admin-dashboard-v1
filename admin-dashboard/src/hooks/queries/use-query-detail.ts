// src/hooks/queries/use-query-detail.ts
"use client";

import { useState, useEffect } from "react";
import type { QueryDetailResponse } from "@/types/query";

export function useQueryDetail(queryId: string) {
  const [data, setData] = useState<QueryDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchQueryDetail() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/queries/${queryId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch query details: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (e) {
        console.error("Query detail fetch error:", e);
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    if (queryId) {
      fetchQueryDetail();
    }
  }, [queryId]);

  return { data, loading, error };
}
