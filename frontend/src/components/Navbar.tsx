import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard, // <--- ADDED THIS
  Bookmark         // <--- ADDED THIS
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Briefcase className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">JobPortal</span>
        </div>

        {/* MAIN LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate("/jobs")} className="text-foreground hover:text-primary transition-colors font-medium">
            Find Jobs
          </button>
          
          {(!user || user.role === 'employer') && (
            <button onClick={() => navigate("/employers")} className="text-foreground hover:text-primary transition-colors font-medium">
              For Employers
            </button>
          )}

          <button onClick={() => navigate("/about")} className="text-foreground hover:text-primary transition-colors font-medium">
            About
          </button>
        </div>

        {/* AUTH BUTTONS / DROPDOWN */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Dashboard Redirection */}
                <DropdownMenuItem onClick={() => navigate(user.role === 'employer' ? "/employers" : "/dashboard")}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>

                {user.role === 'job_seeker' && (
                  <DropdownMenuItem onClick={() => navigate("/saved-jobs")}>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Saved Jobs
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/register")} className="bg-blue-600 hover:bg-black transition-all">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
