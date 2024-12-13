// src/lib/api/users.ts
import type { User, UserResponse } from "@/types/user";

export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<UserResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);

  const response = await fetch(`/api/users?${searchParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function getUserById(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export async function getUserQueries(userId: string) {
  const response = await fetch(`/api/users/${userId}/queries`);
  if (!response.ok) {
    throw new Error("Failed to fetch user queries");
  }

  return response.json();
}

export async function getUserErrors(userId: string) {
  const response = await fetch(`/api/users/${userId}/errors`);
  if (!response.ok) {
    throw new Error("Failed to fetch user errors");
  }

  return response.json();
}
