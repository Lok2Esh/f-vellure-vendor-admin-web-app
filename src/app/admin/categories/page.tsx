"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ToggleLeft, 
  ToggleRight, 
  SlidersHorizontal,
  Eye,
  EyeOff,
  Filter,
  X,
  Building2,
  Utensils,
  Camera,
  Flower,
  Music,
  HeartHandshake,
  Heart,
  Crown,
  Flower2,
  Gift,
  Hotel
} from "lucide-react";

export interface CategoryItem {
  id: string;
  key: string;
  name: string;
  type: 'EVENT' | 'SERVICE';
  tagline?: string;
  icon?: string;
  image?: string;
  color?: string;
  isActive: boolean;
  order: number;
  allowedServices?: string[];
  createdAt: string;
  updatedAt: string;
}

const BACKEND_URL = "http://localhost:3000/api/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'EVENT' | 'SERVICE'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<CategoryItem>>({
    name: '',
    key: '',
    type: 'EVENT',
    tagline: '',
    icon: 'Sparkles',
    color: '#641E3D',
    image: '',
    isActive: true,
    allowedServices: [],
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/all`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend not available, using local cache:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggleActive = async (category: CategoryItem) => {
    const nextState = !category.isActive;
    // Optimistic UI update
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, isActive: nextState } : c))
    );

    try {
      await fetch(`${BACKEND_URL}/admin/${category.id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });
    } catch (err) {
      console.error("Failed to toggle category on backend:", err);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const payload = {
      ...formData,
      key: (formData.key || formData.name).toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    };

    try {
      const res = await fetch(`${BACKEND_URL}/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) => [...prev, data.category]);
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }

    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      key: '',
      type: 'EVENT',
      tagline: '',
      icon: 'Sparkles',
      color: '#641E3D',
      image: '',
      isActive: true,
      allowedServices: [],
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    // Optimistic UI update
    setCategories((prev) =>
      prev.map((c) => (c.id === selectedCategory.id ? { ...c, ...formData } : c))
    );

    try {
      await fetch(`${BACKEND_URL}/admin/${selectedCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error("Error updating category:", err);
    }

    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));

    try {
      await fetch(`${BACKEND_URL}/admin/${selectedCategory.id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Error deleting category:", err);
    }

    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const openEditModal = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setFormData({ ...cat });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const filteredCategories = categories.filter((c) => {
    if (typeFilter !== 'ALL' && c.type !== typeFilter) return false;
    if (statusFilter === 'ACTIVE' && !c.isActive) return false;
    if (statusFilter === 'INACTIVE' && c.isActive) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.key.toLowerCase().includes(q) ||
        (c.tagline || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const eventCount = categories.filter((c) => c.type === 'EVENT').length;
  const serviceCount = categories.filter((c) => c.type === 'SERVICE').length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.filter((c) => !c.isActive).length;

  const AVAILABLE_SERVICE_KEYS = [
    { key: 'venue', label: 'Grand Venues' },
    { key: 'catering', label: 'Artisanal Catering' },
    { key: 'decor', label: 'Bespoke Decor' },
    { key: 'photography', label: 'Cinematic Photography' },
    { key: 'videography', label: 'Drone & Film' },
    { key: 'makeup', label: 'Bridal Makeup' },
    { key: 'mehendi', label: 'Mehendi Artists' },
    { key: 'entertainment', label: 'DJ & Sound' },
    { key: 'music', label: 'Live Bands' },
    { key: 'priest', label: 'Pandit Ji & Priests' },
    { key: 'planning', label: 'Planners' },
    { key: 'cakes', label: 'Designer Cakes' },
    { key: 'bartending', label: 'Bar Services' },
    { key: 'transport', label: 'Luxury Transport' },
    { key: 'security', label: 'Valet & Security' },
  ];

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#641E3D]/10 text-[#641E3D]">
                <Layers className="size-4" />
              </span>
              <h1 className="text-lg font-black tracking-tight text-[#2A121E]">
                Category & Service Master Controller
              </h1>
            </div>
            <p className="text-xs text-[#786B70] mt-1">
              Configure, enable/disable, add, update, and manage all celebration event types and partner service categories live across the customer mobile app.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                key: '',
                type: 'EVENT',
                tagline: '',
                icon: 'Sparkles',
                color: '#641E3D',
                image: '',
                isActive: true,
                allowedServices: [],
              });
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#641E3D] hover:bg-[#4E142E] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="size-4" />
            Add New Category
          </button>
        </div>

        {/* High Density Metric Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => { setTypeFilter('ALL'); setStatusFilter('ALL'); }}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              typeFilter === 'ALL' && statusFilter === 'ALL'
                ? 'bg-[#641E3D] text-white border-[#641E3D] shadow-sm'
                : 'bg-white text-[#2A121E] border-[#EFE3CF] hover:bg-[#FAF5EC]'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">All Categories</p>
            <p className="text-xl font-black mt-1">{categories.length}</p>
          </button>

          <button
            type="button"
            onClick={() => { setTypeFilter('EVENT'); setStatusFilter('ALL'); }}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              typeFilter === 'EVENT'
                ? 'bg-[#641E3D] text-white border-[#641E3D] shadow-sm'
                : 'bg-white text-[#2A121E] border-[#EFE3CF] hover:bg-[#FAF5EC]'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Celebrations</p>
            <p className="text-xl font-black mt-1">{eventCount}</p>
          </button>

          <button
            type="button"
            onClick={() => { setTypeFilter('SERVICE'); setStatusFilter('ALL'); }}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              typeFilter === 'SERVICE'
                ? 'bg-[#641E3D] text-white border-[#641E3D] shadow-sm'
                : 'bg-white text-[#2A121E] border-[#EFE3CF] hover:bg-[#FAF5EC]'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Services</p>
            <p className="text-xl font-black mt-1">{serviceCount}</p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('ACTIVE')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              statusFilter === 'ACTIVE'
                ? 'bg-[#15803D] text-white border-[#15803D] shadow-sm'
                : 'bg-white text-[#15803D] border-[#DCFCE7] hover:bg-[#F0FDF4]'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Active on App</p>
            <p className="text-xl font-black mt-1">{activeCount}</p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('INACTIVE')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              statusFilter === 'INACTIVE'
                ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-sm'
                : 'bg-white text-[#B91C1C] border-[#FEE2E2] hover:bg-[#FEF2F2]'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Inactive / Hidden</p>
            <p className="text-xl font-black mt-1">{inactiveCount}</p>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-xl border border-[#EFE3CF]">
          <div className="relative flex-1 w-full">
            <Search className="size-4 text-[#786B70] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category by name, key, or tagline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none focus:border-[#641E3D] text-[#2A121E]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="text-xs bg-[#FAF5EC] border border-[#EFE3CF] rounded-lg px-2.5 py-1.5 font-semibold text-[#2A121E] focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="EVENT">Celebration Events</option>
              <option value="SERVICE">Service Categories</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-[#FAF5EC] border border-[#EFE3CF] rounded-lg px-2.5 py-1.5 font-semibold text-[#2A121E] focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Categories Grid Table */}
        <div className="bg-white rounded-2xl border border-[#EFE3CF] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF5EC] border-b border-[#EFE3CF] text-[10px] font-black uppercase tracking-wider text-[#786B70]">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Category Name & Key</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Tagline / Services Scope</th>
                  <th className="py-3 px-4 text-center">Status on Mobile App</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE3CF] text-xs font-medium text-[#2A121E]">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#786B70]">
                      No categories found matching your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4 text-[#786B70] font-mono text-[11px]">
                        #{cat.order || idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="size-8 rounded-lg object-cover shrink-0 border border-[#EFE3CF]"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span
                              className="size-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                              style={{ backgroundColor: cat.color || '#641E3D' }}
                            >
                              {cat.name.charAt(0)}
                            </span>
                          )}
                          <div>
                            <p className="font-bold text-xs text-[#2A121E]">{cat.name}</p>
                            <p className="text-[10px] font-mono text-[#786B70]">{cat.key}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider ${
                            cat.type === 'EVENT'
                              ? 'bg-[#FAF1E3] text-[#8A6A23] border border-[#ECD8B5]'
                              : 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                          }`}
                        >
                          {cat.type === 'EVENT' ? 'Celebration' : 'Specialist'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-[11px] text-[#4A3B40] truncate">{cat.tagline || '—'}</p>
                        {cat.allowedServices && cat.allowedServices.length > 0 && (
                          <p className="text-[9.5px] text-[#786B70] mt-0.5">
                            {cat.allowedServices.length} linked services ({cat.allowedServices.slice(0, 3).join(', ')}...)
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            cat.isActive
                              ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0] hover:bg-[#BBF7D0]'
                              : 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA] hover:bg-[#FECACA]'
                          }`}
                        >
                          {cat.isActive ? (
                            <>
                              <CheckCircle2 className="size-3" />
                              Active (Visible)
                            </>
                          ) : (
                            <>
                              <XCircle className="size-3" />
                              Inactive (Hidden)
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 rounded-lg border border-[#EFE3CF] hover:bg-[#FAF5EC] text-[#641E3D] transition-colors"
                            title="Edit Category"
                          >
                            <Edit3 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(cat)}
                            className="p-1.5 rounded-lg border border-[#FEE2E2] hover:bg-[#FEF2F2] text-[#B91C1C] transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="size-3.5" />
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

        {/* ──── CREATE CATEGORY MODAL ──── */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#EFE3CF] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE3CF]">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#2A121E]">Add New Category</h3>
                <button type="button" onClick={() => setIsCreateModalOpen(false)}>
                  <X className="size-4 text-[#786B70]" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Category Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full text-xs p-2.5 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none"
                    >
                      <option value="EVENT">Celebration Event (e.g. Reception)</option>
                      <option value="SERVICE">Service Specialist (e.g. Venue)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Color Tag</label>
                    <input
                      type="color"
                      value={formData.color || '#641E3D'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full h-[38px] p-1 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Wedding, Pandit Ji & Priests"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none focus:border-[#641E3D]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Key (URL / Token identifier)</label>
                  <input
                    type="text"
                    placeholder="e.g. wedding, reception, priest"
                    value={formData.key || ''}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Tagline / Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Banquets & Feasts"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Image URL / Asset Path</label>
                  <input
                    type="text"
                    placeholder="e.g. http://localhost:3000/assets/celebrations/wedding.jpg or Unsplash URL"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none font-mono"
                  />
                </div>

                {formData.type === 'EVENT' && (
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">
                      Linked Services for this Celebration
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF]">
                      {AVAILABLE_SERVICE_KEYS.map((srv) => {
                        const isChecked = (formData.allowedServices || []).includes(srv.key);
                        return (
                          <label key={srv.key} className="flex items-center gap-1.5 text-[10.5px] font-medium text-[#2A121E] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = formData.allowedServices || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, allowedServices: [...current, srv.key] });
                                } else {
                                  setFormData({ ...formData, allowedServices: current.filter((k) => k !== srv.key) });
                                }
                              }}
                            />
                            {srv.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="createActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="createActive" className="text-xs font-bold text-[#2A121E] cursor-pointer">
                    Active immediately (visible on customer mobile app)
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EFE3CF]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-[#EFE3CF] text-[#786B70]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#641E3D] text-white hover:bg-[#4E142E]"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ──── EDIT CATEGORY MODAL ──── */}
        {isEditModalOpen && selectedCategory && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#EFE3CF] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE3CF]">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#2A121E]">
                  Edit Category: {selectedCategory.name}
                </h3>
                <button type="button" onClick={() => setIsEditModalOpen(false)}>
                  <X className="size-4 text-[#786B70]" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Category Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full text-xs p-2.5 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none"
                    >
                      <option value="EVENT">Celebration Event</option>
                      <option value="SERVICE">Service Specialist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Color Tag</label>
                    <input
                      type="color"
                      value={formData.color || '#641E3D'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full h-[38px] p-1 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none focus:border-[#641E3D]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full text-xs p-2.5 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">Database Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 text-xs p-2.5 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF] focus:outline-none font-mono"
                    />
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="size-[38px] rounded-lg object-cover border border-[#EFE3CF]"
                      />
                    )}
                  </div>
                </div>

                {formData.type === 'EVENT' && (
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#786B70] uppercase mb-1">
                      Linked Services for this Celebration
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#FAF5EC] rounded-lg border border-[#EFE3CF]">
                      {AVAILABLE_SERVICE_KEYS.map((srv) => {
                        const isChecked = (formData.allowedServices || []).includes(srv.key);
                        return (
                          <label key={srv.key} className="flex items-center gap-1.5 text-[10.5px] font-medium text-[#2A121E] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = formData.allowedServices || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, allowedServices: [...current, srv.key] });
                                } else {
                                  setFormData({ ...formData, allowedServices: current.filter((k) => k !== srv.key) });
                                }
                              }}
                            />
                            {srv.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="editActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="editActive" className="text-xs font-bold text-[#2A121E] cursor-pointer">
                    Active & Visible on customer app
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EFE3CF]">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-[#EFE3CF] text-[#786B70]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#641E3D] text-white hover:bg-[#4E142E]"
                  >
                    Update Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ──── DELETE CATEGORY MODAL ──── */}
        {isDeleteModalOpen && selectedCategory && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#FEE2E2] max-w-sm w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#FEE2E2] text-[#B91C1C]">
                  <Trash2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#2A121E]">Delete Category</h3>
                  <p className="text-xs text-[#786B70]">Are you sure you want to remove &quot;{selectedCategory.name}&quot;?</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EFE3CF]">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#EFE3CF] text-[#786B70]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#B91C1C] text-white hover:bg-[#991B1B]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
