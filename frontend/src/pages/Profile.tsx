import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Briefcase, MapPin, Loader2, Save } from "lucide-react";
import { apiClient } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    role: "",
    companyName: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getProfile();
        
        // Match the { user: { ... } } structure from backend
        if (response && response.user) {
          setUserData({
            fullName: response.user.fullName || "",
            email: response.user.email || "",
            role: response.user.role || "job_seeker",
            companyName: response.user.companyName || "",
            location: response.user.location || "",
            bio: response.user.bio || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({ title: "Error", description: "Could not load profile", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await apiClient.updateProfile(userData);
      
      if (response && response.user) {
        setUserData({
          fullName: response.user.fullName || "",
          email: response.user.email || "",
          role: response.user.role || "job_seeker",
          companyName: response.user.companyName || "",
          location: response.user.location || "",
          bio: response.user.bio || "",
        });
      }
      
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error) {
      console.error("Update error:", error);
      toast({ title: "Error", description: "Update failed", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="shadow-lg border-none">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Update your personal and professional details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <User className="h-4 w-4 text-primary" /> Full Name
                  </label>
                  <Input 
                    value={userData.fullName} 
                    onChange={(e) => setUserData({...userData, fullName: e.target.value})} 
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <Mail className="h-4 w-4 text-primary" /> Email Address
                  </label>
                  <Input 
                    value={userData.email} 
                    disabled 
                    className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <Briefcase className="h-4 w-4 text-primary" /> Account Type
                  </label>
                  <Input 
                    value={userData.role.replace('_', ' ').toUpperCase()} 
                    disabled 
                    className="bg-slate-100 border-slate-200 text-slate-500 capitalize" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-primary" /> Location
                  </label>
                  <Input 
                    value={userData.location} 
                    placeholder="City, Country"
                    onChange={(e) => setUserData({...userData, location: e.target.value})} 
                  />
                </div>
              </div>

              {userData.role === 'employer' && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="text-sm font-semibold text-slate-700">Company Name</label>
                  <Input 
                    value={userData.companyName} 
                    onChange={(e) => setUserData({...userData, companyName: e.target.value})} 
                  />
                </div>
              )}

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-black text-white h-12 text-lg font-bold transition-all shadow-md"
                  disabled={updating}
                >
                  {updating ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
