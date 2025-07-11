import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { proof, nullifier_hash, merkle_root, verification_level, action, signal } = await request.json()

    // Verify the proof with World ID production endpoint
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (process.env.WORLDCOIN_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.WORLDCOIN_API_KEY}`
    }
    const verifyResponse = await fetch("https://developer.worldcoin.org/api/v1/verify/app_production_your_app_id", {
      method: "POST",
      headers,
      body: JSON.stringify({
        nullifier_hash,
        merkle_root,
        proof,
        verification_level,
        action: action || "claim-daily-vldx",
        signal,
      }),
    })

    const verifyResult = await verifyResponse.json()

    if (verifyResult.success) {
      // Update user's verification status in database (implement as needed)
      return NextResponse.json({
        success: true,
        verified: true,
        nullifier_hash,
        action: action || "claim-daily-vldx",
      })
    } else {
      return NextResponse.json({ success: false, error: "World ID verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("World ID verification error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
