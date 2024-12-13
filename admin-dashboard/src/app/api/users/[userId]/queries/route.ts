// src/app/api/users/[userId]/queries/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const queries = await db
      .collection("queries")
      .find({ userId: params.userId })
      .sort({ date: -1 }) // Most recent first
      .toArray();

    return NextResponse.json({ queries });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user queries" },
      { status: 500 }
    );
  }
}
