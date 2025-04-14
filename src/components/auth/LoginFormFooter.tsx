
import React from "react";
import { Link } from "react-router-dom";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LoginFormFooterProps {
  isLoading: boolean;
}

const LoginFormFooter = ({ isLoading }: LoginFormFooterProps) => {
  return (
    <CardFooter className="flex-col gap-2">
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      
      <div className="flex items-center justify-center mt-4 text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>
        <Link to="/register" className="ml-1 text-primary hover:underline">
          Create account
        </Link>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        By logging in, you agree to our Privacy Policy and Terms of Service
      </p>
    </CardFooter>
  );
};

export default LoginFormFooter;
