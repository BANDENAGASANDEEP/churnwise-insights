
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Redirect to our HTML implementation
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading TeleGuard Dashboard...</h1>
        <p className="text-muted-foreground">Please wait while we redirect you to the application.</p>
      </div>
    </div>
  );
};

export default Index;
