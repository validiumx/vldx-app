"use client"

import type React from "react"
import { sendHapticFeedback } from "@/lib/minikit"

interface WorldButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  loading?: boolean
  haptic?: "light" | "medium" | "heavy"
  className?: string
}

export function WorldButton({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  haptic = "light",
  className = "",
  ...props
}: WorldButtonProps) {
  const handleClick = () => {
    if (!disabled && !loading) {
      sendHapticFeedback(haptic)
      onClick?.()
    }
  }

  const baseClasses = "font-medium rounded-xl transition-all duration-200 flex items-center justify-center"

  const variantClasses = {
    primary: "bg-white text-black hover:bg-gray-100 active:bg-gray-200",
    secondary: "bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-600",
    outline: "border-2 border-gray-600 text-white hover:border-gray-500 hover:bg-gray-800/50",
  }

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  }

  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
