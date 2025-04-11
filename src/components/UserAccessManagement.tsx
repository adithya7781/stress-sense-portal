
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { userApi } from "@/services/api";
import { User } from "@/types";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface UserAccessManagementProps {
  user: User;
  onAccessUpdated?: () => void;
}

interface AccessSettings {
  camera_access: boolean;
  image_upload_access: boolean;
  video_upload_access: boolean;
  realtime_monitoring: boolean;
}

const UserAccessManagement = ({ user, onAccessUpdated }: UserAccessManagementProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [accessSettings, setAccessSettings] = useState<AccessSettings>({
    camera_access: false,
    image_upload_access: true, // Default allows image upload
    video_upload_access: false,
    realtime_monitoring: false,
  });
  const [originalSettings, setOriginalSettings] = useState<AccessSettings | null>(null);

  useEffect(() => {
    // Here we would typically fetch the current access settings
    // For now, we'll assume settings based on the user's hasAccess property
    const hasAccess = user.hasAccess ?? false;
    setAccessSettings({
      camera_access: hasAccess,
      image_upload_access: true, // Default true for all users
      video_upload_access: hasAccess,
      realtime_monitoring: hasAccess,
    });
    setOriginalSettings({
      camera_access: hasAccess,
      image_upload_access: true,
      video_upload_access: hasAccess,
      realtime_monitoring: hasAccess,
    });
  }, [user]);

  const handleToggleAccess = (key: keyof AccessSettings) => {
    setAccessSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const hasChanges = () => {
    if (!originalSettings) return false;
    
    return Object.keys(accessSettings).some(
      key => accessSettings[key as keyof AccessSettings] !== originalSettings[key as keyof AccessSettings]
    );
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    
    try {
      await userApi.updateAccess(user.id, accessSettings);
      
      toast({
        title: "Access Updated",
        description: `Access settings for ${user.name} have been updated successfully.`,
      });
      
      setOriginalSettings({...accessSettings});
      
      if (onAccessUpdated) {
        onAccessUpdated();
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update access settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!originalSettings) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground animate-pulse" />
            <p className="ml-2">Loading access settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Access Settings</CardTitle>
        <CardDescription>
          Manage what {user.name} can access in the system
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Camera Access</h4>
              <p className="text-sm text-muted-foreground">
                Allow user to access camera for real-time monitoring
              </p>
            </div>
            <Switch 
              checked={accessSettings.camera_access} 
              onCheckedChange={() => handleToggleAccess('camera_access')} 
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Image Upload</h4>
              <p className="text-sm text-muted-foreground">
                Allow user to upload images for analysis
              </p>
            </div>
            <Switch 
              checked={accessSettings.image_upload_access} 
              onCheckedChange={() => handleToggleAccess('image_upload_access')} 
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Video Upload</h4>
              <p className="text-sm text-muted-foreground">
                Allow user to upload videos for analysis
              </p>
            </div>
            <Switch 
              checked={accessSettings.video_upload_access} 
              onCheckedChange={() => handleToggleAccess('video_upload_access')} 
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Real-time Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                Allow user to use continuous real-time stress monitoring
              </p>
            </div>
            <Switch 
              checked={accessSettings.realtime_monitoring} 
              onCheckedChange={() => handleToggleAccess('realtime_monitoring')} 
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSaveChanges} 
          disabled={!hasChanges() || isLoading}
          className="w-full"
        >
          {isLoading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserAccessManagement;
