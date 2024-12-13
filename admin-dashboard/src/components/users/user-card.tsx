"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import type { User } from "@/types/user";

interface UserCardProps {
  user: User;
}

interface Query {
  _id: string;
  userId: string;
  prompt: string;
  messages: number;
  date: string;
  modelUsed: string;
  tokensUsed: number;
}

function ChatHistory({
  userId,
  userName,
  isOpen,
  onClose,
}: {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchQueries = async () => {
        try {
          const response = await fetch(`/api/users/${userId}/queries`);
          if (!response.ok) throw new Error("Failed to fetch queries");
          const data = await response.json();
          setQueries(data.queries);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchQueries();
    }
  }, [userId, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chat History - ${userName}`}
    >
      {loading ? (
        <div className="py-4 text-center">Loading chat history...</div>
      ) : error ? (
        <div className="py-4 text-center text-red-500">{error}</div>
      ) : queries.length === 0 ? (
        <div className="py-4 text-center text-gray-500">
          No chat history found
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <div key={query._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{query.prompt}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(query.date)}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="mr-4">Messages: {query.messages}</span>
                <span className="mr-4">Model: {query.modelUsed}</span>
                <span>Tokens: {query.tokensUsed}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

export function UserCard({ user }: UserCardProps) {
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-12 items-center gap-4">
          {/* User Info - 3 columns */}
          <div className="col-span-3 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-medium truncate">{user.name}</h3>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Date Joined - 2 columns */}
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Joined</p>
            <p className="text-sm">{formatDate(user.dateJoined)}</p>
          </div>

          {/* Last Active - 2 columns */}
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Last Active</p>
            <p className="text-sm">{formatDate(user.lastActive)}</p>
          </div>

          {/* Token Usage - 1 column */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Token Usage</p>
            <p className="text-sm">{user.tokenUsage}</p>
          </div>

          {/* Total Amount - 1 column */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-sm">{user.totalAmount}</p>
          </div>

          {/* Action Buttons - 3 columns */}
          <div className="col-span-3 flex justify-end space-x-2">
            <button
              onClick={() => setIsChatHistoryOpen(true)}
              className="px-4 py-1 text-sm bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200"
            >
              Chat History
            </button>
            <button className="px-4 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200">
              Errors
            </button>
          </div>
        </div>
      </div>

      <ChatHistory
        userId={user._id}
        userName={user.name}
        isOpen={isChatHistoryOpen}
        onClose={() => setIsChatHistoryOpen(false)}
      />
    </>
  );
}
