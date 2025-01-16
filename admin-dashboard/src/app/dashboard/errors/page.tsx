// src/app/dashboard/errors/page.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useErrors } from "@/hooks/errors/use-errors";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { ErrorEvent } from "@/types/error";
import Link from "next/link";

export default function ErrorsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ErrorEvent["status"] | "">("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const { data, loading, error } = useErrors({
    page: pagination.page,
    limit: pagination.limit,
    search,
    status: status || undefined,
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Errors Overview</h1>
        <div className="flex space-x-4">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as ErrorEvent["status"] | "")
            }
            className="px-4 py-2 rounded-lg bg-white focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
            <option value="ignored">Ignored</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search errors..."
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
          <div className="text-sm text-gray-600">Total Errors</div>
          <div className="text-2xl font-semibold mt-1">
            {data?.stats?.totalErrors || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg p-6">
          <div className="text-sm text-gray-600">Unresolved Errors</div>
          <div className="text-2xl font-semibold mt-1">
            {data?.stats?.unresolvedErrors || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg p-6">
          <div className="text-sm text-gray-600">Affected Users</div>
          <div className="text-2xl font-semibold mt-1">
            {data?.stats?.affectedUsers || 0}
          </div>
        </div>
      </div>

      {/* Errors Table */}
      <div className="bg-white rounded-lg">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold">Recent Errors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Error
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Level
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Last Seen
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                  Count
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
              ) : !data?.errors?.length ? (
                <tr>
                  <td colSpan={5} className="py-4 px-6 text-center">
                    No errors found
                  </td>
                </tr>
              ) : (
                data.errors.map((error: ErrorEvent) => (
                  <tr key={error._id.toString()} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <Link
                        href={`/dashboard/errors/${error._id}`}
                        className="block"
                      >
                        <div className="font-medium">{error.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xl">
                          {error.message}
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          error.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : error.status === "ignored"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {error.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          error.level === "error"
                            ? "bg-red-100 text-red-800"
                            : error.level === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {error.level}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {formatDate(error.lastSeen)}
                    </td>
                    <td className="py-4 px-6 text-sm">{error.count}</td>
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
