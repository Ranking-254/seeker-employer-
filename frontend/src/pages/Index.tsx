import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import {
  Search, Briefcase, Users, Code, Palette,
  FileText, Megaphone, BarChart, Shield, Loader2, Bookmark,
  Linkedin, Twitter, Instagram, Facebook, Phone
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { apiClient } from "@/integrations/api/client";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = [
  { name: "Technology", icon: Code, count: "1,200+" },
  { name: "Design", icon: Palette, count: "850+" },
  { name: "Writing", icon: FileText, count: "400+" },
  { name: "Marketing", icon: Megaphone, count: "900+" },
  { name: "Sales", icon: BarChart, count: "600+" },
  { name: "Security", icon: Shield, count: "300+" }
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        // Fetching the 3 most recent jobs for the homepage
        const response = await apiClient.getJobs({ limit: 3 });
        setJobs(response.jobs || []);
      } catch (error) {
        console.error("Failed to load featured jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    // Navigates to the jobs page with the category as a search query
    // This makes the categories "alive"
    navigate(`/jobs?category=${encodeURIComponent(categoryName.toLowerCase())}`);
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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative bg-slate-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Elevate Your <span className="text-blue-500">Career</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-slate-300 max-w-2xl mx-auto">
            The most reliable platform to find professional opportunities and top-tier talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 text-lg font-bold" onClick={() => navigate("/jobs")}>
              <Search className="mr-2 h-5 w-5" /> Find a Job
            </Button>

            {user?.role === 'job_seeker' ? (
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white px-8 h-14 text-lg font-bold" onClick={() => navigate("/saved-jobs")}>
                <Bookmark className="mr-2 h-5 w-5" /> Saved Jobs
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white px-8 h-14 text-lg font-bold" onClick={() => navigate("/employers")}>
                <Users className="mr-2 h-5 w-5" /> For Employers
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="py-10 border-b bg-white">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-3xl font-bold text-blue-600">12k+</div><div className="text-slate-500 text-sm font-medium uppercase tracking-wider">Active Jobs</div></div>
          <div><div className="text-3xl font-bold text-blue-600">8k+</div><div className="text-slate-500 text-sm font-medium uppercase tracking-wider">Companies</div></div>
          <div><div className="text-3xl font-bold text-blue-600">45k+</div><div className="text-slate-500 text-sm font-medium uppercase tracking-wider">Candidates</div></div>
          <div><div className="text-3xl font-bold text-blue-600">1.5k+</div><div className="text-slate-500 text-sm font-medium uppercase tracking-wider">New Hires</div></div>
        </div>
      </section>

      {/* --- FEATURED JOBS SECTION --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Opportunities</h2>
            <p className="text-slate-500 mt-2">Hand-picked roles from top-rated companies.</p>
          </div>
          <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50" onClick={() => navigate("/jobs")}>
            View All Jobs &rarr;
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-12 w-12 text-blue-600" /></div>
        ) : (
          <div className="grid gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => <JobCard key={job._id} job={formatJobForCard(job)} />)
            ) : (
              <div className="text-center py-10 text-slate-400 font-medium">No jobs found. Check back later!</div>
            )}
          </div>
        )}
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section className="py-20 bg-slate-50 border-y">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">Browse by Industry</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => (
              <Card 
                key={cat.name} 
                className="hover:border-blue-500 transition-all cursor-pointer group hover:shadow-lg active:scale-95"
                onClick={() => handleCategoryClick(cat.name)}
              >
                <CardHeader className="text-center p-6">
                  <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                    <cat.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800">{cat.name}</CardTitle>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">{cat.count} openings</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to start your next chapter?</h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Create an account today and get matched with jobs that fit your profile perfectly.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/register")} className="bg-white text-blue-600 hover:bg-slate-100 font-bold px-10 h-14">
            Join Now — It's Free
          </Button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900 tracking-tight">JobPortal</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Empowering professionals and companies to find the perfect match. 
                Built for the modern workforce.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">For Candidates</h3>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link to="/jobs" className="hover:text-blue-600">Browse All Jobs</Link></li>
                <li><Link to="/profile" className="hover:text-blue-600">Career Profile</Link></li>
                <li><Link to="/saved-jobs" className="hover:text-blue-600">My Bookmarks</Link></li>
                <li><Link to="/dashboard" className="hover:text-blue-600">Applications</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">For Employers</h3>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link to="/employers" className="hover:text-blue-600">Employer Dashboard</Link></li>
                <li><Link to="/post-job" className="hover:text-blue-600">Post a Position</Link></li>
                <li><Link to="/talent" className="hover:text-blue-600">Search Candidates</Link></li>
                <li><Link to="/pricing" className="hover:text-blue-600">Pricing & Plans</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Legal</h3>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600">Contact Support</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-medium uppercase tracking-widest">
            <p>&copy; 2025 JobPortal Global Inc.</p>

            <div className="flex flex-wrap gap-8 items-center">
              <a 
                href="https://www.linkedin.com/in/pattin-njue-a789412b0?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-[#0077B5] transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://x.com/NjuePattin?t=PzrpeIWy5cPN7hFZ_YfFlw&s=09" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-black transition-colors"
                title="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="https://www.instagram.com/pattin_njue?igsh=MWJqZjVqZjV2ZW56cg==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-[#E4405F] transition-colors"
                title="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://facebook.com/yourprofile" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-[#1877F2] transition-colors"
                title="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://wa.me/254716700151" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-[#25D366] transition-colors"
                title="WhatsApp"
              >
                <Phone size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;