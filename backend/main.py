
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from fastapi.staticfiles import StaticFiles
import pandas as pd
import joblib
import json
import os

from haystack.document_stores.memory import InMemoryDocumentStore
from haystack.nodes import BM25Retriever
from haystack.schema import Document

from pydantic import BaseModel
from typing import List, Optional
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="ChurnWise Insights API", 
              description="API for telecom customer churn prediction and analysis")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create data directory if it doesn't exist
os.makedirs("churnwise-insights-main", exist_ok=True)

# Define file paths
users_csv_path = "churnwise-insights-main/users.csv"
churn_csv_path = "churnwise-insights-main/Telco-Customer-Churn.csv"
rf_model_path = "churnwise-insights-main/random_forest_best_model.pkl"
churn_store_path = "churnwise-insights-main/customer_churn_store.json"

# Load users data or create empty DataFrame
users_df = pd.read_csv(users_csv_path) if os.path.exists(users_csv_path) else pd.DataFrame(columns=["email", "password"])
if not os.path.exists(users_csv_path):
    users_df.to_csv(users_csv_path, index=False)
    print(f"Created empty users file at {users_csv_path}")

# Check for churn data
if os.path.exists(churn_csv_path):
    churn_data = pd.read_csv(churn_csv_path)
    print(f"Loaded telecom churn data from {churn_csv_path}")
else:
    # Create dummy data for testing if real data is missing
    print(f"WARNING: {churn_csv_path} not found. Using dummy data for testing.")
    # Create minimal dummy data with essential columns
    churn_data = pd.DataFrame({
        "customerID": ["TEST-001", "TEST-002", "TEST-003"],
        "gender": ["Male", "Female", "Male"],
        "SeniorCitizen": [0, 1, 0],
        "Partner": ["Yes", "No", "Yes"],
        "Dependents": ["No", "No", "Yes"],
        "tenure": [12, 24, 36],
        "PhoneService": ["Yes", "Yes", "Yes"],
        "MultipleLines": ["No", "Yes", "No"],
        "InternetService": ["DSL", "Fiber optic", "No"],
        "OnlineSecurity": ["Yes", "No", "No"],
        "OnlineBackup": ["Yes", "No", "No"],
        "DeviceProtection": ["No", "Yes", "No"],
        "TechSupport": ["No", "No", "Yes"],
        "StreamingTV": ["No", "Yes", "No"],
        "StreamingMovies": ["No", "Yes", "No"],
        "Contract": ["Month-to-month", "One year", "Two year"],
        "PaperlessBilling": ["Yes", "Yes", "No"],
        "PaymentMethod": ["Electronic check", "Mailed check", "Bank transfer (automatic)"],
        "MonthlyCharges": [29.85, 56.95, 104.80],
        "TotalCharges": [100.35, 1889.50, 3046.05],
        "Churn": ["No", "Yes", "No"]
    })

# Load ML model or create dummy model
if os.path.exists(rf_model_path):
    try:
        rf_model = joblib.load(rf_model_path)
        print(f"Loaded random forest model from {rf_model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")
        rf_model = None
else:
    print(f"WARNING: {rf_model_path} not found. Using dummy prediction logic.")
    rf_model = None

# Load chatbot data or create dummy data
if os.path.exists(churn_store_path):
    try:
        with open(churn_store_path, "r") as f:
            docs_json = json.load(f)
        docs = [Document.from_dict(doc) for doc in docs_json]
        print(f"Loaded chatbot data from {churn_store_path}")
    except Exception as e:
        print(f"Error loading chatbot data: {e}")
        # Create dummy documents
        docs = [Document(content="Dummy chatbot response for testing purposes.", id="1")]
else:
    print(f"WARNING: {churn_store_path} not found. Using dummy chatbot data.")
    # Create dummy documents
    docs = [Document(content="This is a test response from the chatbot. Please add the customer_churn_store.json file for real responses.", id="1")]

# Initialize document store and retriever
document_store = InMemoryDocumentStore(use_bm25=True)
document_store.write_documents(docs)
retriever = BM25Retriever(document_store=document_store)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# User Model
class User(BaseModel):
    email: str
    password: str

# Churn Prediction Request Model
class ChurnInput(BaseModel):
    features: List[float]  # Adjust according to your dataset features

# Register user
@app.post("/register")
def register(user: User):
    global users_df
    if user.email in users_df["email"].values:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    new_user = pd.DataFrame({"email": [user.email], "password": [pwd_context.hash(user.password)]})
    
    if users_df.empty:
        new_user.to_csv(users_csv_path, index=False)
    else:
        new_user.to_csv(users_csv_path, mode="a", header=False, index=False)
    
    users_df = pd.read_csv(users_csv_path)  # Reload updated data
    return {"message": "User registered successfully"}

# User login
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_df[users_df["email"] == form_data.username]
    if user.empty or not pwd_context.verify(form_data.password, user.iloc[0]["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": form_data.username, "token_type": "bearer"}

# Churn Prediction API
@app.post("/predict")
def predict_churn(input_data: ChurnInput):
    if rf_model is None:
        # If model is not available, provide a dummy prediction
        return {"churn_prediction": 0, "is_dummy": True, "message": "Using dummy prediction (model not found)"}
    
    try:
        prediction = rf_model.predict([input_data.features])[0]
        return {"churn_prediction": int(prediction)}
    except Exception as e:
        return {"error": str(e), "is_dummy": True, "churn_prediction": 0}

# Business Analytics API
@app.get("/dashboard-data")
def get_dashboard_data():
    try:
        summary = churn_data.describe().to_dict()
        
        # Add churn distribution data
        churn_distribution = churn_data["Churn"].value_counts().to_dict()
        
        # Calculate some additional metrics
        total_customers = len(churn_data)
        churn_rate = churn_data["Churn"].value_counts(normalize=True).to_dict()
        
        return {
            "summary": summary,
            "churn_distribution": churn_distribution,
            "total_customers": total_customers,
            "churn_rate": churn_rate
        }
    except Exception as e:
        return {"error": str(e), "message": "Error generating dashboard data"}

# Customer Profile API
@app.get("/customer-profile")
def get_customer_profile(customer_id: str):
    try:
        customer = churn_data[churn_data["customerID"] == customer_id]
        if customer.empty:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer.to_dict(orient="records")[0]
    except Exception as e:
        if str(e) == "404: Customer not found":
            raise HTTPException(status_code=404, detail="Customer not found")
        return {"error": str(e), "message": "Error retrieving customer profile"}

# AI Chatbot API
@app.get("/chat")
def chat(query: str):
    try:
        results = retriever.retrieve(query, top_k=3)
        responses = [res.content for res in results] if results else ["I'm sorry, I couldn't find relevant information."]
        return {"response": responses}
    except Exception as e:
        return {"response": [f"Error: {str(e)}. Please check if the chatbot data is properly loaded."]}

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "up", 
        "data_files": {
            "users.csv": os.path.exists(users_csv_path),
            "Telco-Customer-Churn.csv": os.path.exists(churn_csv_path),
            "random_forest_best_model.pkl": os.path.exists(rf_model_path),
            "customer_churn_store.json": os.path.exists(churn_store_path)
        }
    }

# Run the API
if __name__ == "__main__":
    print("Starting ChurnWise Insights API...")
    print("Check API documentation at http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
