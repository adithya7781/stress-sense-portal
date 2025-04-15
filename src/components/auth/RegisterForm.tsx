
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { authApi } from "@/services/api";
import ErrorAlert from "./ErrorAlert";
import PasswordInput from "./PasswordInput";
import RegisterFormFooter from "./RegisterFormFooter";
import { UserType } from "@/types";
import UserTypeSelector from "./UserTypeSelector";
import { RegisterFormValues } from "@/pages/Register";

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormValues>;
}

const RegisterForm = ({ form }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { toast: hookToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  form.handleSubmit(handleRegister);

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
        
        <UserTypeSelector form={form} />
        
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
