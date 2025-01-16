// src/hooks/errors/use-error-detail.ts
("use client");

import { useState, useEffect } from "react";
import type { ErrorEvent } from "@/types/error";

interface ErrorDetailResponse {
  error: ErrorEvent;
  relatedErrors: ErrorEvent[];
}

export function useErrorDetail(errorId: string) {
  const [data, setData] = useState<ErrorDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchErrorDetail() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/errors/${errorId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch error details: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (e) {
        console.error("Error detail fetch error:", e);
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    if (errorId) {
      fetchErrorDetail();
    }
  }, [errorId]);

  return { data, loading, error };
}
