
# ChurnWise Insights Backend

This is the backend API for the ChurnWise Insights application. It provides endpoints for user authentication, churn prediction, business analytics, and an AI chatbot.

## Setup Instructions

### 1. Create the required folders
```
mkdir -p churnwise-insights-main
```

### 2. Place your data files
You need the following files in the churnwise-insights-main folder:
- users.csv (will be created automatically if it doesn't exist)
- Telco-Customer-Churn.csv
- random_forest_best_model.pkl
- customer_churn_store.json

### 3. Create a virtual environment
```
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

### 4. Install dependencies
```
pip install fastapi uvicorn pandas scikit-learn farm-haystack passlib python-multipart
```

### 5. Start the backend server
```
cd backend
python main.py
```

The API will be available at http://localhost:8000

### API Documentation
- API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc
