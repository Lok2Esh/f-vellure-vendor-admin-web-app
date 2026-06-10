"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { 
  UserCircle, 
  Store, 
  MapPin, 
  Wallet, 
  Tag, 
  Loader2, 
  Save, 
  ShieldCheck, 
  MessageSquare
} from "lucide-react";

interface ProfileData {
  businessName: string;
  category: string;
  city: string;
  basePrice: number;
  priceType: "PER_PLATE" | "PER_DAY" | "PER_EVENT" | "FIXED";
}

export default function VendorProfile() {
  const [formData, setFormData] = useState<ProfileData>({
    businessName: "",
    category: "CATERING",
    city: "Patiala",
    basePrice: 0,
    priceType: "PER_PLATE",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/vendors/profile");
        const { businessName, category, city, basePrice, priceType } = response.data;
        setFormData({ businessName, category, city, basePrice, priceType });
      } catch (err: any) {
        if (err.response?.status === 404) {
          setIsNewProfile(true);
        } else {
          console.error("Failed to fetch profile", err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      if (isNewProfile) {
        await api.post("/vendors/profile", formData);
        setIsNewProfile(false);
        setMessage({ text: "Profile created successfully. Status: PENDING verification.", type: "success" });
      } else {
        await api.put("/vendors/profile", formData);
        setMessage({ text: "Profile updated successfully. Your changes are live.", type: "success" });
      }
    } catch (err: any) {
      setMessage({ text: err.response?.data?.error || "Failed to update profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["VENDOR"]}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-burgundy" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={["VENDOR"]}>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Business Profile</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage how your luxury brand appears to potential clients</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            <ShieldCheck className="w-5 h-5" />
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="luxury-card space-y-6">
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Legal Business Name</label>
                <div className="relative group">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                  <input
                    type="text" required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy font-medium transition-all"
                    placeholder="Grand Palace Decorators"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Service Category</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy font-medium appearance-none transition-all scroll-smooth"
                    >
                      {["VENUE", "CATERING", "DECOR", "PHOTOGRAPHY", "MAKEUP", "ENTERTAINMENT", "PRIEST", "MISC"].map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Base Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                    <input
                      type="text" required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy font-medium transition-all"
                      placeholder="e.g., Patiala"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Base Pricing (₹)</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-gold transition-colors">₹</span>
                    <input
                      type="number" required
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy font-medium transition-all"
                      placeholder="1200"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Pricing Model</label>
                  <div className="relative group">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                    <select
                      value={formData.priceType}
                      onChange={(e) => setFormData({ ...formData, priceType: e.target.value as any })}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy font-medium appearance-none transition-all"
                    >
                      <option value="PER_PLATE">Per Plate</option>
                      <option value="PER_DAY">Per Day</option>
                      <option value="PER_EVENT">Per Event</option>
                      <option value="FIXED">Fixed Fee</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-burgundy text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-burgundy/20 hover:-translate-y-0.5 transition-all"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Brand Details</>}
            </button>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
            <div className="luxury-card bg-burgundy text-white border-none shadow-xl shadow-burgundy/10">
               <div className="flex justify-between items-start mb-6">
                 <div className="p-3 bg-white/10 rounded-xl">
                   <ShieldCheck className="w-6 h-6 text-gold" />
                 </div>
                 <span className="text-[10px] font-bold bg-gold/20 text-gold px-2 py-0.5 rounded uppercase tracking-widest">Premium</span>
               </div>
               <h4 className="text-xl font-serif font-bold mb-3">Excellence Score</h4>
               <p className="text-sm text-white/70 leading-relaxed italic">
                 "Our AI verifies profile completeness every 24 hours. A complete profile with high-quality pricing data ranks 3x higher in the user app."
               </p>
            </div>

            <div className="luxury-card">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-5 h-5 text-gold" />
                <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-400">Concierge Help</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Need help adjusting your category? Our support team can assist with high-tier classification.
              </p>
              <button className="text-xs font-bold text-burgundy mt-4 hover:underline">
                Contact Support
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
