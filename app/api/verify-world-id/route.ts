import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { proof, nullifier_hash, merkle_root, verification_level, action, signal } = await request.json()

    // Bypass World ID verification in dev if proof is mock
    if (process.env.NODE_ENV !== "production" && proof === "0xMOCKPROOF") {
      return NextResponse.json({
        success: true,
        verified: true,
        nullifier_hash,
        action: action || "claim-daily-vldx",
        worldIdVerified: true,
      })
    }

    // Verify the proof with World ID
    const verifyResponse = await fetch("https://developer.worldcoin.org/api/v1/verify/app_staging_your_app_id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      // Update user's verification status in database
      // This is where you'd update your user record for VLDX access

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
