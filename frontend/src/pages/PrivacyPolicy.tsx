import { Navbar } from "@/components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <p>Last updated: December 2025</p>
          <h2 className="text-xl font-bold text-slate-800">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, post a job, or apply for a position.</p>
          <h2 className="text-xl font-bold text-slate-800">2. How We Use Your Data</h2>
          <p>Your data is used to facilitate the hiring process between employers and job seekers.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;