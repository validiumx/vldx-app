@echo off
echo Setting up VLDX Rasmi Project...

echo.
echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Creating environment file...
if not exist .env.local (
    echo NEXT_PUBLIC_WORLD_APP_ID=your_app_id > .env.local
    echo NEXT_PUBLIC_WORLD_ACTION_ID=claim-daily-vldx >> .env.local
    echo NEXT_PUBLIC_API_URL=http://localhost:3000/api >> .env.local
    echo Environment file created! Please update .env.local with your actual values.
) else (
    echo Environment file already exists.
)

echo.
echo Step 3: Building the project...
call npm run build

echo.
echo Setup complete! You can now run:
echo npm run dev
echo.
pause
