// helper functions for the admin dashboard

// src/lib/utils.ts
import type { MongoDateType } from "@/types/mongodb";

export function formatDate(date: Date | string | number | MongoDateType) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
