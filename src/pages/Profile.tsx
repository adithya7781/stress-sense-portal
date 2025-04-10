
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { User as UserIcon, Mail, Building, BriefcaseBusiness, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import { User, StressLevel } from "@/types";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  
  // Mock logout function
  const handleLogout = () => {
    localStorage.removeItem("stressSenseUser");
    navigate("/login");
  };
  
  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem("stressSenseUser");
    if (!userJson) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userJson) as User;
    setUser(parsedUser);
    
    // Initialize form fields
    setName(parsedUser.name || "");
    setEmail(parsedUser.email || "");
    setDepartment(parsedUser.department || "IT Department");
    setPosition(parsedUser.position || "Software Engineer");
  }, [navigate]);
  
  const handleSaveProfile = () => {
    if (!user) return;
    
    // Update user object
    const updatedUser: User = {
      ...user,
      name,
      email,
      department,
      position
    };
    
    // Save to localStorage
    localStorage.setItem("stressSenseUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
  };
  
  if (!user) return null;
  
  // Mock stress data
  const stressAverage = Math.floor(Math.random() * 100);
  let stressLevel: StressLevel;
  if (stressAverage < 25) stressLevel = 'low';
  else if (stressAverage < 50) stressLevel = 'medium';
  else if (stressAverage < 75) stressLevel = 'high';
  else stressLevel = 'severe';
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userName={user.name}
        userType={user.type}
        onLogout={handleLogout}
      />
      
      <div className="pt-20 pb-16">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">User Profile</h1>
            <p className="text-muted-foreground">
              View and manage your profile information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="mb-6">
                <CardHeader className="pb-0">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <h2 className="text-xl font-bold mt-4">{user.name}</h2>
                  <p className="text-muted-foreground mb-4">{user.email}</p>
                  
                  <Badge variant="outline" className="mb-4 capitalize">
                    {user.type === "it_professional" ? "IT Professional" : "HR Administrator"}
                  </Badge>
                  
                  <Button variant="outline" className="w-full mb-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stress Overview</CardTitle>
                  <CardDescription>Your average stress level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Average Stress Level</span>
                        <span className={
                          stressLevel === 'low' ? 'text-stress-low' :
                          stressLevel === 'medium' ? 'text-stress-medium' :
                          stressLevel === 'high' ? 'text-stress-high' : 'text-stress-severe'
                        }>
                          {stressAverage}/100
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            stressLevel === 'low' ? 'bg-stress-low' :
                            stressLevel === 'medium' ? 'bg-stress-medium' :
                            stressLevel === 'high' ? 'bg-stress-high' : 'bg-stress-severe'
                          }`}
                          style={{ width: `${stressAverage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Last 7 days</span>
                        <span>{Math.round(stressAverage * 0.9)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Last 30 days</span>
                        <span>{Math.round(stressAverage * 1.1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overall average</span>
                        <span>{stressAverage}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => navigate("/dashboard")}
                      variant="outline" 
                      className="w-full"
                    >
                      View Stress History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        {isEditing ? "Edit your personal details" : "Your personal details"}
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              placeholder="Full Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="Email Address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="department"
                              placeholder="Department"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <div className="relative">
                            <BriefcaseBusiness className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="position"
                              placeholder="Position"
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 justify-end">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>{user.name}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Department</label>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>{department || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Position</label>
                        <div className="flex items-center">
                          <BriefcaseBusiness className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>{position || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">Account Type</p>
                          <p className="text-sm text-muted-foreground">
                            {user.type === "it_professional" ? "IT Professional" : "HR Administrator"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">Stress Monitoring</p>
                          <p className="text-sm text-muted-foreground">
                            Assessment access enabled
                          </p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive alerts for high stress levels
                          </p>
                        </div>
                        <Badge>Enabled</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
