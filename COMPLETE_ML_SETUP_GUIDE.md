# Complete ML Setup Guide for Career Recommender System

## 🎯 Overview

This guide will help you set up the Machine Learning enhancement for your career recommendation system on Windows.

## 📋 Prerequisites

- Python 3.8 or higher installed
- Node.js and npm installed
- MongoDB running (local or cloud)
- Your existing career recommender project

## 🚀 Step-by-Step Setup

### Step 1: Run the Setup Script

\`\`\`cmd

# From your project root directory

setup_ml_system_windows.bat
\`\`\`

This script will:

- ✅ Check Python installation
- ✅ Create Python virtual environment in `server/ml_system/ml_env`
- ✅ Install all required Python packages
- ✅ Create models directory
- ✅ Create .env file with default settings

### Step 2: Configure Database Connection

\`\`\`cmd

# Edit the ML system environment file

cd server\ml_system
notepad .env
\`\`\`

Update the MongoDB URI:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/your_database_name
\`\`\`

### Step 3: Train the ML Models

\`\`\`cmd

# From the server directory

cd server
npm run train-models-windows
\`\`\`

This will:

- Connect to your MongoDB database
- Extract training data from existing users and recommendations
- Train collaborative filtering model
- Train academic performance predictor
- Save trained models to `server/ml_system/models/`

### Step 4: Test the ML System

\`\`\`cmd

# Test if everything is working

npm run test-ml-windows
\`\`\`

### Step 5: Start Your Enhanced Server

\`\`\`cmd

# Start the server with ML capabilities

npm run dev
\`\`\`

## 🔄 Workflow Explanation

### Training Phase (One-time or Periodic)

1. **Data Collection**: Extract user interactions, KCSE results, and recommendation history
2. **Model Training**: Train collaborative filtering and performance prediction models
3. **Model Persistence**: Save trained models to disk

### Runtime Phase (Continuous)

1. **Server Startup**: Load pre-trained models into memory
2. **Request Processing**: When users request recommendations:
   - Generate rule-based recommendations (your existing logic)
   - Enhance with ML predictions (success probability, similar careers)
   - Return combined results

### The Models Don't Run Concurrently

- Models are **trained offline** and saved to files
- The **server loads** these files at startup
- **Predictions are fast** (milliseconds) using loaded models
- **Re-training** can be done periodically with new data

## 📁 File Structure After Setup

\`\`\`
your-project/
├── client/ # Your React frontend
├── server/ # Your Node.js backend
│ ├── ml_system/ # 🆕 ML System
│ │ ├── ml_env/ # 🆕 Python virtual environment
│ │ │ ├── Scripts/ # 🆕 Python executables (Windows)
│ │ │ └── Lib/ # 🆕 Python packages
│ │ ├── models/ # 🆕 Trained ML models (generated)
│ │ │ ├── collaborative_filter.joblib # 🆕 (after training)
│ │ │ ├── performance_predictor.joblib # 🆕 (after training)
│ │ │ └── training_report.json # 🆕 (after training)
│ │ ├── collaborative_filtering_model.py # 🆕 CF model
│ │ ├── academic_performance_predictor.py # 🆕 Performance predictor
│ │ ├── ml_integration_service.py # 🆕 Main ML service
│ │ ├── train_models.py # 🆕 Training script
│ │ ├── requirements.txt # 🆕 Python dependencies
│ │ └── .env # 🆕 ML configuration
│ ├── controllers/
│ │ ├── recommendationController.js # Your existing controller
│ │ └── mlEnhancedRecommendationController.js # 🆕 ML-enhanced controller
│ ├── routes/
│ │ ├── recommendationRoutes.js # Your existing routes
│ │ └── mlRecommendationRoutes.js # 🆕 ML routes
│ ├── models/
│ │ └── Recommendation.js # 🔄 Updated with ML fields
│ ├── utils/
│ │ └── mlHelper.js # 🆕 ML utility functions
│ ├── server.js # 🔄 Updated with ML routes
│ └── package.json # 🔄 Updated with ML scripts
├── setup_ml_system_windows.bat # 🆕 Setup script
└── COMPLETE_ML_SETUP_GUIDE.md # 🆕 This guide
\`\`\`

## 🧠 What the ML System Does

### For Students:

1. **Smarter Recommendations**: Instead of just grade matching, considers patterns from similar students
2. **Success Predictions**: "Students with your profile have 87% success rate in this career"
3. **Personalized Insights**: "Improve Chemistry from B to B+ to increase Medical career fit by 15%"
4. **Discovery**: "Students like you also considered Data Science - 78% match"

### Technical Features:

1. **Collaborative Filtering**: Finds students with similar academic profiles and interests
2. **Performance Prediction**: Predicts success probability for each career path
3. **Trend Analysis**: Identifies emerging career trends
4. **Continuous Learning**: Models improve as more students use the system

## 🔧 Maintenance Commands

\`\`\`cmd

# Check ML system health

npm run ml-health

# Check if models exist

npm run ml-status

# Retrain models with new data

npm run train-models-windows

# Test ML integration

npm run test-ml-windows
\`\`\`

## 🚨 Troubleshooting

### Python Not Found

\`\`\`cmd

# Install Python from python.org

# Make sure to check "Add Python to PATH" during installation

\`\`\`

### Virtual Environment Issues

\`\`\`cmd

# Manually create virtual environment

cd server\ml_system
python -m venv ml_env
ml_env\Scripts\activate
pip install -r requirements.txt
\`\`\`

### MongoDB Connection Issues

\`\`\`cmd

# Check if MongoDB is running

# Update MONGODB_URI in server/ml_system/.env

\`\`\`

### Models Not Training

\`\`\`cmd

# Check training logs

cd server
npm run train-models-windows

# Look for error messages in the output

\`\`\`

## 🎉 Success Indicators

✅ Setup script completes without errors
✅ Models directory contains .joblib files after training
✅ ML health check returns "healthy": true
✅ Server starts with "🤖 ML System integration enabled" message
✅ API endpoint `/api/ml-health` returns system status

## 📈 Next Steps

1. **Test with Real Data**: Input some KCSE results and see ML-enhanced recommendations
2. **Monitor Performance**: Check `/api/ml-health` endpoint regularly
3. **Retrain Periodically**: Run training script monthly with new user data
4. **Analyze Results**: Compare ML-enhanced vs rule-based recommendations

Your career recommendation system is now powered by machine learning! 🚀
