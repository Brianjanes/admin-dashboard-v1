// insertTestData.js
import { MongoClient } from "mongodb";

// Your MongoDB Atlas connection string
const uri =
  "mongodb+srv://briansDatabase:U9UTknkiz2PUHOqD@cluster0.hldwllb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const users = [
  {
    _id: "user_01",
    id: "u_01",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    dateJoined: "2024-01-10T09:00:00Z",
    lastActive: "2024-03-18T16:45:00Z",
    tokenUsage: 25840,
    totalAmount: "258.40",
    status: "active",
  },
  {
    _id: "user_02",
    id: "u_02",
    name: "Michael Rodriguez",
    email: "m.rodriguez@example.com",
    dateJoined: "2024-01-15T14:30:00Z",
    lastActive: "2024-03-17T11:20:00Z",
    tokenUsage: 18650,
    totalAmount: "186.50",
    status: "active",
  },
  {
    _id: "user_03",
    id: "u_03",
    name: "Emma Watson",
    email: "emma.w@example.com",
    dateJoined: "2024-01-20T10:15:00Z",
    lastActive: "2024-02-28T09:30:00Z",
    tokenUsage: 5200,
    totalAmount: "52.00",
    status: "inactive",
  },
  {
    _id: "user_04",
    id: "u_04",
    name: "James Kim",
    email: "james.kim@example.com",
    dateJoined: "2024-02-01T08:45:00Z",
    lastActive: "2024-03-18T15:10:00Z",
    tokenUsage: 31200,
    totalAmount: "312.00",
    status: "active",
  },
  {
    _id: "user_05",
    id: "u_05",
    name: "Priya Patel",
    email: "priya.p@example.com",
    dateJoined: "2024-02-05T11:30:00Z",
    lastActive: "2024-03-18T14:25:00Z",
    tokenUsage: 28750,
    totalAmount: "287.50",
    status: "active",
  },
  {
    _id: "user_06",
    id: "u_06",
    name: "David Cooper",
    email: "d.cooper@example.com",
    dateJoined: "2024-02-10T13:20:00Z",
    lastActive: "2024-03-01T10:45:00Z",
    tokenUsage: 4800,
    totalAmount: "48.00",
    status: "inactive",
  },
  {
    _id: "user_07",
    id: "u_07",
    name: "Lisa Martinez",
    email: "lisa.m@example.com",
    dateJoined: "2024-02-15T09:40:00Z",
    lastActive: "2024-03-18T13:15:00Z",
    tokenUsage: 15900,
    totalAmount: "159.00",
    status: "active",
  },
  {
    _id: "user_08",
    id: "u_08",
    name: "Alex Thompson",
    email: "alex.t@example.com",
    dateJoined: "2024-02-20T15:50:00Z",
    lastActive: "2024-03-18T12:30:00Z",
    tokenUsage: 12400,
    totalAmount: "124.00",
    status: "active",
  },
  {
    _id: "user_09",
    id: "u_09",
    name: "Nina Anderson",
    email: "nina.a@example.com",
    dateJoined: "2024-03-01T10:00:00Z",
    lastActive: "2024-03-15T16:20:00Z",
    tokenUsage: 3600,
    totalAmount: "36.00",
    status: "inactive",
  },
  {
    _id: "user_10",
    id: "u_10",
    name: "Omar Hassan",
    email: "omar.h@example.com",
    dateJoined: "2024-03-05T12:25:00Z",
    lastActive: "2024-03-18T11:45:00Z",
    tokenUsage: 8900,
    totalAmount: "89.00",
    status: "active",
  },
];

