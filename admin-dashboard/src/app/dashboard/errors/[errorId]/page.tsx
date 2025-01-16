// src/app/dashboard/errors/[errorId]/page.tsx
"use client";

import { useState } from "react";
import { useErrorDetail } from "@/hooks/errors/use-error-detail";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ChevronDown, ChevronUp, Code, User } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PageProps {
  params: Promise<{ errorId: string }>;
}

export default function ErrorDetailPage({ params }: PageProps) {
  const { errorId } = React.use(params);
  const { data, loading, error } = useErrorDetail(errorId);
  const [isStackTraceExpanded, setIsStackTraceExpanded] = useState(true);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [isRequestExpanded, setIsRequestExpanded] = useState(false);
  const [isBreadcrumbsExpanded, setIsBreadcrumbsExpanded] = useState(false);

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
          {error?.message || "Error not found"}
        </div>
      </div>
    );
  }

  const { error: errorData } = data;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/errors"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Errors
        </Link>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Error Overview Card */}
        <div className="bg-white rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold">{errorData.title}</h2>
                <div className="text-sm text-gray-600 mt-1">
                  {errorData.message}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    errorData.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : errorData.status === "ignored"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {errorData.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    errorData.level === "error"
                      ? "bg-red-100 text-red-800"
                      : errorData.level === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {errorData.level}
                </span>
              </div>
            </div>

            {/* Error Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-sm text-gray-600">First Seen</div>
                <div className="mt-1 font-medium">
                  {formatDate(errorData.firstSeen)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Last Seen</div>
                <div className="mt-1 font-medium">
                  {formatDate(errorData.lastSeen)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Occurrences</div>
                <div className="mt-1 font-medium">{errorData.count}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Environment</div>
                <div className="mt-1 font-medium">{errorData.environment}</div>
              </div>
            </div>

            {/* Stack Trace Section */}
            {errorData.stacktrace && (
              <div className="mb-6">
                <button
                  onClick={() => setIsStackTraceExpanded(!isStackTraceExpanded)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
                >
                  {isStackTraceExpanded ? (
                    <ChevronUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                  <Code className="h-4 w-4 mr-1" />
                  Stack Trace
                </button>
                {isStackTraceExpanded && (
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                    {errorData.stacktrace}
                  </pre>
                )}
              </div>
            )}

            {/* User Information */}
            {errorData.user && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <User className="h-4 w-4" />
                  <span>User Details</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">User ID</div>
                      <div className="mt-1 font-medium">
                        {errorData.user.id}
                      </div>
                    </div>
                    {errorData.user.email && (
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="mt-1 font-medium">
                          {errorData.user.email}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Request Information */}
            {errorData.request && (
              <div className="mb-6">
                <button
                  onClick={() => setIsRequestExpanded(!isRequestExpanded)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
                >
                  {isRequestExpanded ? (
                    <ChevronUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                  Request Information
                </button>
                {isRequestExpanded && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    {errorData.request.url && (
                      <div>
                        <div className="text-sm text-gray-600">URL</div>
                        <div className="mt-1 font-medium break-all">
                          {errorData.request.url}
                        </div>
                      </div>
                    )}
                    {errorData.request.method && (
                      <div>
                        <div className="text-sm text-gray-600">Method</div>
                        <div className="mt-1 font-medium">
                          {errorData.request.method}
                        </div>
                      </div>
                    )}
                    {errorData.request.headers && (
                      <div>
                        <div className="text-sm text-gray-600">Headers</div>
                        <pre className="mt-1 bg-white p-3 rounded-md text-sm overflow-x-auto">
                          {JSON.stringify(errorData.request.headers, null, 2)}
                        </pre>
                      </div>
                    )}
                    {errorData.request.data && (
                      <div>
                        <div className="text-sm text-gray-600">
                          Request Data
                        </div>
                        <pre className="mt-1 bg-white p-3 rounded-md text-sm overflow-x-auto">
                          {JSON.stringify(errorData.request.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Context Information */}
            {errorData.context && (
              <div className="mb-6">
                <button
                  onClick={() => setIsContextExpanded(!isContextExpanded)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
                >
                  {isContextExpanded ? (
                    <ChevronUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                  Additional Context
                </button>
                {isContextExpanded && (
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                    {JSON.stringify(errorData.context, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* Breadcrumbs */}
            {errorData.breadcrumbs && errorData.breadcrumbs.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() =>
                    setIsBreadcrumbsExpanded(!isBreadcrumbsExpanded)
                  }
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
                >
                  {isBreadcrumbsExpanded ? (
                    <ChevronUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                  Error Timeline
                </button>
                {isBreadcrumbsExpanded && (
                  <div className="space-y-3">
                    {errorData.breadcrumbs.map((crumb, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 flex justify-between items-start"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {crumb.message}
                          </div>
                          <div className="text-sm text-gray-500">
                            {crumb.category} • {crumb.type}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(crumb.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Errors */}
        {data.relatedErrors && data.relatedErrors.length > 0 && (
          <div className="bg-white rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Related Errors</h2>
              <div className="space-y-4">
                {data.relatedErrors.map((relatedError) => (
                  <Link
                    key={relatedError._id.toString()}
                    href={`/dashboard/errors/${relatedError._id}`}
                    className="block p-4 rounded-lg hover:bg-gray-50"
                  >
                    <div className="font-medium mb-1">{relatedError.title}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(relatedError.lastSeen)} • {relatedError.count}{" "}
                      occurrences
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
