import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Briefcase, Users, CreditCard, 
  Search, LayoutDashboard, Loader2 
} from "lucide-react";
import { apiClient } from "@/integrations/api/client";
import { useNavigate, Link } from "react-router-dom";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchEmployerData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Secondary Nav for Employer Pages */}
      <div className="bg-white border-b sticky top-16 z-10">
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
          <h1 className="text-3xl font-bold">Employer Console</h1>
          <Button onClick={() => navigate("/post-job")} className="bg-blue-600 font-bold">
            <Plus className="mr-2 h-5 w-5" /> Post Job
          </Button>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Post a Job", icon: <Plus />, path: "/post-job", color: "bg-blue-500" },
            { label: "Find Talent", icon: <Search />, path: "/talent", color: "bg-green-500" },
            { label: "Active Jobs", icon: <Briefcase />, path: "/employers", color: "bg-orange-500" },
            { label: "Pricing/Plans", icon: <CreditCard />, path: "/pricing", color: "bg-purple-500" }
          ].map((item) => (
            <Card key={item.label} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(item.path)}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`${item.color} text-white p-3 rounded-full mb-3`}>
                  {item.icon}
                </div>
                <span className="font-bold text-slate-700">{item.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Your Active Listings</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : myJobs.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No jobs posted yet.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left">Title</th>
                    <th className="px-6 py-4 text-left">Location</th>
                    <th className="px-6 py-4 text-center">Applicants</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {myJobs.map((job: any) => (
                    <tr key={job._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold">{job.title}</td>
                      <td className="px-6 py-4 text-slate-600">{job.location}</td>
                      <td className="px-6 py-4 text-center">
                         <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">0</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => navigate(`/jobs/${job._id}`)}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;