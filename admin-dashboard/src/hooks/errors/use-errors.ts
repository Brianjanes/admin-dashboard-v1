// src/hooks/errors/use-errors.ts
"use client";

import { useState, useEffect } from "react";
import type { ErrorEvent } from "@/types/error";

interface ErrorResponse {
  errors: ErrorEvent[];
  stats?: {
    totalErrors: number;
    unresolvedErrors: number;
    affectedUsers: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function useErrors(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}
) {
  const [data, setData] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchErrors() {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);
        if (params.status) searchParams.set("status", params.status);

        const response = await fetch(`/api/errors?${searchParams}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch errors: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (e) {
        console.error("Error fetch error:", e);
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchErrors();
  }, [params.page, params.limit, params.search, params.status]);

  return { data, loading, error };
}
