import { MapPin, Briefcase, DollarSign, Clock, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: {
    id: string;
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

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg" />
            <div>
              <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-card-foreground mb-4 line-clamp-2">{job.description}</p>
        
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            {job.type}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            {job.salary}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {job.postedDate}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Badge variant="secondary">{job.type}</Badge>
          <Button onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
