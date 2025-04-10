
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrainCog, ArrowLeft, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";
import { UserType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  userType: z.enum(["it_professional", "admin"]),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast: hookToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "it_professional",
      rememberMe: false,
    },
  });

  // Mock login function - in a real app, this would call an API
  const handleLogin = (values: LoginFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Email format validation already handled by zod

      // Mock successful login
      // In a real app, this would validate credentials against a backend
      const mockUser = {
        id: "user-1",
        name: values.userType === "admin" ? "Admin User" : "IT Professional",
        email: values.email,
        type: values.userType,
        isNew: Math.random() > 0.5, // Randomly decide if user is new for demo purposes
        hasAccess: values.userType === "admin" ? true : Math.random() > 0.3, // Admins always have access, others might need approval
      };

      // Store user in localStorage or sessionStorage
      if (values.rememberMe) {
        localStorage.setItem("stressSenseUser", JSON.stringify(mockUser));
      } else {
        sessionStorage.setItem("stressSenseUser", JSON.stringify(mockUser));
      }
      
      toast.success(`Welcome back, ${mockUser.name}!`, {
        description: "You have successfully logged in."
      });
      
      // If new user, show additional notification for admins
      if (mockUser.type === "admin" && mockUser.isNew) {
        hookToast({
          title: "New User Notification",
          description: "There are new users awaiting access approval.",
        });
      }
      
      // If user doesn't have access yet, show warning
      if (!mockUser.hasAccess && mockUser.type === "it_professional") {
        hookToast({
          title: "Access Pending",
          description: "Your account is awaiting approval from an administrator.",
          variant: "destructive",
        });
      }
      
      // Make sure to clear loading state before navigation
      setIsLoading(false);
      
      // Force navigation to dashboard after successful login
      console.log("Navigating to dashboard");
      navigate("/dashboard", { replace: true });
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Link to="/" className="absolute top-4 left-4 flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <BrainCog className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-primary">StressSense</span>
          </div>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>User Type</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="it_professional" id="it_professional" />
                            <Label htmlFor="it_professional">IT Professional</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="admin" id="admin" />
                            <Label htmlFor="admin">Admin (HR)</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <a href="#" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </a>
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
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;

