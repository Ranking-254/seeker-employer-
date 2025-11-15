import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobCard } from "@/components/JobCard";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  created_at: string;
  employer_profiles: {
    company_name: string;
    company_logo: string | null;
  };
}

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          employer_profiles (
            company_name,
            company_logo
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatJob = (job: Job) => {
    const formatSalary = () => {
      if (!job.salary_min && !job.salary_max) return "Competitive";
      if (job.salary_min && job.salary_max) return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
      if (job.salary_min) return `From $${job.salary_min.toLocaleString()}`;
      return `Up to $${job.salary_max?.toLocaleString()}`;
    };

    const formatDate = () => {
      const date = new Date(job.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    };

    return {
      id: job.id,
      title: job.title,
      company: job.employer_profiles.company_name,
      location: job.location,
      type: job.job_type.replace("_", "-"),
      salary: formatSalary(),
      description: job.description,
      postedDate: formatDate(),
      logo: job.employer_profiles.company_logo || `https://api.dicebear.com/7.x/initials/svg?seed=${job.employer_profiles.company_name}`
    };
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-8">Find Your Dream Job</h1>
          
          <div className="bg-card rounded-lg shadow-lg p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Location"
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button className="w-full">Search Jobs</Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-[180px]">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Salary Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-50k">$0 - $50k</SelectItem>
                  <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                  <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                  <SelectItem value="150k+">$150k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Jobs</h2>
          <p className="text-muted-foreground">{jobs.length} jobs found</p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={formatJob(job)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
