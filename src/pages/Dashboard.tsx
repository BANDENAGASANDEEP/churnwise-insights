
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Bell, LayoutDashboard, User, Settings, Search, Send, Users, Phone, Mail, Calendar, Clock, DollarSign, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data for charts
const performanceData = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3000 },
  { month: 'Mar', value: 5000 },
  { month: 'Apr', value: 2780 },
  { month: 'May', value: 1890 },
  { month: 'Jun', value: 2390 },
  { month: 'Jul', value: 3490 },
];

const customerData = [
  { name: 'Active', value: 65 },
  { name: 'Inactive', value: 35 },
];

const COLORS = ['#8B5CF6', '#E5E7EB'];

// Sample customer data
const customers = [
  {
    id: "C78542396",
    name: "Emily Johnson",
    accountType: "Family Plan (3 lines)",
    spend: "$89.99",
    since: "March 2019",
    contract: "Monthly",
    payment: "Credit Card",
    lastContact: "15 days ago",
    churnRisk: 75,
    riskLevel: "high",
    riskFactors: [
      "Recent service disruptions (2 outages)",
      "Increasing usage beyond plan limits",
      "Competitor promotion inquiry (last call)",
      "Bill increases in last 3 months"
    ],
    recommendedOffers: [
      { name: "Premium Data Upgrade", success: 84, bestMatch: true, description: "Upgrade to unlimited premium data for all lines at current price for 6 months." },
      { name: "Family Plan Discount", success: 76, description: "15% monthly discount for next 12 months when adding a 4th line to family plan." },
      { name: "Device Upgrade Credit", success: 68, description: "$150 device upgrade credit on any new phone purchase with 24-month contract." },
      { name: "Premium Support Package", success: 62, description: "Free premium support and priority service for 12 months." }
    ]
  },
  {
    id: "C92345678",
    name: "Michael Smith",
    accountType: "Individual Premium",
    spend: "$75.99",
    since: "June 2020",
    contract: "Annual",
    payment: "Bank Transfer",
    lastContact: "3 days ago",
    churnRisk: 35,
    riskLevel: "low",
    riskFactors: [
      "Minor billing query (resolved)",
      "Occasional network issues in rural area",
    ],
    recommendedOffers: [
      { name: "Rural Coverage Booster", success: 75, bestMatch: true, description: "Free signal booster device for improved coverage in rural areas." },
      { name: "Loyalty Reward Points", success: 82, description: "2000 bonus reward points redeemable for accessories or bill credit." },
      { name: "International Calling Bundle", success: 45, description: "Discounted international calling package for 6 months." }
    ]
  }
];

