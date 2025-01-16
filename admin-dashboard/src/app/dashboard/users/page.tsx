// src/app/dashboard/users/page.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useUsers } from "@/hooks/users/use-users";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { User } from "@/types/user";
import Link from "next/link";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<User["status"] | "">("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const { data, loading, error } = useUsers({
    page: pagination.page,
    limit: pagination.limit,
    search,
    status: status || undefined,
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Users Overview</h1>
        <div className="flex space-x-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as User["status"] | "")}
            className="px-4 py-2 rounded-lg bg-white focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-semibold mt-1">
            {data?.stats?.totalUsers || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg p-6">
          <div className="text-sm text-gray-600">Active Users</div>
          <div className="text-2xl font-semibold mt-1">
            {data?.stats?.activeUsers || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg p-6">
          <div className="text-sm text-gray-600">Total Token Usage</div>
          <div className="text-2xl font-semibold mt-1">
            {data?.stats?.totalTokens || 0}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold">Users List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  User
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Joined
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Last Active
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Token Usage
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-4 px-6 text-center">
                    <LoadingSpinner size="large" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 px-6 text-center text-red-500"
                  >
                    {error.message}
                  </td>
                </tr>
              ) : !data?.users?.length ? (
                <tr>
                  <td colSpan={6} className="py-4 px-6 text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                data.users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <Link
                        href={`/dashboard/users/${user._id}`}
                        className="block"
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {formatDate(user.dateJoined)}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {formatDate(user.lastActive)}
                    </td>
                    <td className="py-4 px-6 text-sm">{user.tokenUsage}</td>
                    <td className="py-4 px-6 text-sm">{user.totalAmount}</td>
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
