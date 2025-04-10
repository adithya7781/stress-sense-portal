
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrainCog, ArrowLeft } from "lucide-react";
import { UserType } from "@/types";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<UserType>("it_professional");
  const [isLoading, setIsLoading] = useState(false);

  // Mock login function - in a real app, this would call an API
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock validation
      if (!email || !password) {
        toast({
          title: "Login Failed",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Mock successful login
      // In a real app, this would validate credentials against a backend
      const mockUser = {
        id: "user-1",
        name: userType === "admin" ? "Admin User" : "IT Professional",
        email: email,
        type: userType,
      };

      // Store user in localStorage (just for demo purposes)
      localStorage.setItem("stressSenseUser", JSON.stringify(mockUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
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
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-type">User Type</Label>
                <RadioGroup 
                  defaultValue="it_professional" 
                  value={userType} 
                  onValueChange={(value) => setUserType(value as UserType)}
                  className="flex space-x-2"
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
