import { Navbar } from "@/components/Navbar";
import { Briefcase, Target, ShieldCheck } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-black mb-6 text-center">Connecting Talent with Opportunity</h1>
        <p className="text-xl text-slate-600 text-center mb-12">
          We are more than just a job board. We are a bridge between ambitious professionals and the world's most innovative companies.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-blue-600 h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Our Mission</h3>
            <p className="text-slate-500 text-sm">To simplify the hiring process through transparency and technology.</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-green-600 h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Our Vision</h3>
            <p className="text-slate-500 text-sm">A world where every person finds a career they are truly passionate about.</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-purple-600 h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Our Values</h3>
            <p className="text-slate-500 text-sm">Integrity, efficiency, and candidate-first experiences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;