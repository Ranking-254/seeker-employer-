import { Button } from "@/components/ui/button";
import { Briefcase, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Briefcase className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">JobPortal</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate("/jobs")} className="text-foreground hover:text-primary transition-colors">
            Find Jobs
          </button>
          <button onClick={() => navigate("/employers")} className="text-foreground hover:text-primary transition-colors">
            For Employers
          </button>
          <button className="text-foreground hover:text-primary transition-colors">
            About
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button onClick={() => navigate("/register")}>
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};
