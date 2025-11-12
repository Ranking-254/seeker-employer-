import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase, User, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type UserRole = "jobseeker" | "employer";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("jobseeker");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic with Lovable Cloud
    console.log("Register:", { ...formData, role });
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join JobPortal and start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-3">
              <Label>I am a</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-secondary">
                  <RadioGroupItem value="jobseeker" id="jobseeker" />
                  <Label htmlFor="jobseeker" className="flex items-center gap-2 cursor-pointer flex-1">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Job Seeker</div>
                      <div className="text-sm text-muted-foreground">Looking for opportunities</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-secondary">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label htmlFor="employer" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Employer</div>
                      <div className="text-sm text-muted-foreground">Hiring talent</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
