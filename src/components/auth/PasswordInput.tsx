
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface PasswordInputProps {
  form: UseFormReturn<any>;
  name?: string;
  label?: string;
}

const PasswordInput = ({ form, name = "password", label = "Password" }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input 
                type={showPassword ? "text" : "password"} 
                {...field}
                className="pr-10"
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
          {name === "password" && (
            <div className="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters and include letters, numbers, and special characters.
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordInput;
