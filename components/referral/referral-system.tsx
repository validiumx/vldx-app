"use client"

import { useState } from "react"
import { WorldButton } from "@/components/ui/world-button"
import { WorldCard } from "@/components/ui/world-card"
import { shareContent, sendHapticFeedback } from "@/lib/minikit"
import { useAuth } from "@/hooks/use-auth"

export function VLDXReferralSystem() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const generateReferralLink = () => {
    if (!user) return ""
    const baseUrl = window.location.origin
    return `${baseUrl}?ref=${user.referralCode}&wid=${user.id}`
  }

  const handleCopyLink = async () => {
    const link = generateReferralLink()

    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      sendHapticFeedback("light")

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleShare = () => {
    const link = generateReferralLink()
    shareContent("Join me on Validium-X and earn VLDX tokens! 🚀", link)
  }

  if (!user) return null

  return (
    <WorldCard>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
          </div>

          <h3 className="text-xl font-semibold mb-2">Invite Friends</h3>
          <p className="text-gray-400 mb-4">Earn 50 VLDX for each friend who joins using your referral link!</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
            <p className="text-lg font-mono font-bold text-white">{user.referralCode}</p>
          </div>

          <div className="flex space-x-3">
            <WorldButton onClick={handleCopyLink} variant="outline" className="flex-1" haptic="light">
              {copied ? "Copied!" : "Copy Link"}
            </WorldButton>

            <WorldButton onClick={handleShare} className="flex-1" haptic="medium">
              Share
            </WorldButton>
          </div>
        </div>
      </div>
    </WorldCard>
  )
}
