import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, Loader2, ArrowLeft } from "lucide-react";
import { apiClient } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    coverLetter: "",
    cvUrl: "" // For now, we use a link. We can add file upload later.
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiClient.getJob(id!);
        setJob(response.job);
      } catch (error) {
        toast({ title: "Error", description: "Job not found", variant: "destructive" });
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.applyForJob(id!, formData);
      toast({ title: "Success!", description: "Application submitted successfully." });
      navigate("/dashboard"); // Redirect to seeker dashboard to see status
    } catch (error: any) {
      toast({ title: "Failed", description: error.message || "Could not submit", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Details
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="border-b bg-white">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Apply for {job?.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{job?.employerId?.companyName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4" /> CV / Resume Link
                </label>
                <Input 
                  placeholder="Link to your Google Drive or Dropbox CV" 
                  required
                  value={formData.cvUrl}
                  onChange={(e) => setFormData({...formData, cvUrl: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Cover Letter</label>
                <Textarea 
                  placeholder="Explain why you are a great fit for this role..." 
                  className="min-h-[200px]"
                  required
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin mr-2" /> : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplyJob;