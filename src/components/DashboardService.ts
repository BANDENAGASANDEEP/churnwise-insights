
import { churnService, chatbotService } from '@/services/api';

// Dashboard data interface
export interface DashboardData {
  summary: {
    [key: string]: {
      [stat: string]: number;
    };
  };
}

// Customer profile interface
export interface CustomerProfile {
  customerID: string;
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
  Churn: string;
}

// Churn prediction interface
export interface ChurnPrediction {
  churn_prediction: number;
}

// Chat response interface
export interface ChatResponse {
  response: string[];
}

// Get dashboard data
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await churnService.getDashboardData();
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Get customer profile
export const getCustomerProfile = async (customerId: string): Promise<CustomerProfile> => {
  try {
    const response = await churnService.getCustomerProfile(customerId);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    throw error;
  }
};

// Predict churn
export const predictChurn = async (features: number[]): Promise<ChurnPrediction> => {
  try {
    const response = await churnService.predictChurn(features);
    return response.data;
  } catch (error) {
    console.error('Error predicting churn:', error);
    throw error;
  }
};

// Send chat message
export const sendChatMessage = async (query: string): Promise<ChatResponse> => {
  try {
    const response = await chatbotService.sendMessage(query);
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};
