// src/components/users/user-list.tsx
"use client";

import { useUsers } from "@/hooks/use-users";
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
    <div className="space-y-4">
      {data.users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
}
