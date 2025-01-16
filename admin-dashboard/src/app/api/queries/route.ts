import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Add debug logging
    console.log("MongoDB Query:", { search, page, limit });

    const query = search
      ? {
          $or: [
            { prompt: { $regex: search, $options: "i" } },
            { modelUsed: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Debug: Log the raw queries before transformation
    const rawQueries = await db
      .collection("queries")
      .find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    console.log("Raw Queries:", rawQueries);

    // Simplify the query first to debug
    const queries = await db
      .collection("queries")
      .find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await db.collection("queries").countDocuments(query);

    // Get stats
    const stats = {
      totalQueries: await db.collection("queries").countDocuments(),
      activeUsers: await db
        .collection("queries")
        .distinct("userId", {
          date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        })
        .then((users) => users.length),
      avgTokens: await db
        .collection("queries")
        .aggregate([
          {
            $group: {
              _id: null,
              avg: { $avg: "$tokensUsed" },
            },
          },
        ])
        .toArray()
        .then((result) => Math.round(result[0]?.avg || 0)),
    };

    return NextResponse.json({
      queries,
      stats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch queries" },
      { status: 500 }
    );
  }
}
