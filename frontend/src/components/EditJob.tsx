import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Save } from "lucide-react";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    jobType: "full_time",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await apiClient.getJob(id!);
        const job = response.job;
        setFormData({
          title: job.title,
          category: job.category,
          location: job.location,
          jobType: job.jobType,
          salaryMin: job.salaryMin?.toString() || "",
          salaryMax: job.salaryMax?.toString() || "",
          description: job.description,
          requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements || "",
        });
      } catch (error) {
        toast({ title: "Error", description: "Could not load job details", variant: "destructive" });
        navigate("/employers");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Process requirements back into an array
      const processedData = {
        ...formData,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
        requirements: formData.requirements.split("\n").filter(line => line.trim() !== ""),
      };

      await apiClient.updateJob(id!, processedData);
      toast({ title: "Job Updated", description: "Changes saved successfully!" });
      navigate("/employers");
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate("/employers")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <Card className="max-w-3xl mx-auto shadow-xl border-none">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Edit Job Listing</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.target. technology, design..."
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <select 
                    id="jobType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.jobType}
                    onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Min Salary ($)</Label>
                  <Input 
                    id="salaryMin" 
                    type="number"
                    value={formData.salaryMin} 
                    onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Max Salary ($)</Label>
                  <Input 
                    id="salaryMax" 
                    type="number"
                    value={formData.salaryMax} 
                    onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea 
                  id="description" 
                  rows={6}
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (One per line)</Label>
                <Textarea 
                  id="requirements" 
                  rows={4}
                  placeholder="Bachelor's degree&#10;3+ years experience&#10;React proficiency"
                  value={formData.requirements} 
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12" disabled={updating}>
                {updating ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditJob;