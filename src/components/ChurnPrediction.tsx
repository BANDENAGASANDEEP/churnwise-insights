
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predictChurn } from "@/components/DashboardService";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function ChurnPrediction() {
  const [tenure, setTenure] = useState("");
  const [monthlyCharges, setMonthlyCharges] = useState("");
  const [contract, setContract] = useState("");
  const [internetService, setInternetService] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [churnRisk, setChurnRisk] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!tenure || !monthlyCharges || !contract || !internetService) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields to predict churn risk",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Convert form data to features array
      // This needs to match the expected format in your ML model
      const features = [
        parseInt(tenure),
        parseFloat(monthlyCharges),
        contract === "month-to-month" ? 1 : 0,
        contract === "one-year" ? 1 : 0,
        contract === "two-year" ? 1 : 0,
        internetService === "fiber-optic" ? 1 : 0,
        internetService === "dsl" ? 1 : 0,
      ];

      const result = await predictChurn(features);
      setPrediction(result.churn_prediction);
      
      // Generate risk percentage (in a real app, your model might return this directly)
      const randomOffset = Math.random() * 20;
      const riskPercentage = result.churn_prediction === 1 ? 
        70 + randomOffset : // High risk
        10 + randomOffset;  // Low risk
      
      setChurnRisk(Math.floor(riskPercentage));
      
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        variant: "destructive",
        title: "Prediction failed",
        description: "Unable to predict churn risk. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get class and icon based on risk level
  const getRiskStatus = () => {
    if (churnRisk === null) return { class: "", icon: null };
    
    if (churnRisk < 30) {
      return { 
        class: "text-green-600 bg-green-50", 
        icon: <CheckCircle2 className="h-5 w-5 mr-2" /> 
      };
    } else if (churnRisk < 70) {
      return { 
        class: "text-yellow-600 bg-yellow-50", 
        icon: <AlertTriangle className="h-5 w-5 mr-2" /> 
      };
    } else {
      return { 
        class: "text-red-600 bg-red-50", 
        icon: <AlertTriangle className="h-5 w-5 mr-2" /> 
      };
    }
  };

  const riskStatus = getRiskStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Risk Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure (months)</Label>
              <Input
                id="tenure"
                type="number"
                placeholder="0"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyCharges">Monthly Charges ($)</Label>
              <Input
                id="monthlyCharges"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={monthlyCharges}
                onChange={(e) => setMonthlyCharges(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contract">Contract Type</Label>
              <Select value={contract} onValueChange={setContract}>
                <SelectTrigger id="contract">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month-to-month">Month-to-month</SelectItem>
                  <SelectItem value="one-year">One year</SelectItem>
                  <SelectItem value="two-year">Two year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="internetService">Internet Service</Label>
              <Select value={internetService} onValueChange={setInternetService}>
                <SelectTrigger id="internetService">
                  <SelectValue placeholder="Select internet service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dsl">DSL</SelectItem>
                  <SelectItem value="fiber-optic">Fiber optic</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Calculating..." : "Predict Churn Risk"}
          </Button>
        </form>
        
        {prediction !== null && churnRisk !== null && (
          <div className="mt-6">
            <div className="rounded-lg p-4 flex items-center justify-between border mb-4">
              <div className="font-semibold">Churn Risk</div>
              <div className={`px-3 py-1 rounded-full font-medium flex items-center ${riskStatus.class}`}>
                {riskStatus.icon}
                {churnRisk}%
              </div>
            </div>
            
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  churnRisk < 30 ? 'bg-green-500' : 
                  churnRisk < 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${churnRisk}%` }}
              ></div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              {churnRisk < 30 ? (
                <p>This customer has a low risk of churning. Regular service maintenance recommended.</p>
              ) : churnRisk < 70 ? (
                <p>This customer has a moderate risk of churning. Consider proactive retention offers.</p>
              ) : (
                <p>This customer has a high risk of churning. Immediate retention strategy recommended.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
