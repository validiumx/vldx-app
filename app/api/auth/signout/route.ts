import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    // Clear all session cookies
    cookieStore.delete("session_token")
    cookieStore.delete("session_address")
    cookieStore.delete("session_expiry")
    cookieStore.delete("auth_nonce")
    cookieStore.delete("nonce_timestamp")

    console.log("User logged out successfully")

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      { status: 500 },
    )
  }
}
