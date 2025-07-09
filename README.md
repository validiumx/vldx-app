# vldx-app
  Validium-X (VLDX) Mini App for World App. Claim, swap, and invite friends to earn VLDX tokens. Built for WorldChain.

# Validium-X Official World Mini App

> **NOTA PENTING:**
> 
> Jika anda menggunakan mock MiniKit untuk development/testing,
> **JANGAN deploy mock ini ke production!**
> Pastikan kod mock MiniKit hanya aktif dalam environment development atau staging sahaja.

The official World Mini App for VLDX (Validium-X) token - The Backbone of Crypto, built with MiniKit and deployed on World Chain.

## 🚀 Features

- **MiniKit Integration**: Full integration with World App MiniKit
- **Wallet Authentication**: SIWE (Sign-In with Ethereum) authentication
- **World ID Verification**: Secure identity verification for VLDX claims
- **Daily VLDX Claims**: Users can claim VLDX tokens daily
- **Referral System**: Earn 50 VLDX for each friend you invite
- **Real Contract Integration**: Connected to official VLDX contracts on World Chain
- **Payment Integration**: Support for VLDX payments through World App

## 📦 VLDX Contract Addresses (World Chain Mainnet)

- **VLDX Token**: `0x6B44699577d2EC9669802b3a4F8F91ecc4Aa8789`
- **VLDX Liquidity**: `0xaBF584aA0E3a7943Fb82692B8A06CD8CccEaE019`
- **VLDX Swapper**: `0xD1a55b27F13f06788A3C8378ee7EA4965133125C`
- **VLDX Claim**: `0xfA087564057A805e47C379935DCd2889c903ec3a`

**Deployer**: `0x701aB55cb87FB8dA4fE3f45FFf6cc1eA60965310`  
**Status**: Verified ✅ on WorldScan

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **World Integration**: MiniKit JS/React, World ID
- **Blockchain**: World Chain (Chain ID: 480)
- **Styling**: Tailwind CSS
- **Authentication**: SIWE, World ID

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- World App installed on mobile device
- World Developer Portal account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd validium-x-world-mini-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your World App credentials:
\`\`\`env
NEXT_PUBLIC_WORLD_APP_ID=your_app_id
NEXT_PUBLIC_WORLD_ACTION_ID=claim-daily-vldx
NEXT_PUBLIC_API_URL=http://localhost:3000/api
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in World App

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/                    # API routes
│   │   ├── claim-daily-vldx/   # VLDX daily claim endpoint
│   │   ├── verify-world-id/    # World ID verification
│   │   └── complete-siwe/      # SIWE authentication
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── auth/                   # Authentication components
│   ├── claim/                  # VLDX claim components
│   ├── providers/              # Context providers
│   ├── referral/               # VLDX referral system
│   ├── ui/                     # UI components
│   └── verification/           # World ID verification
├── hooks/                      # Custom React hooks
│   ├── use-vldx.ts            # VLDX contract interactions
│   └── use-world-id.ts        # World ID verification
├── lib/                        # Utility functions
│   ├── vldx-contracts.ts      # VLDX contract service
│   └── config.ts              # App configuration
└── public/                     # Static assets
    └── images/
        └── VLDX_logo.png      # Official VLDX logo
\`\`\`

## 🔗 Key Components

### VLDX Contract Integration
- Real-time balance checking
- Daily claim verification
- Contract interaction through ethers.js
- World Chain RPC integration

### Authentication Flow
1. Check MiniKit installation
2. Connect wallet via SIWE
3. Verify World ID for VLDX access
4. Access daily claims and referral features

### API Endpoints
- `/api/claim-daily-vldx` - Process daily VLDX claims
- `/api/verify-world-id` - Verify World ID proof
- `/api/complete-siwe` - Complete SIWE authentication

## 🌍 World App Integration

### MiniKit Commands Used
- `walletAuth` - Wallet authentication
- `verify` - World ID verification (action: claim-daily-vldx)
- `pay` - VLDX payment processing
- `signMessage` - Message signing
- `sendHapticFeedback` - Haptic feedback
- `share` - Content sharing

## 🔒 Security Features

- World ID verification required for claims
- SIWE message verification on backend
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure contract interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 📊 Contract Information

The VLDX ecosystem contracts are deployed and verified on World Chain Mainnet:

- **Deploy Script**: `scripts/deploy_mainnet_strict.js`
- **Verify Script**: `scripts/verify_mainnet_strict.js`
- **Gas Price**: ~0.001001437 gwei
- **Verification Status**: ✅ Verified on WorldScan

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with World App
5. Submit a pull request

## 📄 License

This project is proprietary and confidential to the Validium-X team.

## 🆘 Support

For issues or questions:
- Check World Developer Documentation
- Contact the Validium-X development team
- Submit issues via GitHub

---

**Validium-X - The Backbone of Crypto**  
*Powered by World Chain • Built with MiniKit*
