// src/app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { transformUser, transformQuery } from "@/lib/transformers";

export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db(process.env.MONGODB_DB);

    // Get total users
    const totalUsers = await db.collection("users").countDocuments();

    // Get total queries
    const totalQueries = await db.collection("queries").countDocuments();

    // Get active errors
    const activeErrors = await db
      .collection("queries")
      .countDocuments({ status: "error" });

    // Get total token usage
    const tokenAggregation = await db
      .collection("queries")
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$tokensUsed" },
          },
        },
      ])
      .toArray();
    const tokenUsage = tokenAggregation[0]?.total || 0;

    // Get query history for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const queryHistory = await db
      .collection("queries")
      .aggregate([
        {
          $match: {
            date: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            queries: { $sum: 1 },
            tokens: { $sum: "$tokensUsed" },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            queries: 1,
            tokens: 1,
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .toArray();

    await client.close();

    return NextResponse.json({
      totalUsers,
      totalQueries,
      activeErrors,
      tokenUsage,
      queryHistory,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
