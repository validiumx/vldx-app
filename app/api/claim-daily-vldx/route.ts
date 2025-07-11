import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken, canUserClaim, updateUserBalance } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const token = authHeader.replace("Bearer ", "")
    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid user" }, { status: 401 })
    }
    const eligible = await canUserClaim(user)
    if (!eligible) {
      return NextResponse.json({ success: false, error: "Already claimed. Please wait 24 hours." }, { status: 400 })
    }
    const newBalance = await updateUserBalance(user, 1) // Add 1 VLDX
    return NextResponse.json({
      success: true,
      newBalance,
      nextClaimTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Daily VLDX claim error:", error)
    return NextResponse.json({ success: false, error: "VLDX claim failed" }, { status: 500 })
  }
}
