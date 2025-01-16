// src/hooks/users/use-user-detail.ts
"use client";

import { useState, useEffect } from "react";
import type { User } from "@/types/user";
import type { Query } from "@/types/query";

interface UserDetails extends User {
  totalQueries: number;
  totalTokens: number;
}

interface UserDetailResponse {
  user: UserDetails;
  queries: Query[];
}

export function useUserDetail(userId: string) {
  const [data, setData] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserDetail() {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data and queries in parallel
        const [userResponse, queriesResponse] = await Promise.all([
          fetch(`/api/users/${userId}`),
          fetch(`/api/users/${userId}/queries`),
        ]);

        if (!userResponse.ok) {
          throw new Error(
            `Failed to fetch user details: ${userResponse.status}`
          );
        }

        if (!queriesResponse.ok) {
          throw new Error(
            `Failed to fetch user queries: ${queriesResponse.status}`
          );
        }

        const [userData, queriesData] = await Promise.all([
          userResponse.json(),
          queriesResponse.json(),
        ]);

        setData({
          user: userData.user,
          queries: queriesData.queries || [],
        });
      } catch (e) {
        console.error("User detail fetch error:", e);
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  return { data, loading, error };
}
