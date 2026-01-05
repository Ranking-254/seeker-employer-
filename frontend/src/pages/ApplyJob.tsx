import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, Loader2, ArrowLeft, Link as LinkIcon, AlertCircle } from "lucide-react";
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
    cvUrl: "" 
  });

  // State ya ku-track validation error ya URL hapa hapa kwa frontend
  const [urlError, setUrlError] = useState("");

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

  // Function ya ku-verify kama URL ni sahihi kabla ya kusubmit
  const validateUrl = (url: string) => {
    if (!url) return "URL is required";
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    
    if (!pattern.test(url)) {
      return "Tafadhali weka link kamili kuanzia na http:// au https://";
    }
    if (!url.startsWith('http')) {
      return "Link lazima ianze na http:// au https:// (Mfano: https://drive.google.com/...)";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Piga check ya URL kwanza
    const errorMsg = validateUrl(formData.cvUrl);
    if (errorMsg) {
      setUrlError(errorMsg);
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.applyForJob(id!, formData);
      toast({ title: "Success!", description: "Application submitted successfully." });
      navigate("/dashboard");
    } catch (error: any) {
      // 2. Kamata error ya backend (kama ile 400 ya validator)
      const backendError = error.response?.data?.errors?.[0]?.msg || error.response?.data?.error;
      toast({ 
        title: "Failed", 
        description: backendError || "Could not submit. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

  return (
    <div className="min-h-screen bg-slate-100/50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 hover:bg-white text-slate-500 font-bold">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Details
        </Button>

        <Card className="shadow-2xl border-none overflow-hidden rounded-3xl">
          <CardHeader className="border-b bg-white p-8">
            <div className="flex items-center gap-5">
              <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Apply for {job?.title}</CardTitle>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{job?.employerId?.companyName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-blue-600" /> CV / Portfolio Link
                </label>
                <Input 
                  type="url"
                  placeholder="https://drive.google.com/your-cv" 
                  className={`h-14 rounded-xl border-slate-200 transition-all ${urlError ? "border-red-500 ring-1 ring-red-100" : "focus:ring-2 focus:ring-blue-100"}`}
                  required
                  value={formData.cvUrl}
                  onChange={(e) => {
                    setFormData({...formData, cvUrl: e.target.value});
                    setUrlError(""); // Futa error unapoandika
                  }}
                />
                {urlError && (
                  <p className="text-red-500 text-xs font-bold flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" /> {urlError}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 font-medium">Make sure the link is public so the employer can view it.</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" /> Cover Letter
                </label>
                <Textarea 
                  placeholder="Explain your skills and why you are a good fit..." 
                  className="min-h-[200px] rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-100 shadow-inner resize-none"
                  required
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-slate-900 text-white shadow-xl transition-all active:scale-95" disabled={submitting}>
                {submitting ? <><Loader2 className="animate-spin mr-2" /> Submitting...</> : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplyJob;