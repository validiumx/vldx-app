"use client"

import { useState } from "react"
import { verifyWorldId } from "@/lib/verify"
import { sendHapticFeedback } from "@/lib/minikit"

export const useWorldId = () => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const verify = async (action = "claim-daily-vldx") => {
    setIsVerifying(true)
    try {
      const result = await verifyWorldId(action)
      if (result.success) {
        setIsVerified(true)
        sendHapticFeedback("medium")
      }
      return result
    } catch (error) {
      console.error("World ID verification error:", error)
      sendHapticFeedback("heavy")
      throw error
    } finally {
      setIsVerifying(false)
    }
  }

  return {
    isVerifying,
    isVerified,
    verify,
  }
}
