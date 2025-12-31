import { useState, useEffect, useRef } from "react";
import { PreviewModal } from "../components/PreviewModal";
import { useNavigate } from "react-router";
import {
  ChevronLeft,
  Upload,
  Calendar as CalendarIcon,
  MapPin,
  Home,
  Wifi,
  Users,
  User,
  Zap,
  Building,
  Clock,
  BedDouble,
  Loader2,
  Image as ImageIcon,
  X,
  Star,
  RotateCw,
  Check,
  Flame,
  Droplets,
  Wind,
  CheckCircle2,
  Circle,
  AlertCircle,
  Info,
  DollarSign,
  Bath,
  Bed,
  LayoutGrid,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Share2,
  Heart,
  Eye,
  Crop,
  RotateCcw,
  CalendarDays,
  Utensils,
  Waves,
  Car,
  TreePine,
  PawPrint,
  Sofa,
} from "lucide-react";
import { format, parse } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { useAuthStore } from "../stores/authStore";

import Cropper from "react-easy-crop";
import { Slider } from "../components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

// Simple debounce implementation
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Canvas Utils for Cropping
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function handles the canvas processing to create the cropped image.
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return "";
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  return canvas.toDataURL('image/jpeg');
}

// --- Types & Constants ---

// Rentals moved to the bottom as requested
const LISTING_TYPES = [
    {
    id: 1,
    name: "Rentals",
    description: "Long-term residential rentals",
    icon: Building,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    id: 4,
    name: "Short Term",
    description: "Vacation & temp stays",
    icon: Clock,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    id: 2,
    name: "Sublets",
    description: "Subletting for fixed period",
    icon: CalendarIcon,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    id: 3,
    name: "Room for Rent",
    description: "Individual room in shared unit",
    icon: BedDouble,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },

];

const AMENITIES_LIST = [
  { id: "dishwasher", label: "Dishwasher", icon: Droplets },
  { id: "fireplace", label: "Fireplace", icon: Flame },
  { id: "porch", label: "Porch / Deck", icon: Wind },
  { id: "is_season", label: "Seasonal Rental", icon: CalendarIcon },
  { id: "smoking", label: "Smoking Allowed", icon: Check },
];

const UTILITIES_LIST = [
  { name: "Heat", icon: Flame, description: "Central heating included" },
  { name: "Water", icon: Droplets, description: "Hot & cold water" },
  { name: "Electric", icon: Zap, description: "Electricity included" },
  { name: "Wifi", icon: Wifi, description: "High-speed internet" },
  { name: "Contact Manager", icon: User, description: "Talk to manager for details" },
];

const PERFECT_FOR_OPTIONS = [
  { id: "Students", icon: "🎓", description: "College & university students" },
  { id: "Families", icon: "👨‍👩‍👧‍👦", description: "Families with children" },
  { id: "Professionals", icon: "💼", description: "Working professionals" },
  { id: "Seniors", icon: "🏡", description: "Senior citizens" },
];

const BUILDING_TYPES = [
  { value: "Apartment", label: "Apartment", icon: Building },
  { value: "House", label: "House", icon: Home },
  { value: "Condo", label: "Condo", icon: LayoutGrid },
  { value: "Townhouse", label: "Townhouse", icon: Building },
];

