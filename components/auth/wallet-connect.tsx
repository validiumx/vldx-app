"use client"

import { useState } from "react"
import { WorldButton } from "@/components/ui/world-button"
import { WorldCard } from "@/components/ui/world-card"
import { useAuth } from "@/hooks/use-auth"
import { MiniKit } from "@worldcoin/minikit-js"

export function WalletConnect() {
  const { login, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"initial" | "connecting" | "verifying">("initial")

  const handleConnect = async () => {
    try {
      setError(null)
      setStep("connecting")

      // Add delay to show connecting state
      setTimeout(() => {
        setStep("verifying")
      }, 1000)

      // Check MiniKit production only
      if (typeof MiniKit === "undefined" || !MiniKit.isInstalled()) {
        setError("Please open this mini-app inside World App.")
        setStep("initial")
        return
      }

      await login()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
      setStep("initial")
    }
  }

  if (step === "connecting") {
    return (
      <WorldCard>
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Connecting to World App</h3>
          <p className="text-gray-600 mb-4">Please wait while we establish a secure connection...</p>
        </div>
      </WorldCard>
    )
  }

  if (step === "verifying") {
    return (
      <WorldCard>
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <div className="animate-pulse">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Verifying Identity</h3>
          <p className="text-gray-600 mb-4">Your identity is being verified using World ID...</p>
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

        <h3 className="text-lg font-semibold mb-2">Log in with World ID</h3>
        <p className="text-gray-600 mb-6">
          Securely verify your identity using World App. Click "Connect World App" to begin verification.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Your identity will be verified using World ID.
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              No password required.
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              This process ensures your account is secure and can only be accessed by you.
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <WorldButton onClick={handleConnect} loading={isLoading} haptic="medium" className="w-full">
          {isLoading ? "Verifying..." : "Connect World App"}
        </WorldButton>

        <p className="text-xs text-gray-500 mt-4">
          By connecting, you agree to verify your identity using the World ID protocol.
        </p>
      </div>
    </WorldCard>
  )
}
