import NextAuth from "next-auth";
import { Profile } from "next-auth";

// Worldcoin OAuth provider config (from world-id-nextauth-template)
function WorldcoinProvider(options: any): any {
  return {
    id: "worldcoin",
    name: "Worldcoin",
    type: "oauth",
    wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
    authorization: {
      url: "https://id.worldcoin.org/authorize",
      params: {
        scope: "openid profile",
        action_id: process.env.NEXT_PUBLIC_WORLD_ACTION_ID,
      },
    },
    token: "https://id.worldcoin.org/oauth/token",
    userinfo: "https://id.worldcoin.org/userinfo",
    clientId: process.env.WORLDCOIN_CLIENT_ID,
    clientSecret: process.env.WORLDCOIN_CLIENT_SECRET,
    profile(profile: any) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        aud: profile.aud,
      };
    },
    ...options,
  };
}
import { NextRequest, NextResponse } from "next/server";

const expectedDomain = "vldx-app.vercel.app";
const expectedOrigin = "https://vldx-app.vercel.app";

function isWorldApp(userAgent: string | undefined) {
  // World App user agent contains 'WorldApp'
  return userAgent?.includes("WorldApp");
}

const handler = NextAuth({
  providers: [
    WorldcoinProvider({
      clientId: process.env.WORLDCOIN_CLIENT_ID!,
      clientSecret: process.env.WORLDCOIN_CLIENT_SECRET!,
      actionId: process.env.NEXT_PUBLIC_WORLD_ACTION_ID!,
      // Worldcoin provider specific config
      authorization: {
        params: {
          scope: "openid profile",
        },
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Only allow redirect to expected domain
      const allowed = url.startsWith(expectedOrigin) || url.startsWith(baseUrl);
      return allowed ? url : baseUrl;
    },
    async signIn({ account, profile }) {
      // Get request headers from NextAuth context (for route handlers)
      const headers = (globalThis as any).headers;
      const userAgent = headers?.get("user-agent") || headers?.get("User-Agent");
      if (!isWorldApp(userAgent)) {
        throw new Error("This app only works in World App, please open via World App");
      }
      // Validate domain
      const origin = headers?.get("origin") || headers?.get("Origin");
      if (
        (origin && origin !== expectedOrigin) ||
        (account?.provider === "worldcoin" && (profile as any)?.aud !== expectedDomain)
      ) {
        return false;
      }
      return true;
    },
  },
  pages: {
    error: "/auth/error", // Custom error page (optional)
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
});

export { handler as GET, handler as POST };
