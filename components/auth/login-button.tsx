"use client"

import { useState } from "react"
import { AuthService, type AuthResponse } from "@/lib/auth-service"
import { MiniKit } from "@worldcoin/minikit-js"
import { getUserWalletAddress, checkMiniKitSupport } from "@/lib/minikit"
import { useRouter } from "next/navigation"

interface LoginButtonProps {
  onLoginSuccess: (response: AuthResponse) => void
  onLoginError: (error: string) => void
}

export function LoginButton({ onLoginSuccess, onLoginError }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Example MiniKit initialization (required at the top of the file)
  // import { checkMiniKitSupport } from "@/lib/minikit"

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // Check if MiniKit is installed and app is running inside World App
      const isSupported = await checkMiniKitSupport()
      if (!isSupported || !MiniKit.isInstalled()) {
        // Show alert if not in World App
        alert("Please open this mini-app inside World App to login.")
        throw new Error("MiniKit is not available. Please open this app in World App.")
      }

      // Check domain and redirect URI (must match Worldcoin Developer Dashboard)
      const allowedDomain = "YOUR_ALLOWED_DOMAIN" // TODO: Replace with your actual domain
      const allowedRedirectUri = "YOUR_ALLOWED_REDIRECT_URI" // TODO: Replace with your actual redirect URI
      if (window.location.hostname !== allowedDomain) {
        alert("Domain mismatch. Please access this app from the correct domain.")
        throw new Error("Domain mismatch. Current: " + window.location.hostname)
      }
      if (!window.location.origin.startsWith(allowedRedirectUri)) {
        alert("Redirect URI mismatch. Please access this app from the correct URL.")
        throw new Error("Redirect URI mismatch. Current: " + window.location.origin)
      }

      // 1. Get wallet address
      const walletAddress = await getUserWalletAddress()
      if (!walletAddress) throw new Error("Wallet address not found")

      // 2. Get nonce from backend
      const nonceRes = await fetch("/api/auth/nonce", { method: "POST" })
      const { nonce } = await nonceRes.json()


      // 3. Prepare SIWE message (or just sign nonce)
      // 4. Sign message with MiniKit

      // MiniKit.commandsAsync.signMessage returns { commandPayload, finalPayload }
      const signResult = await MiniKit.commandsAsync.signMessage({ message: nonce })
      // Extract signature from finalPayload (MiniAppSignMessagePayload)
      // Some MiniKit versions use 'result' or 'signature' or 'payload'. Try all for compatibility.
      let signature = undefined
      if (signResult.finalPayload) {
        if ('signature' in signResult.finalPayload) {
          signature = (signResult.finalPayload as any).signature
        } else if ('result' in signResult.finalPayload && (signResult.finalPayload as any).result?.signature) {
          signature = (signResult.finalPayload as any).result.signature
        } else if ('payload' in signResult.finalPayload && (signResult.finalPayload as any).payload?.signature) {
          signature = (signResult.finalPayload as any).payload.signature
        }
      }
      if (!signature) throw new Error("Failed to sign message: signature missing in MiniKit payload")

      // 5. Send to backend for verify & login
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, signature, nonce }),
      })

      if (!loginRes.ok) throw new Error("Login failed")
      router.refresh()
    } catch (error) {
      // Log and show error
      console.error("Login error:", error)
      onLoginError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`
        w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300
        ${
          isLoading
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
        }
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Authenticating...</span>
        </div>
      ) : (
        "Sign In with Wallet"
      )}
    </button>
  )
}
