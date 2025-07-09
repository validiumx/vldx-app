import { type NextRequest, NextResponse } from "next/server"

// In-memory store for demo (replace with real DB in production)
const PAYMENTS_KEY = Symbol.for('app.payments')
const getPaymentsStore = () => {
  if (!(PAYMENTS_KEY in globalThis)) {
    ;(globalThis as any)[PAYMENTS_KEY] = {}
  }
  return (globalThis as any)[PAYMENTS_KEY] as Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const { to, value, description, tokenAddress, from } = await request.json()
    const payments = getPaymentsStore()

    // Generate payment reference
    const reference = `pay_${Date.now()}_${Math.random().toString(36).substring(2)}`

    // Store payment request in memory (replace with DB in production)
    payments[reference] = {
      to,
      value,
      description,
      tokenAddress,
      from,
      createdAt: Date.now(),
      status: 'pending',
    }

    return NextResponse.json({
      success: true,
      reference,
      to,
      value,
      description,
      tokenAddress,
    })
  } catch (error) {
    console.error("Payment initiation error:", error)
    return NextResponse.json({ success: false, error: "Failed to initiate payment" }, { status: 500 })
  }
}
