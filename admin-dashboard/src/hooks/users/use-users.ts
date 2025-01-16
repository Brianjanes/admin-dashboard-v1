// src/hooks/users/use-users.ts
"use client";

import { useState, useEffect } from "react";
import type { User, UserResponse } from "@/types/user";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  totalTokens: number;
}

interface EnhancedUserResponse extends UserResponse {
  stats: UserStats;
}

export function useUsers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: User["status"];
  } = {}
) {
  const [data, setData] = useState<EnhancedUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);
        if (params.status) searchParams.set("status", params.status);

        const response = await fetch(`/api/users?${searchParams}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (e) {
        console.error("User fetch error:", e);
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [params.page, params.limit, params.search, params.status]);

  return { data, loading, error };
}
