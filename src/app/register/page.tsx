"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { setAuthSession, getRedirectPath } from "@/lib/auth";
import { updateVendorProfile } from "@/lib/vendorStore";
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Briefcase, 
  Store, 
  MapPin, 
  IndianRupee, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight
} from "lucide-react";

const CATEGORIES = [
  { value: "VENUE", label: "Palace / Luxury Venue" },
  { value: "CATERING", label: "Gourmet Catering & Kitchen" },
  { value: "PHOTOGRAPHY", label: "Candid Cinema & Photography" },
  { value: "DECOR", label: "Floral & Stage Architecture" },
  { value: "MAKEUP", label: "Bridal Makeup & Styling" },
  { value: "ENTERTAINMENT", label: "Sangeet DJ & Concert Band" },
  { value: "PLANNING", label: "Wedding Specialist & Planner" },
  { value: "PRIEST", label: "Ceremonial Vedic Priest" },
];

const CITIES = ["Patiala", "Chandigarh", "Ludhiana", "Amritsar", "Delhi NCR", "Jaipur", "Udaipur", "Goa"];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    category: "VENUE",
    city: "Patiala",
    basePrice: 150000,
    priceType: "PER_EVENT" as "PER_PLATE" | "PER_DAY" | "PER_EVENT" | "FIXED" | "STARTING_PRICE",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Attempt API Registration
      let userObj = {
        id: `v_new_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: "VENDOR" as const,
      };
      let token = `token_${Date.now()}`;

      try {
        const response = await api.post("/users/register", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "VENDOR",
        });
        token = response.data.token;
        userObj = response.data.user;
      } catch {
        // Fallback local registration
      }

      // 2. Initialize in Vendor Store
      const newVendor = updateVendorProfile(
        {
          id: userObj.id,
          name: formData.name,
          email: formData.email,
          businessName: formData.businessName || `${formData.name}'s Atelier`,
          category: formData.category,
          city: formData.city,
          phone: formData.phone,
          role: "VENDOR",
          status: "PENDING",
          basePrice: Number(formData.basePrice) || 50000,
          priceType: formData.priceType,
          serviceRadiusKm: 100,
          bio: formData.bio || "Crafting bespoke celebration experiences.",
          amenities: ["Verified Partnership", "Dedicated Concierge Support"],
          packages: [],
        },
        userObj.id
      );

      // 3. Set Auth Session
      setAuthSession(token, {
        id: newVendor.id,
        name: newVendor.businessName,
        email: newVendor.email,
        role: "VENDOR",
      });

      router.push("/vendor/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please review your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-12 bg-[#FAF7F2] text-[#2A121E]">
      {/* ──── LEFT BRAND PANEL (4 cols) ──── */}
      <div className="hidden lg:flex lg:col-span-4 flex-col justify-between p-10 bg-[#1F0E17] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#D2AD6B_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-[#641E3D]/40 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl border border-[#D2AD6B]/40 bg-[#D2AD6B]/10 text-[#D2AD6B]">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h1 className="text-xl font-serif font-bold text-white tracking-tight">Vellure</h1>
              <p className="text-[8.5px] uppercase tracking-[0.3em] text-[#D2AD6B] font-bold mt-0.5">
                Partner Atelier Onboarding
              </p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 py-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#E8CF9F]">
            <ShieldCheck className="size-3.5" />
            Partner Privileges
          </div>

          <h2 className="font-serif text-2xl font-normal text-white/95 leading-snug">
            Join the most exclusive wedding network in India.
          </h2>

          <div className="space-y-3.5 text-xs text-white/75">
            <div className="flex items-start gap-2.5">
              <span className="text-[#D2AD6B] font-bold mt-0.5">01</span>
              <p><b>Direct High-Budget Inquiries:</b> Connect with verified couples building custom suites.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-[#D2AD6B] font-bold mt-0.5">02</span>
              <p><b>Dynamic Pricing Benchmarks:</b> Let couples calculate live guest costs and packages.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-[#D2AD6B] font-bold mt-0.5">03</span>
              <p><b>Collaborator Network:</b> Cross-tag partner venues, photographers, and decorators.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-white/50 border-t border-white/10 pt-4">
          All applications undergo concierge verification within 24 hours.
        </div>
      </div>

      {/* ──── RIGHT ONBOARDING FORM (8 cols) ──── */}
      <div className="lg:col-span-8 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A121E]">
              Register Your Business Atelier
            </h2>
            <p className="mt-1 text-xs text-[#786B70] font-medium">
              Create your multi-vendor account to publish your portfolio and receive bespoke wedding inquiries
            </p>
          </div>

          {error && (
            <div className="bg-[#FDEDF0] text-[#B63A4A] p-3.5 rounded-xl text-xs font-semibold border border-[#F8CCD3]">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#EFE3CF] space-y-6">
            {/* Section 1: Lead Representative */}
            <div className="space-y-3">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5 pb-2 border-b border-[#F7EFE4]">
                <User className="size-3.5" />
                1. Account Credentials & Contact
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D]"
                    placeholder="e.g. Gurpreet Singh / Rohan Roy"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Official Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Official Inquiry Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D]"
                    placeholder="concierge@myatelier.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Secure Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D]"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Business Profile */}
            <div className="space-y-3 pt-2">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5 pb-2 border-b border-[#F7EFE4]">
                <Store className="size-3.5" />
                2. Business Profile & Service Category
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Brand / Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D]"
                    placeholder="e.g. Fort Patiala Royal Heritage"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Primary City
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D]"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Specialist Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                    Starting Benchmark Rate (₹)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                      className="w-2/3 px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D]"
                      placeholder="150000"
                    />
                    <select
                      value={formData.priceType}
                      onChange={(e) => setFormData({ ...formData, priceType: e.target.value as any })}
                      className="w-1/3 px-2 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-[10.5px] font-bold text-[#2A121E] outline-none"
                    >
                      <option value="PER_EVENT">/ Event</option>
                      <option value="PER_DAY">/ Day</option>
                      <option value="PER_PLATE">/ Plate</option>
                      <option value="FIXED">Fixed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                  Atelier Bio / Story
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your craft, luxury equipment, heritage story, and celebration specializations..."
                  className="w-full px-3.5 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-medium text-[#2A121E] outline-none focus:border-[#641E3D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#641E3D]/10 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating Workspace & Profile...
                </>
              ) : (
                <>
                  Complete Registration & Launch Atelier
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[#786B70] font-medium">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-[#641E3D] hover:underline">
              Sign in to your concierge portal →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
