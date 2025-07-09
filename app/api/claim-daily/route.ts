import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Verify JWT token (mock implementation)
    const token = authHeader.replace("Bearer ", "")

    // Here you would:
    // 1. Verify the JWT token
    // 2. Get user from database
    // 3. Check if user can claim (24 hours since last claim)
    // 4. Update user's balance and last claim time

    // Mock implementation
    const user = {
      id: "user_123",
      vixBalance: 50.96195,
      lastClaimTime: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      newBalance: user.vixBalance,
      nextClaimTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Daily claim error:", error)
    return NextResponse.json({ success: false, error: "Claim failed" }, { status: 500 })
  }
}
