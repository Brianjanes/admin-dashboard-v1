"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/dashboard/queries",
    label: "Queries",
    icon: MessageSquare,
  },
  {
    href: "/dashboard/errors",
    label: "Errors",
    icon: AlertCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r h-full">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>
      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                size={20}
                className={isActive ? "text-gray-900" : "text-gray-400"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
