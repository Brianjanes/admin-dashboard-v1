// src/components/errors/error-card.tsx
"use client";

import { formatDate } from "@/lib/utils";
import type { ErrorEvent } from "@/types/error";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface ErrorCardProps {
  error: ErrorEvent;
}

export function ErrorCard({ error }: ErrorCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-100";
      case "ignored":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-red-600 bg-red-100";
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-medium truncate">{error.title}</h3>
            <p className="text-sm text-gray-500 truncate">{error.message}</p>
          </div>
        </div>

        <div className="col-span-2 text-center">
          <span
            className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
              error.status
            )}`}
          >
            {error.status}
          </span>
        </div>

        <div className="col-span-2 text-center">
          <p className="text-sm">{formatDate(error.lastSeen)}</p>
        </div>

        <div className="col-span-1 text-center">
          <p className="text-sm">{error.count}</p>
        </div>

        <div className="col-span-3 flex justify-end">
          <Link
            href={`/dashboard/errors/${error._id}`}
            className="px-4 py-1 text-sm bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
