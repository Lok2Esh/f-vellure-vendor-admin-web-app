export interface VendorAccount {
  id: string;
  email: string;
  name: string;
  businessName: string;
  category: string;
  city: string;
  locality?: string;
  phone: string;
  role: 'VENDOR' | 'ADMIN';
  status: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'SUSPENDED';
  rating: number;
  reviewsCount: number;
  basePrice: number;
  priceType: 'PER_PLATE' | 'PER_DAY' | 'PER_EVENT' | 'FIXED' | 'STARTING_PRICE';
  serviceRadiusKm: number;
  capacityMin?: number;
  capacityMax?: number;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  amenities: string[];
  packages: Array<{
    id: string;
    name: string;
    price: number;
    priceType: string;
    guestCount?: number;
    description: string;
    inclusions: string[];
    exclusions: string[];
  }>;
}

export interface InquiryItem {
  id: string;
  vendorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  city: string;
  budget: number;
  status: 'NEW' | 'QUOTED' | 'CONFIRMED' | 'DECLINED';
  notes?: string;
  receivedAt: string;
  quotedAmount?: number;
  quoteDetails?: {
    lineItems: Array<{ desc: string; qty: number; rate: number; total: number }>;
    subtotal: number;
    tax: number;
    total: number;
    validUntil: string;
    terms?: string;
  };
}

export interface PortfolioItem {
  id: string;
  vendorId: string;
  title: string;
  eventType: string;
  venue: string;
  city: string;
  date: string;
  budget: number;
  guestCount: number;
  scope: string;
  imageUrl: string;
  images: string[];
  videoUrl?: string;
  clientReview?: {
    clientName: string;
    quote: string;
    rating: number;
  };
  collaborators: Array<{
    vendorId?: string;
    name: string;
    category?: string;
    role?: string;
    isRegistered?: boolean;
  }>;
}

export interface ReviewItem {
  id: string;
  vendorId: string;
  customerName: string;
  rating: number;
  date: string;
  eventType: string;
  comment: string;
  sentiment: 'EXCELLENT' | 'GREAT' | 'AVERAGE';
  vendorReply?: {
    replyText: string;
    repliedAt: string;
  };
}

