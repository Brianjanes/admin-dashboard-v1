// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Build search query
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await db.collection("users").find(query).toArray();

    return NextResponse.json({
      users,
      pagination: {
        total: users.length,
        page: 1,
        limit: 10,
        pages: 1,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
