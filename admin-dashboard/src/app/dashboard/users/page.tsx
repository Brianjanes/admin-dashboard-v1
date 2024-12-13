// src/app/dashboard/users/page.tsx
"use client";

import { useState } from "react";
import { UserList } from "@/components/users/user-list";
import { Search } from "lucide-react";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-4 pr-10 py-2 border rounded-lg w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>
      </div>
      <UserList search={search} />
    </div>
  );
}
