import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
            <p className="text-slate-600 mb-8 text-lg">Have questions? Our team is here to help you navigate your journey.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-blue-600" /> <span>support@jobportal.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-blue-600" /> <span>+254 716 700 151</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="text-blue-600" /> <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <form className="space-y-4">
              <Input placeholder="Your Name" />
              <Input placeholder="Email Address" type="email" />
              <Textarea placeholder="How can we help?" rows={5} />
              <Button className="w-full bg-blue-600 h-12 font-bold">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;