export const DEMO_VENDORS: VendorAccount[] = [
  {
    id: 'v_patiala_fort',
    email: 'fort@patialaheritage.com',
    name: 'Maharaja Amarinder & Team',
    businessName: 'Fort Patiala Royal Heritage',
    category: 'VENUE',
    city: 'Patiala',
    locality: 'Heritage Fort Road',
    phone: '+91 98140 12345',
    role: 'VENDOR',
    status: 'VERIFIED',
    rating: 4.9,
    reviewsCount: 48,
    basePrice: 1500000,
    priceType: 'PER_EVENT',
    serviceRadiusKm: 50,
    capacityMin: 200,
    capacityMax: 1500,
    bio: 'Historic 18th-century palace offering authentic royal hospitality, grand courtyard lawns, chandelier ballrooms, and heritage suites for bespoke luxury weddings.',
    avatarUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    bannerUrl: 'https://images.unsplash.com/photo-1545232979-fbf678ab2659?w=1200',
    amenities: ['Heritage Courtyard', 'Valet Parking (300 cars)', 'Bridal Palace Suite', '24/7 Power Backup', 'In-House Banqueting', 'Sound & Stage License'],
    packages: [
      {
        id: 'pkg_1',
        name: 'Royal Heritage 2-Day Grand Wedding',
        price: 2500000,
        priceType: 'PER_EVENT',
        guestCount: 800,
        description: 'Complete 48-hour access to inner royal courtyards, 20 heritage suites for family, sound permissions, and grand procession entry gate.',
        inclusions: ['Inner & Outer Courtyard Lawns', '20 Luxury Heritage Palace Rooms', 'Dedicated Royal Butler Crew', 'Illuminated Palace Facade'],
        exclusions: ['Outside Alcohol Corkage', 'Drone Permission Govt Fees'],
      },
      {
        id: 'pkg_2',
        name: 'Sangeet & Cocktail Palace Gala',
        price: 1200000,
        priceType: 'PER_EVENT',
        guestCount: 400,
        description: 'Single-evening extravaganza with fairy-light canopy, dance arena, and royal bar setup.',
        inclusions: ['Terrace Chandelier Ballroom', 'Stage Trussing & Laser Lighting', 'Cocktail Lounge Furniture'],
        exclusions: ['Catering Food (Charged separately)'],
      },
    ],
  },
  {
    id: 'v_rohan_roy',
    email: 'rohan@rohanroystudios.com',
    name: 'Rohan Roy',
    businessName: 'Rohan Roy Candid Studios',
    category: 'PHOTOGRAPHY',
    city: 'Patiala',
    locality: 'Model Town',
    phone: '+91 98888 23456',
    role: 'VENDOR',
    status: 'VERIFIED',
    rating: 4.95,
    reviewsCount: 62,
    basePrice: 125000,
    priceType: 'PER_DAY',
    serviceRadiusKm: 250,
    capacityMin: 50,
    capacityMax: 2000,
    bio: 'Award-winning destination wedding photographer & cinematic storyteller. Capturing unscripted royal emotions with Sony FX Cinema & drone optics.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    bannerUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200',
    amenities: ['4K Cinema Rig', 'Dual Drone Operators', 'Same-Day Teaser Edit', 'Leather-Bound Master Albums', 'High-Speed Cloud Backup'],
    packages: [
      {
        id: 'pkg_rr_1',
        name: 'Imperial 3-Day Cinema Suite',
        price: 350000,
        priceType: 'PER_EVENT',
        guestCount: 500,
        description: 'Complete 3-day coverage (Mehendi, Sangeet, Wedding & Reception) with a 6-person visual crew, dual 4K drones, and cinematic teaser in 48 hours.',
        inclusions: ['2 Lead Candid Photographers', '2 Master Cinematographers', '1 Drone Pilot', '140-Page Handcrafted Italian Album', 'Raw 4K Footage HDD'],
        exclusions: ['Crew Travel/Lodging Outside Punjab'],
      },
    ],
  },
  {
    id: 'v_bhogal_caterers',
    email: 'bhogal@royalpatialakitchen.com',
    name: 'Gurpreet Singh Bhogal',
    businessName: 'Bhogal Caterers & Royal Kitchen',
    category: 'CATERING',
    city: 'Patiala',
    locality: 'Urban Estate II',
    phone: '+91 98765 34567',
    role: 'VENDOR',
    status: 'VERIFIED',
    rating: 4.85,
    reviewsCount: 54,
    basePrice: 1850,
    priceType: 'PER_PLATE',
    serviceRadiusKm: 150,
    capacityMin: 150,
    capacityMax: 3000,
    bio: 'Over 3 decades of crafting legendary Punjabi gourmet banquets, live artisanal chaat stations, Awadhi slow-cooked gravies, and international dessert bars.',
    avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    bannerUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200',
    amenities: ['Live Clay Tandoor', 'Tasting Kitchen Session', 'Copper Buffet Chafing', 'Artisanal Mocktail Bar', 'Uniformed Butler Service'],
    packages: [
      {
        id: 'pkg_bc_1',
        name: 'Shahi Dawat Imperial Buffet',
        price: 2400,
        priceType: 'PER_PLATE',
        guestCount: 500,
        description: '6 Welcome Drinks, 8 Appetizers, 14 Main Courses with live copper degs, 8 artisanal desserts, and imported cold stone ice cream counter.',
        inclusions: ['Live Amritsari Kulcha Counter', 'Dum Biryani in Handi', 'Belgian Chocolate Fountain', 'Luxury Tableware & Linens'],
        exclusions: ['Imported Liquor Mixology Fee'],
      },
    ],
  },
  {
    id: 'v_flora_belle',
    email: 'contact@florabelledecor.com',
    name: 'Simran & Aanchal',
    businessName: 'Flora Belle Luxury Decor',
    category: 'DECOR',
    city: 'Patiala',
    locality: 'Leela Bhawan',
    phone: '+91 98111 45678',
    role: 'VENDOR',
    status: 'VERIFIED',
    rating: 4.9,
    reviewsCount: 39,
    basePrice: 450000,
    priceType: 'STARTING_PRICE',
    serviceRadiusKm: 100,
    capacityMin: 100,
    capacityMax: 2000,
    bio: 'Bespoke floral architecture, glass mandaps, customized crystal chandeliers, and curated thematic stage designs for magnificent wedding celebrations.',
    avatarUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    bannerUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200',
    amenities: ['Exotic Dutch Floral Imports', '3D Architectural Stage Renderings', 'LED Neon Signage', 'Crystal Drop Chandeliers', 'Custom Carpet Liners'],
    packages: [
      {
        id: 'pkg_fb_1',
        name: 'Grand Glass Mandap & Floral Stage',
        price: 850000,
        priceType: 'PER_EVENT',
        guestCount: 600,
        description: 'Reflective mirror walkway, 24-ft floral dome mandap with imported hydrangeas and white orchids, photo booth wall, and grand stage.',
        inclusions: ['Mirror Stage & Walkway', 'Overhead Floral Clouds', '200 Warm Glow Fairy Lanterns', 'Complete Teardown & Cleanup'],
        exclusions: ['Generator Diesel Fuel'],
      },
    ],
  },
];

