import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js"

export const verifyWorldId = async (action = "claim-daily-vldx") => {
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit not installed")
  }

  try {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.verify({
      action,
      signal: MiniKit.user?.walletAddress || "",
      verification_level: VerificationLevel.Orb, // or VerificationLevel.Device
    })

    // Verify proof on backend
    const response = await fetch("/api/verify-world-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proof: (finalPayload as any).proof,
        nullifier_hash: (finalPayload as any).nullifier_hash,
        merkle_root: (finalPayload as any).merkle_root,
        verification_level: (finalPayload as any).verification_level,
        action,
        signal: MiniKit.user?.walletAddress || "",
      }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error("World ID verification failed")
    }

    return result
  } catch (error) {
    console.error("World ID verification error:", error)
    throw error
  }
}
