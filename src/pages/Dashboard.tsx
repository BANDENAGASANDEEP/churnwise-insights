
import { useState } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("business");
  
  return (
    <div className="min-h-screen bg-background">
      <header className="glass-nav py-4 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">TeleGuard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="btn-secondary text-sm px-3 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Notifications
              </button>
              <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="glass-card rounded-full p-1 inline-flex">
            <button 
              className={`px-6 py-2 rounded-full transition-all ${activeTab === 'business' ? 'bg-primary text-white' : 'hover:bg-background/50'}`}
              onClick={() => setActiveTab('business')}
            >
              Business Analytics
            </button>
            <button 
              className={`px-6 py-2 rounded-full transition-all ${activeTab === 'customer' ? 'bg-primary text-white' : 'hover:bg-background/50'}`}
              onClick={() => setActiveTab('customer')}
            >
              Customer Profile
            </button>
            <button 
              className={`px-6 py-2 rounded-full transition-all ${activeTab === 'prediction' ? 'bg-primary text-white' : 'hover:bg-background/50'}`}
              onClick={() => setActiveTab('prediction')}
            >
              Churn Prediction
            </button>
          </div>
        </div>
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 rounded-xl shadow-lg"
        >
          {activeTab === 'business' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Business Analytics Dashboard</h2>
              <p className="text-muted-foreground">Coming soon - Interactive charts and analytics</p>
            </div>
          )}
          
          {activeTab === 'customer' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Customer Profile</h2>
              <p className="text-muted-foreground">Coming soon - Customer details and churn analysis</p>
            </div>
          )}
          
          {activeTab === 'prediction' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Churn Prediction</h2>
              <p className="text-muted-foreground">Coming soon - Prediction models for new entries</p>
            </div>
          )}
        </motion.div>
      </main>
      
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
