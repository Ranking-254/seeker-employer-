import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Clock, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock job data - will be replaced with actual data
  const job = {
    id: id || "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    postedDate: "2 days ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TC",
    description: `We're looking for an experienced frontend developer to join our growing team. 
    
You'll be working on cutting-edge web applications using React, TypeScript, and modern web technologies.

Key Responsibilities:
• Build and maintain high-quality, reusable code
• Collaborate with designers and backend developers
• Participate in code reviews and technical discussions
• Mentor junior developers

Requirements:
• 5+ years of experience with React
• Strong TypeScript skills
• Experience with modern build tools (Vite, Webpack)
• Excellent problem-solving abilities`,
    requirements: ["React", "TypeScript", "Vite", "Tailwind CSS"],
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-primary-foreground hover:text-primary-foreground/90">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-lg" />
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                      <p className="text-xl text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                    Posted {job.postedDate}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
                  <p className="whitespace-pre-line text-card-foreground leading-relaxed">{job.description}</p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Button className="w-full" size="lg">Apply Now</Button>
                <Button variant="outline" className="w-full">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save Job
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Job
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">About {job.company}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  TechCorp Inc. is a leading technology company focused on building innovative solutions for the future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
