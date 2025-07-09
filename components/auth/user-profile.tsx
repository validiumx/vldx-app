"use client"
import { WorldButton } from "@/components/ui/world-button"
import { WorldCard } from "@/components/ui/world-card"
import { useAuth } from "@/hooks/use-auth"

interface UserProfileProps {
  user: any
  compact?: boolean
}

export function UserProfile({ user, compact = false }: UserProfileProps) {
  const { logout } = useAuth()

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (compact) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">{user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <p className="font-medium text-gray-900">Selamat datang, {user?.username || "User"}!</p>
              {user?.worldIdVerified && (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Your username is used to identify you in this application. Please keep your information up to date for the best experience.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <WorldCard>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">{user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-2">
            <h3 className="text-xl font-semibold">Welcome, {user?.username || "User"}!</h3>
            {user?.worldIdVerified && (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Your username is used to identify you in this app. Please keep your information up to date for the best
            experience.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{user?.vldxBalance?.toFixed(2) || "0.00"}</p>
              <p className="text-xs text-gray-600">VLDX Balance</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{user?.worldIdVerified ? "Verified" : "Pending"}</p>
              <p className="text-xs text-gray-600">World ID Status</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Identity Verified</p>
                <p className="text-xs text-blue-600">Your account is secured with World ID</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <WorldButton onClick={handleSignOut} variant="outline" className="w-full" haptic="light">
              Sign Out
            </WorldButton>
          </div>
        </div>
      </div>
    </WorldCard>
  )
}
