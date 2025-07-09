import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MiniKitProvider } from "@/components/providers/minikit-provider";
// ...

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Validium-X | Official World Mini App",
  description: "The Backbone of Crypto - Official VLDX Token Mini App on World Chain",
  manifest: "/manifest.json",
  keywords: ["VLDX", "Validium-X", "World Chain", "Crypto", "DeFi", "World App"],
  authors: [{ name: "Validium-X Team" }],
  openGraph: {
    title: "Validium-X | The Backbone of Crypto",
    description: "Official VLDX Token Mini App - Claim daily rewards and earn through referrals",
    type: "website",
    siteName: "Validium-X",
  },
}

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#000000",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MiniKitProvider>{children}</MiniKitProvider>
      </body>
    </html>
  )
}
