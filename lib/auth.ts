import { MiniKit } from "@worldcoin/minikit-js"
import { SiweMessage } from "siwe"

export const authenticateWithWallet = async () => {
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit not installed")
  }

  try {
    // Get nonce from backend
    const nonceResponse = await fetch("/api/nonce")
    const { nonce } = await nonceResponse.json()

    // Create SIWE message
    const siweMessage = new SiweMessage({
      domain: window.location.host,
      address: MiniKit.walletAddress!,
      statement: "Sign in to Validium-X Mini App",
      uri: window.location.origin,
      version: "1",
      chainId: 480, // World Chain
      nonce,
    })

    const message = siweMessage.prepareMessage()

    // Sign message with MiniKit
    const signResult = await MiniKit.commandsAsync.signMessage({
      message,
    })

    if (!signResult.success) {
      throw new Error("Failed to sign message")
    }

    // Complete SIWE authentication
    const authResponse = await fetch("/api/complete-siwe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        signature: signResult.signature,
        walletAddress: MiniKit.walletAddress,
      }),
    })

    const authResult = await authResponse.json()

    if (!authResult.success) {
      throw new Error("Authentication failed")
    }

    return authResult
  } catch (error) {
    console.error("Wallet authentication error:", error)
    throw error
  }
}

export const walletAuth = async () => {
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit not installed")
  }

  try {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: await generateNonce(),
      requestId: generateRequestId(),
      expirationTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      notBefore: new Date(),
      statement: "Sign in to Validium-X",
    })

    // Verify the payload on backend
    const response = await fetch("/api/verify-wallet-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ finalPayload }),
    })

    return await response.json()
  } catch (error) {
    console.error("Wallet auth error:", error)
    throw error
  }
}

const generateNonce = async (): Promise<string> => {
  const response = await fetch("/api/nonce")
  const { nonce } = await response.json()
  return nonce
}

const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2)}`
}
