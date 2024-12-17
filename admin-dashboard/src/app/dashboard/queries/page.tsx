// src/app/dashboard/queries/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useQueries } from "@/hooks/use-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Query } from "@/types/query";
import Link from "next/link";

export default function QueriesPage() {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [users, setUsers] = useState<{ [key: string]: string }>({});

  const { data, loading, error } = useQueries({
    page: pagination.page,
    limit: pagination.limit,
    search,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = [...new Set(data?.queries?.map((query) => query.userId))];
      if (!userIds.length) return;

      const response = await fetch(`/api/users?ids=${userIds.join(",")}`);
      const usersData = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch users:", response.statusText);
        return;
      }

      const usersArray = usersData.users;
      if (Array.isArray(usersArray)) {
        const userMap = usersArray.reduce<{ [key: string]: string }>(
          (acc, user) => {
            acc[user._id] = user.name;
            return acc;
          },
          {}
        );
        setUsers(userMap);
      }
    };

    if (data?.queries) {
      fetchUsers();
    }
  }, [data?.queries]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Queries Overview</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search queries..."
            className="pl-4 pr-10 py-2 rounded-lg w-64 bg-white focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6">
          <div className="text-sm text-gray-600">Total Queries</div>
          <div className="text-2xl font-semibold mt-1">
            {data?.stats?.totalQueries || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg p-6">
          <div className="text-sm text-gray-600">Active Users Today</div>
          <div className="text-2xl font-semibold mt-1">
            {data?.stats?.activeUsers || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg p-6">
          <div className="text-sm text-gray-600">Avg. Token Usage</div>
          <div className="text-2xl font-semibold mt-1">
            {data?.stats?.avgTokens || 0}
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-lg">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold">Recent Queries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  User
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Query
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Model
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Tokens
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-4 px-6 text-center">
                    <LoadingSpinner size="large" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 px-6 text-center text-red-500"
                  >
                    {error.message}
                  </td>
                </tr>
              ) : !data?.queries?.length ? (
                <tr>
                  <td colSpan={5} className="py-4 px-6 text-center">
                    No queries found
                  </td>
                </tr>
              ) : (
                data.queries.map((query: Query) => (
                  <tr key={query._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm">
                      <Link
                        href={`/dashboard/queries/${query._id}`}
                        className="block"
                      >
                        {users[query.userId] || "Unknown User"}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-sm">{query.prompt}</td>
                    <td className="py-4 px-6 text-sm">{query.modelUsed}</td>
                    <td className="py-4 px-6 text-sm">{query.tokensUsed}</td>
                    <td className="py-4 px-6 text-sm">
                      {formatDate(query.date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Page {data?.pagination?.page || 1} of {data?.pagination?.pages || 1}
          </div>
          <div className="space-x-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={data?.pagination?.page === 1}
              className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(data?.pagination?.pages || 1, prev.page + 1),
                }))
              }
              disabled={data?.pagination?.page === data?.pagination?.pages}
              className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
