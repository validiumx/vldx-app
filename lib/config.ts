export const APP_CONFIG = {
  APP_ID: process.env.NEXT_PUBLIC_WORLD_APP_ID || "app_staging_your_app_id",
  ACTION_ID: process.env.NEXT_PUBLIC_WORLD_ACTION_ID || "claim-daily-vldx",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
  CHAIN_ID: 480, // World Chain
  DAILY_CLAIM_AMOUNT: 1,
  REFERRAL_BONUS: 50,
}

// Official VLDX Contract Addresses on WorldChain Mainnet
export const VLDX_CONTRACTS = {
  VLDX: "0x6B44699577d2EC9669802b3a4F8F91ecc4Aa8789",
  VLDXLiquidity: "0xaBF584aA0E3a7943Fb82692B8A06CD8CccEaE019",
  VLDXSwapper: "0xD1a55b27F13f06788A3C8378ee7EA4965133125C",
  VLDXClaim: "0xfA087564057A805e47C379935DCd2889c903ec3a", // Main claim contract
}

export const WORLD_CHAIN_CONFIG = {
  id: 480,
  name: "World Chain",
  network: "worldchain",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://worldchain-mainnet.g.alchemy.com/public"] },
    default: { http: ["https://worldchain-mainnet.g.alchemy.com/public"] },
  },
  blockExplorers: {
    default: { name: "World Chain Explorer", url: "https://worldchain-mainnet.explorer.alchemy.com" },
  },
}

export const DEPLOYER_INFO = {
  address: "0x701aB55cb87FB8dA4fE3f45FFf6cc1eA60965310",
  deployScript: "scripts/deploy_mainnet_strict.js",
  verifyScript: "scripts/verify_mainnet_strict.js",
  gasPrice: "0.001001437 gwei",
  status: "Verified ✅",
}

// Claim contract specific constants
export const CLAIM_CONFIG = {
  MIN_CLAIM: 1, // 1 VLDX minimum
  COOLDOWN_HOURS: 24, // 24 hours between claims
  PHASE_THRESHOLDS: {
    PHASE_1: 5000, // < 5000 users: max 50 VLDX
    PHASE_2: 10000, // < 10000 users: max 5 VLDX
    PHASE_3_STEP: 5000, // Every 5000 users after 10k: -5 VLDX (min 1)
  },
}