// Sample churn reasons data for charts
const churnReasonsData = [
  { name: 'Service Quality', value: 35 },
  { name: 'Competitor Offers', value: 25 },
  { name: 'Price Increases', value: 20 },
  { name: 'Poor Support', value: 15 },
  { name: 'Other', value: 5 },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("business");
  const [searchCustomerId, setSearchCustomerId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [isSearching, setIsSearching] = useState(false);
  const [predictionResult, setPredicitionResult] = useState(null);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I\'m your TeleGuard assistant. How can I help you with churn prediction or customer retention today?' }
  ]);
  const [messageInput, setMessageInput] = useState("");
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Handle customer search
  const handleCustomerSearch = () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const customer = customers.find(c => c.id === searchCustomerId || c.name.toLowerCase().includes(searchCustomerId.toLowerCase()));
      if (customer) {
        setSelectedCustomer(customer);
      }
      setIsSearching(false);
    }, 800);
  };

  // Handle prediction form submission
  const handlePredictionSubmit = (e) => {
    e.preventDefault();
    
    // Get form values (simplified for demo)
    const contractType = e.target.elements.contract?.value || "Month-to-month";
    const tenure = parseInt(e.target.elements.tenure?.value || "0");
    
    // Calculate risk based on contract type and tenure (simplified logic)
    let risk = 0;
    if (contractType === "Month-to-month") {
      risk += 30;
    }
    if (tenure < 12) {
      risk += 20;
    }
    
    // Random factor to vary results
    risk += Math.floor(Math.random() * 30);
    
    // Cap risk between 0-100
    risk = Math.min(Math.max(risk, 0), 100);
    
    // Determine risk level
    let riskLevel = "low";
    let riskColor = "green-500";
    
    if (risk > 70) {
      riskLevel = "high";
      riskColor = "destructive";
    } else if (risk > 40) {
      riskLevel = "medium";
      riskColor = "yellow-500";
    }
    
    // Set prediction result
    setPredicitionResult({
      risk,
      riskLevel,
      riskColor,
      factors: [
        contractType === "Month-to-month" ? "Month-to-month contract" : "Contract type is favorable",
        e.target.elements["online-security"]?.value === "No" ? "No online security" : "Has online security",
        tenure < 12 ? "Low tenure (new customer)" : "Good tenure length"
      ]
    });
  };

  // Handle sending chat message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // Add user message
    setChatMessages([...chatMessages, { sender: 'user', text: messageInput }]);
    setMessageInput("");
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse = "I'm analyzing your request. How else can I assist you with customer retention?";
      
      // Simple keyword-based responses
      if (messageInput.toLowerCase().includes("churn")) {
        botResponse = "To reduce churn, we recommend focusing on service quality improvements and personalized offers based on usage patterns.";
      } else if (messageInput.toLowerCase().includes("retention")) {
        botResponse = "Our data shows that loyalty programs and proactive service issue resolution can improve retention by up to 25%.";
      } else if (messageInput.toLowerCase().includes("offer") || messageInput.toLowerCase().includes("discount")) {
        botResponse = "The most effective offers currently are data upgrades for high-usage customers and family plan discounts for single-line users.";
      }
      
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">TeleGuard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="flex gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                <User className="h-5 w-5 text-violet-600 dark:text-violet-300" />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 inline-flex shadow-md">
            <Button 
              variant={activeTab === 'business' ? "default" : "ghost"}
              className={`rounded-full ${activeTab === 'business' ? 'bg-violet-600 hover:bg-violet-700' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              Business Analytics
            </Button>
            <Button 
              variant={activeTab === 'customer' ? "default" : "ghost"}
              className={`rounded-full ${activeTab === 'customer' ? 'bg-violet-600 hover:bg-violet-700' : ''}`}
              onClick={() => setActiveTab('customer')}
            >
              Customer Profile
            </Button>
            <Button 
              variant={activeTab === 'prediction' ? "default" : "ghost"}
              className={`rounded-full ${activeTab === 'prediction' ? 'bg-violet-600 hover:bg-violet-700' : ''}`}
              onClick={() => setActiveTab('prediction')}
            >
              Churn Prediction
            </Button>
          </div>
        </div>
        
        {activeTab === 'business' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Growth</CardTitle>
                  <CardDescription>Monthly performance data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Revenue']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8B5CF6" 
                          fill="url(#colorGradient)" 
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Customer Retention</CardTitle>
                  <CardDescription>Overall account status</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={customerData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          labelLine={false}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                            return (
                              <text 
                                x={x} 
                                y={y} 
                                fill="#888888" 
                                textAnchor={x > cx ? 'start' : 'end'} 
                                dominantBaseline="central"
                              >
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                            );
                          }}
                        >
                          {customerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity</CardTitle>
                  <CardDescription>User engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value}`, 'Active Users']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#8B5CF6" 
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
        
        {activeTab === 'customer' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Customer Search */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="max-w-xl mx-auto">
                  <label htmlFor="customerId" className="block text-sm font-medium mb-2">Search Customer</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      id="customerId" 
                      placeholder="Enter Customer ID or Name" 
                      className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={searchCustomerId}
                      onChange={(e) => setSearchCustomerId(e.target.value)} 
                    />
                    <Button 
                      variant="default" 
                      className="rounded-l-none"
                      onClick={handleCustomerSearch} 
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Customer Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Info */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">Customer Information</CardTitle>
                    <div className="px-2 py-1 text-xs bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 rounded-md font-medium">
                      Premium
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center mr-4">
                      <User className="h-8 w-8 text-violet-600 dark:text-violet-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedCustomer.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {selectedCustomer.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 py-2">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Account Type</span>
                      </div>
                      <span className="text-sm font-medium">{selectedCustomer.accountType}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 py-2">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Monthly Spend</span>
                      </div>
                      <span className="text-sm font-medium">{selectedCustomer.spend}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 py-2">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Customer Since</span>
                      </div>
                      <span className="text-sm font-medium">{selectedCustomer.since}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 py-2">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Contract Type</span>
                      </div>
                      <span className="text-sm font-medium">{selectedCustomer.contract}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 py-2">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Payment Method</span>
                      </div>
                      <span className="text-sm font-medium">{selectedCustomer.payment}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Last Contact</span>
                      </div>
                      <span className="text-sm font-medium">{selectedCustomer.lastContact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Churn Risk */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Churn Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-8 text-center">
                    <div className="relative inline-block">
                      <svg className="w-36 h-36" viewBox="0 0 36 36">
                        <path 
                          className="stroke-current text-gray-200" 
                          strokeWidth="2" 
                          fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path 
                          className={`stroke-current ${selectedCustomer.riskLevel === 'high' ? 'text-red-500' : 'text-yellow-500'}`}
                          strokeWidth="2" 
                          fill="none" 
                          strokeDasharray={`${selectedCustomer.churnRisk}, 100`} 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.5" className="font-bold text-3xl" textAnchor="middle">{selectedCustomer.churnRisk}%</text>
                      </svg>
                    </div>
                    <div className={`${selectedCustomer.riskLevel === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'} px-4 py-2 rounded-md inline-block mt-4`}>
                      <span className="font-medium capitalize">{selectedCustomer.riskLevel} Risk of Churn</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Key Risk Factors:</h3>
                    <div className="space-y-3">
                      {selectedCustomer.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-1 h-4 ${index < 3 ? 'bg-red-500' : 'bg-yellow-500'} mr-3`}></div>
                          <span className="text-sm">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Retention Offers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recommended Retention Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedCustomer.recommendedOffers.map((offer, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-violet-500 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{offer.name}</h3>
                          {offer.bestMatch && (
                            <div className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded">Best Match</div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{offer.success}% success rate</span>
                          <Button variant="default" size="sm" className="px-3 py-1 h-auto text-xs bg-violet-600 hover:bg-violet-700">
                            Apply Offer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'prediction' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Prediction Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Customer Data Input</CardTitle>
                  <CardDescription>
                    Enter customer information to predict churn probability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="churnPredictionForm" className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handlePredictionSubmit}>
                    <div>
                      <label htmlFor="customer-type" className="block text-sm font-medium mb-2">Customer Type</label>
                      <select id="customer-type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option>New Customer</option>
                        <option>Existing Customer</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="tenure" className="block text-sm font-medium mb-2">Tenure (months)</label>
                      <input type="number" id="tenure" name="tenure" min="0" max="120" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" defaultValue="0" />
                    </div>
                    
                    <div>
                      <label htmlFor="contract" className="block text-sm font-medium mb-2">Contract Type</label>
                      <select id="contract" name="contract" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option>Month-to-month</option>
                        <option>One year</option>
                        <option>Two year</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="payment-method" className="block text-sm font-medium mb-2">Payment Method</label>
                      <select id="payment-method" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option>Electronic check</option>
                        <option>Mailed check</option>
                        <option>Bank transfer</option>
                        <option>Credit card</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="monthly-charges" className="block text-sm font-medium mb-2">Monthly Charges ($)</label>
                      <input type="number" id="monthly-charges" min="0" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" defaultValue="65" />
                    </div>
                    
                    <div>
                      <label htmlFor="total-charges" className="block text-sm font-medium mb-2">Total Charges ($)</label>
                      <input type="number" id="total-charges" min="0" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" defaultValue="0" />
                    </div>
                    
                    <div>
                      <label htmlFor="online-security" className="block text-sm font-medium mb-2">Online Security</label>
                      <select id="online-security" name="online-security" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option>No</option>
                        <option>Yes</option>
                        <option>No internet service</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="tech-support" className="block text-sm font-medium mb-2">Tech Support</label>
                      <select id="tech-support" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option>No</option>
                        <option>Yes</option>
                        <option>No internet service</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="internet-service" className="block text-sm font-medium mb-2">Internet Service</label>
                      <select id="internet-service" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option>DSL</option>
                        <option>Fiber optic</option>
                        <option>No</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="online-backup" className="block text-sm font-medium mb-2">Online Backup</label>
                      <select id="online-backup" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option>No</option>
                        <option>Yes</option>
                        <option>No internet service</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex items-center mb-4">
                        <input type="checkbox" id="multiple-lines" className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500" />
                        <label htmlFor="multiple-lines" className="ml-2 text-sm">Multiple Lines</label>
                      </div>
                      <div className="flex items-center mb-4">
                        <input type="checkbox" id="streaming-tv" className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500" />
                        <label htmlFor="streaming-tv" className="ml-2 text-sm">Streaming TV</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="streaming-movies" className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500" />
                        <label htmlFor="streaming-movies" className="ml-2 text-sm">Streaming Movies</label>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 mt-4">
                      <Button type="submit" className="w-full">Predict Churn Probability</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Prediction Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Prediction Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {predictionResult ? (
                    <>
                      <div className="text-center mb-8">
                        <div className="relative inline-block">
                          <svg className="w-36 h-36" viewBox="0 0 36 36">
                            <path 
                              className="stroke-current text-gray-200" 
                              strokeWidth="2" 
                              fill="none" 
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path 
                              className={`stroke-current text-${predictionResult.riskColor}`}
                              strokeWidth="2" 
                              fill="none" 
                              strokeDasharray={`${predictionResult.risk}, 100`} 
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.5" className="font-bold text-3xl" textAnchor="middle">{predictionResult.risk}%</text>
                          </svg>
                        </div>
                        <div className={`bg-${predictionResult.riskColor}/10 text-${predictionResult.riskColor} px-4 py-2 rounded-md inline-block mt-4`}>
                          <span className="font-medium capitalize">{predictionResult.riskLevel} Risk of Churn</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Key Risk Factors:</h3>
                        <div className="space-y-3">
                          {predictionResult.factors.map((factor, index) => (
                            <div key={index} className="flex items-center">
                              <div 
                                className={`w-1 h-4 ${factor.includes('No') || factor.includes('Month-to-month') ? 'bg-yellow-500' : 'bg-green-500'} mr-3`}
                              ></div>
                              <span className="text-sm">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="text-sm font-medium mb-3">Recommended Actions:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                          <li>Offer security package add-on</li>
                          <li>Consider contract upgrade incentives</li>
                          <li>Monitor usage patterns closely</li>
                          <li>Schedule follow-up satisfaction call</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <p className="text-muted-foreground mb-6">Enter customer data and click "Predict" to see churn probability analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </main>
      
      {/* AI Chatbot */}
      <div className={`fixed bottom-6 right-6 z-50 ${chatbotVisible ? 'flex' : 'hidden'} flex-col w-80 md:w-96 rounded-lg shadow-xl overflow-hidden`}>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center mr-3">
                <MessageSquare className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              </div>
              <h3 className="font-medium">TeleGuard Assistant</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setChatbotVisible(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          </div>
          
          <div className="h-80 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {chatMessages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.sender === 'bot' ? 'pr-12' : 'pl-12 flex justify-end'}`}>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'bot' 
                    ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' 
                    : 'bg-violet-600 text-white'
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button className="rounded-l-none" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6">
        <Button 
          className="rounded-full h-12 w-12 p-0 shadow-lg bg-violet-600 hover:bg-violet-700"
          onClick={() => setChatbotVisible(!chatbotVisible)}
        >
          {chatbotVisible ? (
            <Settings className="h-5 w-5" />
          ) : (
            <MessageSquare className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
