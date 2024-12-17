// src/app/api/users/[userId]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { transformUser } from "@/lib/transformers";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Fetch user
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate additional metrics
    const totalQueries = await db
      .collection("queries")
      .countDocuments({ userId: userId });

    const tokenAggregation = await db
      .collection("queries")
      .aggregate([
        { $match: { userId: userId } },
        { $group: { _id: null, totalTokens: { $sum: "$tokensUsed" } } },
      ])
      .toArray();

    const transformedUser = {
      ...transformUser(user),
      totalQueries,
      totalTokens: tokenAggregation[0]?.totalTokens || 0,
    };

    return NextResponse.json({ user: transformedUser });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
