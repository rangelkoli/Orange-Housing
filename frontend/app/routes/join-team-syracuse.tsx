import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

export default function JoinTeamSyracusePage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      {/* Navbar Placeholder / Back Button */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/team-syracuse" className="p-2 -ml-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors group" title="Back to Team Syracuse">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          
          <div className="h-6 w-px bg-stone-200" />

          <nav className="flex items-center text-sm text-stone-500">
            <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <Link to="/team-syracuse" className="hover:text-stone-900 transition-colors">Team Syracuse</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <span className="text-stone-900 font-medium">Join</span>
          </nav>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Application Form</h1>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Fill out the form below to join our community.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8 md:p-12">
                <form className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input id="businessName" placeholder="Your Business Name" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input id="contactName" placeholder="Full Name" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="name@company.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" type="url" placeholder="https://www.example.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Tell us a bit about yourself and why you'd like to join..." rows={4} />
                    </div>

                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 rounded-xl text-lg shadow-lg shadow-orange-200 transition-all hover:scale-[1.02]">
                        Submit Application
                    </Button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}
