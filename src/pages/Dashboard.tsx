import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Briefcase, FileText, Bookmark, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
        <p className="text-muted-foreground mb-8">Here's what's happening with your job search</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Applications Sent
              </h3>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Saved Jobs
              </h3>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Review and apply</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Profile Views
              </h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-muted-foreground">+12% this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Active Jobs
              </h3>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">In your area</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Applications</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Senior Frontend Developer</h3>
                    <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                  </div>
                  <span className="text-sm px-3 py-1 bg-accent/10 text-accent rounded-full">Pending</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">UX Designer</h3>
                    <p className="text-sm text-muted-foreground">Design Studio</p>
                  </div>
                  <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">Reviewed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recommended Jobs</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary cursor-pointer">
                  <div>
                    <h3 className="font-semibold">React Developer</h3>
                    <p className="text-sm text-muted-foreground">Startup Co. • Remote</p>
                  </div>
                  <span className="text-sm text-primary">View</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary cursor-pointer">
                  <div>
                    <h3 className="font-semibold">Full Stack Engineer</h3>
                    <p className="text-sm text-muted-foreground">Tech Hub • SF</p>
                  </div>
                  <span className="text-sm text-primary">View</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
