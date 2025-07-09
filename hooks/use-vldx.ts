"use client"

import { useState, useEffect } from "react"
import { vldxService } from "@/lib/vldx-contracts"
import { useMiniKit } from "./use-minikit"

export const useVLDX = () => {
  const { walletAddress } = useMiniKit()
  const [balance, setBalance] = useState("0")
  const [canClaim, setCanClaim] = useState(false)
  const [lastClaimTime, setLastClaimTime] = useState(0)
  const [claimAmount, setClaimAmount] = useState("1")
  const [tokenInfo, setTokenInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = async () => {
    if (!walletAddress) return

    setIsLoading(true)
    try {
      const [balanceResult, canClaimResult, lastClaimResult, claimAmountResult, tokenInfoResult] = await Promise.all([
        vldxService.getVLDXBalance(walletAddress),
        vldxService.canClaimVLDX(walletAddress),
        vldxService.getLastClaimTime(walletAddress),
        vldxService.getClaimAmount(),
        vldxService.getVLDXTokenInfo(),
      ])

      setBalance(balanceResult)
      setCanClaim(canClaimResult)
      setLastClaimTime(lastClaimResult)
      setClaimAmount(claimAmountResult)
      setTokenInfo(tokenInfoResult)
    } catch (error) {
      console.error("Error refreshing VLDX data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [walletAddress])

  return {
    balance,
    canClaim,
    lastClaimTime,
    claimAmount,
    tokenInfo,
    isLoading,
    refreshData,
  }
}
