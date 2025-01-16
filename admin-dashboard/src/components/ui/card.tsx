import React from "react";

import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
  padding?: boolean;
}

export function Card({
  className = "",
  variant = "default",
  padding = true,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg ${
        variant === "outline" ? "border border-gray-200" : "shadow-sm"
      } ${padding ? "p-6" : ""} ${className}`}
      {...props}
    />
  );
}
