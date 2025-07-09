import { type NextRequest, NextResponse } from "next/server"

const PAYMENTS_KEY = Symbol.for('app.payments')
const getPaymentsStore = () => {
  if (!(PAYMENTS_KEY in globalThis)) {
    ;(globalThis as any)[PAYMENTS_KEY] = {}
  }
  return (globalThis as any)[PAYMENTS_KEY] as Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const { reference, finalPayload } = await request.json()
    const payments = getPaymentsStore()
    const payment = payments[reference]

    if (!payment) {
      return NextResponse.json({ success: false, error: "Reference not found" }, { status: 400 })
    }

    // Get transaction hash from finalPayload
    const transactionHash = finalPayload?.transactionHash
    if (!transactionHash) {
      return NextResponse.json({ success: false, error: "No transaction hash" }, { status: 400 })
    }

    // Call Worldcoin API to verify transaction status
    // (Replace with your actual APP_ID)
    const APP_ID = process.env.NEXT_PUBLIC_WORLD_APP_ID || "app_staging_your_app_id"
    const txRes = await fetch(`https://developer.worldcoin.org/api/v2/minikit/transaction/${transactionHash}?app_id=${APP_ID}`)
    const txData = await txRes.json()

    if (!txData || txData.reference !== reference || txData.status === 'failed') {
      return NextResponse.json({ success: false, error: "Transaction not confirmed or reference mismatch" }, { status: 400 })
    }

    // Update payment status
    payment.status = 'confirmed'
    payment.transactionHash = transactionHash

    return NextResponse.json({
      success: true,
      transactionHash,
      status: txData.status,
    })
  } catch (error) {
    console.error("Payment confirmation error:", error)
    return NextResponse.json({ success: false, error: "Payment confirmation failed" }, { status: 500 })
  }
}
