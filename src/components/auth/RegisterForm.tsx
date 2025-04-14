
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { authApi } from "@/services/api";
import ErrorAlert from "./ErrorAlert";
import PasswordInput from "./PasswordInput";
import RegisterFormFooter from "./RegisterFormFooter";
import { UserType } from "@/types";

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

export type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast: hookToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <CardContent className="space-y-4">
        <ErrorAlert message={errorMessage} />
        
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
        
        <PasswordInput form={form} name="password" label="Password" />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  {...field}
                />
              </FormControl>
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
      
      <RegisterFormFooter isLoading={isLoading} />
    </>
  );
};

export default RegisterForm;
