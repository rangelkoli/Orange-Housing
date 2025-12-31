import { HelpCircle, BookOpen, MessageCircle, Mail, FileText, ExternalLink, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function LandlordHelp() {
  const faqs = [
    {
      question: "How do I create a new listing?",
      answer: "Click the 'Add New Listing' button in the sidebar or dashboard. Fill out the property details, upload photos, and submit for review."
    },
    {
      question: "How long does listing approval take?",
      answer: "Most listings are reviewed within 24-48 hours. You'll receive an email notification once your listing is approved."
    },
    {
      question: "How do I edit my listing after it's published?",
      answer: "Go to your Dashboard, find the listing, click 'Manage' and select 'Edit Property'. Changes may require re-approval."
    },
    {
      question: "How does billing work?",
      answer: "Listings are billed monthly. You can manage your subscription, payment methods, and view invoices in the Billing & Payments section."
    },
    {
      question: "Can I pause my listing temporarily?",
      answer: "Yes! You can archive a listing to temporarily hide it without losing your data. Reactivate it anytime from your dashboard."
    }
  ];

  const resources = [
    { icon: BookOpen, title: "Getting Started Guide", description: "Learn the basics of listing your property", href: "#" },
    { icon: FileText, title: "Listing Guidelines", description: "Best practices for creating effective listings", href: "#" },
    { icon: MessageCircle, title: "Community Forum", description: "Connect with other landlords", href: "#" },
  ];

  return (
    <div className="h-full overflow-y-auto w-full bg-[#fbfbfb]">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900">Help & Support</h1>
            <p className="text-stone-500 mt-2">
              Find answers, resources, and ways to get in touch.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-stone-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-900 mb-1">Contact Support</h3>
                  <p className="text-sm text-stone-500 mb-3">Get help from our team via email</p>
                  <a 
                    href="mailto:support@orangehousing.com" 
                    className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    support@orangehousing.com
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                  <HelpCircle size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-900 mb-1">FAQs</h3>
                  <p className="text-sm text-stone-500 mb-3">Browse common questions & answers</p>
                  <a 
                    href="/faqs" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View all FAQs
                    <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources */}
        <Card className="border-stone-100 shadow-sm">
          <CardHeader className="border-b border-stone-100 bg-white/50 backdrop-blur-sm px-6 py-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">Resources</h2>
          </CardHeader>
          <CardContent className="p-0">
            {resources.map((resource, index) => (
              <a 
                key={index}
                href={resource.href}
                className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0 group"
              >
                <div className="p-3 rounded-xl bg-stone-100 text-stone-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                  <resource.icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-stone-900">{resource.title}</h3>
                  <p className="text-sm text-stone-500">{resource.description}</p>
                </div>
                <ChevronRight className="text-stone-400 group-hover:text-orange-500 transition-colors" size={20} />
              </a>
            ))}
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="border-stone-100 shadow-sm">
          <CardHeader className="border-b border-stone-100 bg-white/50 backdrop-blur-sm px-6 py-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">Frequently Asked Questions</h2>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="pb-6 border-b border-stone-100 last:border-b-0 last:pb-0">
                <h3 className="font-semibold text-stone-900 mb-2 flex items-start gap-2">
                  <span className="text-orange-500 font-bold">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-stone-600 text-sm pl-6">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
