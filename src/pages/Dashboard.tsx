
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Bell, LayoutDashboard, User, Settings } from "lucide-react";

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("business");
  
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
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Customer Profile Analytics</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Detailed customer segmentation and behavior analysis coming soon. This dashboard will provide insights on customer demographics, activity patterns, and churn risk factors.
              </p>
              <div className="mt-10 flex justify-center">
                <div className="animate-pulse flex space-x-4 p-6 max-w-lg w-full">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-violet-200 dark:bg-violet-700 rounded w-3/4"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-violet-200 dark:bg-violet-700 rounded col-span-2"></div>
                        <div className="h-2 bg-violet-200 dark:bg-violet-700 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-violet-200 dark:bg-violet-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'prediction' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Churn Prediction Model</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Advanced AI-powered churn prediction coming soon. This feature will help you identify customers at risk of churning before they leave, enabling proactive retention strategies.
              </p>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="animate-pulse space-y-4">
                      <div className="h-20 bg-violet-200 dark:bg-violet-800 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-violet-200 dark:bg-violet-700 rounded"></div>
                        <div className="h-2 bg-violet-200 dark:bg-violet-700 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
      
      <div className="fixed bottom-6 right-6">
        <Button className="rounded-full h-12 w-12 p-0 shadow-lg bg-violet-600 hover:bg-violet-700">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
