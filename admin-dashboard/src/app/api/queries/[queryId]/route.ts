// src/app/api/queries/[queryId]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { queryId: string } }
) {
  try {
    const queryId = params.queryId;
    if (!queryId) {
      return NextResponse.json(
        { error: "Query ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Fetch the query details
    const query = await db
      .collection("queries")
      .findOne({ _id: new ObjectId(queryId) });

    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    // Fetch the user details
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(query.userId) });

    // Get related queries from the same user
    const relatedQueries = await db
      .collection("queries")
      .find({
        userId: query.userId,
        _id: { $ne: new ObjectId(queryId) },
      })
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      query,
      user: user
        ? {
            _id: user._id,
            name: user.name,
            email: user.email,
          }
        : null,
      relatedQueries,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch query details" },
      { status: 500 }
    );
  }
}
