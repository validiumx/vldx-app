import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json()

    if (!user || !user.walletAddress) {
      return NextResponse.json({ success: false, error: "Invalid user data" }, { status: 400 })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        walletAddress: user.walletAddress,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      },
      JWT_SECRET,
    )

    return NextResponse.json({
      success: true,
      token,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create session" }, { status: 500 })
  }
}
