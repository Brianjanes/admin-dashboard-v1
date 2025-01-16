// src/app/dashboard/queries/[queryId]/page.tsx
"use client";

import { useQueryDetail } from "@/hooks/queries/use-query-detail";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ChevronDown, ChevronUp, Clock, Zap } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface PageProps {
  params: Promise<{ queryId: string }>;
}

export default function QueryDetailPage({ params }: PageProps) {
  const { queryId } = React.use(params);
  const { data, loading, error } = useQueryDetail(queryId);
  const [isExpanded, setIsExpanded] = useState(false);

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
          {error?.message || "Query not found"}
        </div>
      </div>
    );
  }

  const { query, user, relatedQueries } = data;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/queries"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Queries
        </Link>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Query Overview Card */}
        <div className="bg-white rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold">Query Details</h2>
                <div className="text-sm text-gray-600 mt-1">
                  Started {formatDate(query.date)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    query.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : query.status === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {query.status}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-6">
              <div className="text-sm text-gray-600">User</div>
              <div className="mt-1">
                <Link
                  href={`/dashboard/users/${query.userId}`}
                  className="font-medium hover:text-blue-600"
                >
                  {user?.name || "Unknown User"}
                </Link>
                {user?.email && (
                  <div className="text-sm text-gray-600">{user.email}</div>
                )}
              </div>
            </div>

            {/* Query Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-sm text-gray-600">Model Used</div>
                <div className="mt-1 font-medium">{query.modelUsed}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Tokens</div>
                <div className="mt-1 font-medium">{query.tokensUsed}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Processing Time</div>
                <div className="mt-1 font-medium">
                  {query.metadata?.totalProcessingTime
                    ? `${query.metadata.totalProcessingTime}ms`
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Context</div>
                <div className="mt-1 font-medium">
                  {query.metadata?.context?.documents?.length || 0} documents
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {isExpanded ? "Hide Chat History" : "Show Chat History"}
              </button>

              {isExpanded && (
                <div className="space-y-4">
                  {query.messages?.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-50 ml-auto max-w-2xl"
                          : "bg-gray-50 mr-auto max-w-2xl"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">
                          {message.role === "user" ? user?.name : "Jarbiz"}
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(message.timestamp)}</span>
                        </div>
                      </div>
                      <div className="text-sm">{message.content}</div>
                      {message.metadata && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {message.metadata.modelUsed && (
                              <div className="flex items-center">
                                <Zap className="h-3 w-3 mr-1" />
                                {message.metadata.modelUsed}
                              </div>
                            )}
                            {message.metadata.tokensUsed && (
                              <div>{message.metadata.tokensUsed} tokens</div>
                            )}
                            {message.metadata.processingTime && (
                              <div>{message.metadata.processingTime}ms</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Queries */}
        {relatedQueries.length > 0 && (
          <div className="bg-white rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Related Queries</h2>
              <div className="space-y-4">
                {relatedQueries.map((relatedQuery) => (
                  <Link
                    key={relatedQuery._id}
                    href={`/dashboard/queries/${relatedQuery._id}`}
                    className="block p-4 rounded-lg hover:bg-gray-50"
                  >
                    <div className="font-medium mb-1">
                      {relatedQuery.prompt}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(relatedQuery.date)} · {relatedQuery.modelUsed}{" "}
                      · {relatedQuery.tokensUsed} tokens
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
