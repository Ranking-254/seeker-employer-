import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Briefcase, Users, CreditCard, 
  Search, Loader2, X, ExternalLink, CheckCircle, 
  XCircle, Trash2, Edit, MessageSquare, Save 
} from "lucide-react";
import { apiClient } from "@/integrations/api/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- States for handling the Applicant view ---
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    fetchEmployerData();
  }, []);

  const fetchEmployerData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getEmployerJobs();
      setMyJobs(response.jobs || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE JOB LOGIC ---
  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${jobTitle}"? This will remove all associated applications.`)) {
      try {
        await apiClient.deleteJob(jobId);
        setMyJobs((prev) => prev.filter((j: any) => j._id !== jobId));
        if (selectedJob?._id === jobId) setSelectedJob(null);
        toast({ title: "Job Deleted", description: "Listing has been removed successfully." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete job", variant: "destructive" });
      }
    }
  };

  // --- VIEW APPLICANTS LOGIC ---
  const handleViewApplicants = async (job: any) => {
    setSelectedJob(job);
    setLoadingApps(true);
    try {
      const response = await apiClient.getJobApplications(job._id);
      setApplicants(response.applications || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load applicants", variant: "destructive" });
    } finally {
      setLoadingApps(false);
    }
  };

  // --- UPDATE APPLICATION STATUS LOGIC ---
  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      await apiClient.updateApplicationStatus(appId, status);
      setApplicants((prev: any) => 
        prev.map((a: any) => a._id === appId ? { ...a, status } : a)
      );
      toast({ title: "Success", description: `Application marked as ${status}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  // --- DELETE APPLICANT LOGIC ---
  const handleDeleteApplicant = async (appId: string, seekerName: string) => {
    if (!window.confirm(`Permanently remove ${seekerName}'s application?`)) return;
    try {
      await apiClient.employerDeleteApplication(appId);
      setApplicants((prev: any) => prev.filter((a: any) => a._id !== appId));
      toast({ title: "Removed", description: "Application deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete application", variant: "destructive" });
    }
  };

  // --- SAVE FEEDBACK/NOTE LOGIC ---
  const handleSaveNote = async (appId: string, note: string) => {
    try {
      await apiClient.updateApplicationNote(appId, note);
      toast({ title: "Note Saved", description: "Feedback updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save note", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      {/* Secondary Nav */}
      <div className="bg-white border-b sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto py-4">
            <Link to="/employers" className="text-blue-600 font-bold border-b-2 border-blue-600 pb-4">Dashboard</Link>
            <Link to="/post-job" className="text-slate-600 hover:text-blue-600 font-medium pb-4">Post a Job</Link>
            <Link to="/talent" className="text-slate-600 hover:text-blue-600 font-medium pb-4">Find Talent</Link>
            <Link to="/pricing" className="text-slate-600 hover:text-blue-600 font-medium pb-4">Pricing</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employer Console</h1>
          <Button onClick={() => navigate("/post-job")} className="bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg transition-all active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> Post Job
          </Button>
        </div>

        {/* Top Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Post a Job", icon: <Plus />, path: "/post-job", color: "bg-blue-500" },
            { label: "Find Talent", icon: <Search />, path: "/talent", color: "bg-green-500" },
            { label: "Active Jobs", icon: <Briefcase />, path: "/employers", color: "bg-orange-500" },
            { label: "Pricing/Plans", icon: <CreditCard />, path: "/pricing", color: "bg-purple-500" }
          ].map((item) => (
            <Card key={item.label} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border-none bg-white shadow-sm" onClick={() => navigate(item.path)}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`${item.color} text-white p-4 rounded-2xl mb-4 shadow-md`}>
                  {item.icon}
                </div>
                <span className="font-bold text-slate-800 tracking-tight">{item.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Listings Table */}
          <div className={`${selectedJob ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-500`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900">Your Active Listings</h2>
                <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                  {myJobs.length} JOBS
                </div>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>
                ) : myJobs.length === 0 ? (
                  <div className="p-20 text-center text-slate-400 font-medium">No jobs posted yet. Start hiring today!</div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b">
                      <tr>
                        <th className="px-6 py-4 text-left">Title</th>
                        <th className="px-6 py-4 text-left">Location</th>
                        <th className="px-6 py-4 text-center">Applicants</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myJobs.map((job: any) => (
                        <tr key={job._id} className={`transition-colors hover:bg-slate-50/80 ${selectedJob?._id === job._id ? 'bg-blue-50/50' : ''}`}>
                          <td className="px-6 py-4 font-bold text-slate-900">{job.title}</td>
                          <td className="px-6 py-4 text-slate-600 text-sm">{job.location}</td>
                          <td className="px-6 py-4 text-center">
                             <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm">
                               {job.applicantCount || 0}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:bg-blue-100" onClick={() => handleViewApplicants(job)}>Candidates</Button>
                              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600" onClick={() => navigate(`/edit-job/${job._id}`)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteJob(job._id, job.title)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Applicant Detail Side Panel */}
          {selectedJob && (
            <div className="lg:col-span-1">
              <Card className="sticky top-40 shadow-2xl border-blue-200 overflow-hidden animate-in slide-in-from-right duration-300 rounded-2xl">
                <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white">
                  <div className="flex flex-col">
                    <h3 className="font-bold truncate text-sm">Applicants List</h3>
                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-black truncate max-w-[150px]">{selectedJob.title}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)} className="text-white hover:bg-blue-700 h-8 w-8 rounded-full shadow-inner"><X className="h-4 w-4" /></Button>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto bg-white">
                  {loadingApps ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
                  ) : applicants.length === 0 ? (
                    <div className="p-12 text-center">
                       <Users className="h-10 w-10 mx-auto text-slate-200 mb-2" />
                       <p className="text-slate-400 text-sm font-medium">No one has applied yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {applicants.map((app: any) => (
                        <div key={app._id} className="p-5 space-y-4 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                               <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-black text-blue-600 border border-blue-100 uppercase shadow-sm">
                                 {app.jobSeekerId?.fullName?.charAt(0)}
                               </div>
                               <div>
                                 <p className="font-bold text-slate-900 text-sm leading-tight">{app.jobSeekerId?.fullName}</p>
                                 <p className="text-[10px] text-slate-400 font-bold">{app.jobSeekerId?.email}</p>
                               </div>
                            </div>
                            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ring-1 shadow-sm ${
                              app.status === 'accepted' ? 'bg-green-50 text-green-700 ring-green-100' : 
                              app.status === 'rejected' ? 'bg-red-50 text-red-700 ring-red-100' : 
                              'bg-yellow-50 text-yellow-700 ring-yellow-100'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                             <p className="text-[11px] text-slate-600 leading-relaxed italic">"{app.coverLetter}"</p>
                          </div>

                          {/* FEEDBACK SECTION */}
                          <div className="space-y-2 border-t pt-3 border-slate-100">
                            <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                              <MessageSquare className="h-3 w-3" /> Quick Feedback / Response
                            </div>
                            <textarea
                              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none shadow-inner"
                              rows={2}
                              placeholder="Type a message or interview invite..."
                              defaultValue={app.employerNotes || ""}
                              onBlur={(e) => handleSaveNote(app._id, e.target.value)}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-9 text-[11px] flex-1 font-bold rounded-lg border-slate-200 shadow-sm" asChild>
                              <a href={app.cvUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-2" /> View CV
                              </a>
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-9 w-9 p-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition-all active:scale-90"
                              onClick={() => handleUpdateStatus(app._id, 'accepted')}
                              title="Accept"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-9 w-9 p-0 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-md transition-all active:scale-90"
                              onClick={() => handleUpdateStatus(app._id, 'rejected')}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-9 w-9 p-0 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleDeleteApplicant(app._id, app.jobSeekerId?.fullName)}
                              title="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;