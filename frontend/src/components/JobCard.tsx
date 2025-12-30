import { MapPin, Briefcase, DollarSign, Clock, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    postedDate: string;
    logo: string;
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  const navigate = useNavigate();

  // If ID is missing, we show an error on the card so you know immediately
  if (!job._id || job._id === "undefined") {
    return (
      <Card className="p-4 border-red-500 bg-red-50">
        <p className="text-red-600 font-bold">Error: Job data is corrupted (Missing ID)</p>
      </Card>
    );
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-primary" 
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <img src={job.logo} alt="logo" className="w-14 h-14 rounded-xl border bg-white" />
            <div>
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 mb-4">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.type}</span>
          <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {job.salary}</span>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="capitalize">{job.type}</Badge>
          <Link to={`/jobs/${job._id}`} className="text-primary font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
            View Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};