// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { transformUsers } from "@/lib/transformers";
import type { NextRequest } from "next/server";
import type { MongoUser } from "@/lib/transformers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids")?.split(",") || [];
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Build query
    const query = ids.length
      ? {
          _id: {
            $in: ids.map((id) => {
              try {
                return new ObjectId(id);
              } catch {
                return new ObjectId();
              }
            }),
          },
        }
      : search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // console.log("Users query:", query);

    const total = await db.collection("users").countDocuments(query);

    const users = (await db
      .collection("users")
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()) as unknown as MongoUser[];

    // console.log("Found users:", users);

    // Transform the users using the imported transformer
    const transformedUsers = transformUsers(users);

    return NextResponse.json({
      users: transformedUsers,
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
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
