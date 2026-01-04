import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Send } from "lucide-react";

const EditApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [formData, setFormData] = useState({
    coverLetter: "",
    cvUrl: "",
  });

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        // We need a specific route or we use getMyApplications and filter
        const response = await apiClient.getMyApplications();
        const apps = response.applications || response;
        const currentApp = apps.find((a: any) => a._id === id);

        if (!currentApp) {
          throw new Error("Application not found");
        }

        if (currentApp.status !== 'pending') {
          toast({ 
            title: "Access Denied", 
            description: "You can only edit pending applications.", 
            variant: "destructive" 
          });
          navigate("/dashboard");
          return;
        }

        setJobTitle(currentApp.jobId?.title || "the position");
        setFormData({
          coverLetter: currentApp.coverLetter,
          cvUrl: currentApp.cvUrl,
        });
      } catch (error) {
        toast({ title: "Error", description: "Could not load application", variant: "destructive" });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await apiClient.updateApplication(id!, formData);
      toast({ title: "Updated", description: "Your application has been updated successfully." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <Card className="max-w-2xl mx-auto shadow-lg border-none">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">Update Application</CardTitle>
            <p className="text-blue-100 text-sm">Editing application for: <span className="font-bold">{jobTitle}</span></p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cvUrl">CV / Portfolio Link</Label>
                <Input 
                  id="cvUrl" 
                  type="url"
                  placeholder="https://your-portfolio.com/cv.pdf"
                  value={formData.cvUrl} 
                  onChange={(e) => setFormData({...formData, cvUrl: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter / Pitch</Label>
                <Textarea 
                  id="coverLetter" 
                  placeholder="Why are you the best fit for this role?"
                  rows={8}
                  value={formData.coverLetter} 
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                  required 
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => navigate("/dashboard")}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold" 
                  disabled={updating}
                >
                  {updating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditApplication;