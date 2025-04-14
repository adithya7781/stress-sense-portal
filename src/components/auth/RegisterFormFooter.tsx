
import React from "react";
import { Link } from "react-router-dom";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RegisterFormFooterProps {
  isLoading: boolean;
}

const RegisterFormFooter = ({ isLoading }: RegisterFormFooterProps) => {
  return (
    <CardFooter className="flex-col gap-2">
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
      
      <div className="flex items-center justify-center mt-4 text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Link to="/login" className="ml-1 text-primary hover:underline">
          Login
        </Link>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        By creating an account, you agree to our Privacy Policy and Terms of Service
      </p>
    </CardFooter>
  );
};

export default RegisterFormFooter;
