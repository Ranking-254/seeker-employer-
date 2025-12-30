import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, Loader2, SlidersHorizontal, X } from "lucide-react";
import { apiClient } from "@/integrations/api/client";

const Jobs = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get initial filters from URL (especially 'category' from the Home screen)
  const categoryParam = searchParams.get("category") || "";
  const titleParam = searchParams.get("title") || "";

  // Filter States
  const [searchTerm, setSearchTerm] = useState(titleParam);
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Build search object - NO LIMIT HERE so it shows all results
      const params: any = {
        title: searchTerm,
        location: location,
        category: selectedCategory,
        isActive: true
        // limit: 100 // Optional: increase this if your API defaults to a small number
      };

      const response = await apiClient.getJobs(params);
      setJobs(response.jobs || []);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch whenever the URL category changes (from Home screen) or page loads
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    fetchJobs();
  }, [categoryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setSelectedCategory("");
    navigate("/jobs");
    fetchJobs();
  };

  const formatJobForCard = (job: any) => {
    return {
      _id: job._id?.toString() || job.id?.toString(),
      title: job.title,
      company: job.employerId?.companyName || "Private Employer",
      location: job.location,
      type: (job.jobType || "full_time").replace("_", " "),
      salary: job.salaryMin ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax?.toLocaleString()}` : "Competitive",
      description: job.description,
      postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently",
      logo: job.employerId?.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${job.title}`
    };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-5xl mx-auto bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-2 border-b md:border-b-0 md:border-r border-slate-100">
              <Search className="text-slate-400 h-5 w-5" />
              <Input 
                className="border-none focus-visible:ring-0 text-slate-700 h-12" 
                placeholder="Job title or keywords..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-2 border-b md:border-b-0 md:border-r border-slate-100">
              <MapPin className="text-slate-400 h-5 w-5" />
              <Input 
                className="border-none focus-visible:ring-0 text-slate-700 h-12" 
                placeholder="Location..." 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-2">
              <Briefcase className="text-slate-400 h-5 w-5" />
              <select 
                className="w-full border-none focus:outline-none text-slate-600 h-12 bg-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Industries</option>
                <option value="technology">Technology</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="writing">Writing</option>
                <option value="sales">Sales</option>
                <option value="security">Security</option>
              </select>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-black text-white h-12 px-8 font-bold transition-colors">
              Find Jobs
            </Button>
          </form>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {selectedCategory 
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Jobs` 
                : "Available Opportunities"}
            </h2>
            <p className="text-slate-500">Showing {jobs.length} total results</p>
          </div>
          
          {(searchTerm || selectedCategory || location) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-700">
              <X className="h-4 w-4 mr-1" /> Clear Filters
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Searching for matches...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={formatJobForCard(job)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No matching jobs found</h3>
            <p className="text-slate-500 mt-2">Try changing your keywords or category.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;