import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  MapPin, Briefcase, DollarSign, Clock, Bookmark, ArrowLeft, Loader2, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiClient } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to protect actions (Apply/Save)
  const protectAction = (actionName: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: `Please sign in to ${actionName} this job.`,
      });
      navigate("/login", { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchJobData = async () => {
      if (!id || id === "undefined") return;
      try {
        setLoading(true);
        const data = await apiClient.getJob(id);
        setJob(data.job);

        if (user) {
          const saveStatus = await apiClient.checkSavedJob(id);
          setIsSaved(saveStatus.isSaved);
        }
      } catch (error: any) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!protectAction("save")) return;
    if (!id) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await apiClient.removeSavedJob(id);
        setIsSaved(false);
        toast({ title: "Removed", description: "Job removed from bookmarks" });
      } else {
        await apiClient.saveJob(id);
        setIsSaved(true);
        toast({ title: "Saved", description: "Job saved successfully" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Action failed", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = () => {
    // 1. Check if user is logged in
    if (!protectAction("apply for")) return;

    // 2. Prevent Employers from applying
    if (user?.role === 'employer') {
      toast({ 
        title: "Action Denied", 
        description: "Employer accounts cannot apply for jobs.", 
        variant: "destructive" 
      });
      return;
    }

    // 3. Redirect to the Application Form
    toast({ title: "Application Started", description: "Redirecting to application form..." });
    navigate(`/apply/${id}`);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!job) return <div className="p-10 text-center text-xl font-bold">Job Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader className="border-b pb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <img 
                    src={job.employerId?.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${job.title}`} 
                    className="w-20 h-20 rounded-xl object-cover border p-1 bg-white" 
                    alt="logo" 
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
                    <p className="text-xl text-blue-600 font-medium">{job.employerId?.companyName || "Private Employer"}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 pt-6">
                {/* Quick Info Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Location</p>
                    <div className="flex items-center gap-1 text-sm font-semibold"><MapPin className="h-4 w-4 text-blue-600" /> {job.location}</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Job Type</p>
                    <div className="flex items-center gap-1 text-sm font-semibold"><Briefcase className="h-4 w-4 text-blue-600" /> {job.jobType.replace('_', ' ')}</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Salary Range</p>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <DollarSign className="h-4 w-4 text-blue-600" /> 
                      {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : 'N/A'} - {job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Date Posted</p>
                    <div className="flex items-center gap-1 text-sm font-semibold"><Clock className="h-4 w-4 text-blue-600" /> {new Date(job.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold mb-4 text-slate-900">Job Description</h2>
                  <p className="whitespace-pre-line leading-relaxed text-slate-700">{job.description}</p>
                </div>

                {/* Requirements Section */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">Key Requirements</h2>
                    <ul className="grid grid-cols-1 gap-3">
                      {job.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-slate-600">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-4">
            <Card className="sticky top-24 shadow-md">
              <CardContent className="pt-6 space-y-4">
                <Button 
                  className="w-full bg-blue-600 hover:bg-black text-white h-12 text-lg font-bold transition-all" 
                  size="lg"
                  onClick={handleApply}
                >
                  Apply for this Job
                </Button>
                <Button 
                  variant={isSaved ? "default" : "outline"} 
                  className={`w-full h-12 ${isSaved ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100" : ""}`} 
                  onClick={handleToggleSave}
                  disabled={isSaving}
                >
                  <Bookmark className={`h-5 w-5 mr-2 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Saved to Bookmarks" : "Save this Job"}
                </Button>
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-sm mb-2 text-slate-900">About the Employer</h3>
                  <p className="text-sm text-slate-600 mb-1">{job.employerId?.companyName}</p>
                  {job.employerId?.location && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.employerId.location}
                    </p>
                  )}
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-4 leading-tight">
                  By clicking apply, you agree to share your profile and CV with the employer.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetail;