"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl: string;
  vendorCount: number;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "calendar",
    imageUrl: "",
    vendorCount: 0,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories");
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      // Soft-delete toggles isActive
      const response = await api.delete(`/admin/categories/${id}`);
      setCategories(categories.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c));
    } catch (err) {
      console.error("Failed to toggle status", err);
    } finally {
      setActionLoading(null);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "", icon: "calendar", imageUrl: "", vendorCount: 0, sortOrder: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon,
      imageUrl: category.imageUrl || "",
      vendorCount: category.vendorCount,
      sortOrder: category.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("save");
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, formData);
      } else {
        await api.post("/admin/categories", formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save category");
    } finally {
      setActionLoading(null);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (!editingId) {
      setFormData({ 
        ...formData, 
        name: newName, 
        slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
      });
    } else {
      setFormData({ ...formData, name: newName });
    }
  };

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage event categories displayed on the app home screen</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-burgundy text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Table Body */}
        <div className="luxury-card p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Category details</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Order & Vendors</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-10 bg-gray-50/10" />
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic font-medium">
                    No categories found. Create one to get started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className={cn("hover:bg-gray-50/50 transition-colors group", !category.isActive && "opacity-60")}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        {category.imageUrl ? (
                          <img src={category.imageUrl} alt={category.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">No Img</div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900">{category.name}</p>
                          <p className="text-xs text-gray-400 font-medium mt-1">/{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-gray-700">Sort: {category.sortOrder}</p>
                      <p className="text-xs text-gray-400 font-bold mt-1">{category.vendorCount} Vendors</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider",
                        category.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openEditModal(category)}
                          className="p-2.5 rounded-xl bg-gray-50 hover:bg-gold hover:text-white text-gray-600 transition-all border border-transparent hover:border-gold/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          disabled={actionLoading === category.id}
                          onClick={() => handleToggleActive(category.id, category.isActive)}
                          className={cn(
                            "p-2.5 rounded-xl transition-all border",
                            category.isActive 
                              ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-red-100" 
                              : "bg-green-50 text-green-500 hover:bg-green-500 hover:text-white border-green-100",
                            actionLoading === category.id && "opacity-50"
                          )}
                          title={category.isActive ? "Deactivate" : "Activate"}
                        >
                          {actionLoading === category.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                           category.isActive ? <Trash2 className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
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
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-burgundy">
                  {editingId ? "Edit Category" : "Create Category"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name *</label>
                    <input required type="text" value={formData.name} onChange={handleNameChange} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slug *</label>
                    <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                  <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image URL</label>
                  <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Icon</label>
                    <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort Order</label>
                    <input type="number" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor Count</label>
                    <input type="number" value={formData.vendorCount} onChange={e => setFormData({...formData, vendorCount: parseInt(e.target.value) || 0})} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-burgundy text-sm" />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">
                    Cancel
                  </button>
                  <button type="submit" disabled={actionLoading === "save"} className="flex items-center gap-2 px-8 py-3 bg-burgundy text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all">
                    {actionLoading === "save" ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Save Category
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
