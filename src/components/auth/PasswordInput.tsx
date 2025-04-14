
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface PasswordInputProps {
  form: UseFormReturn<any>;
  forgotPasswordLink?: boolean;
}

const PasswordInput = ({ form, forgotPasswordLink = true }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Password</FormLabel>
            {forgotPasswordLink && (
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <FormControl>
              <Input 
                type={showPassword ? "text" : "password"} 
                autoComplete="current-password"
                className="pr-10"
                {...field}
              />
            </FormControl>
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? 
                <EyeOff size={16} className="text-muted-foreground" /> : 
                <Eye size={16} className="text-muted-foreground" />
              }
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordInput;