export const DEMO_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq_101',
    vendorId: 'v_patiala_fort',
    customerName: 'Navjot Kaur & Kabir Gill',
    customerEmail: 'kabir.gill@gmail.com',
    customerPhone: '+91 98721 00011',
    eventType: 'Grand Royal Wedding',
    eventDate: '2026-11-18',
    guestCount: 650,
    city: 'Patiala',
    budget: 3500000,
    status: 'NEW',
    notes: 'Looking for a 2-day palace booking with evening Sangeet on the terrace and daytime Anand Karaj in the courtyard.',
    receivedAt: '2026-08-29T14:20:00Z',
  },
  {
    id: 'inq_102',
    vendorId: 'v_patiala_fort',
    customerName: 'Harleen Sandhu',
    customerEmail: 'harleen.sandhu@yahoo.com',
    customerPhone: '+91 98150 99887',
    eventType: 'Sangeet Gala Night',
    eventDate: '2026-12-04',
    guestCount: 400,
    city: 'Patiala',
    budget: 1500000,
    status: 'QUOTED',
    notes: 'Need palace lawns with high-capacity sound permissions until 11:30 PM.',
    receivedAt: '2026-08-28T09:15:00Z',
    quotedAmount: 1350000,
    quoteDetails: {
      lineItems: [
        { desc: 'Palace Lawn & Chandelier Terrace (Single Evening)', qty: 1, rate: 1000000, total: 1000000 },
        { desc: 'Lighting & Generator Redundancy Setup', qty: 1, rate: 150000, total: 150000 },
        { desc: 'Heritage Suite for Bridal Preparation', qty: 2, rate: 25000, total: 50000 },
      ],
      subtotal: 1200000,
      tax: 216000,
      total: 1416000,
      validUntil: '2026-09-15',
      terms: '50% advance upon confirmation. 50% on event morning.',
    },
  },
  {
    id: 'inq_103',
    vendorId: 'v_rohan_roy',
    customerName: 'Amanpreet & Vikramaditya',
    customerEmail: 'amanpreet.v@gmail.com',
    customerPhone: '+91 98765 11223',
    eventType: 'Destination Wedding',
    eventDate: '2026-11-22',
    guestCount: 300,
    city: 'Patiala',
    budget: 400000,
    status: 'CONFIRMED',
    notes: '3-day coverage including pre-wedding shoot in Patiala heritage precincts.',
    receivedAt: '2026-08-25T11:00:00Z',
    quotedAmount: 350000,
  },
  {
    id: 'inq_104',
    vendorId: 'v_bhogal_caterers',
    customerName: 'Sardar Manjit Singh Dhillon',
    customerEmail: 'manjit.dhillon@gmail.com',
    customerPhone: '+91 98144 55443',
    eventType: 'Reception Gala Dinner',
    eventDate: '2026-12-10',
    guestCount: 800,
    city: 'Patiala',
    budget: 2000000,
    status: 'NEW',
    notes: 'Need authentic Punjabi slow-cooked non-veg and vegetarian feast with live chaat and hot jalebi counters.',
    receivedAt: '2026-08-29T16:45:00Z',
  },
];

