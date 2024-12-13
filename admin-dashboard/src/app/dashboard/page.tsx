// src/app/dashboard/page.tsx
import { Card } from "@/components/ui/card";
import { Users, MessageSquare, AlertCircle, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-x-4">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold">123</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-x-4">
            <MessageSquare className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Queries</p>
              <p className="text-2xl font-semibold">1,234</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-x-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Errors</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-x-4">
            <Activity className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Token Usage</p>
              <p className="text-2xl font-semibold">45.2k</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
