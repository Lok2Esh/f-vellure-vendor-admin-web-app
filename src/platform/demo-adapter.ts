import { MARKET_CONFIG } from "@/platform/market";
import { Dashboard } from "./domain";
const inr = (rupees: number) => ({
  amount: Math.round(rupees * 100),
  currency: MARKET_CONFIG.currency.code,
});
/** Isolated fixture adapter. No production mutation or ledger calculation belongs here. */
export function demoDashboard(period: string, branchId: string): Dashboard {
  const multiplier =
    period === "Today"
      ? 1
      : period === "7 days"
        ? 6
        : period === "30 days"
          ? 24
          : 230;
  const branchFactor =
    branchId === "all" ? 1 : branchId === "sector17" ? 0.65 : 0.35;
  const scale = multiplier * branchFactor;
  const all: Dashboard["appointmentsList"] = [
    {
      id: "APT-1042",
      customer: "Priya Sharma",
      initials: "PS",
      service: "Signature haircut & blow dry",
      staff: "Neha K.",
      branchId: "sector17",
      startsAt: "2026-09-07T05:00:00Z",
      duration: 60,
      price: inr(899),
      status: "CHECKED_IN",
      payment: "PAID",
      notes: "Prefers a natural finish.",
    },
    {
      id: "APT-1043",
      customer: "Ananya Gupta",
      initials: "AG",
      service: "Hydra glow facial",
      staff: "Meera S.",
      branchId: "sector17",
      startsAt: "2026-09-07T05:30:00Z",
      duration: 75,
      price: inr(1299),
      status: "CONFIRMED",
      payment: "PAID",
      notes: "First visit. Please allow time for consultation.",
    },
    {
      id: "APT-1044",
      customer: "Simran Kaur",
      initials: "SK",
      service: "Classic manicure & pedicure",
      staff: "Simran K.",
      branchId: "indiranagar",
      startsAt: "2026-09-07T06:00:00Z",
      duration: 60,
      price: inr(1498),
      status: "PENDING",
      payment: "UNPAID",
      notes: "No additional notes.",
    },
    {
      id: "APT-1045",
      customer: "Neha Kapoor",
      initials: "NK",
      service: "Hair colour consultation",
      staff: "Neha K.",
      branchId: "sector17",
      startsAt: "2026-09-07T06:30:00Z",
      duration: 30,
      price: inr(2499),
      status: "CONFIRMED",
      payment: "UNPAID",
      notes: "Interested in balayage.",
    },
    {
      id: "APT-1046",
      customer: "Meera Singh",
      initials: "MS",
      service: "Relaxing full body massage",
      staff: "Meera S.",
      branchId: "indiranagar",
      startsAt: "2026-09-07T07:00:00Z",
      duration: 90,
      price: inr(1999),
      status: "CONFIRMED",
      payment: "PAID",
      notes: "No additional notes.",
    },
    {
      id: "APT-1047",
      customer: "Ishita Verma",
      initials: "IV",
      service: "Signature haircut & blow dry",
      staff: "Neha K.",
      branchId: "sector17",
      startsAt: "2026-09-07T08:00:00Z",
      duration: 60,
      price: inr(899),
      status: "PENDING",
      payment: "UNPAID",
      notes: "No additional notes.",
    },
  ];
  const labels =
    period === "Today"
      ? [
          "9 AM",
          "10 AM",
          "11 AM",
          "12 PM",
          "1 PM",
          "2 PM",
          "3 PM",
          "4 PM",
          "5 PM",
          "6 PM",
          "7 PM",
          "8 PM",
        ]
      : period === "7 days"
        ? ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"]
        : period === "30 days"
          ? [
              "1 Sep",
              "4 Sep",
              "7 Sep",
              "10 Sep",
              "13 Sep",
              "16 Sep",
              "19 Sep",
              "22 Sep",
              "25 Sep",
              "28 Sep",
            ]
          : [
              "Oct",
              "Nov",
              "Dec",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
            ];
  return {
    businessName: "Glow & Grace Salon",
    branches: [
      { value: "all", label: "All branches" },
      { value: "sector17", label: "Sector 17 · Chandigarh" },
      { value: "indiranagar", label: "Indiranagar · Bengaluru" },
    ],
    businessHours: "9:00 AM – 9:00 PM",
    occupancyPercent: 75,
    changes: {
      revenue: "18.6%",
      appointments: "4 more",
      orders: "20.0%",
      rating: "0.2",
      periodRevenue: "18.6%",
    },
    date: "2026-09-07T05:00:00Z",
    revenue: inr(24850 * branchFactor),
    appointments: Math.round(18 * branchFactor),
    orders: Math.round(11 * branchFactor),
    pendingAppointments: Math.round(5 * branchFactor),
    pendingOrders: Math.round(4 * branchFactor),
    rating: 4.7,
    ratingCount: 128,
    lowStock: 3,
    upcoming: Math.round(18 * branchFactor),
    serviceRevenue: inr(18450 * scale),
    productRevenue: inr(6400 * scale),
    trend: labels.map((label, i) => ({
      label,
      services: Math.round(
        (18450 *
          scale *
          100 *
          [32, 42, 36, 57, 49, 65, 53, 77, 63, 72, 65, 87][i]) /
          [32, 42, 36, 57, 49, 65, 53, 77, 63, 72, 65, 87]
            .slice(0, labels.length)
            .reduce((sum, n) => sum + n, 0),
      ),
      products: Math.round(
        (6400 *
          scale *
          100 *
          [13, 18, 14, 27, 22, 30, 25, 38, 28, 34, 30, 41][i]) /
          [13, 18, 14, 27, 22, 30, 25, 38, 28, 34, 30, 41]
            .slice(0, labels.length)
            .reduce((sum, n) => sum + n, 0),
      ),
    })),
    appointmentsList: all.filter(
      (a) => branchId === "all" || a.branchId === branchId,
    ),
    payout: {
      amount: inr(48750),
      expectedAt: "2026-09-10T07:00:00Z",
      bankVerified: true,
    },
    inventory: [
      {
        name: "L’Oréal Absolut Repair Shampoo",
        sku: "LR-AR-300",
        available: 3,
        threshold: 5,
      },
      {
        name: "The Ordinary Niacinamide 10%",
        sku: "TO-N10-30",
        available: 2,
        threshold: 5,
      },
      {
        name: "OPI Nail Lacquer · Bubble Bath",
        sku: "OPI-BB-15",
        available: 1,
        threshold: 4,
      },
    ],
    reviews: [
      {
        name: "Priya Sharma",
        service: "Hydra glow facial",
        rating: 5,
        text: "Such a lovely experience! The team was incredibly welcoming and my skin feels amazing.",
      },
      {
        name: "Arjun Mehta",
        service: "Haircut & styling",
        rating: 5,
        text: "Finally found my go-to salon. Neha understood exactly what I wanted.",
      },
    ],
    actionOrders: [
      {
        id: "ORD-2084",
        customer: "Aarav Sharma",
        items: 3,
        total: inr(1797),
        status: "NEW",
      },
      {
        id: "ORD-2083",
        customer: "Rohan Kapoor",
        items: 2,
        total: inr(1298),
        status: "ACCEPTED",
      },
      {
        id: "ORD-2081",
        customer: "Aditya Verma",
        items: 1,
        total: inr(799),
        status: "READY",
      },
    ],
  };
}
