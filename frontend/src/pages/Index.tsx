import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Search, Briefcase, Users, TrendingUp, Code, Palette, FileText, Megaphone, BarChart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";

const FEATURED_JOBS = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "We're looking for an experienced frontend developer to join our growing team.",
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
    description: "Join our creative team to design beautiful experiences for millions of users.",
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
    description: "Build scalable backend systems with cutting-edge cloud technology.",
    postedDate: "3 days ago",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=CS"
  }
];

const CATEGORIES = [
  { name: "Technology", icon: Code, count: 1234 },
  { name: "Design", icon: Palette, count: 567 },
  { name: "Content Writing", icon: FileText, count: 432 },
  { name: "Marketing", icon: Megaphone, count: 789 },
  { name: "Sales", icon: BarChart, count: 345 },
  { name: "Security", icon: Shield, count: 234 }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Connect with top employers and discover opportunities that match your skills and ambitions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => navigate("/jobs")}>
                <Search className="mr-2 h-5 w-5" />
                Browse Jobs
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigate("/register")}>
                <Users className="mr-2 h-5 w-5" />
                Post a Job
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Jobs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Job Seekers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2,000+</div>
              <div className="text-muted-foreground">Hired This Month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Jobs</h2>
            <Button variant="outline" onClick={() => navigate("/jobs")}>View All</Button>
          </div>
          <div className="grid gap-6">
            {FEATURED_JOBS.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.count} jobs</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">Join thousands of job seekers and employers who trust JobPortal</p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/register")}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">JobPortal</span>
              </div>
              <p className="text-muted-foreground">Connect talent with opportunity</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-primary">Create Profile</a></li>
                <li><a href="#" className="hover:text-primary">Saved Jobs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Post a Job</a></li>
                <li><a href="#" className="hover:text-primary">Find Talent</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
