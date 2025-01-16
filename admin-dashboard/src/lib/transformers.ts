import { User } from "@/types/user";
import { Query, Message } from "@/types/query";
import type { WithId, Document } from "mongodb";

export interface MongoUser extends WithId<Document> {
  name: string;
  email: string;
  dateJoined: { $date: string } | Date;
  lastActive: { $date: string } | Date;
  tokenUsage: { $numberInt: string } | number;
  totalAmount: number;
  status: string;
}

export interface MongoMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: { $date: string } | Date;
  metadata?: {
    tokensUsed?: { $numberInt: string } | number;
    modelUsed?: string;
    processingTime?: { $numberInt: string } | number;
  };
}

export interface MongoQuery extends WithId<Document> {
  userId: string;
  prompt: string;
  modelUsed: string;
  tokensUsed: { $numberInt: string } | number;
  date: { $date: string } | Date;
  status: "completed" | "error" | "in_progress";
  messages: MongoMessage[];
  metadata?: {
    totalProcessingTime?: { $numberInt: string } | number;
    error?: string;
    context?: {
      documents?: string[];
      apps?: string[];
    };
  };
}

export function transformMessage(message: MongoMessage): Message {
  return {
    role: message.role,
    content: message.content,
    timestamp: new Date(
      "$date" in message.timestamp ? message.timestamp.$date : message.timestamp
    ).toISOString(),
    ...(message.metadata && {
      metadata: {
        ...(message.metadata.tokensUsed && {
          tokensUsed:
            typeof message.metadata.tokensUsed === "number"
              ? message.metadata.tokensUsed
              : parseInt(message.metadata.tokensUsed.$numberInt),
        }),
        ...(message.metadata.modelUsed && {
          modelUsed: message.metadata.modelUsed,
        }),
        ...(message.metadata.processingTime && {
          processingTime:
            typeof message.metadata.processingTime === "number"
              ? message.metadata.processingTime
              : parseInt(message.metadata.processingTime.$numberInt),
        }),
      },
    }),
  };
}

function validateStatus(status: string): "active" | "inactive" {
  if (status !== "active" && status !== "inactive") {
    throw new Error(
      `Invalid status: ${status}. Must be either "active" or "inactive"`
    );
  }
  return status;
}

export function transformUser(user: MongoUser): User {
  const id = user._id.toString();
  return {
    _id: id,
    id,
    name: user.name,
    email: user.email,
    dateJoined: new Date(
      "$date" in user.dateJoined ? user.dateJoined.$date : user.dateJoined
    ).toISOString(),
    lastActive: new Date(
      "$date" in user.lastActive ? user.lastActive.$date : user.lastActive
    ).toISOString(),
    tokenUsage:
      typeof user.tokenUsage === "number"
        ? user.tokenUsage
        : parseInt(user.tokenUsage.$numberInt),
    totalAmount: user.totalAmount.toString(),
    status: validateStatus(user.status),
  };
}

export function transformQuery(query: MongoQuery): Query {
  return {
    _id: query._id.toString(),
    userId: query.userId,
    prompt: query.prompt,
    modelUsed: query.modelUsed,
    tokensUsed:
      typeof query.tokensUsed === "number"
        ? query.tokensUsed
        : parseInt(query.tokensUsed.$numberInt),
    date: new Date(
      "$date" in query.date ? query.date.$date : query.date
    ).toISOString(),
    status: query.status,
    messages: query.messages.map(transformMessage),
    ...(query.metadata && {
      metadata: {
        ...(query.metadata.totalProcessingTime && {
          totalProcessingTime:
            typeof query.metadata.totalProcessingTime === "number"
              ? query.metadata.totalProcessingTime
              : parseInt(query.metadata.totalProcessingTime.$numberInt),
        }),
        ...(query.metadata.error && {
          error: query.metadata.error,
        }),
        ...(query.metadata.context && {
          context: query.metadata.context,
        }),
      },
    }),
  };
}

export function transformUsers(users: MongoUser[]): User[] {
  return users.map(transformUser);
}

export function transformQueries(queries: MongoQuery[]): Query[] {
  return queries.map(transformQuery);
}