const generateQueriesForUser = (userId, userName, email) => {
  const topics = [
    "Next.js authentication",
    "React performance optimization",
    "TypeScript interfaces",
    "MongoDB aggregation",
    "Docker containerization",
    "AWS deployment",
    "GraphQL queries",
    "Redis caching",
    "Kubernetes pods",
    "CI/CD pipeline",
  ];

  return topics.map((topic, index) => ({
    _id: `query_${userId}_${index + 1}`,
    userId: userId,
    prompt: `How to implement ${topic}?`,
    modelUsed: Math.random() > 0.3 ? "gpt-4" : "gpt-3.5-turbo",
    tokensUsed: Math.floor(Math.random() * 2000) + 500,
    date: new Date(
      Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    status: Math.random() > 0.1 ? "completed" : "error",
    messages: [
      {
        role: "user",
        content: `How to implement ${topic}?`,
        timestamp: new Date(
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        metadata: {
          tokensUsed: Math.floor(Math.random() * 20) + 5,
          modelUsed: "gpt-4",
          processingTime: Math.random() * 2,
        },
      },
      {
        role: "assistant",
        content: `Here's how to implement ${topic}...`,
        timestamp: new Date(
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        metadata: {
          tokensUsed: Math.floor(Math.random() * 1000) + 500,
          modelUsed: "gpt-4",
          processingTime: Math.random() * 3 + 1,
        },
      },
    ],
    metadata: {
      totalProcessingTime: Math.random() * 5 + 2,
      context: {
        documents: [
          `${topic.toLowerCase()}-docs`,
          `${topic.toLowerCase()}-examples`,
        ],
        apps: ["github"],
      },
    },
  }));
};

const generateErrorsForUser = (userId, userName, email) => {
  const errorTypes = [
    { title: "API Rate Limit Exceeded", type: "RateLimitError" },
    { title: "Database Connection Failed", type: "DatabaseError" },
    { title: "Authentication Failed", type: "AuthError" },
    { title: "Invalid Input Format", type: "ValidationError" },
    { title: "Service Unavailable", type: "ServiceError" },
  ];

  return errorTypes.map((error, index) => ({
    _id: `err_${userId}_${index + 1}`,
    userId: userId,
    title: error.title,
    type: error.type,
    status: Math.random() > 0.5 ? "resolved" : "unresolved",
    environment: "production",
    level: "error",
    message: `Error occurred: ${error.title}`,
    stacktrace: `Error: ${error.title}\n    at Function.check (/app/middleware/${error.type}.ts:42:12)...`,
    context: {
      requestsPerMinute: Math.floor(Math.random() * 100) + 50,
      limit: 100,
    },
    metadata: {
      region: "us-east-1",
      instance: `server-${Math.floor(Math.random() * 5) + 1}`,
    },
    tags: [error.type.toLowerCase(), "production"],
    user: {
      id: userId,
      email: email,
    },
    request: {
      url: "/api/v1/queries",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    },
    breadcrumbs: [
      {
        type: "http",
        category: "request",
        message: "GET /api/v1/user",
        timestamp: new Date(
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ).toISOString(),
      },
    ],
    firstSeen: new Date(
      Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    lastSeen: new Date(
      Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)
    ).toISOString(),
    count: Math.floor(Math.random() * 5) + 1,
    release: "v1.2.3",
  }));
};

// Generate queries and errors for each user
const allQueries = users.flatMap((user) =>
  generateQueriesForUser(user._id, user.name, user.email)
);

const allErrors = users.flatMap((user) =>
  generateErrorsForUser(user._id, user.name, user.email)
);

async function insertTestData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("admin_dashboard");

    // Drop existing collections to start fresh
    await Promise.all([
      db
        .collection("users")
        .drop()
        .catch(() => {}),
      db
        .collection("queries")
        .drop()
        .catch(() => {}),
      db
        .collection("errors")
        .drop()
        .catch(() => {}),
    ]);

    // Insert all data
    await Promise.all([
      db.collection("users").insertMany(users),
      db.collection("queries").insertMany(allQueries),
      db.collection("errors").insertMany(allErrors),
    ]);

    // Create indexes
    await Promise.all([
      db.collection("users").createIndex({ id: 1 }, { unique: true }),
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db.collection("queries").createIndex({ userId: 1 }),
      db.collection("errors").createIndex({ userId: 1 }),
    ]);

    console.log("Test data inserted successfully");
  } catch (error) {
    console.error("Error inserting test data:", error);
  } finally {
    await client.close();
  }
}

// Run the script
insertTestData().catch(console.error);
