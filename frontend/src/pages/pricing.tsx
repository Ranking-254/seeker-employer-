import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    { name: "Basic", price: "Free", features: ["3 Job Postings", "Basic Support", "7-day listing"] },
    { name: "Pro", price: "$49", features: ["Unlimited Postings", "Featured Badges", "Priority Support", "Candidate Export"] },
    { name: "Enterprise", price: "Custom", features: ["Bulk Hiring", "Dedicated Manager", "API Access"] }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Transparent Pricing</h1>
        <p className="text-slate-500 mb-12 max-w-2xl mx-auto">Choose the plan that's right for your business hiring needs.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white p-8 rounded-2xl shadow-sm border hover:border-blue-500 transition-all flex flex-col">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-black mb-6">{plan.price}</div>
              <ul className="space-y-4 mb-8 text-left flex-grow">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-slate-600">
                    <Check className="h-5 w-5 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Button className={`w-full h-12 font-bold ${plan.name === "Pro" ? "bg-blue-600" : "bg-black"}`}>
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;