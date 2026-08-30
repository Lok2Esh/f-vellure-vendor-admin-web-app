"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getCurrentVendor, getPortfolioForVendor, addPortfolioItem, deletePortfolioItem } from "@/lib/vendorStore";
import { PortfolioItem, DEMO_VENDORS } from "@/lib/mockData";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  CalendarDays, 
  MapPin, 
  IndianRupee, 
  Users, 
  Video, 
  Image as ImageIcon, 
  Star, 
  CheckCircle2, 
  X, 
  Search,
  ExternalLink,
  ChevronRight,
  Play
} from "lucide-react";

export default function VendorPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMediaItem, setActiveMediaItem] = useState<PortfolioItem | null>(null);

  // Form State for Add Work
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("Grand Royal Wedding");
  const [venue, setVenue] = useState("Fort Patiala Royal Heritage");
  const [city, setCity] = useState("Patiala");
  const [date, setDate] = useState("February 2026");
  const [budget, setBudget] = useState(3500000);
  const [guestCount, setGuestCount] = useState(650);
  const [scope, setScope] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1519741497674-611481863552?w=1000");
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [clientName, setClientName] = useState("");
  const [clientQuote, setClientQuote] = useState("");
  const [selectedCollaborators, setSelectedCollaborators] = useState<any[]>([]);

  const vendor = getCurrentVendor();

  useEffect(() => {
    setItems(getPortfolioForVendor(vendor.id));
  }, [vendor.id]);

  const handleCreateWork = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addPortfolioItem(
      {
        title: title || "Celebration Showcase",
        eventType,
        venue,
        city,
        date,
        budget: Number(budget),
        guestCount: Number(guestCount),
        scope: scope || "Full bespoke management & execution.",
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1545232979-fbf678ab2659?w=1000",
        images: [
          imageUrl || "https://images.unsplash.com/photo-1545232979-fbf678ab2659?w=1000",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000",
        ],
        videoUrl,
        clientReview: clientQuote
          ? {
              clientName: clientName || "Verified Couple",
              quote: clientQuote,
              rating: 5,
            }
          : undefined,
        collaborators: selectedCollaborators,
      },
      vendor.id
    );

    setItems([created, ...items]);
    setShowAddModal(false);

    // Reset Form
    setTitle("");
    setScope("");
    setClientQuote("");
  };

  const handleDeleteWork = (id: string) => {
    if (confirm("Are you sure you want to remove this work history entry from your public showcase?")) {
      deletePortfolioItem(id);
      setItems(items.filter((it) => it.id !== id));
    }
  };

  const toggleCollaborator = (v: any) => {
    if (selectedCollaborators.some((c) => c.vendorId === v.id)) {
      setSelectedCollaborators(selectedCollaborators.filter((c) => c.vendorId !== v.id));
    } else {
      setSelectedCollaborators([
        ...selectedCollaborators,
        { vendorId: v.id, name: v.businessName, category: v.category, role: `${v.category} Partner`, isRegistered: true },
      ]);
    }
  };

  return (
    <DashboardLayout allowedRoles={["VENDOR"]}>
      <div className="space-y-6">
        {/* ──── TOP HEADER ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
              Work History & Portfolio Atelier ({items.length})
            </h1>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Showcase past weddings with high-res galleries, cinematic video links, scope deliverables, and collaborator tags
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="size-3.5" />
            + Add Past Celebration Work
          </button>
        </div>

        {/* ──── WORKS GRID (HIGH DENSITY) ──── */}
        {items.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#EFE3CF] space-y-3">
            <Sparkles className="size-8 text-[#D2AD6B] mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#2A121E]">No Work History Entries Yet</h3>
            <p className="text-xs text-[#786B70] max-w-md mx-auto">
              Add your past weddings, palace banquets, or candid shoots to build customer trust and showcase your capabilities.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#641E3D] text-white text-xs font-bold rounded-xl"
            >
              + Create First Entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-2xl border border-[#EFE3CF] overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#641E3D]/40 transition-all"
              >
                {/* Media Header with Overlay & Video Tag */}
                <div className="h-52 w-full relative bg-[#2A121E] overflow-hidden">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-extrabold uppercase tracking-wider text-[#641E3D]">
                      {work.eventType}
                    </span>
                    {work.videoUrl && (
                      <span className="px-2.5 py-1 rounded-full bg-[#641E3D]/90 backdrop-blur-sm text-[9px] font-bold text-white flex items-center gap-1">
                        <Play className="size-2.5 fill-white" /> 4K Video
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteWork(work.id)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-red-600 text-white backdrop-blur-sm transition-colors"
                      title="Remove Entry"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Title */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-serif font-bold text-base text-white leading-tight drop-shadow-sm">
                      {work.title}
                    </h3>
                    <p className="text-[10.5px] text-[#E8CF9F] font-semibold mt-0.5 flex items-center gap-2">
                      <span>{work.venue} ({work.city})</span>
                      <span>•</span>
                      <span>{work.date}</span>
                    </p>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  {/* Stats Bar */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FAF5EC] rounded-xl border border-[#EFE3CF] text-[10.5px]">
                    <div>
                      <span className="text-[8.5px] font-bold uppercase text-[#8A7A70] block">Guest Scale</span>
                      <span className="font-bold text-[#2A121E] flex items-center gap-1">
                        <Users className="size-3 text-[#641E3D]" />
                        {work.guestCount} Guests
                      </span>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-bold uppercase text-[#8A7A70] block">Project Budget</span>
                      <span className="font-bold text-[#2A121E] flex items-center gap-1">
                        <IndianRupee className="size-3 text-[#8A6A23]" />
                        ₹{(work.budget / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                  </div>

                  {/* Scope of Work */}
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70] block mb-1">
                      Deliverables & Scope
                    </span>
                    <p className="text-[11px] text-[#4A3B40] leading-relaxed line-clamp-2">
                      {work.scope}
                    </p>
                  </div>

                  {/* Collaborators Tag */}
                  {work.collaborators && work.collaborators.length > 0 && (
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#641E3D] block mb-1">
                        Tagged Partner Network
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {work.collaborators.map((col, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#FAF5EC] border border-[#EFE3CF] text-[9.5px] font-bold text-[#2A121E]"
                          >
                            {col.name} ({col.category})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Testimonial Quote */}
                  {work.clientReview && (
                    <div className="p-2.5 bg-[#FCFAF6] border border-[#ECD8B5] rounded-xl text-[10.5px] italic text-[#5D4A52] space-y-1">
                      <div className="flex items-center gap-1 text-[#D2AD6B]">
                        <Star className="size-3 fill-[#D2AD6B]" />
                        <Star className="size-3 fill-[#D2AD6B]" />
                        <Star className="size-3 fill-[#D2AD6B]" />
                        <Star className="size-3 fill-[#D2AD6B]" />
                        <Star className="size-3 fill-[#D2AD6B]" />
                        <span className="text-[9px] font-bold not-italic text-[#2A121E] ml-1">
                          — {work.clientReview.clientName}
                        </span>
                      </div>
                      <p>"{work.clientReview.quote}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ──── ADD WORK HISTORY MODAL ──── */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-2xl border border-[#EFE3CF] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-[#EFE3CF] bg-[#FCFAF6] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2A121E]">
                    Add Past Celebration Work
                  </h3>
                  <p className="text-[10.5px] text-[#786B70]">
                    Publish high-res photos, video links, guest metrics, and collaborator tags
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="size-8 rounded-lg border border-[#EFE3CF] hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleCreateWork} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                {/* Title & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Royal Wedding of Kabir & Navjot"
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Event Type
                    </label>
                    <input
                      type="text"
                      required
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      placeholder="e.g. Grand Royal Wedding / Sangeet Gala"
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Venue & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Venue / Palace Name
                    </label>
                    <input
                      type="text"
                      required
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. Fort Patiala Outer Lawns"
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Celebration Date
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g. Jan 2026"
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Budget & Guests */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Project Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Guest Count
                    </label>
                    <input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Media Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Video Reel URL (YouTube / Vimeo / MP4)
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                    Deliverables & Execution Scope
                  </label>
                  <textarea
                    rows={2}
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    placeholder="Describe lighting, crew size, stages built, live food counters, and special moments..."
                    className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs outline-none"
                  />
                </div>

                {/* Tag Collaborator Partners */}
                <div>
                  <label className="block text-[10px] font-bold text-[#641E3D] uppercase mb-1.5">
                    Tag Partner Ateliers Involved
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {DEMO_VENDORS.map((v) => {
                      const isSelected = selectedCollaborators.some((c) => c.vendorId === v.id);
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => toggleCollaborator(v)}
                          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all border ${
                            isSelected
                              ? 'bg-[#641E3D] text-white border-[#641E3D]'
                              : 'bg-[#FAF5EC] text-[#2A121E] border-[#EFE3CF] hover:bg-[#F3EADB]'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {v.businessName} ({v.category})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Client Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Client / Couple Name
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Simran & Jaspreet Grewal"
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                      Client Testimonial Quote
                    </label>
                    <input
                      type="text"
                      value={clientQuote}
                      onChange={(e) => setClientQuote(e.target.value)}
                      placeholder="e.g. The palace looked like a fairytale under the stars..."
                      className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#FAF5EC] border border-[#EFE3CF] text-xs font-bold text-[#786B70]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    Publish to Marketplace Showcase →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
