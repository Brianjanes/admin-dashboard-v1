// src/types/user.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  dateJoined: string | Date;
  lastActive: string | Date;
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
