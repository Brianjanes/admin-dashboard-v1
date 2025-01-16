// src/app/api/errors/[errorId]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { errorId: string } }
) {
  try {
    const { errorId } = params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const error = await db
      .collection("errors")
      .findOne({ _id: new ObjectId(errorId) });

    if (!error) {
      return NextResponse.json({ error: "Error not found" }, { status: 404 });
    }

    return NextResponse.json({ error });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch error details" },
      { status: 500 }
    );
  }
}
