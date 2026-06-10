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

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge: string;
  badgeColor: string;
  discount: number;
  discountType: string;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  sortOrder: number;
  targetUrl: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
}

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    badge: "LIMITED",
    badgeColor: "#800020",
    discount: 0,
    discountType: "PERCENTAGE",
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: "",
    sortOrder: 0,
    targetUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [offersRes, categoriesRes] = await Promise.all([
        api.get("/admin/offers"),
        api.get("/admin/categories")
      ]);
      setOffers(offersRes.data.offers);
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
      await api.delete(`/admin/offers/${id}`);
      setOffers(offers.map(o => o.id === id ? { ...o, isActive: !currentStatus } : o));
    } catch (err) {
      console.error("Failed to toggle status", err);
    } finally {
      setActionLoading(null);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: "", subtitle: "", imageUrl: "", badge: "LIMITED", badgeColor: "#800020",
      discount: 0, discountType: "PERCENTAGE", validFrom: new Date().toISOString().split('T')[0],
      validUntil: "", sortOrder: 0, targetUrl: "", categoryId: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingId(offer.id);
    setFormData({
      title: offer.title,
      subtitle: offer.subtitle || "",
      imageUrl: offer.imageUrl || "",
      badge: offer.badge,
      badgeColor: offer.badgeColor,
      discount: offer.discount || 0,
      discountType: offer.discountType,
      validFrom: offer.validFrom ? new Date(offer.validFrom).toISOString().split('T')[0] : "",
      validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().split('T')[0] : "",
      sortOrder: offer.sortOrder,
      targetUrl: offer.targetUrl || "",
      categoryId: offer.category?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("save");
    
    // Clean payload
    const payload = {
      ...formData,
      discount: Number(formData.discount),
      sortOrder: Number(formData.sortOrder),
      validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
      validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : new Date().toISOString(),
      categoryId: formData.categoryId || null,
    };

    try {
      if (editingId) {
        await api.put(`/admin/offers/${editingId}`, payload);
      } else {
        await api.post("/admin/offers", payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save offer");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">Promotional Offers</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage banners and discounts shown on the home screen</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-burgundy text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Offer
          </button>
        </div>

        {/* Table Body */}
        <div className="luxury-card p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Offer Details</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Discount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Validity</th>
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
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic font-medium">
                    No offers found. Create one to get started.
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className={cn("hover:bg-gray-50/50 transition-colors group", !offer.isActive && "opacity-60")}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        {offer.imageUrl ? (
                          <img src={offer.imageUrl} alt={offer.title} className="w-16 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-16 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">{offer.title}</p>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: offer.badgeColor }}>
                              {offer.badge}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 font-medium mt-1 truncate max-w-xs">{offer.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-burgundy">
                        {offer.discountType === 'PERCENTAGE' ? `${offer.discount}% OFF` : `₹${offer.discount?.toLocaleString()} OFF`}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-semibold text-gray-700">From: {new Date(offer.validFrom).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400 font-bold mt-1">To: {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'Forever'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider",
                        offer.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {offer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openEditModal(offer)}
                          className="p-2.5 rounded-xl bg-gray-50 hover:bg-gold hover:text-white text-gray-600 transition-all border border-transparent hover:border-gold/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          disabled={actionLoading === offer.id}
                          onClick={() => handleToggleActive(offer.id, offer.isActive)}
                          className={cn(
                            "p-2.5 rounded-xl transition-all border",
                            offer.isActive 
                              ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-red-100" 
                              : "bg-green-50 text-green-500 hover:bg-green-500 hover:text-white border-green-100",
                            actionLoading === offer.id && "opacity-50"
                          )}
                        >
                          {actionLoading === offer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                           offer.isActive ? <Trash2 className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
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
                  {editingId ? "Edit Offer" : "Create Offer"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title *</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subtitle</label>
                    <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image URL</label>
                  <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discount Type</label>
                    <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm">
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FLAT">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discount Value</label>
                    <input type="number" step="0.01" value={formData.discount} onChange={e => setFormData({...formData, discount: parseFloat(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort Order</label>
                    <input type="number" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Badge Text</label>
                    <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Badge Color (Hex)</label>
                    <input type="text" value={formData.badgeColor} onChange={e => setFormData({...formData, badgeColor: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Valid From</label>
                    <input type="date" value={formData.validFrom} onChange={e => setFormData({...formData, validFrom: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Valid Until</label>
                    <input type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target URL</label>
                    <input type="text" value={formData.targetUrl} onChange={e => setFormData({...formData, targetUrl: e.target.value})} placeholder="/offers/..." className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
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
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">
                    Cancel
                  </button>
                  <button type="submit" disabled={actionLoading === "save"} className="flex items-center gap-2 px-8 py-3 bg-burgundy text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all">
                    {actionLoading === "save" ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Save Offer
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
