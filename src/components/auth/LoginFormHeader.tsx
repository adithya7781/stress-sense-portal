
import React from "react";
import { BrainCog } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

const LoginFormHeader = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <BrainCog className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-bold text-primary">StressSense</span>
        </div>
      </div>
      
      <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
      <CardDescription className="text-center">
        Enter your credentials to access your account
      </CardDescription>
    </>
  );
};

export default LoginFormHeader;
