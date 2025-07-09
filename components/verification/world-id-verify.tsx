"use client"

import { useState } from "react"
import { WorldButton } from "@/components/ui/world-button"
import { WorldCard } from "@/components/ui/world-card"
import { useWorldId } from "@/hooks/use-world-id"

interface WorldIdVerifyProps {
  action?: string
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
}

export function WorldIdVerify({ action = "claim-daily-vldx", onSuccess, onError }: WorldIdVerifyProps) {
  const { isVerifying, isVerified, verify } = useWorldId()
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    try {
      setError(null)
      const result = await verify(action)
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Verification failed")
      setError(error.message)
      onError?.(error)
    }
  }

  if (isVerified) {
    return (
      <WorldCard>
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-green-800">Identity Verified!</h3>
          <p className="text-green-600">
            Your World ID has been successfully verified. You can now access all VLDX features.
          </p>
        </div>
      </WorldCard>
    )
  }

  return (
    <WorldCard>
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold mb-2">Verify Your Identity</h3>
        <p className="text-gray-600 mb-6">
          Complete your identity verification with World ID to access VLDX features and claim daily rewards.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Secure verification using World ID protocol
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              One-time verification process
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Protects against fraud and ensures fair access
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <WorldButton onClick={handleVerify} loading={isVerifying} haptic="medium" className="w-full">
          {isVerifying ? "Verifying Identity..." : "Verify World ID"}
        </WorldButton>

        <p className="text-xs text-gray-500 mt-4">
          This verification ensures secure access to your VLDX account and features.
        </p>
      </div>
    </WorldCard>
  )
}
