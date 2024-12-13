// src/hooks/use-users.ts
"use client";

import { useState, useEffect } from "react";
import type { User, UserResponse } from "@/types/user";

export function useUsers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}
) {
  const [data, setData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);

        const response = await fetch(`/api/users?${searchParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setData(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [params.page, params.limit, params.search]);

  return { data, loading, error };
}
