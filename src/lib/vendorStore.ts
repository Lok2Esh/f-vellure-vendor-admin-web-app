import {
  VendorAccount,
  InquiryItem,
  PortfolioItem,
  ReviewItem,
  DEMO_VENDORS,
  DEMO_INQUIRIES,
  DEMO_PORTFOLIO,
  DEMO_REVIEWS,
} from './mockData';
import { getAuthUser } from './auth';

const STORAGE_KEYS = {
  VENDORS: 'vellure_vendors_db',
  INQUIRIES: 'vellure_inquiries_db',
  PORTFOLIO: 'vellure_portfolio_db',
  REVIEWS: 'vellure_reviews_db',
  ACTIVE_VENDOR_ID: 'vellure_active_vendor_id',
};

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// -------------------------------------------------------------
// VENDORS DATA
// -------------------------------------------------------------

export function getAllVendors(): VendorAccount[] {
  return loadStorage<VendorAccount[]>(STORAGE_KEYS.VENDORS, DEMO_VENDORS);
}

export function getVendorById(id: string): VendorAccount | null {
  const all = getAllVendors();
  return all.find((v) => v.id === id) || null;
}

export function getCurrentVendor(): VendorAccount {
  const auth = getAuthUser();
  const all = getAllVendors();
  
  if (auth && auth.role === 'VENDOR') {
    const matched = all.find((v) => v.email.toLowerCase() === auth.email.toLowerCase() || v.id === auth.id);
    if (matched) return matched;
  }

  // Fallback to Fort Patiala or first vendor
  return all[0] || DEMO_VENDORS[0];
}

export function updateVendorProfile(updated: Partial<VendorAccount>, vendorId?: string): VendorAccount {
  const all = getAllVendors();
  const targetId = vendorId || getCurrentVendor().id;
  const idx = all.findIndex((v) => v.id === targetId);

  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updated };
    saveStorage(STORAGE_KEYS.VENDORS, all);
    return all[idx];
  } else {
    const newVendor: VendorAccount = {
      id: targetId,
      email: updated.email || 'partner@vellure.com',
      name: updated.name || 'Partner',
      businessName: updated.businessName || 'Luxury Atelier',
      category: updated.category || 'VENUE',
      city: updated.city || 'Patiala',
      phone: updated.phone || '+91 98000 00000',
      role: 'VENDOR',
      status: 'PENDING',
      rating: 5.0,
      reviewsCount: 1,
      basePrice: updated.basePrice || 100000,
      priceType: updated.priceType || 'STARTING_PRICE',
      serviceRadiusKm: updated.serviceRadiusKm || 50,
      amenities: updated.amenities || ['Luxury Hospitality'],
      packages: updated.packages || [],
      ...updated,
    };
    all.push(newVendor);
    saveStorage(STORAGE_KEYS.VENDORS, all);
    return newVendor;
  }
}

// -------------------------------------------------------------
// INQUIRIES & QUOTATIONS
// -------------------------------------------------------------

export function getInquiriesForVendor(vendorId?: string): InquiryItem[] {
  const vId = vendorId || getCurrentVendor().id;
  const all = loadStorage<InquiryItem[]>(STORAGE_KEYS.INQUIRIES, DEMO_INQUIRIES);
  return all.filter((i) => i.vendorId === vId);
}

export function getAllInquiries(): InquiryItem[] {
  return loadStorage<InquiryItem[]>(STORAGE_KEYS.INQUIRIES, DEMO_INQUIRIES);
}

export function updateInquiryStatus(
  inquiryId: string,
  status: InquiryItem['status'],
  quoteData?: InquiryItem['quoteDetails']
): InquiryItem | null {
  const all = loadStorage<InquiryItem[]>(STORAGE_KEYS.INQUIRIES, DEMO_INQUIRIES);
  const idx = all.findIndex((i) => i.id === inquiryId);
  if (idx >= 0) {
    all[idx] = {
      ...all[idx],
      status,
      ...(quoteData ? { quoteDetails: quoteData, quotedAmount: quoteData.total } : {}),
    };
    saveStorage(STORAGE_KEYS.INQUIRIES, all);
    return all[idx];
  }
  return null;
}

// -------------------------------------------------------------
// PORTFOLIO / WORK HISTORY
// -------------------------------------------------------------

export function getPortfolioForVendor(vendorId?: string): PortfolioItem[] {
  const vId = vendorId || getCurrentVendor().id;
  const all = loadStorage<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, DEMO_PORTFOLIO);
  return all.filter((p) => p.vendorId === vId);
}

export function addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'vendorId'>, vendorId?: string): PortfolioItem {
  const vId = vendorId || getCurrentVendor().id;
  const all = loadStorage<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, DEMO_PORTFOLIO);
  const newItem: PortfolioItem = {
    ...item,
    id: `port_${Date.now()}`,
    vendorId: vId,
  };
  all.unshift(newItem);
  saveStorage(STORAGE_KEYS.PORTFOLIO, all);
  return newItem;
}

export function deletePortfolioItem(itemId: string): boolean {
  const all = loadStorage<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, DEMO_PORTFOLIO);
  const filtered = all.filter((p) => p.id !== itemId);
  saveStorage(STORAGE_KEYS.PORTFOLIO, filtered);
  return true;
}

// -------------------------------------------------------------
// REVIEWS
// -------------------------------------------------------------

export function getReviewsForVendor(vendorId?: string): ReviewItem[] {
  const vId = vendorId || getCurrentVendor().id;
  const all = loadStorage<ReviewItem[]>(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
  return all.filter((r) => r.vendorId === vId);
}

export function addVendorReviewReply(reviewId: string, replyText: string): boolean {
  const all = loadStorage<ReviewItem[]>(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
  const idx = all.findIndex((r) => r.id === reviewId);
  if (idx >= 0) {
    all[idx].vendorReply = {
      replyText,
      repliedAt: 'Just now',
    };
    saveStorage(STORAGE_KEYS.REVIEWS, all);
    return true;
  }
  return false;
}
