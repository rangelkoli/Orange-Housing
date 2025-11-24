
import { Footer } from "../components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-stone-900 flex flex-col">
      
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Have questions about a listing? Need help with your account? Or just want to say hello? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center h-full">
                <div className="bg-orange-100 p-4 rounded-full text-orange-600 mb-6">
                  <Phone size={24} />
                </div>
                <h3 className="font-bold text-xl mb-2">Call Us</h3>
                <p className="text-stone-500 mb-6">Mon-Fri from 9am to 5pm EST.</p>
                <a href="tel:+13155550198" className="text-orange-600 font-bold hover:underline text-lg">(315) 555-0198</a>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center h-full">
                <div className="bg-orange-100 p-4 rounded-full text-orange-600 mb-6">
                  <Mail size={24} />
                </div>
                <h3 className="font-bold text-xl mb-2">Email Us</h3>
                <p className="text-stone-500 mb-6">We'll get back to you within 24 hours.</p>
                <a href="mailto:support@orangehousing.com" className="text-orange-600 font-bold hover:underline text-lg">support@orangehousing.com</a>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center h-full">
                <div className="bg-orange-100 p-4 rounded-full text-orange-600 mb-6">
                  <MapPin size={24} />
                </div>
                <h3 className="font-bold text-xl mb-2">Visit Us</h3>
                <p className="text-stone-500 mb-6">Come say hi at our office.</p>
                <p className="text-stone-800 font-medium">
                  123 University Ave, Suite 400<br />
                  Syracuse, NY 13210
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-stone-100">
                <h2 className="text-2xl font-bold mb-8">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">First Name</label>
                      <input type="text" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Last Name</label>
                      <input type="text" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Email Address</label>
                    <input type="email" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Subject</label>
                    <select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
                      <option>General Inquiry</option>
                      <option>Listing Support</option>
                      <option>Report a Problem</option>
                      <option>Partnership Opportunity</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Message</label>
                    <textarea rows={6} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="How can we help you today?"></textarea>
                  </div>

                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2">
                    Send Message <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
