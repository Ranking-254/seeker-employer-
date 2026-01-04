import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, MapPin, Calendar, Clock, 
  Trash2, Edit3, Loader2, Search, ArrowLeft 
} from "lucide-react";
import { apiClient } from "@/integrations/api/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Applications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMyApplications();
      setApplications(response.applications || response);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({ title: "Error", description: "Failed to load applications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id: string) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await apiClient.deleteApplication(id);
      toast({ title: "Success", description: "Application withdrawn." });
      fetchApplications();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredApps = applications.filter(app => 
    filter === "all" ? true : app.status === filter
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-2 p-0 h-auto hover:bg-transparent text-blue-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
            <p className="text-slate-500 text-sm">Track the status of your sent applications.</p>
          </div>

          <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
            {["all", "pending", "accepted", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                  filter === status 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "text-slate-500 hover:text-blue-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-12 w-12 text-blue-600" /></div>
        ) : filteredApps.length === 0 ? (
          <Card className="border-dashed border-2 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No {filter !== 'all' ? filter : ''} applications found.</p>
              <Button onClick={() => navigate("/jobs")} className="mt-4 bg-blue-600">Browse Jobs</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredApps.map((app) => (
              <Card key={app._id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                    {/* Company Logo Initials */}
                    <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100">
                      {app.jobId?.employerId?.companyName?.charAt(0) || "J"}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{app.jobId?.title}</h3>
                        <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full ring-1 ${
                          app.status === 'pending' ? 'bg-yellow-50 text-yellow-600 ring-yellow-200' : 
                          app.status === 'accepted' ? 'bg-green-50 text-green-600 ring-green-200' : 
                          'bg-red-50 text-red-600 ring-red-200'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {app.jobId?.employerId?.companyName}</div>
                        <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {app.jobId?.location}</div>
                        <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Applied on {new Date(app.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {app.status === 'pending' ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-200 text-slate-600 hover:text-blue-600"
                            onClick={() => navigate(`/edit-application/${app._id}`)}
                          >
                            <Edit3 className="h-4 w-4 mr-2" /> Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleWithdraw(app._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Withdraw
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => navigate(`/jobs/${app.jobId?._id}`)}>
                           View Job Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;