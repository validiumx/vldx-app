import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          isValid: false,
          message: "No authorization token provided",
        },
        { status: 401 },
      )
    }

    // Get session from cookies
    const cookieStore = await cookies()
    const storedToken = cookieStore.get("session_token")?.value
    const sessionAddress = cookieStore.get("session_address")?.value
    const sessionExpiry = cookieStore.get("session_expiry")?.value

    // Validate token
    if (!storedToken || storedToken !== token) {
      return NextResponse.json(
        {
          success: false,
          isValid: false,
          message: "Invalid session token",
        },
        { status: 401 },
      )
    }

    // Check expiry
    if (sessionExpiry && Date.now() > Number.parseInt(sessionExpiry)) {
      // Clear expired session
      cookieStore.delete("session_token")
      cookieStore.delete("session_address")
      cookieStore.delete("session_expiry")

      return NextResponse.json(
        {
          success: false,
          isValid: false,
          message: "Session has expired",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      isValid: true,
      address: sessionAddress,
      expiresAt: sessionExpiry ? Number.parseInt(sessionExpiry) : null,
    })
  } catch (error) {
    console.error("Session validation error:", error)

    return NextResponse.json(
      {
        success: false,
        isValid: false,
        message: "Session validation failed",
      },
      { status: 500 },
    )
  }
}
