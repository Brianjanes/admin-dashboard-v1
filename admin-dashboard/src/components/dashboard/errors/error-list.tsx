// src/components/errors/error-list.tsx
"use client";

import { useErrors } from "@/hooks/errors/use-errors";
import { ErrorCard } from "./error-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ErrorListProps {
  search?: string;
  status?: string;
}

export function ErrorList({ search, status }: ErrorListProps) {
  const { data, loading, error } = useErrors({ search, status });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );

  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  if (!data?.errors?.length) return <div className="p-4">No errors found</div>;

  return (
    <div>
      <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 bg-gray-50 rounded-lg mb-2 border-solid border-2 border-gray-700">
        <div className="col-span-4">
          <p className="text-md font-bold text-gray-500">Error</p>
        </div>
        <div className="col-span-2 text-center">
          <p className="text-md font-bold text-gray-500">Status</p>
        </div>
        <div className="col-span-2 text-center">
          <p className="text-md font-bold text-gray-500">Last Seen</p>
        </div>
        <div className="col-span-1 text-center">
          <p className="text-md font-bold text-gray-500">Count</p>
        </div>
        <div className="col-span-3"></div>
      </div>
      <div className="space-y-4">
        {data.errors.map((error) => (
          <ErrorCard key={error._id.toString()} error={error} />
        ))}
      </div>
    </div>
  );
}
