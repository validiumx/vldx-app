"use client"

import type React from "react"

interface WorldCardProps {
  children: React.ReactNode
  className?: string
  padding?: "none" | "small" | "medium" | "large"
}

export function WorldCard({ children, className = "", padding = "medium" }: WorldCardProps) {
  const paddingClasses = {
    none: "",
    small: "p-3",
    medium: "p-4",
    large: "p-6",
  }

  return (
    <div
      className={`
        bg-gray-900/50 
        backdrop-blur-sm 
        border border-gray-800 
        rounded-xl 
        ${paddingClasses[padding]} 
        ${className}
      `}
    >
      {children}
    </div>
  )
}
