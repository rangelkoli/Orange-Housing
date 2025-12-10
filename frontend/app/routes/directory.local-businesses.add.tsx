import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ChevronRight,
  Building2,
  Upload,
  Check,
  CreditCard,
  Clock,
  Shield,
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
  ImageIcon,
} from "lucide-react";

type PricingPlan = "6month" | "12month";

interface FormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  description: string;
  image: File | null;
}

export default function AddBusinessPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>("12month");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "NY",
    zipCode: "",
    category: "",
    description: "",
    image: null,
  });

  const categories = [
    "Moving Services",
    "Cleaning Services",
    "Home Services",
    "Furniture",
    "Storage",
    "Home Improvement",
    "Landscaping",
    "Pest Control",
    "Appliance Repair",
    "Other",
  ];

  const plans = {
    "6month": {
      price: 200,
      duration: "6 Months",
      perMonth: "$33.33/mo",
      savings: null,
    },
    "12month": {
      price: 300,
      duration: "12 Months",
      perMonth: "$25/mo",
      savings: "Save $100",
    },
  };

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
      setStep(3);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = () => {
    return (
      formData.businessName.trim() !== "" &&
      formData.contactName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.zipCode.trim() !== "" &&
      formData.category !== "" &&
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
            To be listed under <strong>Support our Local Syracuse Businesses</strong>, please fill out this form with your contact info and upload 1 picture.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= stepNum
                      ? "bg-orange-600 text-white"
                      : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {step > stepNum ? <Check size={20} /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 rounded-full transition-all ${
                      step > stepNum ? "bg-orange-600" : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-stone-500 px-4">
            <span className={step >= 1 ? "text-orange-600 font-medium" : ""}>
              Business Info
            </span>
            <span className={step >= 2 ? "text-orange-600 font-medium" : ""}>
              Choose Plan
            </span>
            <span className={step >= 3 ? "text-orange-600 font-medium" : ""}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Step 1: Business Information */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-6 font-serif">
                Business Information
              </h2>

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
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                {/* Contact Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
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

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="Syracuse"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg bg-stone-50 text-stone-600"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="13202"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Business Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
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
                  <p className="text-xs text-stone-500 mt-1">
                    Maximum 500 characters
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Business Photo (optional)
                  </label>
                  <div className="border-2 border-dashed border-stone-200 rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({ ...prev, image: null }));
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                            <ImageIcon size={24} />
                          </div>
                          <span className="text-stone-600 font-medium">
                            Click to upload an image
                          </span>
                          <span className="text-xs text-stone-400">
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

                {/* Continue Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid()}
                    className="w-full py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue to Pricing
                    <ChevronRight size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 2: Choose Plan */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-2 font-serif">
                Choose Your Listing Plan
              </h2>
              <p className="text-stone-600 mb-8">
                Select a plan that works best for your business. Both plans include full directory listing with your business information and photo.
              </p>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 6 Month Plan */}
                <div
                  onClick={() => setSelectedPlan("6month")}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === "6month"
                      ? "border-orange-500 bg-orange-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">
                        6 Month Listing
                      </h3>
                      <p className="text-stone-500 text-sm">{plans["6month"].perMonth}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === "6month"
                          ? "border-orange-500 bg-orange-500"
                          : "border-stone-300"
                      }`}
                    >
                      {selectedPlan === "6month" && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-stone-900 mb-4">
                    ${plans["6month"].price}
                    <span className="text-base font-normal text-stone-500">
                      {" "}
                      one-time
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      Full directory listing
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      Business photo included
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      Contact info displayed
                    </li>
                  </ul>
                </div>

                {/* 12 Month Plan */}
                <div
                  onClick={() => setSelectedPlan("12month")}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === "12month"
                      ? "border-orange-500 bg-orange-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {/* Best Value Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Best Value
                    </span>
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">
                        12 Month Listing
                      </h3>
                      <p className="text-stone-500 text-sm">{plans["12month"].perMonth}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === "12month"
                          ? "border-orange-500 bg-orange-500"
                          : "border-stone-300"
                      }`}
                    >
                      {selectedPlan === "12month" && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-stone-900 mb-1">
                    ${plans["12month"].price}
                    <span className="text-base font-normal text-stone-500">
                      {" "}
                      one-time
                    </span>
                  </div>
                  <p className="text-green-600 text-sm font-semibold mb-4">
                    {plans["12month"].savings}
                  </p>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      Full directory listing
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      Business photo included
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      Contact info displayed
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-orange-500" />
                      <span className="font-medium">Priority placement</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Features */}
              <div className="bg-stone-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-stone-900 mb-4">
                  What's Included in Your Listing:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin size={18} className="text-orange-600" />
                    </div>
                    <span>Business address & map</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Phone size={18} className="text-orange-600" />
                    </div>
                    <span>Click-to-call phone</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Mail size={18} className="text-orange-600" />
                    </div>
                    <span>Email contact button</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Globe size={18} className="text-orange-600" />
                    </div>
                    <span>Website link</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <ImageIcon size={18} className="text-orange-600" />
                    </div>
                    <span>Business photo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Shield size={18} className="text-orange-600" />
                    </div>
                    <span>Verified badge</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-orange-50 rounded-xl p-6 mb-8 border border-orange-100">
                <h3 className="font-bold text-stone-900 mb-4">Order Summary</h3>
                <div className="flex justify-between items-center py-2 border-b border-orange-200">
                  <span className="text-stone-600">
                    Directory Listing ({plans[selectedPlan].duration})
                  </span>
                  <span className="font-semibold">${plans[selectedPlan].price}</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-orange-600">
                    ${plans[selectedPlan].price}
                  </span>
                </div>
              </div>

              {/* Payment Note */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-8 border border-blue-100">
                <CreditCard size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Secure Payment via Stripe</p>
                  <p>
                    You'll be redirected to Stripe's secure checkout to complete your
                    payment. We accept all major credit cards. Your listing will go
                    live automatically after payment is confirmed.
                  </p>
                </div>
              </div>

              {/* Pay by Check Option */}
              <div className="flex items-start gap-3 p-4 bg-stone-100 rounded-lg mb-8">
                <Clock size={20} className="text-stone-600 shrink-0 mt-0.5" />
                <div className="text-sm text-stone-600">
                  <p className="font-semibold mb-1">Prefer to Pay by Check?</p>
                  <p>
                    You can also mail a check to our office. Your listing will be
                    added to a holding queue and will go live once payment is
                    received. Contact us at{" "}
                    <a
                      href="mailto:Donna@orangehousing.com"
                      className="text-orange-600 hover:underline"
                    >
                      Donna@orangehousing.com
                    </a>{" "}
                    for mailing instructions.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Proceed to Payment - ${plans[selectedPlan].price}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
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
                      A confirmation receipt will be sent to <strong>{formData.email}</strong>
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
        )}
      </div>
    </div>
  );
}
