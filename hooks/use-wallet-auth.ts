"use client"

import { useState, useEffect, useCallback } from "react"
import { WalletAuthService } from "@/lib/auth/wallet-auth"
import { sendHapticFeedback } from "@/lib/minikit"
import type { User } from "@/lib/types"

export const useWalletAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      const currentUser = await WalletAuthService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Auth status check error:", error)
      setError("Failed to check authentication status")
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = useCallback(async () => {
    try {
      setIsAuthenticating(true)
      setError(null)

      // Initiate wallet authentication
      const payload = await WalletAuthService.initiateWalletAuth()

      // Complete authentication
      const authenticatedUser = await WalletAuthService.completeWalletAuth(payload)

      // Store auth token
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: authenticatedUser }),
      })

      const sessionResult = await response.json()

      if (sessionResult.success) {
        localStorage.setItem("auth_token", sessionResult.token)
        setUser(authenticatedUser)
        sendHapticFeedback("medium")
      } else {
        throw new Error("Failed to create session")
      }

      return authenticatedUser
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed"
      setError(errorMessage)
      sendHapticFeedback("heavy")
      throw error
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await WalletAuthService.signOut()
      setUser(null)
      setError(null)
      sendHapticFeedback("light")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await WalletAuthService.getCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch (error) {
      console.error("Refresh user error:", error)
      return null
    }
  }, [])

  const getUserByAddress = useCallback(async (address: string) => {
    try {
      return await WalletAuthService.getUserByAddress(address)
    } catch (error) {
      console.error("Get user by address error:", error)
      return null
    }
  }, [])

  const getUserByUsername = useCallback(async (username: string) => {
    try {
      return await WalletAuthService.getUserByUsername(username)
    } catch (error) {
      console.error("Get user by username error:", error)
      return null
    }
  }, [])

  return {
    user,
    isLoading,
    isAuthenticating,
    error,
    isAuthenticated: !!user,
    signIn,
    signOut,
    refreshUser,
    getUserByAddress,
    getUserByUsername,
    checkAuthStatus,
  }
}
