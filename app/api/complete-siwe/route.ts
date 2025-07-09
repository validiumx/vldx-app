import { type NextRequest, NextResponse } from "next/server"
import { SiweMessage } from "siwe"

export async function POST(request: NextRequest) {
  try {
    const { message, signature, walletAddress } = await request.json()

    // Verify SIWE message
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.verify({ signature })

    if (!fields.success) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
    }

    // Here you would typically:
    // 1. Check if user exists in database
    // 2. Create user if doesn't exist
    // 3. Generate JWT token
    // 4. Return user data and token

    const user = {
      id: `user_${walletAddress.toLowerCase()}`,
      walletAddress: walletAddress.toLowerCase(),
      worldIdVerified: false,
      vldxBalance: 50.0, // Starting VLDX balance
      referralCode: generateReferralCode(),
      lastClaimTime: null,
    }

    const token = "mock_jwt_token" // Replace with actual JWT generation

    return NextResponse.json({
      success: true,
      user,
      token,
    })
  } catch (error) {
    console.error("SIWE completion error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}

function generateReferralCode(): string {
  return "VLDX" + Math.random().toString(36).substring(2, 8).toUpperCase()
}
