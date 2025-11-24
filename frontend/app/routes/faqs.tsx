import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

export const meta = () => {
  return [
    { title: "Frequently Asked Questions | Syracuse Sanctuary" },
    { name: "description", content: "Find answers to common questions about renting, listing properties, and living in Syracuse, NY." },
  ];
};

export default function FAQPage() {
  const faqs = [
    {
      category: "For Renters",
      items: [
        { q: "What makes a Syracuse Sanctuary property unique?", a: "Our properties are hand-picked for their family-friendly amenities, safety, and proximity to schools and parks. We verify every listing to ensure it meets our high standards for quality and comfort." },
        { q: "Are there resources for new residents to Syracuse?", a: "Yes! We provide a comprehensive welcome guide with local recommendations, utility contacts, and school district information. Check out our blog for neighborhood guides and relocation tips." },
        { q: "How can I schedule a viewing?", a: "You can schedule a viewing directly through the property listing page. Look for the 'Schedule Viewing' button, select a time that works for you, and the landlord will confirm the appointment." },
        { q: "What is the application process like?", a: "Once you find a home you love, you can submit an application directly through our platform. You'll need to provide proof of income, rental history, and undergo a standard background check." },
        { q: "Are pets allowed in the rentals?", a: "Pet policies vary by property. You can filter your search results to show only pet-friendly listings. Check the specific listing details for information on pet deposits or restrictions." },
      ]
    },
    {
      category: "For Landlords",
      items: [
        { q: "How do I list my quality property for families?", a: "Simply click the 'List Your Space' button in the navigation bar to get started. You'll create an account, upload photos and details about your property, and we'll review it for approval." },
        { q: "Do you offer property management services?", a: "Yes, we connect landlords with top-rated local property managers who specialize in maintaining high-quality family homes. Contact us for a referral." },
        { q: "What are the fees for listing a property?", a: "Listing a property on Syracuse Sanctuary is free for the first 30 days. After that, we offer affordable monthly plans or a pay-per-lead model. Visit our Landlord page for detailed pricing." },
        { q: "How do you verify tenants?", a: "We offer integrated tenant screening services including credit checks, background checks, and eviction history reports to help you find reliable tenants." },
      ]
    },
    {
      category: "General",
      items: [
        { q: "What are the benefits of long-term rentals?", a: "Long-term rentals offer stability for your family, predictable costs, and the opportunity to truly become part of the community. They are often more affordable than short-term options." },
        { q: "Is Syracuse a good place for families?", a: "Absolutely! Syracuse offers affordable housing, excellent parks, diverse cultural events, and a strong sense of community. It's a great place to raise a family." },
         { q: "How can I contact support?", a: "You can reach our support team via the 'Contact Us' link in the footer, or email us directly at support@syracusesanctuary.com. We're here to help!" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4 transition-colors">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-stone-600">
            Everything you need to know about finding your home or listing your property in Syracuse.
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, itemIdx) => (
                  <AccordionItem key={itemIdx} value={`${section.category}-${itemIdx}`} className="border-b-stone-100 last:border-0">
                    <AccordionTrigger className="text-left text-lg font-medium text-stone-800 hover:text-orange-600 hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 leading-relaxed text-base pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-orange-600 rounded-2xl p-10 text-white shadow-xl shadow-orange-600/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our friendly team is here to help you with anything you need.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-sm"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}
