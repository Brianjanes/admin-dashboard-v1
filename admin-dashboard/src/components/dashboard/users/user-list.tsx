// src/components/users/user-list.tsx
"use client";

import { useUsers } from "@/hooks/users/use-users";
import { UserCard } from "./user-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface UserListProps {
  search?: string;
}

export function UserList({ search }: UserListProps) {
  const { data, loading, error } = useUsers({ search });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );

  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  if (!data?.users?.length) return <div className="p-4">No users found</div>;

  return (
    <div>
      <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 bg-gray-50 rounded-lg mb-2 border-solid border-2 border-gray-700">
        <div className="col-span-3 pl-[52px]">
          <p className="text-md font-bold text-gray-500">Username</p>
        </div>
        <div className="col-span-1 text-center">
          <p className="text-md font-bold text-gray-500">Joined</p>
        </div>
        <div className="col-span-1 text-center">
          <p className="text-md font-bold text-gray-500">Last Active</p>
        </div>
        <div className="col-span-1 text-center">
          <p className="text-md font-bold text-gray-500">Token Usage</p>
        </div>
        <div className="col-span-1 text-center">
          <p className="text-md font-bold text-gray-500">Total Amount</p>
        </div>

        <div className="col-span-5"></div>
      </div>
      <div className="space-y-4">
        {data.users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}
