import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, User } from "lucide-react";

const FindTalent = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Find Talent</h1>
        <p className="text-slate-500 mb-8">Search through our database of skilled professionals.</p>

        <div className="flex gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input className="pl-10 h-12" placeholder="Search by skills or job title..." />
          </div>
          <Button className="h-12 px-8 bg-blue-600 font-bold">Search</Button>
        </div>

        <div className="grid gap-6">
          <Card className="border-dashed border-2 py-20 text-center">
            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">Talent Search Coming Soon</h3>
            <p className="text-slate-400">We are currently verifying our candidate database.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FindTalent;