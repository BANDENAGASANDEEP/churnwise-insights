
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
from typing import List
import uvicorn

# Initialize FastAPI app
app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change if needed)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve UI files
app.mount("/ui", StaticFiles(directory="churnwise-insights-main/ui", html=True), name="ui")

# Load datasets
users_csv_path = "churnwise-insights-main/users.csv"
churn_csv_path = "churnwise-insights-main/Telco-Customer-Churn.csv"
rf_model_path = "churnwise-insights-main/random_forest_best_model.pkl"
churn_store_path = "churnwise-insights-main/customer_churn_store.json"

users_df = pd.read_csv(users_csv_path) if os.path.exists(users_csv_path) else pd.DataFrame(columns=["email", "password"])
churn_data = pd.read_csv(churn_csv_path)

# Load ML model
rf_model = joblib.load(rf_model_path)

# Load BM25 Chatbot model
with open(churn_store_path, "r") as f:
    docs_json = json.load(f)
docs = [Document.from_dict(doc) for doc in docs_json]
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
    prediction = rf_model.predict([input_data.features])[0]
    return {"churn_prediction": int(prediction)}

# Business Analytics API
@app.get("/dashboard-data")
def get_dashboard_data():
    summary = churn_data.describe().to_dict()
    return {"summary": summary}

# Customer Profile API
@app.get("/customer-profile")
def get_customer_profile(customer_id: str):
    customer = churn_data[churn_data["customerID"] == customer_id]
    if customer.empty:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer.to_dict(orient="records")[0]

# AI Chatbot API
@app.get("/chat")
def chat(query: str):
    results = retriever.retrieve(query, top_k=3)
    responses = [res.content for res in results] if results else ["I'm sorry, I couldn't find relevant information."]
    return {"response": responses}

# Run the API
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
