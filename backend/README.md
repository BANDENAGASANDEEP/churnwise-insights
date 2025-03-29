
# ChurnWise Insights Backend

This is the backend API for the ChurnWise Insights application. It provides endpoints for user authentication, churn prediction, business analytics, and an AI chatbot.

## Requirements

- Python 3.7 or higher
- FastAPI
- pandas
- scikit-learn
- farm-haystack
- passlib
- uvicorn

## Installation

1. Create a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install dependencies:
```
pip install fastapi uvicorn pandas scikit-learn farm-haystack passlib python-multipart
```

3. Create a folder structure:
```
mkdir -p churnwise-insights-main
```

4. Place your data files in the churnwise-insights-main folder:
   - users.csv (will be created automatically if it doesn't exist)
   - Telco-Customer-Churn.csv
   - random_forest_best_model.pkl
   - customer_churn_store.json

## Running the API

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## API Documentation

- API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc
