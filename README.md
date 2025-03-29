
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

## Testing vs. Production Data

The application can run in two modes:

1. **Testing Mode**: If the required data files are missing, the backend will automatically use dummy data. This is useful for initial setup and testing.

2. **Production Mode**: For real predictions and analytics, you need to place the actual data files in the `churnwise-insights-main` folder.

## Setup Instructions

### 1. Backend Setup

1. Create required data folders:
```bash
mkdir -p churnwise-insights-main
```

2. For production use, place your ML model and data files in the `churnwise-insights-main` folder:
   - Telco-Customer-Churn.csv
   - random_forest_best_model.pkl
   - customer_churn_store.json

   Note: The application will work with dummy data if these files are missing.

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

The frontend will be available at: http://localhost:5173

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Use the login page to sign in (register if needed)
3. Explore the dashboard with churn prediction and analytics features

## API Documentation

- API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc
- Health check: http://localhost:8000/health
