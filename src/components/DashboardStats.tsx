
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/components/DashboardService";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, UserMinus, TrendingUp, DollarSign } from "lucide-react";

export function DashboardStats() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Failed to load dashboard data",
          description: "Please check your connection and try again",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Prepare data for charts
  const prepareChurnDistribution = () => {
    if (!dashboardData?.churn_distribution) return [];
    
    return [
      { name: "Retained", value: dashboardData.churn_distribution["No"] || 0 },
      { name: "Churned", value: dashboardData.churn_distribution["Yes"] || 0 },
    ];
  };

  // Monthly trend data (example data - in a real app this would come from the API)
  const churnTrendData = [
    { month: "Jan", churnRate: 5.2 },
    { month: "Feb", churnRate: 5.8 },
    { month: "Mar", churnRate: 5.4 },
    { month: "Apr", churnRate: 5.9 },
    { month: "May", churnRate: 5.7 },
    { month: "Jun", churnRate: 6.1 },
    { month: "Jul", churnRate: 5.6 },
    { month: "Aug", churnRate: 5.3 },
    { month: "Sep", churnRate: 4.9 },
    { month: "Oct", churnRate: 4.8 },
    { month: "Nov", churnRate: 4.6 },
    { month: "Dec", churnRate: 4.5 },
  ];

  // Churn reasons data (example data - in a real app this would come from the API)
  const churnReasonsData = [
    { reason: "Price", percentage: 38 },
    { reason: "Competitor", percentage: 25 },
    { reason: "Service Quality", percentage: 15 },
    { reason: "Coverage", percentage: 12 },
    { reason: "Moving", percentage: 7 },
    { reason: "Other", percentage: 3 },
  ];

  // Colors for pie chart
  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Summary statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.total_customers || "N/A"}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.churn_rate?.["Yes"] 
                        ? (dashboardData.churn_rate["Yes"] * 100).toFixed(1) + "%" 
                        : "N/A"}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <UserMinus className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Tenure</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.summary?.["tenure"]?.["mean"] 
                        ? Math.round(dashboardData.summary["tenure"]["mean"]) + " mo" 
                        : "N/A"}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Monthly Charge</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.summary?.["MonthlyCharges"]?.["mean"] 
                        ? "$" + dashboardData.summary["MonthlyCharges"]["mean"].toFixed(2)
                        : "N/A"}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Churn Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Churn Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareChurnDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {prepareChurnDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Churn Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Churn Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={churnTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) => `${value}%`}
                        domain={[4, 7]}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, "Churn Rate"]} />
                      <Line
                        type="monotone"
                        dataKey="churnRate"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Churn Reasons */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Churn Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={churnReasonsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="reason" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Bar
                        dataKey="percentage"
                        fill="#8884d8"
                        barSize={30}
                        radius={[4, 4, 0, 0]}
                      >
                        {churnReasonsData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? "#ef4444"
                                : index === 1
                                ? "#f97316"
                                : index === 2
                                ? "#eab308"
                                : index === 3
                                ? "#10b981"
                                : index === 4
                                ? "#3b82f6"
                                : "#8b5cf6"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
