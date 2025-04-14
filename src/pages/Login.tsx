
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import LoginFormHeader from "@/components/auth/LoginFormHeader";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Link to="/" className="absolute top-4 left-4 flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <LoginFormHeader />
          </CardHeader>
          
          <LoginForm />
        </Card>
      </div>
    </div>
  );
};

export default Login;
