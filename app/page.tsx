"use client"

import { useEffect, useState } from "react"
import { AuthService, type AuthUser, type AuthResponse } from "@/lib/auth-service"
import { LoginButton } from "@/components/auth/login-button"
import { useMiniKit } from "@/components/providers/minikit-provider"

export default function HomePage() {
  const { environment } = useMiniKit()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkInitialAuth()
  }, [])

  const checkInitialAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check existing authentication
      const authStatus = await AuthService.checkAuthStatus()

      if (authStatus.success && authStatus.user) {
        setUser(authStatus.user)
        console.log("User already authenticated:", authStatus.user.walletAddress)
      }
    } catch (error) {
      console.error("Initial auth check failed:", error)
      setError("Failed to check authentication status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = (response: AuthResponse) => {
    if (response.user) {
      setUser(response.user)
      setError(null)
      console.log("Login successful for:", response.user.walletAddress)
    }
  }

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage)
    setUser(null)
    console.error("Login failed:", errorMessage)
  }

  const handleLogout = async () => {
    try {
      const success = await AuthService.logout()
      if (success) {
        setUser(null)
        setError(null)
        console.log("Logout successful")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Validium-X...</p>
        </div>
      </div>
    )
  }

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">V</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Validium-X</h1>
            <p className="text-gray-400">Official World App Mini App</p>
            {environment === "development" && <p className="text-yellow-400 text-sm mt-2">🚧 Development Mode</p>}
          </div>

          {/* Login Form */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Welcome</h2>
            <p className="text-gray-300 text-sm mb-6">Sign in with your wallet to start claiming VLDX tokens daily.</p>

            <LoginButton onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />

            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Main app screen
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">V</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Validium-X</h1>
          <p className="text-gray-400 text-sm">Welcome back!</p>
          {environment === "development" && <p className="text-yellow-400 text-xs mt-1">🚧 Development Mode</p>}
        </div>

        {/* User Info */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl || "/placeholder.svg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{user.username?.charAt(0).toUpperCase() || "U"}</span>
                </div>
              )}
              <div>
                <p className="font-medium">{user.username || "Anonymous"}</p>
                <p className="text-sm text-gray-400">
                  {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-500"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 text-center">
          <h2 className="text-green-300 font-semibold mb-2">Authentication Successful!</h2>
          <p className="text-green-200 text-sm">You are now logged in and can access all features of Validium-X.</p>
          <p className="text-green-400 text-xs mt-2">Environment: {environment}</p>
        </div>
      </div>
    </div>
  )
}
