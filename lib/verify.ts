import { MiniKit } from "@worldcoin/minikit-js"

export const verifyWorldId = async (action = "claim-daily-vldx") => {
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit not installed")
  }

  try {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.verify({
      action,
      signal: MiniKit.walletAddress || "",
      verification_level: "orb", // or 'device'
    })

    // Verify proof on backend
    const response = await fetch("/api/verify-world-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proof: finalPayload.proof,
        nullifier_hash: finalPayload.nullifier_hash,
        merkle_root: finalPayload.merkle_root,
        verification_level: finalPayload.verification_level,
        action,
        signal: MiniKit.walletAddress || "",
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
