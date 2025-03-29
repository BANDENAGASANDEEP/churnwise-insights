
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage } from "@/components/DashboardService";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function Chatbot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(message);
      
      if (response.response && response.response.length > 0) {
        response.response.forEach((text: string) => {
          setChatHistory((prev) => [...prev, { sender: "bot", text }]);
        });
      } else {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: "I couldn't find relevant information for your query." },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from chatbot. Please try again.",
      });
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I'm having trouble connecting to the server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Customer Support Assistant
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <CardContent className="space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center text-slate-400 my-8">
              Ask me anything about customer churn or support issues
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    chat.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-900 max-w-[80%] rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0ms]"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:150ms]"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:300ms]"></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
