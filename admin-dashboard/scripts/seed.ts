import { MongoClient, ObjectId } from "mongodb";

async function seed() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db(process.env.MONGODB_DB);

  // Add test user
  await db.collection("users").insertOne({
    _id: new ObjectId(),
    name: "Test User",
    email: "test@example.com",
    dateJoined: new Date(),
    lastActive: new Date(),
    tokenUsage: 1000,
    totalAmount: 50,
    status: "active",
  });

  // Add test queries
  await db.collection("queries").insertMany([
    {
      _id: new ObjectId(),
      userId: "test-user-id",
      prompt: "Test query 1",
      modelUsed: "gpt-4",
      tokensUsed: 150,
      date: new Date(),
      status: "completed",
    },
    // Add more test queries as needed
  ]);

  await client.close();
  console.log("Seed data inserted");
}

seed().catch(console.error);
