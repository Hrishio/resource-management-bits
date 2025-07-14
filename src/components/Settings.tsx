import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { User, Bell, Shield, Database } from "lucide-react";

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: user?.email || ""
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    projectUpdates: true
  });

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          full_name: profileData.fullName,
          email: profileData.email 
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground text-sm lg:text-base">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1">
          <TabsTrigger value="profile" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
            <User className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
            <Bell className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
            <Shield className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
            <Database className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base lg:text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm lg:text-base">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="text-sm lg:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm lg:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="text-sm lg:text-base"
                />
              </div>
              <Button onClick={updateProfile} disabled={loading} className="text-sm lg:text-base">
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base lg:text-lg">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm lg:text-base">Email Notifications</Label>
                  <p className="text-xs lg:text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm lg:text-base">Push Notifications</Label>
                  <p className="text-xs lg:text-sm text-muted-foreground">Receive browser notifications</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, pushNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm lg:text-base">Project Updates</Label>
                  <p className="text-xs lg:text-sm text-muted-foreground">Get notified about project changes</p>
                </div>
                <Switch
                  checked={notifications.projectUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, projectUpdates: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base lg:text-lg">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm lg:text-base">Change Password</Label>
                <Button variant="outline" className="text-sm lg:text-base">Update Password</Button>
              </div>
              <div className="space-y-2">
                <Label className="text-sm lg:text-base">Two-Factor Authentication</Label>
                <Button variant="outline" className="text-sm lg:text-base">Enable 2FA</Button>
              </div>
              <div className="space-y-2">
                <Label className="text-sm lg:text-base">Active Sessions</Label>
                <Button variant="outline" className="text-sm lg:text-base">Manage Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base lg:text-lg">System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm lg:text-base">App Version</Label>
                  <p className="text-xs lg:text-sm text-muted-foreground">v1.0.0</p>
                </div>
                <div>
                  <Label className="text-sm lg:text-base">Database Status</Label>
                  <p className="text-xs lg:text-sm text-green-600">Connected</p>
                </div>
                <div>
                  <Label className="text-sm lg:text-base">Last Backup</Label>
                  <p className="text-xs lg:text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <div>
                  <Label className="text-sm lg:text-base">Storage Used</Label>
                  <p className="text-xs lg:text-sm text-muted-foreground">45% of 1GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};