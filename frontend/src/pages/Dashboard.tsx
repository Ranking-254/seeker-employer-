import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Briefcase, FileText, Bookmark, TrendingUp, Loader2, ArrowRight } from "lucide-react";
import { apiClient } from "@/integrations/api/client";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for dynamic data
  const [stats, setStats] = useState({
    applications: 0,
    savedJobs: 0,
    profileViews: 0, // Usually requires a specific backend tracking route
    activeJobs: 0
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [savedRes, appsRes, jobsRes] = await Promise.all([
          apiClient.getSavedJobs(),
          apiClient.getMyApplications(), // Ensure this exists in your apiClient
          apiClient.getJobs({ limit: 5 }) // For recommendations
        ]);

        setStats({
          savedJobs: (savedRes.savedJobs || savedRes).length || 0,
          applications: (appsRes.applications || appsRes).length || 0,
          profileViews: 145, // Static for now unless you have tracking
          activeJobs: jobsRes.totalJobs || 0
        });

        setRecentApplications((appsRes.applications || appsRes).slice(0, 3));
        setRecommendedJobs((jobsRes.jobs || []).slice(0, 3));
        
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

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
        <p className="text-muted-foreground mb-8">Here's what's happening with your job search</p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Applications Sent" value={stats.applications} icon={<FileText />} trend="+0 this week" />
          <StatCard 
            title="Saved Jobs" 
            value={stats.savedJobs} 
            icon={<Bookmark />} 
            trend="Review and apply" 
            onClick={() => navigate('/saved-jobs')}
            className="cursor-pointer hover:border-primary transition-colors"
          />
          <StatCard title="Profile Views" value={stats.profileViews} icon={<TrendingUp />} trend="+12% this month" />
          <StatCard title="Active Jobs" value={stats.activeJobs} icon={<Briefcase />} trend="In your area" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Applications</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/applications')}>View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No applications yet.</p>
                ) : (
                  recentApplications.map((app) => (
                    <div key={app._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{app.jobId?.title || "Job Title"}</h3>
                        <p className="text-sm text-muted-foreground">{app.jobId?.employerId?.companyName || "Company"}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Jobs */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recommended Jobs</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div 
                    key={job._id} 
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary transition-colors cursor-pointer group"
                  >
                    <div>
                      <h3 className="font-semibold group-hover:text-primary">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.employerId?.companyName} • {job.location}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
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

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, trend, onClick, className }: any) => (
  <Card className={className} onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </CardContent>
  </Card>
);

import { Button } from "@/components/ui/button"; // Ensure Button is imported
export default Dashboard;
