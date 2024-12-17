// src/app/dashboard/users/[userId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types/user";
import type { Query } from "@/types/query";
import type { MongoDateType } from "@/types/mongodb";

interface UserDetails extends User {
  totalQueries: number;
  totalTokens: number;
}

export default function UserDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data
        const userResponse = await fetch(`/api/users/${params.userId}`);

        if (userResponse.status === 404) {
          setError("User not found");
          return;
        }

        if (userResponse.status !== 200) {
          const errorBody = await userResponse.text();
          throw new Error(
            `Failed to fetch user: ${userResponse.status} - ${errorBody}`
          );
        }

        const userData = await userResponse.json();

        // Fetch queries
        const queriesResponse = await fetch(
          `/api/users/${params.userId}/queries`
        );

        if (queriesResponse.status !== 200) {
          const errorBody = await queriesResponse.text();
          throw new Error(
            `Failed to fetch queries: ${queriesResponse.status} - ${errorBody}`
          );
        }

        const queriesData = await queriesResponse.json();

        setUser(userData.user);
        setQueries(queriesData.queries || []);
      } catch (error) {
        console.error("Detailed Fetch Error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching user data"
        );
      } finally {
        setLoading(false);
      }
    }

    if (params.userId) {
      fetchUserData();
    }
  }, [params.userId]);

  const formatMongoDate = (dateField: MongoDateType | string | Date) => {
    if (!dateField) return "";

    if (typeof dateField === "object" && "$date" in dateField) {
      if ("$numberLong" in dateField.$date) {
        return formatDate(new Date(parseInt(dateField.$date.$numberLong)));
      }
      return formatDate(new Date(dateField.$date));
    }

    return formatDate(dateField);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <Link
        href="/dashboard/users"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Users
      </Link>

      {/* User Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <div className="text-sm text-gray-500">
            Status:{" "}
            <span
              className={`font-medium ${
                user.status === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-500">Joined</p>
            <p className="text-lg font-medium">
              {formatMongoDate(user.dateJoined)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Queries</p>
            <p className="text-lg font-medium">{user.totalQueries}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Token Usage</p>
            <p className="text-lg font-medium">{user.totalTokens}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-lg font-medium">{user.totalAmount}</p>
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Chat History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 w-[45%]">
                  Query
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 w-[15%]">
                  Model
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 w-[15%]">
                  Tokens
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 w-[25%]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {queries.map((query) => (
                <tr
                  key={query._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/dashboard/queries/${query._id}`)
                  }
                >
                  <td className="py-4 px-6 text-sm truncate">{query.prompt}</td>
                  <td className="py-4 px-6 text-sm">{query.modelUsed}</td>
                  <td className="py-4 px-6 text-sm">{query.tokensUsed}</td>
                  <td className="py-4 px-6 text-sm whitespace-nowrap">
                    {formatDate(query.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
