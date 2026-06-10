"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
  images: string[];
  rating: number;
  duration: string;
  guestRange: string;
  services: string[];
  basePrice: number;
  priceLabel: string;
  isActive: boolean;
  sortOrder: number;
  categoryId: string | null;
  category: { id: string; name: string } | null;
}

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    badge: "BEST VALUE",
    badgeColor: "#800020",
    images: "",
    rating: 4.5,
    duration: "1 day event",
    guestRange: "150-250 guests",
    services: "",
    basePrice: 0,
    priceLabel: "PACKAGE FROM",
    sortOrder: 0,
    categoryId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, categoriesRes] = await Promise.all([
        api.get("/admin/packages"),
        api.get("/admin/categories")
      ]);
      setPackages(packagesRes.data.packages);
      setCategories(categoriesRes.data.categories);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      await api.delete(`/admin/packages/${id}`);
      setPackages(packages.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
    } catch (err) {
      console.error("Failed to toggle status", err);
    } finally {
      setActionLoading(null);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: "", description: "", badge: "BEST VALUE", badgeColor: "#800020",
      images: "", rating: 4.5, duration: "1 day event", guestRange: "150-250 guests",
      services: "", basePrice: 0, priceLabel: "PACKAGE FROM", sortOrder: 0, categoryId: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      badge: pkg.badge,
      badgeColor: pkg.badgeColor,
      images: pkg.images.join(", "),
      rating: pkg.rating,
      duration: pkg.duration,
      guestRange: pkg.guestRange,
      services: pkg.services.join(", "),
      basePrice: pkg.basePrice,
      priceLabel: pkg.priceLabel,
      sortOrder: pkg.sortOrder,
      categoryId: pkg.category?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("save");
    
    // Clean payload (convert comma separated strings to arrays)
    const payload = {
      ...formData,
      basePrice: Number(formData.basePrice),
      rating: Number(formData.rating),
      sortOrder: Number(formData.sortOrder),
      images: formData.images.split(",").map(s => s.trim()).filter(s => s),
      services: formData.services.split(",").map(s => s.trim()).filter(s => s),
      categoryId: formData.categoryId || null,
    };

    try {
      if (editingId) {
        await api.put(`/admin/packages/${editingId}`, payload);
      } else {
        await api.post("/admin/packages", payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save package");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">Curated Packages</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage premium bundled experiences for clients</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-burgundy text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Package
          </button>
        </div>

        {/* Table Body */}
        <div className="luxury-card p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Package Info</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Scale & Services</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pricing</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-10 bg-gray-50/10" />
                  </tr>
                ))
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic font-medium">
                    No packages found. Create one to get started.
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id} className={cn("hover:bg-gray-50/50 transition-colors group", !pkg.isActive && "opacity-60")}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        {pkg.images[0] ? (
                          <img src={pkg.images[0]} alt={pkg.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">{pkg.name}</p>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: pkg.badgeColor }}>
                              {pkg.badge}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 font-medium mt-1 truncate max-w-[200px]">{pkg.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-gray-700">{pkg.guestRange} · {pkg.duration}</p>
                      <p className="text-xs text-gray-400 font-bold mt-1 truncate max-w-[200px]">{pkg.services.join(" • ")}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{pkg.priceLabel}</p>
                      <p className="text-sm font-bold text-burgundy mt-0.5">₹{pkg.basePrice.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider",
                        pkg.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openEditModal(pkg)}
                          className="p-2.5 rounded-xl bg-gray-50 hover:bg-gold hover:text-white text-gray-600 transition-all border border-transparent hover:border-gold/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          disabled={actionLoading === pkg.id}
                          onClick={() => handleToggleActive(pkg.id, pkg.isActive)}
                          className={cn(
                            "p-2.5 rounded-xl transition-all border",
                            pkg.isActive 
                              ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-red-100" 
                              : "bg-green-50 text-green-500 hover:bg-green-500 hover:text-white border-green-100",
                            actionLoading === pkg.id && "opacity-50"
                          )}
                        >
                          {actionLoading === pkg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                           pkg.isActive ? <Trash2 className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-burgundy">
                  {editingId ? "Edit Package" : "Create Package"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                    <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Base Price (₹) *</label>
                    <input required type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Label</label>
                    <input type="text" value={formData.priceLabel} onChange={e => setFormData({...formData, priceLabel: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</label>
                    <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</label>
                    <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 2 day event" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Guest Range</label>
                    <input type="text" value={formData.guestRange} onChange={e => setFormData({...formData, guestRange: e.target.value})} placeholder="e.g. 150-250 guests" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Services Included (Comma separated)</label>
                  <input type="text" value={formData.services} onChange={e => setFormData({...formData, services: e.target.value})} placeholder="Venue, Catering, Photography" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image URLs (Comma separated)</label>
                  <input type="text" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://img1.jpg, https://img2.jpg" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Badge Text</label>
                    <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Badge Color (Hex)</label>
                    <input type="text" value={formData.badgeColor} onChange={e => setFormData({...formData, badgeColor: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort Order</label>
                    <input type="number" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Link to Category (Optional)</label>
                  <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm">
                    <option value="">None</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">
                    Cancel
                  </button>
                  <button type="submit" disabled={actionLoading === "save"} className="flex items-center gap-2 px-8 py-3 bg-burgundy text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all">
                    {actionLoading === "save" ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Save Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
