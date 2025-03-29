
# ChurnWise Insights Backend

This is the backend API for the ChurnWise Insights application. It provides endpoints for user authentication, churn prediction, business analytics, and an AI chatbot.

## Setup Instructions

### 1. Create the required folders
```
mkdir -p churnwise-insights-main
```

### 2. Data Files Information
You need the following files in the churnwise-insights-main folder:

- **users.csv**: Will be created automatically if it doesn't exist.
- **Telco-Customer-Churn.csv**: Contains telecom customer data.
- **random_forest_best_model.pkl**: Pre-trained ML model for churn prediction.
- **customer_churn_store.json**: Contains data for the AI chatbot.

**Note:** If any of these files are missing, the backend will use dummy data for testing purposes. For production use, make sure to place the actual data files in the folder.

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
python main.py
```

The API will be available at http://localhost:8000

### API Documentation
- API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc
- Health check: http://localhost:8000/health

## API Endpoints

### Authentication
- POST `/register` - Register a new user
- POST `/token` - Login and get access token

### Churn Prediction
- POST `/predict` - Predict churn for given customer features

### Business Analytics
- GET `/dashboard-data` - Get summary statistics and churn distribution

### Customer Profiles
- GET `/customer-profile?customer_id=<id>` - Get detailed customer information

### AI Chatbot
- GET `/chat?query=<text>` - Get AI responses to customer service queries
