import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Briefcase, User, Building2, Loader2, 
  AlertCircle, Eye, EyeOff 
} from "lucide-react"; // Tumeongeza Eye na EyeOff hapa
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type UserRole = "job_seeker" | "employer";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [role, setRole] = useState<UserRole>("job_seeker");
  const [isLoading, setIsLoading] = useState(false);
  
  // State mpya ya kuonyesha/kuficha password
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(formData.password);
  const strengthColor = ["bg-slate-200", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-600"][strength];
  const strengthText = ["Empty", "Very Weak", "Weak", "Medium", "Strong", "Very Strong"][strength];

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const validate = () => {
    const newErrors = { email: "", password: "", confirmPassword: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email.";
    if (formData.password.length < 6) newErrors.password = "Min 6 characters required.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name, role);
    } catch (error: any) {
      setErrors(prev => ({ ...prev, email: error.message || "Registration failed." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">Create Account</CardTitle>
          <CardDescription>Join JobPortal to manage your career</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Role Selection Logic - Imebaki ile ile */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">I am registering as a:</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} className="grid grid-cols-2 gap-4">
                <div className={`flex items-center space-x-2 p-3 border rounded-xl cursor-pointer transition-all ${role === "job_seeker" ? "bg-primary/5 border-primary shadow-sm" : "hover:bg-slate-50"}`}>
                  <RadioGroupItem value="job_seeker" id="job_seeker" className="sr-only" />
                  <Label htmlFor="job_seeker" className="flex flex-col items-center gap-1 cursor-pointer flex-1 text-center">
                    <User className={`h-6 w-6 ${role === "job_seeker" ? "text-primary" : "text-slate-400"}`} />
                    <span className="font-bold text-sm">Job Seeker</span>
                  </Label>
                </div>
                <div className={`flex items-center space-x-2 p-3 border rounded-xl cursor-pointer transition-all ${role === "employer" ? "bg-primary/5 border-primary shadow-sm" : "hover:bg-slate-50"}`}>
                  <RadioGroupItem value="employer" id="employer" className="sr-only" />
                  <Label htmlFor="employer" className="flex flex-col items-center gap-1 cursor-pointer flex-1 text-center">
                    <Building2 className={`h-6 w-6 ${role === "employer" ? "text-primary" : "text-slate-400"}`} />
                    <span className="font-bold text-sm">Employer</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" className="h-11" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email Address</Label>
              <Input id="email" type="email" placeholder="name@example.com" className={`h-11 ${errors.email ? "border-red-500" : ""}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              {errors.email && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" /> {errors.email}</p>}
            </div>

            {/* Password Field na Jicho */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Strength Bar */}
              {formData.password && (
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-500">Security Level</span>
                    <span className={strength < 3 ? "text-red-500" : "text-emerald-600"}>{strengthText}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div key={level} className={`h-full flex-1 transition-all duration-500 ${strength >= level ? strengthColor : "bg-slate-200"}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className={`h-11 ${errors.confirmPassword ? "border-red-500" : ""}`} 
                value={formData.confirmPassword} 
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                required 
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" /> {errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-slate-900 shadow-lg transition-all" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating account...</> : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm border-t pt-6">
            <span className="text-muted-foreground">Already have an account? </span>
            <button onClick={() => navigate("/login")} className="text-primary hover:underline font-bold">Sign in</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;