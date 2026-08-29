"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  Users,
  MapPin,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  Tag,
  HeartHandshake,
  Search,
} from "lucide-react";

interface Collaborator {
  vendorId?: string;
  name: string;
  category?: string;
  role?: string;
  isRegistered?: boolean;
}

interface PortfolioItem {
  id?: string;
  title: string;
  eventType?: string;
  venue?: string;
  city?: string;
  date?: string;
  budget?: number;
  guestCount?: number;
  scope?: string;
  imageUrl?: string;
  images?: string[];
  collaborators?: Collaborator[];
}

const REGISTERED_PARTNERS_LIST = [
  { id: "v1", name: "Fort Patiala Royal Heritage", category: "VENUE", role: "Venue Partner" },
  { id: "v2", name: "Ranbaas The Palace", category: "VENUE", role: "Palace Venue" },
  { id: "v3", name: "The Oberoi Sukhvilas", category: "VENUE", role: "Luxury Resort" },
  { id: "p1", name: "Rohan Roy Candid Studios", category: "PHOTOGRAPHY", role: "Candid & Cinema Lead" },
  { id: "p2", name: "Bansal Creations Cinematic", category: "PHOTOGRAPHY", role: "Cinematography" },
  { id: "c1", name: "Bhogal Caterers & Royal Kitchen", category: "CATERING", role: "Royal Cuisine Feast" },
  { id: "d1", name: "Flora Belle Luxury Decor", category: "DECOR", role: "Floral Mandap & Stage" },
  { id: "m1", name: "Glam Studio by Simran", category: "MAKEUP", role: "Bridal Makeup" },
  { id: "e1", name: "DJ Sunny Sound & Stage Lights", category: "ENTERTAINMENT", role: "Sangeet DJ & Concert Setup" },
];

export default function VendorPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("Grand Wedding");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("Patiala");
  const [date, setDate] = useState("Nov 2025");
  const [budget, setBudget] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [scope, setScope] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1545232979-fbf678ab2659?w=800",
  ]);

  // Collabs Form State
  const [collabMode, setCollabMode] = useState<"APP" | "MANUAL">("APP");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualCategory, setManualCategory] = useState("DECOR");
  const [manualRole, setManualRole] = useState("");

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await api.get("/vendors/profile");
        if (response.data && Array.isArray(response.data.portfolio) && response.data.portfolio.length > 0) {
          setItems(response.data.portfolio);
        } else {
          // Demo items for preview
          setItems([
            {
              id: "demo_1",
              title: "Royal Courtyard Evening Setup",
              eventType: "Grand Wedding",
              venue: "Fort Patiala",
              city: "Patiala",
              date: "Nov 2025",
              budget: 1800000,
              guestCount: 650,
              scope: "Complete courtyard transformation with floral mandap, vintage chandeliers, and red carpet entrance.",
              imageUrl: "https://images.unsplash.com/photo-1545232979-fbf678ab2659?w=800",
              images: [
                "https://images.unsplash.com/photo-1545232979-fbf678ab2659?w=800",
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
              ],
              collaborators: [
                { vendorId: "p1", name: "Rohan Roy Candid Studios", category: "PHOTOGRAPHY", role: "Candid Cinema", isRegistered: true },
                { vendorId: "c1", name: "Bhogal Caterers", category: "CATERING", role: "Gourmet Pure Veg Banquet", isRegistered: true },
                { name: "Flora Belle Luxury Decor", category: "DECOR", role: "Mandap & Chandeliers", isRegistered: false },
              ],
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load portfolio", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setImages((prev) => [...prev, imageInput.trim()]);
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAppVendor = (v: (typeof REGISTERED_PARTNERS_LIST)[0]) => {
    if (collaborators.some((c) => c.vendorId === v.id || c.name === v.name)) return;
    setCollaborators((prev) => [
      ...prev,
      { vendorId: v.id, name: v.name, category: v.category, role: v.role, isRegistered: true },
    ]);
  };

  const handleAddManualVendor = () => {
    if (!manualName.trim()) return;
    setCollaborators((prev) => [
      ...prev,
      {
        name: manualName.trim(),
        category: manualCategory,
        role: manualRole.trim() || `${manualCategory} Specialist`,
        isRegistered: false,
      },
    ]);
    setManualName("");
    setManualRole("");
  };

  const handleRemoveCollab = (index: number) => {
    setCollaborators((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveItem = async () => {
    if (!title.trim()) return;
    setSaving(true);

    const newItem: PortfolioItem = {
      id: `port_${Date.now()}`,
      title: title.trim(),
      eventType: eventType.trim(),
      venue: venue.trim() || "Grand Estate",
      city: city.trim() || "Patiala",
      date: date.trim() || "Recent Event",
      budget: budget ? Number(budget) : 1500000,
      guestCount: guestCount ? Number(guestCount) : 400,
      scope: scope.trim() || "Full event design, styling, and coordination deliverables.",
      imageUrl: images[0] || "",
      images: images.length > 0 ? images : undefined,
      collaborators,
    };

    try {
      if (images[0]) {
        await api.post("/vendors/portfolio", {
          imageUrl: images[0],
          title: title.trim(),
        });
      }
    } catch (_) {}

    setItems((prev) => [newItem, ...prev]);
    setSaving(false);
    setShowModal(false);

    // Reset Form
    setTitle("");
    setVenue("");
    setScope("");
    setCollaborators([]);
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
      <div className="max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">Work History & Portfolio</h1>
            <p className="text-gray-500 mt-2 font-medium">
              Showcase verified celebrations, photo collages, and credited vendor collaborations
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 border border-burgundy bg-burgundy text-white px-5 py-3 rounded-xl font-bold shadow-md shadow-burgundy/15 hover:bg-[#5f0d2e] hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Celebration Case Study
          </button>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => {
            const cardImages = item.images && item.images.length > 0 ? item.images : item.imageUrl ? [item.imageUrl] : [];
            const collabs = item.collaborators || [];

            return (
              <div key={item.id || idx} className="luxury-card overflow-hidden p-0 border border-gray-100 flex flex-col bg-white">
                {/* Images Collage Header */}
                <div className="relative h-56 bg-gray-100 flex overflow-hidden">
                  {cardImages.length > 0 ? (
                    <div className="w-full h-full flex gap-1">
                      <div className="flex-1 relative">
                        <img src={cardImages[0]} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute left-3 bottom-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-3 h-3 text-gold" />
                          Featured Work
                        </div>
                      </div>
                      {cardImages.length > 1 && (
                        <div className="w-1/3 flex flex-col gap-1">
                          {cardImages.slice(1, 3).map((img, i) => (
                            <div key={i} className="flex-1 relative overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  {cardImages.length > 1 && (
                    <div className="absolute right-3 bottom-3 bg-burgundy/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {cardImages.length} Photos
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{item.eventType || "Grand Celebration"}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md uppercase">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  {/* 4 Metric Chips */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-burgundy shrink-0" />
                      <span className="truncate font-medium">{item.venue || item.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-burgundy shrink-0" />
                      <span className="font-medium">{item.date || "Recent"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-3.5 h-3.5 text-burgundy shrink-0" />
                      <span className="font-medium">{item.guestCount ? `${item.guestCount} guests` : "400 guests"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <IndianRupee className="w-3.5 h-3.5 text-burgundy shrink-0" />
                      <span className="font-medium">₹{item.budget?.toLocaleString("en-IN") || "15,00,000"}</span>
                    </div>
                  </div>

                  {/* Collaborators Preview */}
                  {collabs.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <HeartHandshake className="w-3.5 h-3.5 text-burgundy" />
                          Celebration Collabs ({collabs.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {collabs.map((c, i) => (
                          <span
                            key={i}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 ${
                              c.isRegistered ? "bg-green-50 border-green-100 text-green-800" : "bg-gray-50 border-gray-100 text-gray-700"
                            }`}
                          >
                            <span className="font-bold">{c.name}</span>
                            <span className="text-[10px] text-gray-400">({c.role || c.category})</span>
                            {c.isRegistered && <Sparkles className="w-2.5 h-2.5 text-green-600" />}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scope */}
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                    {item.scope || "Complete setup, styling, and coordination deliverables."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Add Case Study */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-gray-100 my-8">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">Add Celebration Case Study</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Showcase your delivered celebrations with photo collage and partner credits</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1">
                {/* 1. Event Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">1. Celebration Info</h4>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Celebration Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Royal Courtyard Evening Setup"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-burgundy font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Event Type</label>
                      <input
                        type="text"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        placeholder="Grand Wedding"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-burgundy font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Event Date</label>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Nov 2025"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-burgundy font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Venue & Location</label>
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="Fort Patiala"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-burgundy font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Guest Scale & Budget</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          placeholder="Guests"
                          className="w-full px-2.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-burgundy font-medium"
                        />
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="₹ Budget"
                          className="w-full px-2.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-burgundy font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Scope of Work & Deliverables</label>
                    <textarea
                      rows={2}
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                      placeholder="Describe the floral mandap, lighting, decor themes, and deliverables..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-burgundy font-medium"
                    />
                  </div>
                </div>

                {/* 2. Photo URLs */}
                <div className="space-y-3 pt-2 border-t">
                  <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">2. Showcase Photos (Collage)</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-burgundy"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-burgundy text-white rounded-xl text-xs font-bold hover:bg-[#5f0d2e]"
                    >
                      Add Photo
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                        <ImageIcon className="w-3 h-3 text-gold" />
                        <span className="max-w-[200px] truncate">{img}</span>
                        <button type="button" onClick={() => handleRemoveImage(i)} className="text-red-500 ml-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Vendor Collaborations */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">3. Vendor Collaborations (Crew)</h4>
                    <div className="flex bg-gray-100 p-1 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setCollabMode("APP")}
                        className={`px-2.5 py-1 rounded-md transition-all ${collabMode === "APP" ? "bg-burgundy text-white" : "text-gray-600"}`}
                      >
                        Platform Partners
                      </button>
                      <button
                        type="button"
                        onClick={() => setCollabMode("MANUAL")}
                        className={`px-2.5 py-1 rounded-md transition-all ${collabMode === "MANUAL" ? "bg-burgundy text-white" : "text-gray-600"}`}
                      >
                        Manual Entry
                      </button>
                    </div>
                  </div>

                  {/* Added Collaborators Chips */}
                  {collaborators.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {collaborators.map((c, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-gold/10 border border-gold/20 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium">
                          <HeartHandshake className="w-3 h-3 text-gold" />
                          <span>{c.name} ({c.role || c.category})</span>
                          <button type="button" onClick={() => handleRemoveCollab(i)} className="text-red-500 ml-1">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {collabMode === "APP" ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={partnerSearchQuery}
                          onChange={(e) => setPartnerSearchQuery(e.target.value)}
                          placeholder="Search partners by name, category or city..."
                          className="w-full pl-8 pr-8 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:border-burgundy"
                        />
                        {partnerSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setPartnerSearchQuery("")}
                            className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {REGISTERED_PARTNERS_LIST.filter((pv) => {
                          if (!partnerSearchQuery.trim()) return true;
                          const q = partnerSearchQuery.toLowerCase().trim();
                          return (
                            pv.name.toLowerCase().includes(q) ||
                            pv.role.toLowerCase().includes(q) ||
                            pv.category.toLowerCase().includes(q)
                          );
                        }).map((pv) => {
                          const isAdded = collaborators.some((c) => c.vendorId === pv.id);
                          return (
                            <button
                              key={pv.id}
                              type="button"
                              onClick={() => handleAddAppVendor(pv)}
                              className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                                isAdded ? "bg-green-50 border-green-200 text-green-800" : "bg-gray-50 border-gray-100 hover:border-burgundy"
                              }`}
                            >
                              <div className="truncate">
                                <p className="font-bold truncate">{pv.name}</p>
                                <p className="text-[10px] text-gray-400">{pv.role}</p>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border shrink-0">
                                {isAdded ? "Added" : "+ Add"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          placeholder="Partner Name (e.g. Bansal Decor)"
                          className="col-span-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-xs outline-none focus:border-burgundy"
                        />
                        <select
                          value={manualCategory}
                          onChange={(e) => setManualCategory(e.target.value)}
                          className="px-2 py-2 bg-white border border-gray-100 rounded-lg text-xs outline-none"
                        >
                          <option value="DECOR">Decor</option>
                          <option value="PHOTOGRAPHY">Photography</option>
                          <option value="CATERING">Catering</option>
                          <option value="MAKEUP">Makeup</option>
                          <option value="VENUE">Venue</option>
                          <option value="ENTERTAINMENT">DJ / Music</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={manualRole}
                          onChange={(e) => setManualRole(e.target.value)}
                          placeholder="Optional specific role (e.g. Mandap Floral Stylist)"
                          className="flex-1 px-3 py-2 bg-white border border-gray-100 rounded-lg text-xs outline-none focus:border-burgundy"
                        />
                        <button
                          type="button"
                          onClick={handleAddManualVendor}
                          className="px-4 py-2 bg-burgundy text-white rounded-lg text-xs font-bold"
                        >
                          Add Collab
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border rounded-xl font-bold text-xs text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveItem}
                  className="px-6 py-2.5 bg-burgundy text-white rounded-xl font-bold text-xs hover:bg-[#5f0d2e] disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Case Study"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
