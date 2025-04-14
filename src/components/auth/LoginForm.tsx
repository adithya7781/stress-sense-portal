
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { authApi } from "@/services/api";
import ErrorAlert from "./ErrorAlert";
import UserTypeSelector from "./UserTypeSelector";
import PasswordInput from "./PasswordInput";
import LoginFormFooter from "./LoginFormFooter";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  userType: z.enum(["it_professional", "admin"]),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "it_professional",
      rememberMe: false,
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Attempting login with:", values);
      
      // Call the login API
      const response = await authApi.login(values.email, values.password, values.userType);
      console.log("Login response received:", response);
      
      const { token, user } = response.data;
      
      // Store token based on remember me setting
      if (values.rememberMe) {
        localStorage.setItem('stressSenseToken', token);
      } else {
        sessionStorage.setItem('stressSenseToken', token);
      }
      
      // Store user data
      const storage = values.rememberMe ? localStorage : sessionStorage;
      storage.setItem('stressSenseUser', JSON.stringify(user));
      
      toast.success(`Welcome back, ${user.name}!`, {
        description: "You have successfully logged in."
      });
      
      // Navigate based on user type
      if (user.type === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      const message = error.response?.data?.message || "Failed to login. Please try again.";
      setErrorMessage(message);
      
      toast.error("Login Failed", {
        description: message
      });
    }
  };

  return (
    <>
      <CardContent className="space-y-4">
        <ErrorAlert message={errorMessage} />
        
        <UserTypeSelector form={form} />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <PasswordInput form={form} />
        
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Remember me
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <div className="bg-muted/50 p-3 rounded-md border border-muted flex items-start space-x-2">
          <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span className="text-xs text-muted-foreground">
            Your password is securely encrypted. We prioritize the security of your account.
          </span>
        </div>
      </CardContent>
      
      <LoginFormFooter isLoading={isLoading} />
    </>
  );
};

export default LoginForm;
