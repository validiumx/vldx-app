vldx-app
Validium-X (VLDX) Official World Mini App — claim, swap, and invite friends to earn VLDX tokens directly within World App.

🌟 Overview
VLDX Mini App lets World App users easily claim daily rewards, swap VLDX tokens, and invite friends to earn bonuses. Built natively for World Chain using MiniKit and fully integrated with official smart contracts.

✨ Key Features
Daily VLDX token claims

Invite friends and earn referral rewards

Secure wallet authentication (SIWE)

World ID verification for claims

Swap and pay directly in World App

🚀 Getting Started
Prerequisites
Node.js 18+

World App installed on your device

World Developer Portal account

Installation
bash
Copy
Edit
git clone <repository-url>
cd validium-x-world-mini-app
npm install
# or
pnpm install
Setup
Copy the example environment file:

bash
Copy
Edit
cp .env.example .env.local
Update it with your World App credentials:

ini
Copy
Edit
NEXT_PUBLIC_WORLD_APP_ID=your_app_id
NEXT_PUBLIC_WORLD_ACTION_ID=claim-daily-vldx
NEXT_PUBLIC_API_URL=http://localhost:3000/api
Start the development server:

bash
Copy
Edit
npm run dev
# or
pnpm dev
Open http://localhost:3000 inside World App.

🚢 Deployment
Recommended: Vercel
Connect your GitHub repository to Vercel

Add environment variables via the Vercel dashboard

Deploy automatically on each push

Manual
bash
Copy
Edit
npm run build
npm start
📄 License
Proprietary — Validium-X Team. All rights reserved.

💬 Support
Refer to World Developer Documentation

Contact the Validium-X development team

Open an issue on GitHub
