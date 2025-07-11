"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { WorldButton } from "@/components/ui/world-button"
import { WorldCard } from "@/components/ui/world-card"
// import { useAuth } from "@/hooks/use-auth"
import { sendHapticFeedback } from "@/lib/minikit"

export function DailyClaim() {
  // Worldcoin guideline: auth info diambil dari MiniKit global object
  const user = typeof window !== "undefined" && (window as any).MiniKit?.user ? (window as any).MiniKit.user : undefined
  const [canClaim, setCanClaim] = useState(false)
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState("")
  const [isClaiming, setIsClaiming] = useState(false)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (user) {
      setBalance(user.vldxBalance || 0)
      checkClaimStatus()
    }
  }, [user])

  useEffect(() => {
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  const checkClaimStatus = () => {
    if (!user?.lastClaimTime) {
      setCanClaim(true)
      return
    }

    const lastClaim = new Date(user.lastClaimTime)
    const now = new Date()
    const timeDiff = now.getTime() - lastClaim.getTime()
    const hoursSinceLastClaim = timeDiff / (1000 * 60 * 60)

    setCanClaim(hoursSinceLastClaim >= 24)
  }

  const updateCountdown = () => {
    if (!user?.lastClaimTime || canClaim) return

    const lastClaim = new Date(user.lastClaimTime)
    const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000)
    const now = new Date()
    const timeDiff = nextClaim.getTime() - now.getTime()

    if (timeDiff <= 0) {
      setCanClaim(true)
      setTimeUntilNextClaim("")
      return
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

    setTimeUntilNextClaim(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    )
  }

  const handleClaim = async () => {
    if (!canClaim || isClaiming) return

    setIsClaiming(true)
    try {
      const response = await fetch("/api/claim-daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      const result = await response.json()

      if (result.success) {
        setBalance(result.newBalance)
        setCanClaim(false)
        sendHapticFeedback("medium")

        // Show success message
        setTimeout(() => {
          alert("Successfully claimed 1 VIX!")
        }, 100)
      } else {
        throw new Error(result.message || "Claim failed")
      }
    } catch (error) {
      console.error("Claim error:", error)
      sendHapticFeedback("heavy")
      alert("Failed to claim. Please try again.")
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Claim Button */}
      <div className="text-center">
        <div
          className={`relative w-64 h-64 mx-auto cursor-pointer transition-transform ${
            canClaim ? "hover:scale-105 animate-pulse" : ""
          }`}
          onClick={handleClaim}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 flex items-center justify-center bg-[#b8b0a6]" style={{ boxShadow: '0 0 60px 10px rgba(255,255,255,0.35)' }}>
            <Image src="/images/VLDX_logo.png" alt="VLDX Token" width={180} height={180} className="object-contain" priority />
          </div>
        </div>

        <div className="mt-4">
          {canClaim ? (
            <p className="text-lg text-gray-300">Tap to claim your daily VIX</p>
          ) : (
            <div>
              <p className="text-lg text-gray-300">Next claim available in:</p>
              <p className="text-2xl font-mono font-bold text-white mt-1">{timeUntilNextClaim}</p>
            </div>
          )}
        </div>
      </div>

      {/* Balance Card */}
      <WorldCard>
        <div className="flex items-center p-4">
          <div className="w-12 h-12 relative mr-4 flex items-center justify-center bg-[#b8b0a6] rounded-full overflow-hidden">
            <Image src="/images/VLDX_logo.png" alt="VLDX" width={32} height={32} className="object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400">VIX Balance</p>
            <p className="text-2xl font-bold text-white">{balance.toFixed(6)}</p>
            <p className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">Convert to USD →</p>
          </div>
        </div>
      </WorldCard>

      {/* Claim Button */}
      <WorldButton
        onClick={handleClaim}
        disabled={!canClaim}
        loading={isClaiming}
        haptic="medium"
        size="large"
        className="w-full"
      >
        {isClaiming ? "Claiming..." : canClaim ? "Claim 1 VIX" : "Already Claimed Today"}
      </WorldButton>
    </div>
  )
}
