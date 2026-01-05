import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { 
  Briefcase, FileText, Bookmark, TrendingUp, 
  Loader2, ArrowRight, Trash2, Edit3, MessageSquare 
} from "lucide-react";
import { apiClient } from "@/integrations/api/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; 
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stats, setStats] = useState({
    applications: 0, savedJobs: 0, profileViews: 145, activeJobs: 0
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [savedRes, appsRes, jobsRes] = await Promise.all([
        apiClient.getSavedJobs(),
        apiClient.getMyApplications(),
        apiClient.getJobs({ limit: 5 })
      ]);
      const apps = appsRes.applications || appsRes;
      setStats(prev => ({
        ...prev,
        savedJobs: (savedRes.savedJobs || savedRes).length || 0,
        applications: apps.length || 0,
        activeJobs: jobsRes.totalJobs || 0
      }));
      setRecentApplications(apps.slice(0, 3));
      setRecommendedJobs((jobsRes.jobs || []).slice(0, 3));
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await apiClient.deleteApplication(id);
      toast({ title: "Withdrawn", description: "Application removed successfully." });
      fetchDashboardData(); 
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">Track and manage your professional journey.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Applications" value={stats.applications} icon={<FileText size={20}/>} trend="Keep going!" />
          <StatCard title="Saved Jobs" value={stats.savedJobs} icon={<Bookmark size={20}/>} trend="Ready to apply" onClick={() => navigate('/saved-jobs')} className="cursor-pointer hover:border-primary" />
          <StatCard title="Profile Views" value={stats.profileViews} icon={<TrendingUp size={20}/>} trend="+12% increase" />
          <StatCard title="Total Jobs" value={stats.activeJobs} icon={<Briefcase size={20}/>} trend="Live listings" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">Your Applications</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/applications')}>View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No applications yet.</p>
                ) : (
                  recentApplications.map((app) => (
                    <div key={app._id} className="group p-4 border rounded-xl hover:shadow-md transition-all bg-white flex flex-col h-full justify-between">
                      {/* TOP SECTION: Info and Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-slate-800">{app.jobId?.title}</h3>
                          <p className="text-xs text-muted-foreground">{app.jobId?.employerId?.companyName}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ring-1 ${
                          app.status === 'accepted' ? 'bg-green-50 text-green-600 ring-green-200' : 
                          app.status === 'rejected' ? 'bg-red-50 text-red-600 ring-red-200' : 
                          'bg-yellow-50 text-yellow-600 ring-yellow-200'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {/* CONDITIONAL ACTION BOX: Swaps between Message or Buttons */}
                      <div className="mt-auto pt-3 border-t border-slate-50">
                        {app.employerNotes && app.employerNotes.trim() !== "" ? (
                          /* SHOW MESSAGE IF IT EXISTS */
                          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-2">
                            <MessageSquare className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Message from Employer:</p>
                              <p className="text-xs text-slate-700 italic leading-relaxed">"{app.employerNotes}"</p>
                            </div>
                          </div>
                        ) : (
                          /* SHOW BUTTONS ONLY IF NO MESSAGE EXISTS AND STATUS IS PENDING */
                          app.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="h-10 text-xs flex-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-bold"
                                onClick={() => navigate(`/edit-application/${app._id}`)}
                              >
                                <Edit3 className="h-3 w-3 mr-1" /> Edit
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="h-10 text-xs flex-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 font-bold"
                                onClick={() => handleDeleteApplication(app._id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Withdraw
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader><h3 className="text-lg font-semibold">Recommended for you</h3></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <div key={job._id} onClick={() => navigate(`/jobs/${job._id}`)} className="flex items-center justify-between p-4 border rounded-xl hover:border-primary transition-all cursor-pointer group bg-white">
                    <div>
                      <h3 className="font-bold text-sm group-hover:text-primary">{job.title}</h3>
                      <p className="text-xs text-muted-foreground">{job.employerId?.companyName} • {job.location}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, onClick, className }: any) => (
  <Card className={`${className} border-none shadow-sm`} onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="text-primary/60">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-black text-slate-900">{value.toLocaleString()}</div>
      <p className="text-[10px] font-medium text-emerald-600 mt-1">{trend}</p>
    </CardContent>
  </Card>
);

export default Dashboard;