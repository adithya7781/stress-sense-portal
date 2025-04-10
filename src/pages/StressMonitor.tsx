
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Upload, Pause, Play, RefreshCw, Save, AlertTriangle, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { User, StressLevel } from "@/types";

const StressMonitor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentTab, setCurrentTab] = useState("camera");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Stress analysis results
  const [stressScore, setStressScore] = useState(0);
  const [stressLevel, setStressLevel] = useState<StressLevel>("low");
  const [showResults, setShowResults] = useState(false);
  
  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
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
    
    const parsedUser = JSON.parse(userJson);
    if (parsedUser.type !== 'it_professional') {
      navigate("/dashboard");
      return;
    }
    
    setUser(parsedUser);
    
    // Cleanup camera on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [navigate]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      setCameraActive(false);
    }
  };
  
  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current && streamRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg');
        setPreviewUrl(imageUrl);
        analyzeStress();
      }
    }
  };
  
  // Mock stress analysis function
  const analyzeStress = () => {
    setAnalyzing(true);
    setShowResults(false);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate random stress score for demo
      const score = Math.floor(Math.random() * 100);
      setStressScore(score);
      
      // Determine stress level based on score
      let level: StressLevel;
      if (score < 25) level = 'low';
      else if (score < 50) level = 'medium';
      else if (score < 75) level = 'high';
      else level = 'severe';
      
      setStressLevel(level);
      setAnalyzing(false);
      setShowResults(true);
      
      // Alert for high stress
      if (level === 'high' || level === 'severe') {
        toast({
          title: "High Stress Detected",
          description: "Your stress levels appear to be elevated.",
          variant: "destructive",
        });
      }
    }, 2000); // Simulate 2 second processing time
  };
  
  // Save results
  const saveResults = () => {
    toast({
      title: "Results Saved",
      description: "Your stress assessment has been saved to your profile.",
    });
    navigate("/dashboard");
  };

  if (!user) return null;

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
            <h1 className="text-2xl font-bold">Stress Monitor</h1>
            <p className="text-muted-foreground">
              Analyze your current stress levels through image or video capture
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Capture Stress Data</CardTitle>
                  <CardDescription>
                    Use your camera or upload an image for stress analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={currentTab}
                    onValueChange={value => {
                      setCurrentTab(value);
                      // Stop camera if switching to upload tab
                      if (value === "upload" && cameraActive) {
                        stopCamera();
                      }
                      setShowResults(false);
                    }}
                  >
                    <TabsList className="mb-4 grid grid-cols-2">
                      <TabsTrigger value="camera">
                        <Camera className="mr-2 h-4 w-4" />
                        Camera
                      </TabsTrigger>
                      <TabsTrigger value="upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="camera">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ display: cameraActive ? 'block' : 'none' }}
                          />
                          
                          {!cameraActive && !previewUrl && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Camera inactive</p>
                            </div>
                          )}
                          
                          {previewUrl && !cameraActive && (
                            <img 
                              src={previewUrl} 
                              alt="Captured"
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          )}
                        </div>
                        
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        
                        <div className="flex space-x-3">
                          {!cameraActive ? (
                            <Button onClick={startCamera} className="flex items-center">
                              <Play className="mr-2 h-4 w-4" />
                              Start Camera
                            </Button>
                          ) : (
                            <>
                              <Button onClick={captureImage} className="flex items-center">
                                <Camera className="mr-2 h-4 w-4" />
                                Capture Image
                              </Button>
                              <Button variant="outline" onClick={stopCamera} className="flex items-center">
                                <Pause className="mr-2 h-4 w-4" />
                                Stop Camera
                              </Button>
                            </>
                          )}
                          
                          {previewUrl && !cameraActive && (
                            <Button onClick={startCamera} variant="outline" className="flex items-center">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Retake
                            </Button>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="upload">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                          {!previewUrl ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">No file selected</p>
                            </div>
                          ) : (
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="absolute inset-0 w-full h-full object-contain" 
                            />
                          )}
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="flex items-center"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Select Image
                          </Button>
                          
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          
                          {selectedFile && (
                            <Button onClick={analyzeStress} className="flex items-center">
                              <Play className="mr-2 h-4 w-4" />
                              Analyze Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Stress Analysis</CardTitle>
                  <CardDescription>
                    {analyzing 
                      ? "Analyzing stress indicators..." 
                      : showResults 
                        ? "Results of your stress assessment" 
                        : "Capture or upload an image to begin"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyzing ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                      <p className="text-center text-muted-foreground">
                        Analyzing facial expressions, eye movements, and other biomarkers...
                      </p>
                    </div>
                  ) : showResults ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Stress Score</h3>
                          <Badge variant={
                            stressLevel === 'low' ? 'outline' :
                            stressLevel === 'medium' ? 'default' :
                            stressLevel === 'high' ? 'secondary' : 'destructive'
                          } className={
                            stressLevel === 'low' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                            stressLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                            stressLevel === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                            'bg-red-600 text-white hover:bg-red-600'
                          }>
                            {stressLevel === 'low' ? 'Low Stress' :
                             stressLevel === 'medium' ? 'Medium Stress' :
                             stressLevel === 'high' ? 'High Stress' : 'Severe Stress'}
                          </Badge>
                        </div>
                        
                        <div className="mb-2">
                          <Slider
                            value={[stressScore]}
                            max={100}
                            step={1}
                            disabled
                            className={`${
                              stressLevel === 'low' ? 'accent-stress-low' :
                              stressLevel === 'medium' ? 'accent-stress-medium' :
                              stressLevel === 'high' ? 'accent-stress-high' : 'accent-stress-severe'
                            }`}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low (0-25)</span>
                          <span>Medium (26-50)</span>
                          <span>High (51-75)</span>
                          <span>Severe (76-100)</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium mb-2">Analysis Details</h3>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-muted-foreground">Facial Tension</p>
                            <p className="font-medium">{Math.round(stressScore * 0.8)}%</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-muted-foreground">Eye Movement</p>
                            <p className="font-medium">{Math.round(stressScore * 1.1)}%</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-muted-foreground">Micro Expressions</p>
                            <p className="font-medium">{Math.round(stressScore * 0.9)}%</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-muted-foreground">Overall Posture</p>
                            <p className="font-medium">{Math.round(stressScore * 1.05)}%</p>
                          </div>
                        </div>
                        
                        {(stressLevel === 'high' || stressLevel === 'severe') && (
                          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md border border-red-200 dark:border-red-900/20">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="text-sm">High stress detected. Consider taking a break.</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Analysis completed at {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No analysis data available
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Use the camera or upload an image to analyze your stress levels
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-muted pt-4">
                  <Button 
                    onClick={saveResults}
                    disabled={!showResults}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Results
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressMonitor;
