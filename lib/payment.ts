import { MiniKit } from "@worldcoin/minikit-js"
import { VLDX_CONTRACTS } from "./config"

export const initiateVLDXPayment = async (to: string, value: string, description: string) => {
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit not installed")
  }

  try {
    // Create payment request on backend
    const paymentResponse = await fetch("/api/initiate-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        value,
        description,
        tokenAddress: VLDX_CONTRACTS.VLDX,
        from: MiniKit.walletAddress,
      }),
    })

    const { reference } = await paymentResponse.json()

    // Execute payment with MiniKit
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.pay({
      reference,
      to: [
        {
          address: to,
          amount: value,
          token: VLDX_CONTRACTS.VLDX,
        },
      ],
    })

    // Confirm payment on backend
    const confirmResponse = await fetch("/api/confirm-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reference,
        finalPayload,
      }),
    })

    return await confirmResponse.json()
  } catch (error) {
    console.error("VLDX payment error:", error)
    throw error
  }
}

export const sendVLDXTransaction = async (to: string, value: string) => {
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit not installed")
  }

  try {
    const result = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: VLDX_CONTRACTS.VLDX,
          abi: [
            {
              name: "transfer",
              type: "function",
              inputs: [
                { name: "to", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              outputs: [{ name: "", type: "bool" }],
            },
          ],
          functionName: "transfer",
          args: [to, value],
        },
      ],
    })

    return result
  } catch (error) {
    console.error("Send VLDX transaction error:", error)
    throw error
  }
}
