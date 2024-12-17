// src/app/api/users/[userId]/queries/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { transformQueries } from "@/lib/transformers";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const queries = await db
      .collection("queries")
      .find({ userId: userId })
      .sort({ date: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      queries: transformQueries(queries),
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user queries" },
      { status: 500 }
    );
  }
}
