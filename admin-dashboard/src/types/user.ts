// src/types/user.ts
export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  dateJoined: string; // ISO date string
  lastActive: string; // ISO date string
  tokenUsage: number;
  totalAmount: string;
  status: "active" | "inactive";
}

export interface UserResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
