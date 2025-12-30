import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { JobCard } from "@/components/JobCard";
import { apiClient } from "@/integrations/api/client";
import { Loader2, BookmarkX } from "lucide-react";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getSavedJobs();
        
        // CRITICAL FIX: Match the backend key 'savedJobs'
        // If your backend says res.json({ savedJobs }), we must use response.savedJobs
        const data = response.savedJobs || []; 
        setSavedJobs(data);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const formatSavedJob = (item: any) => {
    // Digging into the populated jobId from your backend
    const job = item?.jobId;
    if (!job) return null;

    return {
      _id: job._id || job.id,
      title: job.title,
      company: job.employerId?.companyName || "Private Employer",
      location: job.location,
      type: (job.jobType || "full_time").replace("_", " "),
      salary: job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : "Competitive",
      description: job.description,
      postedDate: new Date(job.createdAt).toLocaleDateString(),
      logo: job.employerId?.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${job.title}`
    };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">My Saved Jobs</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
            <BookmarkX className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">You haven't saved any jobs yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {savedJobs.map((item, index) => {
              const formatted = formatSavedJob(item);
              if (!formatted) return null;
              return <JobCard key={formatted._id || index} job={formatted} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;