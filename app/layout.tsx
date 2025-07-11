import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MiniKitProvider } from "../components/providers/minikit-provider";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

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
    url: "https://vldx-app.vercel.app",
  },
  metadataBase: new URL("https://vldx-app.vercel.app"),
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#000000",
  };
}




// Authentication and MiniKit logic must be handled in client components and API routes, not here.

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MiniKitProvider>{children}</MiniKitProvider>
      </body>
    </html>
  );
}
