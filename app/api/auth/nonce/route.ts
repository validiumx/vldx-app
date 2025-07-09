import { type NextRequest, NextResponse } from "next/server"
import { generateNonce } from "siwe"

export async function GET(request: NextRequest) {
  try {
    const nonce = generateNonce()

    // Store nonce in session or database for verification
    // For demo purposes, we'll return it directly
    // In production, you should store this securely

    return NextResponse.json({
      success: true,
      nonce,
    })
  } catch (error) {
    console.error("Nonce generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate nonce" }, { status: 500 })
  }
}