export const DEMO_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port_101',
    vendorId: 'v_patiala_fort',
    title: 'The Royal Wedding of Simran & Jaspreet',
    eventType: 'Grand Royal Wedding',
    venue: 'Fort Patiala Outer & Inner Courtyards',
    city: 'Patiala',
    date: 'February 2026',
    budget: 4500000,
    guestCount: 900,
    scope: 'Complete 3-day royal buyout including palace illumination, 24 heritage guest suites, baraat elephant procession, and central water fountain mandap setup.',
    imageUrl: 'https://images.unsplash.com/photo-1545232979-fbf678ab2659?w=1000',
    images: [
      'https://images.unsplash.com/photo-1545232979-fbf678ab2659?w=1000',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    clientReview: {
      clientName: 'Simran & Jaspreet Grewal',
      quote: 'Hosting our wedding at Fort Patiala felt like stepping into an ancient fairytale. The sheer magnificence of the illuminated ramparts took our breath away.',
      rating: 5,
    },
    collaborators: [
      { vendorId: 'v_rohan_roy', name: 'Rohan Roy Candid Studios', category: 'PHOTOGRAPHY', role: 'Lead Cinema & Stills', isRegistered: true },
      { vendorId: 'v_flora_belle', name: 'Flora Belle Luxury Decor', category: 'DECOR', role: 'Floral Mandap & Stage', isRegistered: true },
      { vendorId: 'v_bhogal_caterers', name: 'Bhogal Caterers & Royal Kitchen', category: 'CATERING', role: 'Royal Punjabi Feast', isRegistered: true },
    ],
  },
  {
    id: 'port_102',
    vendorId: 'v_patiala_fort',
    title: 'Starry Sangeet Gala & Sufi Night',
    eventType: 'Sangeet & Cocktail Gala',
    venue: 'Terrace Chandelier Pavilion',
    city: 'Patiala',
    date: 'January 2026',
    budget: 2200000,
    guestCount: 450,
    scope: 'Concert-grade acoustics setup, 360-degree LED visual mapping across historical palace arches, and bespoke cocktail lounge cabanas.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000',
    ],
    clientReview: {
      clientName: 'Aarav & Meera Kapoor',
      quote: 'The acoustic warmth under the open Punjabi sky and the seamless hospitality made our Sangeet unforgettable.',
      rating: 5,
    },
    collaborators: [
      { vendorId: 'v_rohan_roy', name: 'Rohan Roy Candid Studios', category: 'PHOTOGRAPHY', role: 'Candid Coverage', isRegistered: true },
      { name: 'DJ Sunny Sound & Stage Lights', category: 'ENTERTAINMENT', role: 'Sufi & Commercial Sound' },
    ],
  },
];

export const DEMO_REVIEWS: ReviewItem[] = [
  {
    id: 'rev_1',
    vendorId: 'v_patiala_fort',
    customerName: 'Gurmukh & Harleen Johal',
    rating: 5,
    date: '2 weeks ago',
    eventType: 'Grand Wedding',
    comment: 'The quintessential royal experience in Punjab. The staff attended to our 800 guests with supreme elegance and grace. Every single guest was awed.',
    sentiment: 'EXCELLENT',
    vendorReply: {
      replyText: 'Thank you Gurmukh ji! It was our utmost privilege to host your family for such an auspicious union.',
      repliedAt: '10 days ago',
    },
  },
  {
    id: 'rev_2',
    vendorId: 'v_patiala_fort',
    customerName: 'Dr. Karanveer Chawla',
    rating: 4.8,
    date: '1 month ago',
    eventType: 'Reception Gala',
    comment: 'Impeccable heritage venue. The lighting across the palace front made our photos look like a movie set. Highly recommend booking early!',
    sentiment: 'EXCELLENT',
  },
];
