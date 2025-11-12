import { useState } from "react";
import { Search, MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobCard } from "@/components/JobCard";

const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "We're looking for an experienced frontend developer...",
    postedDate: "2 days ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TC"
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $130k",
    description: "Join our creative team to design beautiful experiences...",
    postedDate: "1 week ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=DS"
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "Cloud Systems",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130k - $180k",
    description: "Build scalable backend systems with cutting-edge technology...",
    postedDate: "3 days ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=CS"
  }
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="min-h-screen bg-secondary">
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
          <p className="text-muted-foreground">{MOCK_JOBS.length} jobs found</p>
        </div>
        
        <div className="grid gap-6">
          {MOCK_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
