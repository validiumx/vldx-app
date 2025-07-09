# VLDX Rasmi Setup Instructions

## Manual Setup (Recommended)

1. **Create new Next.js project:**
\`\`\`bash
npx create-next-app@latest vldx-rasmi --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
\`\`\`

2. **Navigate to project directory:**
\`\`\`bash
cd vldx-rasmi
\`\`\`

3. **Install additional dependencies:**
\`\`\`bash
npm install @worldcoin/minikit-js @worldcoin/minikit-react @worldcoin/idkit siwe viem ethers class-variance-authority clsx tailwind-merge
\`\`\`

4. **Copy all the files from this v0 project to your local project**

5. **Run the development server:**
\`\`\`bash
npm run dev
\`\`\`

## Alternative: Direct Download

You can also download the complete project files and run:

\`\`\`bash
npm install
npm run dev
\`\`\`

## Environment Variables

Create a \`.env.local\` file:

\`\`\`env
NEXT_PUBLIC_WORLD_APP_ID=your_app_id
NEXT_PUBLIC_WORLD_ACTION_ID=claim-daily-vldx
NEXT_PUBLIC_API_URL=http://localhost:3000/api
\`\`\`

## Troubleshooting

If you encounter any issues:
1. Delete \`node_modules\` and \`package-lock.json\`
2. Run \`npm install\` again
3. Make sure you're using Node.js 18+
