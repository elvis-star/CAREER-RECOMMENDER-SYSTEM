@echo off
echo 🚀 Setting up ML System for Career Recommender (Windows)...
echo.

REM Check if Python 3.10 is installed
py -3.10 --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3.10 is not installed or not in PATH.
    echo Please install Python 3.10.11 from: https://www.python.org/downloads/release/python-31011/
    echo.
    pause
    exit /b 1
)

echo ✅ Python 3.10 found:
py -3.10 --version
echo.

REM Check if we're in the right directory
if not exist "server" (
    echo ❌ Error: server folder not found. Please run this script from the project root.
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Navigate to ML system directory
echo 📁 Navigating to ML system directory...
cd server\ml_system

REM Remove old virtual environment if it exists
if exist ml_env (
    echo 🗑️ Removing old virtual environment...
    rmdir /s /q ml_env
)

REM Create virtual environment
echo 📦 Creating Python virtual environment with Python 3.10...
py -3.10 -m venv ml_env

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call ml_env\Scripts\activate.bat

REM Upgrade pip, setuptools, wheel
echo 📥 Upgrading pip, setuptools, and wheel...
python -m pip install --upgrade pip setuptools wheel

REM Install Python dependencies (excluding problematic packages)
echo 📥 Installing Python dependencies...
pip install numpy==1.21.6
pip install pandas==1.5.3
pip install scikit-learn==1.2.2
pip install scipy==1.10.1
pip install pymongo==4.3.3
pip install joblib==1.2.0
pip install python-dotenv==1.0.0
pip install tqdm==4.65.0
pip install pytest==7.2.2

if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo ✅ Python dependencies installed successfully!

REM Create models directory
echo 📁 Creating models directory...
if not exist models mkdir models

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    echo # MongoDB Configuration > .env
    echo MONGODB_URI=mongodb://localhost:27017/career_recommender >> .env
    echo. >> .env
    echo # ML Model Configuration >> .env
    echo MODEL_PATH=./models >> .env
    echo LOG_LEVEL=INFO >> .env
)

echo ⚙️ Environment file created/updated at server\ml_system\.env
echo Please update the MONGODB_URI with your actual MongoDB connection string

echo.
echo 🎉 ML System setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update server\ml_system\.env with your MongoDB URI
echo 2. From server directory, run: npm run train-models-windows
echo 3. Test the system: npm run test-ml-windows  
echo 4. Start your server: npm run dev
echo.
echo 💡 To manually activate Python environment:
echo    cd server\ml_system ^&^& ml_env\Scripts\activate.bat
echo.

REM Go back to project root
cd ..\..

pause
