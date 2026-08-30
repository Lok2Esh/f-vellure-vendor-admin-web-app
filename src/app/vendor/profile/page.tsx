"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getCurrentVendor, updateVendorProfile } from "@/lib/vendorStore";
import { VendorAccount } from "@/lib/mockData";
import { 
  Store, 
  MapPin, 
  IndianRupee, 
  Users, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Clock, 
  Tag,
  Phone,
  Mail,
  Camera,
  Layers,
  Award,
  Star
} from "lucide-react";

const CATEGORIES = [
  "VENUE",
  "CATERING",
  "PHOTOGRAPHY",
  "DECOR",
  "MAKEUP",
  "ENTERTAINMENT",
  "PLANNING",
  "PRIEST",
];

const CITIES = ["Patiala", "Chandigarh", "Ludhiana", "Amritsar", "Delhi NCR", "Jaipur", "Udaipur", "Goa"];

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState<VendorAccount | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("VENUE");
  const [city, setCity] = useState("Patiala");
  const [locality, setLocality] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceRadiusKm, setServiceRadiusKm] = useState(50);
  const [basePrice, setBasePrice] = useState(150000);
  const [priceType, setPriceType] = useState<any>("PER_EVENT");
  const [capacityMin, setCapacityMin] = useState(200);
  const [capacityMax, setCapacityMax] = useState(1500);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenityInput, setNewAmenityInput] = useState("");
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const v = getCurrentVendor();
    setVendor(v);
    setBusinessName(v.businessName || "");
    setCategory(v.category || "VENUE");
    setCity(v.city || "Patiala");
    setLocality(v.locality || "");
    setPhone(v.phone || "");
    setEmail(v.email || "");
    setServiceRadiusKm(v.serviceRadiusKm || 50);
    setBasePrice(v.basePrice || 150000);
    setPriceType(v.priceType || "PER_EVENT");
    setCapacityMin(v.capacityMin || 100);
    setCapacityMax(v.capacityMax || 1500);
    setBio(v.bio || "");
    setAvatarUrl(v.avatarUrl || "");
    setBannerUrl(v.bannerUrl || "");
    setAmenities(v.amenities || []);
    setPackages(v.packages || []);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;
    setSaving(true);
    setMessage(null);

    try {
      const updated = updateVendorProfile(
        {
          businessName,
          category,
          city,
          locality,
          phone,
          email,
          serviceRadiusKm: Number(serviceRadiusKm),
          basePrice: Number(basePrice),
          priceType,
          capacityMin: Number(capacityMin),
          capacityMax: Number(capacityMax),
          bio,
          avatarUrl,
          bannerUrl,
          amenities,
          packages,
        },
        vendor.id
      );

      setVendor(updated);
      setMessage({ text: "Atelier business profile & services updated successfully!", type: "success" });
    } catch {
      setMessage({ text: "Failed to update profile. Please check inputs.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAmenity = () => {
    if (newAmenityInput.trim() && !amenities.includes(newAmenityInput.trim())) {
      setAmenities([...amenities, newAmenityInput.trim()]);
      setNewAmenityInput("");
    }
  };

  const handleRemoveAmenity = (name: string) => {
    setAmenities(amenities.filter((a) => a !== name));
  };

  const handleAddPackage = () => {
    const newPkg = {
      id: `pkg_${Date.now()}`,
      name: "Bespoke Royal Package",
      price: basePrice * 1.5,
      priceType,
      guestCount: 500,
      description: "Comprehensive celebration coverage tailored for grand celebrations.",
      inclusions: ["Dedicated Crew Lead", "Custom Thematic Design", "Complete Setup & Teardown"],
      exclusions: ["Taxes & Travel Outside City"],
    };
    setPackages([...packages, newPkg]);
  };

  const handleRemovePackage = (pkgId: string) => {
    setPackages(packages.filter((p) => p.id !== pkgId));
  };

  const handlePackageChange = (idx: number, field: string, val: any) => {
    const next = [...packages];
    next[idx][field] = val;
    setPackages(next);
  };

  if (!vendor) return null;

  return (
    <DashboardLayout allowedRoles={["VENDOR"]}>
      <form onSubmit={handleSave} className="space-y-6">
        {/* ──── TOP HEADER & ACTIONS ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
              Business Profile & Services Manager
            </h1>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Manage your atelier description, pricing models, service packages, and amenities
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <Save className="size-3.5" />
              {saving ? "Saving Changes..." : "Save Live Profile"}
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-3.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-[#EBF8F2] text-[#287857] border-[#C3ECD8]'
              : 'bg-[#FDEDF0] text-[#B63A4A] border-[#F8CCD3]'
          }`}>
            <CheckCircle2 className="size-4" />
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ──── MAIN FORM (8 cols) ──── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Business Identity & Contact */}
            <div className="bg-white p-6 rounded-2xl border border-[#EFE3CF] space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5 pb-2 border-b border-[#F7EFE4]">
                <Store className="size-4" />
                1. Atelier Identity & Contact
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Atelier / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none focus:border-[#641E3D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Specialist Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none focus:border-[#641E3D]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Operating City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none focus:border-[#641E3D]"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Locality / Precinct
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Model Town / Heritage Fort Rd"
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none focus:border-[#641E3D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Service Radius (km)
                  </label>
                  <input
                    type="number"
                    value={serviceRadiusKm}
                    onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none focus:border-[#641E3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Official Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Inquiry Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                  Atelier Story & Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-medium text-[#2A121E] outline-none focus:border-[#641E3D]"
                />
              </div>
            </div>

            {/* Section 2: Pricing Benchmark & Capacity */}
            <div className="bg-white p-6 rounded-2xl border border-[#EFE3CF] space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5 pb-2 border-b border-[#F7EFE4]">
                <IndianRupee className="size-4" />
                2. Pricing Benchmark & Capacity Scaling
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Starting Benchmark Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Pricing Benchmark Type
                  </label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
                  >
                    <option value="PER_EVENT">/ Per Event</option>
                    <option value="PER_DAY">/ Per Day</option>
                    <option value="PER_PLATE">/ Per Plate</option>
                    <option value="FIXED">Fixed Flat Rate</option>
                    <option value="STARTING_PRICE">Starting Rate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Minimum Guests
                  </label>
                  <input
                    type="number"
                    value={capacityMin}
                    onChange={(e) => setCapacityMin(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Maximum Capacity
                  </label>
                  <input
                    type="number"
                    value={capacityMax}
                    onChange={(e) => setCapacityMax(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Bespoke Service Packages / Tiers */}
            <div className="bg-white p-6 rounded-2xl border border-[#EFE3CF] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F7EFE4]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5">
                  <Layers className="size-4" />
                  3. Service Packages & Tiers ({packages.length})
                </p>
                <button
                  type="button"
                  onClick={handleAddPackage}
                  className="px-3 py-1 rounded-lg bg-[#FAF5EC] border border-[#EFE3CF] text-[11px] font-bold text-[#641E3D] hover:bg-[#F3EADB]"
                >
                  + Add Package Tier
                </button>
              </div>

              <div className="space-y-4">
                {packages.map((pkg, idx) => (
                  <div key={pkg.id || idx} className="p-4 bg-[#FCFAF6] border border-[#EFE3CF] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => handlePackageChange(idx, "name", e.target.value)}
                        placeholder="Package Name (e.g. Royal Gold Suite)"
                        className="font-bold text-xs bg-white px-3 py-1.5 border border-[#EFE3CF] rounded-lg text-[#2A121E] flex-1 mr-2"
                      />
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handlePackageChange(idx, "price", Number(e.target.value))}
                        placeholder="Price ₹"
                        className="w-28 font-bold text-xs bg-white px-3 py-1.5 border border-[#EFE3CF] rounded-lg text-[#641E3D] mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePackage(pkg.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={pkg.description}
                      onChange={(e) => handlePackageChange(idx, "description", e.target.value)}
                      placeholder="Scope and description of this package..."
                      className="w-full text-xs bg-white px-3 py-1.5 border border-[#EFE3CF] rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Key Amenities & Highlight Tags */}
            <div className="bg-white p-6 rounded-2xl border border-[#EFE3CF] space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5 pb-2 border-b border-[#F7EFE4]">
                <Sparkles className="size-4" />
                4. Key Amenities & Features
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAmenityInput}
                  onChange={(e) => setNewAmenityInput(e.target.value)}
                  placeholder="Add amenity (e.g. Valet Parking, Drone Pilot, 4K Rig)..."
                  className="flex-1 px-3.5 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="px-4 py-2 bg-[#641E3D] text-white text-xs font-bold rounded-xl"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {amenities.map((am) => (
                  <span
                    key={am}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#EFE3CF] text-xs font-bold text-[#641E3D]"
                  >
                    {am}
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(am)}
                      className="text-gray-400 hover:text-red-500 ml-1 text-xs"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ──── SIDEBAR: LIVE CUSTOMER APP PREVIEW (4 cols) ──── */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7A70] flex items-center gap-1">
                  <Eye className="size-3.5 text-[#641E3D]" />
                  Live Customer Mobile Preview
                </span>
                <span className="text-[9px] text-[#287857] font-bold">Real-time sync</span>
              </div>

              {/* Mobile Phone Mockup Frame */}
              <div className="bg-white rounded-3xl border-4 border-[#2A121E] shadow-2xl p-3.5 space-y-3 max-w-[320px] mx-auto">
                {/* Simulated Image Slider */}
                <div className="h-36 w-full rounded-2xl bg-[#2A121E] overflow-hidden relative">
                  <img
                    src={bannerUrl || "https://images.unsplash.com/photo-1545232979-fbf678ab2659?w=800"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[8.5px] font-extrabold uppercase tracking-wider text-[#641E3D]">
                    {category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#EBF8F2] text-[#287857] text-[8.5px] font-bold">
                    ✓ Verified
                  </div>
                </div>

                {/* Body Copy */}
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#2A121E] truncate">
                    {businessName || "Your Atelier Name"}
                  </h3>
                  <p className="text-[10px] text-[#786B70] flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3 text-[#8A6A23]" />
                    {city} {locality ? `• ${locality}` : ''}
                  </p>
                </div>

                {/* Rating & Capacity */}
                <div className="flex items-center justify-between text-[10px] bg-[#FAF5EC] p-2 rounded-xl border border-[#EFE3CF]">
                  <div className="flex items-center gap-1 font-bold text-[#2A121E]">
                    <Star className="size-3 text-[#D2AD6B] fill-[#D2AD6B]" />
                    4.9 (48)
                  </div>
                  <div className="text-[#641E3D] font-bold">
                    {capacityMax} Max Guests
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-1 border-t border-[#F7EFE4]">
                  <div>
                    <span className="text-[8.5px] text-[#8A7A70] uppercase font-bold block">Starting at</span>
                    <span className="font-bold text-sm text-[#641E3D]">
                      ₹{Number(basePrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#641E3D] text-white text-[10px] font-bold">
                    + Package
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
