// helper functions for the admin dashboard

// lib/api/users.ts
export async function getUsers() {
  // API logic here
}

// lib/utils.ts
// src/lib/utils.ts
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
