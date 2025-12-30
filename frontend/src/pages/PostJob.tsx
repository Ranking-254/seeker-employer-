import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/integrations/api/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PostJob = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    jobType: "full_time",
    salaryMin: "",
    salaryMax: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createJob(formData);
      toast({ title: "Job Posted!", description: "Your listing is now live." });
      navigate("/employers");
    } catch (error) {
      toast({ title: "Error", description: "Could not post job", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create a Job Posting</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold">Job Title</label>
                <Input required onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold">Location</label>
                  <Input required onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold">Job Type</label>
                  <select 
                    className="w-full border rounded-md h-10 px-3 text-sm"
                    onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold">Min Salary</label>
                  <Input type="number" onChange={(e) => setFormData({...formData, salaryMin: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold">Max Salary</label>
                  <Input type="number" onChange={(e) => setFormData({...formData, salaryMax: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold">Job Description</label>
                <Textarea rows={6} required onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-blue-600 font-bold h-12">Publish Job</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;