export function ListingForm({ initialData }: { initialData?: any }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const formRef = useRef<HTMLFormElement>(null);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeSection, setActiveSection] = useState("type");
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  );

  // Data State
  const [selectedType, setSelectedType] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [buildingType, setBuildingType] = useState("Apartment");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");
  const [leaseDuration, setLeaseDuration] = useState("");
  const [laundry, setLaundry] = useState("");
  const [parking, setParking] = useState("");
  const [furnished, setFurnished] = useState("");
  const [pets, setPets] = useState("");
  const [ac, setAc] = useState("");
  const [rentType, setRentType] = useState("total"); // 'total' or 'person'
  const [rent, setRent] = useState("");
  const [zip, setZip] = useState("");
  const [unit, setUnit] = useState("");

  // Contact State (Auto-filled)
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Image Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Location
  const [address, setAddress] = useState("");
  const debouncedAddress = useDebounce(address, 1000);

  // Photos
  const [photos, setPhotos] = useState<
    {
      file?: File;
      preview: string;
      id: string;
      isCover: boolean;
      rotation: number;
    }[]
  >([]);

  // Pre-fill data
  useEffect(() => {
    if (initialData) {
        setSelectedType(initialData.typeCode || 1);
        setTitle(initialData.title || "");
        setDetails(initialData.details || "");
        setRent(initialData.rent || "");
        setBeds(initialData.beds || "");
        setBaths(initialData.baths || "");
        setBuildingType(initialData.building_type || "Apartment");
        setAddress(initialData.address || "");
        setZip(initialData.zip || "");
        setUnit(initialData.unit || "");
        setLeaseStart(initialData.date_avail || "");
        setLeaseEnd(initialData.tenant_lease_end || "");
        setLeaseDuration(initialData.lease_length || "");
        setRentType(initialData.rent_type || "total");
        setLaundry(initialData.laundry || "");
        setParking(initialData.parking || "");
        setPets(initialData.pets || "");
        setFurnished(initialData.furnished || "");
        setAc(initialData.ac || ""); 
        setPerfectFor(initialData.perfect_for || "");
        
        setContactName(initialData.contact_name || "");
        setContactEmail(initialData.contact_email || "");
        setContactPhone(initialData.contact_number || "");

        // Utilities (comma separated string -> array)
        if (initialData.utilities) {
             const utils = initialData.utilities.split(',').map((u: string) => u.trim());
             setSelectedUtilities(utils);
        }

        // Features (individual columns -> array)
        const features = [];
        if (initialData.dishwasher) features.push("dishwasher");
        if (initialData.fireplace) features.push("fireplace");
        if (initialData.porch) features.push("porch");
        if (initialData.smoking) features.push("smoking");
        if (initialData.is_season) features.push("is_season");
        setSelectedFeatures(features);
        
        // Handle Photos
         if (initialData.images && initialData.images.length > 0) {
            const initialPhotos = initialData.images.map((url: string, index: number) => ({
                id: `existing-${index}`,
                preview: url,
                isCover: index === 0, 
                rotation: 0,
            }));
            setPhotos(initialPhotos);
        }
    }
  }, [initialData]);

  // Perfect For (Single Select)
  const [perfectFor, setPerfectFor] = useState<string>("");

  // Track section completion
  useEffect(() => {
    const newCompleted = new Set<string>();
    if (selectedType) newCompleted.add("type");
    if (title) newCompleted.add("details");
    if (address) newCompleted.add("location");
    if (photos.length > 0) newCompleted.add("media");
    if (contactName) newCompleted.add("contact");
    setCompletedSections(newCompleted);
  }, [selectedType, title, address, photos.length, contactName]);

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [selectedType]);

  // Auto-fill contact info
  useEffect(() => {
    if (user) {
      if (!contactName)
        setContactName(
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.username ||
            ""
        );
      if (!contactEmail) setContactEmail(user.email || "");
      if (!contactPhone) setContactPhone(user.contactNumber || "");
    }
  }, [user]);

  const togglePerfectFor = (option: string) => {
    if (perfectFor === option) {
      setPerfectFor("");
    } else {
      setPerfectFor(option);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file), // Create local preview URL
        rotation: 0,
        isCover: photos.length === 0, // First photo is default cover
      }));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const startEditing = (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (photo) {
      setEditingId(id);
      setRotation(photo.rotation);
      setCrop({ x: 0, y: 0 });
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const saveEditedImage = async () => {
    if (!editingId || !croppedAreaPixels) return;

    try {
      const photo = photos.find(p => p.id === editingId);
      if (!photo) return;

      const croppedImage = await getCroppedImg(photo.preview, croppedAreaPixels, rotation);
      
      setPhotos(photos.map(p => {
        if (p.id === editingId) {
            // Revoke old URL to avoid memory leaks
            // URL.revokeObjectURL(p.preview); 
            return {
                ...p,
                preview: croppedImage,
                rotation: 0 // Reset rotation as it's baked into the new image
            };
        }
        return p;
      }));
      
      setEditingId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const setCover = (id: string) => {
    setPhotos(
      photos.map((p) => ({
        ...p,
        isCover: p.id === id,
      }))
    );
  };

  const handleUtilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      if (value === "Contact Manager") {
        setSelectedUtilities(["Contact Manager"]);
      } else {
        setSelectedUtilities(prev => {
           const filtered = prev.filter(u => u !== "Contact Manager");
           return [...filtered, value];
        });
      }
    } else {
      setSelectedUtilities(selectedUtilities.filter((u) => u !== value));
    }
  };

  const handleSelectAllUtilities = () => {
     const includedUtils = UTILITIES_LIST
       .filter(u => u.name !== "Contact Manager")
       .map(u => u.name);
     
     const allSelected = includedUtils.every(u => selectedUtilities.includes(u));
     
     if (allSelected) {
       setSelectedUtilities([]);
     } else {
       setSelectedUtilities(includedUtils);
     }
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (checked) {
      setSelectedFeatures([...selectedFeatures, name]);
    } else {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== name));
    }
  };

  const handleSaveDraft = async () => {
     // Placeholder for save draft functionality
     alert("Draft saved!");
  };

  const getMapSrc = (addr: string) => {
    if (!addr) return "";
    const query = encodeURIComponent(addr);
    return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert("Please login first.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      data.utilities = selectedUtilities;
      data.typeCode = selectedType;
      data.user_id = user.id;
      data.title = title;
      data.details = details;
      data.perfect_for = perfectFor;
      data.visible = true;
      data.rent = data.rent || 0;
      data.contact_name = contactName;
      data.contact_email = contactEmail;
      data.contact_number = contactPhone;
      data.building_type = buildingType;
      data.lease_start = leaseStart;
      data.lease_end = leaseEnd;
      data.lease_length = leaseDuration;
      data.rent_type = rentType; // Add rent_type to data

      const url = initialData 
        ? `http://localhost:8000/api/listings/update/${initialData.id}/`
        : "http://localhost:8000/api/listings/create/";
        
      const response = await fetch(url, {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        navigate("/landlord/dashboard");
      } else {
        const err = await response.json();
        alert(`Failed to ${initialData ? 'update' : 'create'} listing: ` + (err.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error creating listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { id: "type", label: "Type", icon: LayoutGrid },
    { id: "details", label: "Details", icon: Home },
    { id: "location", label: "Location", icon: MapPin },
    { id: "media", label: "Photos", icon: ImageIcon },
    { id: "amenities", label: "Features & Amenities", icon: Wifi },
    ...(selectedType === 3
      ? [{ id: "housemates", label: "Housemates", icon: Users }]
      : []),
    { id: "contact", label: "Contact", icon: User },
  ];

  const completionPercentage = Math.round(
    (completedSections.size / navItems.length) * 100
  );

  // Helper to get form element value safely
  const getFormValue = (id: string) => (document.getElementById('create-listing-form') as HTMLFormElement)?.[id]?.value;
  const getFormNumberValue = (id: string) => parseInt(getFormValue(id) || '0');

  return (
    <div className='min-h-screen bg-[#F5F7FA] text-stone-900 font-sans pb-20'>
      {/* Page Header */}
      <div className="pt-8 pb-6 px-4 md:px-8">
        <div className='w-full flex items-center gap-3'>
          <div>
            <h1 className='text-3xl font-serif font-bold text-stone-900'>
              {initialData ? "Update Listing" : "New Listing"}
            </h1>
            <p className="text-stone-500 mt-1">
              {initialData 
                ? "Edit your property listing details below" 
                : "Create a new property listing for prospective tenants"}
            </p>
          </div>
        </div>
      </div>

      <div className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm '>
        <div className='w-full px-4 md:px-8 flex items-center justify-between'>
          <div className='flex overflow-x-auto scrollbar-hide gap-1 py-1 mr-4'>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap outline-none",
                  activeSection === item.id
                    ? "border-orange-600 text-orange-700"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className='hidden md:flex bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
              >
                <Eye size={16} className="mr-2"/> Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                className='hidden md:flex bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
              >
                Save Draft
              </Button>
              <Button
                onClick={(e: any) =>
                  document
                    .getElementById("create-listing-form")
                    ?.dispatchEvent(
                      new Event("submit", { cancelable: true, bubbles: true })
                    )
                }
                size='sm'
                disabled={isSubmitting}
                className='bg-orange-600 hover:bg-orange-700 text-white shadow-sm font-bold hidden md:flex'
              >
                {isSubmitting ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  initialData ? "Update" : "Publish"
                )}
              </Button>
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 md:px-8 py-8 relative'>
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          id='create-listing-form'
          className='space-y-8'
        >
          {/* TYPE */}
          <section
            id='type'
            className='py-4 scroll-mt-32'
          >
            <h2 className='text-xl font-serif font-bold text-stone-900 mb-6'>
              Property Type
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {LISTING_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all cursor-pointer relative",
                    selectedType === t.id
                      ? `${t.border} ${t.bg} ring-1 ring-offset-1 ring-${t.color.split("-")[1]}-400 shadow-sm`
                      : "border-stone-200 bg-white shadow-sm hover:border-orange-300"
                  )}
                >
                  {selectedType === t.id && (
                    <div className='absolute top-3 right-3 w-3 h-3 rounded-full bg-current text-inherit' />
                  )}
                  <t.icon
                    size={32}
                    className={cn(
                      "mb-3",
                      selectedType === t.id ? t.color : "text-stone-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      selectedType === t.id ? "text-stone-900" : "text-stone-500"
                    )}
                  >
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* DETAILS */}
          <section
            id='details'
            className='py-4 scroll-mt-32'
          >
            <h2 className='text-xl font-serif font-bold text-stone-900 mb-6'>
              Property Details
            </h2>
            <div className='grid grid-cols-1 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-stone-700'>
                  Listing Title <span className='text-red-500'>*</span>
                </label>
                <input
                  required
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='e.g. Sunny 2-Bed near University'
                  className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                />
              </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div className='space-y-2 col-span-2 md:col-span-1'>
                    <label className='text-sm font-semibold text-stone-700'>
                      Monthly Rent
                    </label>
                    <div className='relative'>
                      <span className='absolute left-3 top-3 text-stone-400'>
                        $
                      </span>
                      <input
                        name='rent'
                        type='number'
                        className='w-full pl-8 px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                        placeholder='1200'
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='space-y-2 col-span-2 md:col-span-1'>
                    <label className='text-sm font-semibold text-stone-700'>
                      Rent Type
                    </label>
                    <select
                      name='rent_type'
                      value={rentType}
                      onChange={(e) => setRentType(e.target.value)}
                      className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                    >
                      <option value="total">Total / Month</option>
                      <option value="person">Per Person / Bed</option>
                    </select>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-stone-700'>
                      Beds
                    </label>
                  <input
                    name='beds'
                    type='number'
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                    placeholder='2'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Baths
                  </label>
                  <input
                    name='baths'
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                    placeholder='1.5'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Building Type
                  </label>
                  <select
                    name='building_type'
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value)}
                    className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Multi-Family">Multi-Family</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Lease Start
                  </label>
                  <div className="w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal px-4 py-3 h-auto rounded-lg border-stone-200 bg-white shadow-sm hover:bg-stone-50",
                            !leaseStart && "text-stone-400"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4 text-orange-500" />
                          {leaseStart ? format(parse(leaseStart, 'yyyy-MM-dd', new Date()), "PPP") : <span>Pick a start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={leaseStart ? parse(leaseStart, 'yyyy-MM-dd', new Date()) : undefined}
                          onSelect={(date) => setLeaseStart(date ? format(date, 'yyyy-MM-dd') : "")}
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={new Date().getFullYear() - 2}
                          toYear={new Date().getFullYear() + 10}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Lease End
                  </label>
                  <div className="w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal px-4 py-3 h-auto rounded-lg border-stone-200 bg-white shadow-sm hover:bg-stone-50",
                            !leaseEnd && "text-stone-400"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4 text-orange-500" />
                          {leaseEnd ? format(parse(leaseEnd, 'yyyy-MM-dd', new Date()), "PPP") : <span>Pick an end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={leaseEnd ? parse(leaseEnd, 'yyyy-MM-dd', new Date()) : undefined}
                          onSelect={(date) => setLeaseEnd(date ? format(date, 'yyyy-MM-dd') : "")}
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={new Date().getFullYear() - 2}
                          toYear={new Date().getFullYear() + 12}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Lease Duration (Months)
                  </label>
                  <input
                    type='number'
                    name="lease_length"
                    value={leaseDuration}
                    onChange={(e) => setLeaseDuration(e.target.value)}
                    placeholder='12'
                    className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                  />
                </div>
              </div>


              
              {/* Divider */}
              <div className="h-px bg-stone-200 my-2" />

              <div className='space-y-4'>
                <h3 className='text-sm font-semibold text-stone-900'>
                  Perfect For
                </h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                 
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-semibold text-stone-700'>
                  Description
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none min-h-[150px] resize-y'
                  placeholder='Describe your property...'
                />
              </div>
            </div>
          </section>

          {/* LOCATION */}
          <section
            id='location'
            className='py-4 scroll-mt-32'
          >
            <h2 className='text-xl font-bold text-stone-900 mb-6'>Location</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Full Address
                  </label>
                  <input
                    name='address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='123 Main St, Syracuse, NY'
                    className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                  />
                  <p className='text-xs text-stone-500'>
                    Map updates automatically as you type.
                  </p>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Zip Code
                  </label>
                  <input
                    name='zip'
                    className='w-full px-4 py-3 rounded-lg border border-stone-300 outline-none'
                    placeholder='13210'
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Unit / Apt #
                  </label>
                  <input
                    name='unit'
                    className='w-full px-4 py-3 rounded-lg border border-stone-300 outline-none'
                    placeholder='4B'
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
              </div>
              <div className='h-[300px] bg-stone-100 rounded-xl overflow-hidden border border-stone-200 relative shadow-inner'>
                {debouncedAddress ? (
                  <iframe
                    width='100%'
                    height='100%'
                    frameBorder='0'
                    className='grayscale-[20%] hover:grayscale-0 transition-all opacity-95 hover:opacity-100'
                    src={getMapSrc(debouncedAddress)}
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center text-stone-400 flex-col gap-2'>
                    <MapPin size={32} />
                    <span>Enter address to see map</span>
                  </div>
                )}
              </div>
            </div>
          </section>
            {/* MEDIA */}
          <section
            id='media'
            className='py-4 scroll-mt-32'
          >
            <h2 className='text-xl font-bold text-stone-900 mb-6'>Photos</h2>
            
            {/* Image Editor Modal */}
            <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
                <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white border-stone-200 shadow-2xl">
                    <div className="relative flex-1 bg-stone-100 w-full min-h-0">
                        {editingId && (
                            <Cropper
                                image={photos.find(p => p.id === editingId)?.preview}
                                crop={crop}
                                zoom={1}
                                rotation={rotation}
                                onCropChange={setCrop}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                            />
                        )}
                    </div>
                    
                    <div className="p-6 bg-white border-t border-stone-200 z-10">
                        <div className="flex flex-col gap-6">
                            
                             {/* Controls Row */}
                            <div className="flex flex-col sm:flex-row items-end justify-center gap-6">
                                {/* Rotation */}
                                <div className="space-y-3 w-full sm:w-auto">
                                    <label className="text-xs font-bold text-stone-500 uppercase">Rotation</label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setRotation((r) => r - 90)}
                                            className="h-9 px-3 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 border border-stone-200 w-full sm:w-auto"
                                        >
                                            <RotateCcw size={16} className="mr-2" /> -90°
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setRotation((r) => r + 90)}
                                            className="h-9 px-3 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 border border-stone-200 w-full sm:w-auto"
                                        >
                                            <RotateCw size={16} className="mr-2" /> +90°
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-2 border-t border-stone-100 mt-2">
                                 <Button 
                                    variant="ghost" 
                                    onClick={() => setEditingId(null)}
                                    className="text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                                 >
                                    Cancel
                                 </Button>
                                 <Button 
                                    onClick={saveEditedImage}
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6"
                                 >
                                    Save Changes
                                 </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className='space-y-6'>
              {/* Photo Grid (Now Above) */}
              {photos.length > 0 && (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in duration-300'>
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className='relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm'
                    >
                      <img
                        src={photo.preview}
                        className='w-full h-full object-cover transition-transform duration-300 ease-in-out'
                        style={{ transform: `rotate(${photo.rotation}deg)` }}
                        alt='Preview'
                      />

                      {/* Overlay */}
                      <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 backdrop-blur-[2px]'>
                        <div className='flex justify-end'>
                          <button
                            type='button'
                            onClick={() => removePhoto(photo.id)}
                            className='p-1.5 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm'
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className='flex gap-2 justify-center'>
                          <button
                            type='button'
                            onClick={() => startEditing(photo.id)}
                            className='px-3 py-1.5 bg-white/90 rounded-lg text-xs font-bold hover:bg-white flex items-center gap-1 shadow-sm text-stone-800'
                          >
                            <Crop size={12} /> Edit
                          </button>
                          <button
                            type='button'
                            onClick={() => setCover(photo.id)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-sm",
                              photo.isCover
                                ? "bg-orange-500 text-white"
                                : "bg-white/90 text-stone-800 hover:bg-white"
                            )}
                          >
                            <Star
                              size={12}
                              fill={photo.isCover ? "currentColor" : "none"}
                            />
                            {photo.isCover ? "Cover" : "Set Cover"}
                          </button>
                        </div>
                      </div>

                      {/* Cover Badge */}
                      {photo.isCover && (
                        <div className='absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded shadow-lg z-20'>
                          Cover Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Box (Now Below) */}
              <div className='border-2 border-dashed border-stone-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-stone-50 transition-all cursor-pointer relative group bg-white shadow-sm'>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handlePhotoUpload}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                />
                <div className='w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-stone-400 group-hover:text-orange-500 group-hover:scale-110 transition-all'>
                  <Upload size={28} />
                </div>
                <h3 className='text-lg font-semibold text-stone-900'>
                  Upload Photos
                </h3>
                <p className='text-stone-500 max-w-sm mt-2'>
                  Drag and drop up to 10 photos here, or click to browse. JPGE,
                  PNG supported.
                </p>
              </div>
            </div>
          </section>
          {/* AMENITIES */}
          <section
            id='amenities'
            className='py-4 scroll-mt-32'
          >
            <h2 className='text-xl font-bold text-stone-900 mb-6'>Features & Amenities</h2>
            <div className='space-y-8'>
              
              {/* Enhanced Features Grid */}
              <div>
                <h3 className='text-sm font-bold text-stone-900 uppercase tracking-wider mb-4'>
                  Property Features
                </h3>
                
                {/* Checkboxes for Boolean Features */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                   {[
                      { id: "dishwasher", label: "Dishwasher", icon: Droplets },
                      { id: "fireplace", label: "Fireplace", icon: Flame },
                      { id: "porch", label: "Porch / Deck", icon: Wind },
                      { id: "smoking", label: "Smoking Allowed", icon: Check },
                   ].map((amenity) => (
                    <label
                      key={amenity.id}
                      className='group flex items-center gap-4 p-4 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 hover:border-stone-300 transition-all has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50/10 shadow-sm bg-white'
                    >
                      <div className='w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:text-orange-600 group-hover:bg-orange-50 transition-colors group-has-[:checked]:bg-orange-100 group-has-[:checked]:text-orange-600'>
                        <amenity.icon size={20} />
                      </div>
                      <div>
                        <div className='font-semibold text-stone-900'>
                          {amenity.label}
                        </div>
                        <input
                          type='checkbox'
                          name={amenity.id}
                          value='Yes'
                          checked={selectedFeatures.includes(amenity.id)}
                          onChange={handleFeatureChange}
                          className='hidden'
                        />
                        <div className='text-xs text-stone-400 group-has-[:checked]:text-orange-600 font-medium'>
                          Select
                        </div>
                      </div>
                      <div className='ml-auto w-5 h-5 rounded-full border-2 border-stone-200 flex items-center justify-center group-has-[:checked]:bg-orange-500 group-has-[:checked]:border-orange-500 transition-all'>
                        <Check
                          size={12}
                          className='text-white opacity-0 group-has-[:checked]:opacity-100'
                        />
                      </div>
                    </label>
                  ))}
                </div>

                {/* Enhanced Features Selection */}
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8'>
                   {/* Laundry */}
                   <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-orange-200 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <Waves size={18} className="text-blue-500" />
                        <label className='font-bold text-stone-900'>Laundry</label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Free", "In-unit", "Shared", "Hookups", "None"].map(opt => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setLaundry(opt)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                              laundry === opt 
                                ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                   </div>

                   {/* Parking */}
                   <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-orange-200 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <Car size={18} className="text-stone-500" />
                        <label className='font-bold text-stone-900'>Parking</label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Garage", "Off-street", "Driveway", "Street", "None"].map(opt => (
                           <button
                             type="button"
                             key={opt}
                             onClick={() => setParking(opt)}
                             className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                               parking === opt 
                                 ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                                 : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                             )}
                           >
                             {opt}
                           </button>
                        ))}
                      </div>
                   </div>

                   {/* Pets */}
                   <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-orange-200 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <PawPrint size={18} className="text-orange-500" />
                        <label className='font-bold text-stone-900'>Pets</label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Allowed", "Cats Only", "Dogs Only", "Negotiable", "No", "2 Pets Max"].map(opt => (
                           <button
                             type="button"
                             key={opt}
                             onClick={() => setPets(opt)}
                             className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                               pets === opt 
                                 ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                                 : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                             )}
                           >
                             {opt}
                           </button>
                        ))}
                      </div>
                   </div>

                   {/* Furnished */}
                   <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-orange-200 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <Sofa size={18} className="text-purple-500" />
                        <label className='font-bold text-stone-900'>Furnished</label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Yes", "No", "Partially"].map(opt => (
                           <button
                             type="button"
                             key={opt}
                             onClick={() => setFurnished(opt)}
                             className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                               furnished === opt 
                                 ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                                 : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                             )}
                           >
                             {opt}
                           </button>
                        ))}
                      </div>
                   </div>

                   {/* AC */}
                   <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-orange-200 transition-colors md:col-span-2 xl:col-span-1">
                      <div className="flex items-center gap-2 mb-4">
                        <Wind size={18} className="text-red-400" />
                        <label className='font-bold text-stone-900'>Air Conditioning</label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {["Central", "Window Units", "Contact for info", "None"].map(opt => (
                           <button
                             type="button"
                             key={opt}
                             onClick={() => setAc(opt)}
                             className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                               ac === opt 
                                 ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                                 : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                             )}
                           >
                             {opt}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* Utilities Section */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                    <h3 className='text-sm font-bold text-stone-900 uppercase tracking-wider'>
                        Included Utilities
                    </h3>
                    <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllUtilities}
                        className="bg-white border-stone-200 text-orange-600 hover:text-orange-700 hover:bg-stone-50 hover:border-orange-200 text-xs h-8 px-3 font-bold transition-all shadow-sm rounded-lg flex items-center gap-1.5"
                    >
                        <CheckCircle2 size={12} />
                        {UTILITIES_LIST.filter(u => u.name !== "Contact Manager").every(u => selectedUtilities.includes(u.name)) 
                          ? "Unselect All" 
                          : "Select All Included"}
                    </Button>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
                  {UTILITIES_LIST.map((u) => (
                    <label
                      key={u.name}
                      className='group relative flex flex-col items-center justify-center p-4 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 hover:border-stone-300 transition-all has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50/10 shadow-sm bg-white'
                    >
                      <input
                        type='checkbox'
                        name='utilities'
                        value={u.name}
                        checked={selectedUtilities.includes(u.name)}
                        onChange={handleUtilityChange}
                        className='w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500 absolute opacity-0'
                      />
                      <div className='w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-1'>
                        <u.icon size={20} />
                      </div>
                      <span className='text-sm font-medium text-stone-700 text-center'>
                        {u.name}
                      </span>
                      <div className='absolute top-2 right-2'>
                        {selectedUtilities.includes(u.name) && (
                           <Check size={16} className='text-orange-500' />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </section>

         

          {/* HOUSEMATES */}
          {selectedType === 3 && (
            <section
              id='housemates'
              className='bg-white rounded-xl border border-stone-200 p-6 md:p-8 scroll-mt-32 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500'
            >
              <div className='flex items-center gap-2 mb-6 border-b border-stone-100 pb-4'>
                <Users className='text-orange-500' size={20} />
                <h2 className='text-xl font-bold text-stone-900'>
                  Housemate Preferences
                </h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Kitchen Cleanliness
                  </label>
                  <select
                    name='house_kitchen'
                    className='w-full px-4 py-3 rounded-lg border border-stone-300 outline-none bg-white'
                  >
                    <option value=''>Select...</option>
                    <option>Clean as you go</option>
                    <option>Clean daily</option>
                    <option>Clean weekly</option>
                    <option>Messy is okay</option>
                  </select>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Chores
                  </label>
                  <select
                    name='house_chores'
                    className='w-full px-4 py-3 rounded-lg border border-stone-300 outline-none bg-white'
                  >
                    <option value=''>Select...</option>
                    <option>Split evenly</option>
                    <option>Rotate</option>
                    <option>Hire cleaner</option>
                  </select>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    Current Household
                  </label>
                  <input
                    name='we_are'
                    className='w-full px-4 py-3 rounded-lg border border-stone-300 outline-none'
                    placeholder='e.g. 2 male students'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-stone-700'>
                    We Prefer
                  </label>
                  <input
                    name='we_prefer'
                    className='w-full px-4 py-3 rounded-lg border border-stone-300 outline-none'
                    placeholder='e.g. Quiet student'
                  />
                </div>
              </div>
            </section>
          )}

          {/* CONTACT */}
          <section
            id='contact'
            className='py-4 scroll-mt-32'
          >
            <h2 className='text-xl font-bold text-stone-900 mb-6'>
              Contact Info
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-stone-700'>
                  Name
                </label>
                <input
                  name='contact_name'
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-stone-700'>
                  Email
                </label>
                <input
                  name='contact_email'
                  type='email'
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-stone-700'>
                  Phone Number
                </label>
                <input
                  name='contact_number'
                  type='tel'
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className='w-full px-4 py-3 rounded-lg border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500/20 outline-none'
                />
              </div>
              <label className='flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer'>
                <input
                  type='checkbox'
                  name='textOk'
                  value='1'
                  className='w-5 h-5 rounded border-stone-300 text-orange-600 focus:ring-orange-500'
                />
                <div>
                  <span className='block text-sm font-semibold text-stone-800'>
                    Can receive text messages?
                  </span>
                  <span className='block text-xs text-stone-500'>
                    Tenants prefer texting over calls.
                  </span>
                </div>
              </label>
            </div>
          </section>

          {/* Hidden inputs for PreviewModal to read */}
          <input type="hidden" name="laundry" value={laundry} />
          <input type="hidden" name="parking" value={parking} />
          <input type="hidden" name="pets" value={pets} />
          <input type="hidden" name="furnished" value={furnished} />
          <input type="hidden" name="ac" value={ac} />
          
          <div className='flex justify-end pt-6 pb-20 p-4 md:hidden'>
            <Button
              type='submit'
              size='lg'
              disabled={isSubmitting}
              className='bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 font-bold px-8 w-full'
            >
              {isSubmitting 
                ? (initialData ? "Updating..." : "Publishing...") 
                : (initialData ? "Update Listing" : "Publish Listing")}
            </Button>
          </div>
        </form>
        
        {showPreview && (
            <PreviewModal 
                onClose={() => setShowPreview(false)}
                formRef={formRef}
                photoPreviewUrls={photos.map(p => p.preview)}
                selectedType={selectedType}
                address={address}
                city="Syracuse" // Default city
                zip={getFormValue('zip')}
                description={details}
            />
        )}

      </div>
    </div>
  );
}
