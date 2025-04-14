
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrainCog, ArrowLeft, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { UserType } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/services/api";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  userType: z.enum(["it_professional", "admin"]),
  department: z.string().optional(),
  position: z.string().optional(),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { toast: hookToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "it_professional",
      department: "",
      position: "",
    },
  });

  const handleRegister = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        type: values.userType,
        department: values.department || undefined,
        position: values.position || undefined
      });
      
      toast.success("Account created successfully", {
        description: "You can now login with your credentials."
      });

      if (values.userType === "admin") {
        hookToast({
          title: "Admin Account Created",
          description: "You have administrator privileges for managing users and access.",
        });
      } else {
        hookToast({
          title: "Account Pending Approval",
          description: "Your account will be reviewed by an admin before full access is granted.",
        });
      }
      
      navigate("/login");
    } catch (error: any) {
      setIsLoading(false);
      const message = error.response?.data?.message || "Failed to create account. Please try again.";
      setErrorMessage(message);
      
      hookToast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)}>
              <CardContent className="space-y-4">
                {errorMessage && (
                  <div className="bg-destructive/15 p-3 rounded-md border border-destructive flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <span className="text-sm text-destructive">{errorMessage}</span>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                      <FormLabel>Password</FormLabel>
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
                      <div className="text-xs text-muted-foreground mt-1">
                        Password must be at least 8 characters and include letters, numbers, and special characters.
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            {...field}
                            className="pr-10"
                          />
                        </FormControl>
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={toggleConfirmPasswordVisibility}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? 
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
                
                {form.watch("userType") === "it_professional" && (
                  <>
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="IT, Engineering, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Developer, Engineer, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <div className="bg-muted/50 p-3 rounded-md border border-muted flex items-start space-x-2">
                  <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-xs text-muted-foreground">
                    Your credentials are securely encrypted. We will never share your information with third parties.
                  </span>
                </div>
              </CardContent>
              
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
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
