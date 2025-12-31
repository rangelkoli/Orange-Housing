import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ChevronRight,
  Building2,
  Check,
  CreditCard,
  Clock,
  Shield,
  Phone,
  Mail,
  Globe,
  MapPin,
  ImageIcon,
  Calendar,
  Info,
  Minus,
  Plus,
} from "lucide-react";

interface FormData {
  businessName: string;
  phone: string;
  website: string;
  description: string;
  image: File | null;
}

export default function AddBusinessPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    phone: "",
    website: "",
    description: "",
    image: null,
  });

  const COST_PER_MONTH = 10;
  const totalCost = durationMonths * COST_PER_MONTH;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDurationChange = (amount: number) => {
    setDurationMonths((prev) => Math.max(1, Math.min(60, prev + amount)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call - In production, this would:
    // 1. Send form data to your backend
    // 2. Create a Stripe checkout session
    // 3. Redirect to Stripe for payment
    
    try {
      // For demo purposes, we'll simulate a redirect to Stripe
      // In production, you'd create a checkout session on your backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate Stripe checkout redirect
      // In production: window.location.href = stripeCheckoutUrl;
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.businessName.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.description.trim() !== ""
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/directory/local-businesses"
            className="p-2 -ml-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors group"
            title="Back to Directory"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>

          <div className="h-6 w-px bg-stone-200" />

          <nav className="flex items-center text-sm text-stone-500">
            <Link to="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <Link
              to="/directory/local-businesses"
              className="hover:text-stone-900 transition-colors"
            >
              Local Businesses
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <span className="text-stone-900 font-medium">Add Your Business</span>
          </nav>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 border-4 border-white shadow-lg">
              <Building2 size={36} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 font-serif">
            Add Your Business to Our Directory
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            To be listed under <strong>Support our Local Syracuse Businesses</strong>, please fill out this form below.
          </p>
        </div>

        {/* Confirmation View */}
        {isSubmitted ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4 font-serif">
                Thank You for Your Submission!
              </h2>
              <p className="text-stone-600 mb-6">
                Your business listing has been submitted successfully. Once your
                payment is confirmed, your listing will be added to our Local
                Syracuse Businesses directory.
              </p>

              <div className="bg-stone-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-bold text-stone-900 mb-4">What's Next?</h3>
                <ul className="space-y-3 text-sm text-stone-600">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-orange-600 font-bold text-xs">1</span>
                    </div>
                    <span>
                      A confirmation receipt will be sent to your provided contact email
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-orange-600 font-bold text-xs">2</span>
                    </div>
                    <span>
                      Your listing will be reviewed and published within 24 hours
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-orange-600 font-bold text-xs">3</span>
                    </div>
                    <span>
                      You'll receive another email when your listing is live
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/directory/local-businesses"
                  className="flex-1 py-3 border border-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition-colors text-center"
                >
                  View Directory
                </Link>
                <Link
                  to="/"
                  className="flex-1 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors text-center"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Main Form Layout */
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column: Form & Duration */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Business Information Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                        <div className="bg-stone-50 px-8 py-6 border-b border-stone-100">
                            <h2 className="text-xl font-bold text-stone-900 font-serif">
                                Business Information
                            </h2>
                            <p className="text-stone-500 text-sm mt-1">
                                Tell us about your business so customers can find you.
                            </p>
                        </div>
                        <div className="p-8">
                            <form className="space-y-6">
                                {/* Business Name */}
                                <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Business Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                    placeholder="Enter your business name"
                                    required
                                />
                                </div>
                                {/* Phone & Website */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="(315) 555-0123"
                                    required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Website (optional)
                                    </label>
                                    <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="https://www.yourbusiness.com"
                                    />
                                </div>
                                </div>


                                {/* Description */}
                                <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Business Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                                    placeholder="Tell us about your business, services offered, and what makes you unique..."
                                    required
                                />
                                <p className="text-xs text-stone-500 mt-1 flex justify-end">
                                    {formData.description.length} / 500 characters
                                </p>
                                </div>

                                {/* Image Upload */}
                                <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Business Photo (optional)
                                </label>
                                <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center hover:border-orange-400 hover:bg-orange-50/10 transition-colors cursor-pointer group">
                                    {imagePreview ? (
                                    <div className="relative inline-block">
                                        <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-64 rounded-lg shadow-md"
                                        />
                                        <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setImagePreview(null);
                                            setFormData((prev) => ({ ...prev, image: null }));
                                        }}
                                        className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                                        >
                                        <Minus size={16} />
                                        </button>
                                    </div>
                                    ) : (
                                    <label className="cursor-pointer block w-full h-full">
                                        <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 group-hover:scale-110 transition-transform group-hover:text-orange-500 group-hover:bg-orange-100">
                                            <ImageIcon size={32} />
                                        </div>
                                        <div>
                                            <span className="text-stone-900 font-medium block text-lg">
                                                Upload Business Photo
                                            </span>
                                            <span className="text-stone-500 text-sm">
                                                Drag and drop or click to browse
                                            </span>
                                        </div>
                                        <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                                            PNG, JPG up to 5MB
                                        </span>
                                        </div>
                                        <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        />
                                    </label>
                                    )}
                                </div>
                                </div>
                            </form>
                        </div>
                    </div>
                

                    {/* Features Preview */}
                    <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 border-dashed">
                        <h3 className="font-bold text-stone-900 mb-4 text-sm uppercase tracking-wide">
                            Your Professional Listing Includes:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                            <div className="flex items-center gap-2 text-stone-700">
                                <Check size={16} className="text-green-500 flex-shrink-0" />
                                <span>Full business profile page</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-700">
                                <Check size={16} className="text-green-500 flex-shrink-0" />
                                <span>Photo gallery display</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-700">
                                <Check size={16} className="text-green-500 flex-shrink-0" />
                                <span>Direct contact links</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-700">
                                <Check size={16} className="text-green-500 flex-shrink-0" />
                                <span>Google Maps integration</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-700">
                                <Check size={16} className="text-green-500 flex-shrink-0" />
                                <span>SEO optimized Listing</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-700">
                                <Check size={16} className="text-green-500 flex-shrink-0" />
                                <span>Mobile responsive design</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Sticky Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden sticky top-8">
                        <div className="bg-stone-50 px-6 py-4 border-b border-stone-100">
                             <h3 className="font-bold text-stone-900">Order Summary</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-3">
                                        Duration (Months)
                                    </label>
                                    <div className="flex items-center gap-3 mb-4">
                                        <button 
                                            type="button"
                                            onClick={() => handleDurationChange(-1)}
                                            className="w-10 h-10 rounded border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors bg-white shadow-sm"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <div className="flex-1 relative">
                                             <input
                                                type="number"
                                                value={durationMonths}
                                                onChange={(e) => setDurationMonths(Math.max(1, Math.min(60, parseInt(e.target.value) || 0)))}
                                                className="w-full h-10 text-center font-bold text-stone-900 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                                min="1"
                                                max="60"
                                            />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleDurationChange(1)}
                                            className="w-10 h-10 rounded border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors bg-white shadow-sm"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-start text-sm pt-4 border-t border-stone-100">
                                    <span className="text-stone-600">Rate</span>
                                    <span className="font-medium text-stone-900">${COST_PER_MONTH}.00 / month</span>
                                </div>
                                <div className="h-px bg-stone-100 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-stone-900 text-lg">Total Due</span>
                                    <span className="font-bold text-2xl text-orange-600">
                                        ${totalCost}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !isFormValid()}
                                    className="w-full py-3.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:bg-stone-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                        </>
                                    ) : (
                                        <>
                                        Make Payment
                                        <ChevronRight size={18} />
                                        </>
                                    )}
                                </button>
                                <div className="text-xs text-stone-500 text-center px-4 mt-2">
                                    By clicking above, you agree to our Terms of Service and Privacy Policy.
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-stone-100 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center text-blue-600 shrink-0">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-xs text-stone-900 uppercase tracking-wide">Secure Online Payment</h4>
                                        <p className="text-xs text-stone-500 mt-1">
                                            Pay securely via Stripe. We accept all major credit cards.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center text-stone-600 shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-xs text-stone-900 uppercase tracking-wide">Pay by Check</h4>
                                        <p className="text-xs text-stone-500 mt-1">
                                            Mail checks to our office. <a href="mailto:Donna@orangehousing.com" className="text-orange-600 hover:underline">Email Donna</a> for info.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
