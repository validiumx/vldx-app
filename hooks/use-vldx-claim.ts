"use client"

import { useState, useEffect, useCallback } from "react"
import { vldxClaimService, type ClaimInfo, type ClaimResult } from "@/lib/vldx-claim-service"
import { useMiniKit } from "./use-minikit"
import { sendHapticFeedback } from "@/lib/minikit"

export const useVLDXClaim = () => {
  const { walletAddress } = useMiniKit()
  const [claimInfo, setClaimInfo] = useState<ClaimInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState("")

  // Refresh claim info
  const refreshClaimInfo = useCallback(async () => {
    if (!walletAddress) return

    setIsLoading(true)
    setError(null)

    try {
      const info = await vldxClaimService.getClaimInfo(walletAddress)
      setClaimInfo(info)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load claim info"
      setError(errorMessage)
      console.error("Error refreshing claim info:", err)
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  // Execute claim
  const executeClaim = useCallback(
    async (amount: string): Promise<ClaimResult> => {
      setIsClaiming(true)
      setError(null)

      try {
        const result = await vldxClaimService.executeClaim(amount)

        if (result.success) {
          sendHapticFeedback("medium")
          // Refresh claim info after successful claim
          setTimeout(() => {
            refreshClaimInfo()
          }, 2000)
        } else {
          sendHapticFeedback("heavy")
          setError(result.error || "Claim failed")
        }

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Claim failed"
        setError(errorMessage)
        sendHapticFeedback("heavy")

        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setIsClaiming(false)
      }
    },
    [refreshClaimInfo],
  )

  // Update countdown every second
  useEffect(() => {
    if (!claimInfo) return

    const updateCountdown = () => {
      if (claimInfo.cooldownRemaining > 0) {
        const now = Math.floor(Date.now() / 1000)
        const lastClaim = claimInfo.lastClaimTime
        const cooldownEnd = lastClaim + 86400 // 24 hours
        const remaining = Math.max(0, cooldownEnd - now)

        setCountdown(vldxClaimService.formatCountdown(remaining))

        // Update claimInfo if cooldown is over
        if (remaining === 0 && !claimInfo.canClaim) {
          refreshClaimInfo()
        }
      } else {
        setCountdown("")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [claimInfo, refreshClaimInfo])

  // Initial load
  useEffect(() => {
    refreshClaimInfo()
  }, [refreshClaimInfo])

  // Get phase information
  const phaseInfo = claimInfo ? vldxClaimService.getPhaseInfo(claimInfo.totalUsers) : null

  return {
    claimInfo,
    phaseInfo,
    countdown,
    isLoading,
    isClaiming,
    error,
    executeClaim,
    refreshClaimInfo,
    canClaim: claimInfo?.canClaim || false,
    cooldownRemaining: claimInfo?.cooldownRemaining || 0,
  }
}
