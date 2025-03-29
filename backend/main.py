
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
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
    raise FileNotFoundError(f"Required file not found: {churn_csv_path}. Please place it in the churnwise-insights-main folder.")

# Load ML model
if os.path.exists(rf_model_path):
    try:
        rf_model = joblib.load(rf_model_path)
        print(f"Loaded random forest model from {rf_model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise FileNotFoundError(f"Error loading model from {rf_model_path}: {e}")
else:
    raise FileNotFoundError(f"Required model file not found: {rf_model_path}. Please place it in the churnwise-insights-main folder.")

# Load chatbot data
if os.path.exists(churn_store_path):
    try:
        with open(churn_store_path, "r") as f:
            docs_json = json.load(f)
        docs = [Document.from_dict(doc) for doc in docs_json]
        print(f"Loaded chatbot data from {churn_store_path}")
    except Exception as e:
        print(f"Error loading chatbot data: {e}")
        raise FileNotFoundError(f"Error loading chatbot data from {churn_store_path}: {e}")
else:
    raise FileNotFoundError(f"Required chatbot data file not found: {churn_store_path}. Please place it in the churnwise-insights-main folder.")

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
    features: List[float]

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
    try:
        prediction = rf_model.predict([input_data.features])[0]
        return {"churn_prediction": int(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

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
        raise HTTPException(status_code=500, detail=f"Error generating dashboard data: {str(e)}")

# Customer Profile API
@app.get("/customer-profile")
def get_customer_profile(customer_id: str):
    try:
        customer = churn_data[churn_data["customerID"] == customer_id]
        if customer.empty:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer.to_dict(orient="records")[0]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving customer profile: {str(e)}")

# AI Chatbot API
@app.get("/chat")
def chat(query: str):
    try:
        results = retriever.retrieve(query, top_k=3)
        responses = [res.content for res in results]
        if not responses:
            raise HTTPException(status_code=404, detail="No relevant information found")
        return {"response": responses}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")

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
