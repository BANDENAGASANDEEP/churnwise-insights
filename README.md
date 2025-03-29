
# ChurnWise Insights Project

This project consists of a FastAPI backend and a React frontend for telecom customer churn prediction and analysis.

## Project Structure

```
ChurnWise-Insights/
│
├── backend/              # Backend FastAPI code
│   ├── main.py           # Main API file
│   ├── .gitignore        # Backend gitignore
│   └── README.md         # Backend setup instructions
│
├── churnwise-insights-main/  # Data files 
│   ├── users.csv             # User data (created automatically)
│   ├── Telco-Customer-Churn.csv  # Telecom customer data
│   ├── random_forest_best_model.pkl  # ML model
│   └── customer_churn_store.json  # Chatbot document store
│
├── src/                 # Frontend React code
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── ...              # Other frontend files
│
└── ... (other project files)
```

## Setup Instructions

### 1. Backend Setup

1. Create required data folders:
```bash
mkdir -p churnwise-insights-main
```

2. Place your ML model and data files in the `churnwise-insights-main` folder:
   - Telco-Customer-Churn.csv
   - random_forest_best_model.pkl
   - customer_churn_store.json

3. Set up Python virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

4. Install Python dependencies:
```bash
pip install fastapi uvicorn pandas scikit-learn farm-haystack passlib python-multipart
```

5. Start the backend server:
```bash
python main.py
```

The backend API will be running at: http://localhost:8000

### 2. Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at: http://localhost:8080

## Usage

1. Open your browser and navigate to http://localhost:8080
2. Use the login page to sign in (register if needed)
3. Explore the dashboard with churn prediction and analytics features

## API Documentation

- API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc
