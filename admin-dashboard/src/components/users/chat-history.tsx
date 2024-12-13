// src/components/users/chat-history.tsx
"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";

interface Query {
  _id: string;
  userId: string;
  prompt: string;
  messages: number;
  date: string;
  modelUsed: string;
  tokensUsed: number;
}

interface ChatHistoryProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatHistory({
  userId,
  userName,
  isOpen,
  onClose,
}: ChatHistoryProps) {
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
