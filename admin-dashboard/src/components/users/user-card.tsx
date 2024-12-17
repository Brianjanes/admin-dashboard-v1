// src/components/users/user-card.tsx
"use client";

import { formatDate } from "@/lib/utils";
import type { User } from "@/types/user";
import Link from "next/link";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-3 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-medium truncate">{user.name}</h3>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        <div className="col-span-2">
          <p className="text-sm text-gray-500">Joined</p>
          <p className="text-sm">{formatDate(user.dateJoined)}</p>
        </div>

        <div className="col-span-2">
          <p className="text-sm text-gray-500">Last Active</p>
          <p className="text-sm">{formatDate(user.lastActive)}</p>
        </div>

        <div className="col-span-1">
          <p className="text-sm text-gray-500">Token Usage</p>
          <p className="text-sm">{user.tokenUsage}</p>
        </div>

        <div className="col-span-1">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-sm">{user.totalAmount}</p>
        </div>

        <div className="col-span-3 flex justify-end">
          <Link
            href={`/dashboard/users/${user._id}`}
            className="px-4 py-1 text-sm bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200"
          >
            View User Details
          </Link>
        </div>
      </div>
    </div>
  );
}
