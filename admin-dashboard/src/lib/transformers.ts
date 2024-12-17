import { User } from "@/types/user";

export function transformUser(user: any): User {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    dateJoined: user.dateJoined?.$date
      ? new Date(user.dateJoined.$date).toISOString()
      : new Date(user.dateJoined).toISOString(),
    lastActive: user.lastActive?.$date
      ? new Date(user.lastActive.$date).toISOString()
      : new Date(user.lastActive).toISOString(),
    tokenUsage: user.tokenUsage?.$numberInt
      ? parseInt(user.tokenUsage.$numberInt)
      : user.tokenUsage,
    totalAmount: user.totalAmount,
    status: user.status,
  };
}

// Optional: Add a function to handle array of users
export function transformUsers(users: any[]): User[] {
  return users.map(transformUser);
}

import { Query } from "@/types/query";

// src/lib/transformers.ts
export function transformQuery(query: any): Query {
  console.log("Transforming query:", query);
  return {
    _id: query._id.toString(),
    userId: query.userId,
    prompt: query.prompt,
    messages: query.messages?.$numberInt
      ? parseInt(query.messages.$numberInt)
      : query.messages,
    date: query.date?.$date
      ? new Date(query.date.$date).toISOString()
      : new Date(query.date).toISOString(),
    modelUsed: query.modelUsed,
    tokensUsed: query.tokensUsed?.$numberInt
      ? parseInt(query.tokensUsed.$numberInt)
      : query.tokensUsed,
  };
}

export function transformQueries(queries: any[]): Query[] {
  return queries.map(transformQuery);
}
