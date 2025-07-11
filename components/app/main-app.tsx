"use client"

import { useState } from "react"
import type { AuthUser } from "@/lib/auth-service"
import { UserProfile } from "@/components/ui/user-profile"
import { ClaimSection } from "@/components/features/claim-section"
import { SwapSection } from "@/components/features/swap-section"
import { InviteSection } from "@/components/features/invite-section"

interface MainAppProps {
  user: AuthUser
  onLogout: () => void
  environment: string
}

export function MainApp({ user, onLogout, environment }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<"claim" | "swap" | "invite">("claim")

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">V</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Validium-X</h1>
          <p className="text-gray-400 text-sm">Welcome back!</p>
        </div>

        {/* User Profile */}
        <div className="px-4 mb-6">
          <UserProfile user={user} onLogout={onLogout} />
        </div>

        {/* Tab Navigation */}
        <div className="px-4 mb-6">
          <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setActiveTab("claim")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "claim" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Claim
            </button>
            <button
              onClick={() => setActiveTab("swap")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "swap" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Swap
            </button>
            <button
              onClick={() => setActiveTab("invite")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "invite" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Invite
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 pb-6">
          {activeTab === "claim" && <ClaimSection user={user} />}
          {activeTab === "swap" && <SwapSection user={user} />}
          {activeTab === "invite" && <InviteSection user={user} />}
        </div>
      </div>
    </div>
  )
}
