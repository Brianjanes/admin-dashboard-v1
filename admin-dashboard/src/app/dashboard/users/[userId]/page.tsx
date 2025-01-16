// src/app/dashboard/users/[userId]/page.tsx
"use client";

import { useUserDetail } from "@/hooks/users/use-user-detail";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const { userId } = React.use(params);
  const { data, loading, error } = useUserDetail(userId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="text-red-500 text-center">
          {error?.message || "User not found"}
        </div>
      </div>
    );
  }

  const { user, queries } = data;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/users"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Users
        </Link>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* User Overview Card */}
        <div className="bg-white rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <div className="text-sm text-gray-600 mt-1">{user.email}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600">Joined</div>
                <div className="mt-1 font-medium">
                  {formatDate(user.dateJoined)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Last Active</div>
                <div className="mt-1 font-medium">
                  {formatDate(user.lastActive)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Token Usage</div>
                <div className="mt-1 font-medium">{user.tokenUsage}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="mt-1 font-medium">{user.totalAmount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Queries History */}
        <div className="bg-white rounded-lg">
          <div className="p-6 pb-4">
            <h2 className="text-lg font-semibold">Query History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
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
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 border-y border-gray-100">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {queries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-6 text-center text-gray-500"
                    >
                      No queries found
                    </td>
                  </tr>
                ) : (
                  queries.map((query) => (
                    <tr key={query._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <Link
                          href={`/dashboard/queries/${query._id}`}
                          className="block"
                        >
                          <div className="text-sm truncate max-w-xl">
                            {query.prompt}
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-sm">{query.modelUsed}</td>
                      <td className="py-4 px-6 text-sm">{query.tokensUsed}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            query.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : query.status === "error"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {query.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {formatDate(query.date)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
