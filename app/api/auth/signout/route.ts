import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 })
    }

    // In a real app, you might want to blacklist the token
    // or remove it from a session store

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
    })
  } catch (error) {
    console.error("Sign out error:", error)
    return NextResponse.json({ success: false, error: "Sign out failed" }, { status: 500 })
  }
}
