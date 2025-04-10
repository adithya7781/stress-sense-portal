
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { InfoIcon, AlertTriangle, Camera, Upload, Calendar, User as UserIcon, Users, Activity, Clock, BarChart2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import StressChart from "@/components/StressChart";
import { User, StressRecord } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [mockStressData, setMockStressData] = useState<StressRecord[]>([]);
  
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
    
    setUser(JSON.parse(userJson));
    
    // Generate mock stress data
    const today = new Date();
    const mockData: StressRecord[] = [];
    
    // Generate data points for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      
      // Generate 1-3 records per day with random stress levels
      const numRecords = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numRecords; j++) {
        const hour = 9 + Math.floor(Math.random() * 8); // Business hours
        day.setHours(hour, Math.floor(Math.random() * 60));
        
        const score = Math.floor(Math.random() * 100);
        let level: 'low' | 'medium' | 'high' | 'severe';
        
        if (score < 25) level = 'low';
        else if (score < 50) level = 'medium';
        else if (score < 75) level = 'high';
        else level = 'severe';
        
        mockData.push({
          id: `record-${i}-${j}`,
          userId: "user-1",
          level,
          score,
          timestamp: new Date(day),
          source: Math.random() > 0.5 ? 'image' : 'video',
          reviewed: Math.random() > 0.7,
        });
      }
    }
    
    setMockStressData(mockData);
  }, [navigate]);

  if (!user) return null;

  // Calculate current stress level (most recent record)
  const sortedRecords = [...mockStressData].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const currentStressRecord = sortedRecords[0];
  const currentStressLevel = currentStressRecord?.level || 'low';
  const currentStressScore = currentStressRecord?.score || 0;

  // Get stress distribution
  const lowStress = mockStressData.filter(r => r.level === 'low').length;
  const mediumStress = mockStressData.filter(r => r.level === 'medium').length;
  const highStress = mockStressData.filter(r => r.level === 'high').length;
  const severeStress = mockStressData.filter(r => r.level === 'severe').length;
  const totalRecords = mockStressData.length;

  // Admin metrics
  const totalEmployees = 42; // Mock data
  const employeesWithHighStress = 12; // Mock data
  const averageStressScore = mockStressData.reduce((acc, record) => acc + record.score, 0) / 
    (mockStressData.length || 1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userName={user.name}
        userType={user.type}
        onLogout={handleLogout}
      />
      
      <div className="pt-20 pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
              <p className="text-muted-foreground">
                {user.type === "admin" 
                  ? "Monitor employee stress levels and well-being" 
                  : "Track your stress levels and well-being"}
              </p>
            </div>
            
            {user.type === "it_professional" && (
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button className="flex items-center" onClick={() => navigate("/stress-monitor")}>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera Monitoring
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            )}
          </div>
          
          {/* Dashboard Content - Different for each user type */}
          {user.type === "it_professional" ? (
            <>
              {/* IT Professional Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Current Stress Level Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Current Stress Level</CardTitle>
                    <CardDescription>Based on your latest assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Score</span>
                        <span className={`font-bold text-lg ${
                          currentStressLevel === 'low' ? 'text-stress-low' :
                          currentStressLevel === 'medium' ? 'text-stress-medium' :
                          currentStressLevel === 'high' ? 'text-stress-high' :
                          'text-stress-severe'
                        }`}>
                          {currentStressScore}/100
                        </span>
                      </div>
                      <Progress 
                        value={currentStressScore} 
                        className={`h-3 ${
                          currentStressLevel === 'low' ? 'bg-green-100' :
                          currentStressLevel === 'medium' ? 'bg-yellow-100' :
                          currentStressLevel === 'high' ? 'bg-red-100' :
                          'bg-red-200'
                        }`}
                        indicatorClassName={`${
                          currentStressLevel === 'low' ? 'bg-stress-low' :
                          currentStressLevel === 'medium' ? 'bg-stress-medium' :
                          currentStressLevel === 'high' ? 'bg-stress-high' :
                          'bg-stress-severe'
                        }`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                        <span>Severe</span>
                      </div>
                      
                      {currentStressLevel === 'high' || currentStressLevel === 'severe' ? (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>High Stress Detected</AlertTitle>
                          <AlertDescription>
                            Consider taking a break or using stress management techniques.
                          </AlertDescription>
                        </Alert>
                      ) : currentStressLevel === 'medium' ? (
                        <Alert className="mt-2 bg-yellow-50 border-yellow-200 text-yellow-800">
                          <InfoIcon className="h-4 w-4" />
                          <AlertTitle>Moderate Stress Detected</AlertTitle>
                          <AlertDescription>
                            Be mindful of your stress levels during your workday.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="mt-2 bg-green-50 border-green-200 text-green-800">
                          <InfoIcon className="h-4 w-4" />
                          <AlertTitle>Low Stress Detected</AlertTitle>
                          <AlertDescription>
                            Your stress levels appear to be well managed.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Weekly Summary Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Weekly Summary</CardTitle>
                    <CardDescription>Your stress patterns over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
                        <span className="text-xs text-muted-foreground">Low</span>
                        <span className="text-lg font-bold text-stress-low">{lowStress}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
                        <span className="text-xs text-muted-foreground">Medium</span>
                        <span className="text-lg font-bold text-stress-medium">{mediumStress}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
                        <span className="text-xs text-muted-foreground">High</span>
                        <span className="text-lg font-bold text-stress-high">{highStress}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
                        <span className="text-xs text-muted-foreground">Severe</span>
                        <span className="text-lg font-bold text-stress-severe">{severeStress}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">Assessments:</span>
                        <span className="font-medium ml-1">{totalRecords}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">Last 7 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tips Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Stress Management Tips</CardTitle>
                    <CardDescription>Personalized recommendations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <div className="rounded-full bg-green-100 p-1 mr-3">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Take regular breaks</p>
                        <p className="text-muted-foreground">Follow the 20-20-20 rule for eye strain reduction</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="rounded-full bg-blue-100 p-1 mr-3">
                        <UserIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Practice deep breathing</p>
                        <p className="text-muted-foreground">5 minutes of deep breathing can reduce stress hormones</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="rounded-full bg-purple-100 p-1 mr-3">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Connect with colleagues</p>
                        <p className="text-muted-foreground">Social connections improve workplace wellbeing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Stress History Chart */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Stress History</CardTitle>
                  <CardDescription>Your stress levels over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="week">
                    <div className="flex justify-end mb-4">
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="day">
                      <StressChart 
                        data={mockStressData.filter(r => {
                          const today = new Date();
                          const recordDate = new Date(r.timestamp);
                          return recordDate.toDateString() === today.toDateString();
                        })} 
                        timeRange="day" 
                      />
                    </TabsContent>
                    <TabsContent value="week">
                      <StressChart data={mockStressData} timeRange="week" />
                    </TabsContent>
                    <TabsContent value="month">
                      <StressChart data={mockStressData} timeRange="month" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Admin (HR) Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Team Overview Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Team Overview</CardTitle>
                    <CardDescription>IT department stress metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>Total employees</span>
                        </div>
                        <span className="font-bold">{totalEmployees}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-stress-high" />
                          <span>High stress alerts</span>
                        </div>
                        <span className="font-bold text-stress-high">{employeesWithHighStress}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BarChart2 className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>Average stress score</span>
                        </div>
                        <span className="font-bold">{averageStressScore.toFixed(1)}/100</span>
                      </div>
                      
                      <Button className="w-full mt-2" variant="outline">
                        View Detailed Reports
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Stress Distribution Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Stress Distribution</CardTitle>
                    <CardDescription>Team stress level breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Low Stress</span>
                          <span className="font-medium">{Math.round((lowStress/totalRecords) * 100)}%</span>
                        </div>
                        <Progress value={(lowStress/totalRecords) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-stress-low" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Medium Stress</span>
                          <span className="font-medium">{Math.round((mediumStress/totalRecords) * 100)}%</span>
                        </div>
                        <Progress value={(mediumStress/totalRecords) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-stress-medium" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>High Stress</span>
                          <span className="font-medium">{Math.round((highStress/totalRecords) * 100)}%</span>
                        </div>
                        <Progress value={(highStress/totalRecords) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-stress-high" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Severe Stress</span>
                          <span className="font-medium">{Math.round((severeStress/totalRecords) * 100)}%</span>
                        </div>
                        <Progress value={(severeStress/totalRecords) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-stress-severe" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Actions Required Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Actions Required</CardTitle>
                    <CardDescription>Employees needing attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {severeStress > 0 && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>{severeStress} employee{severeStress > 1 ? 's' : ''} with severe stress</AlertTitle>
                          <AlertDescription>
                            Immediate intervention recommended
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {highStress > 0 && (
                        <Alert className="border-stress-high bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-stress-high" />
                          <AlertTitle className="text-stress-high">{highStress} employee{highStress > 1 ? 's' : ''} with high stress</AlertTitle>
                          <AlertDescription className="text-stress-high/80">
                            Schedule follow-up meetings
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {highStress === 0 && severeStress === 0 && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                          <p className="font-medium">No urgent actions required</p>
                          <p className="text-sm">Team stress levels are within acceptable ranges</p>
                        </div>
                      )}
                      
                      <Button className="w-full">
                        Manage Camera Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Team Stress Chart */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Team Stress Trends</CardTitle>
                  <CardDescription>Average team stress levels over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="week">
                    <div className="flex justify-end mb-4">
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="day">
                      <StressChart 
                        data={mockStressData.filter(r => {
                          const today = new Date();
                          const recordDate = new Date(r.timestamp);
                          return recordDate.toDateString() === today.toDateString();
                        })} 
                        timeRange="day" 
                      />
                    </TabsContent>
                    <TabsContent value="week">
                      <StressChart data={mockStressData} timeRange="week" />
                    </TabsContent>
                    <TabsContent value="month">
                      <StressChart data={mockStressData} timeRange="month" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
