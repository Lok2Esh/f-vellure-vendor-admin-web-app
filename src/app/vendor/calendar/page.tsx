"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getCurrentVendor } from "@/lib/vendorStore";
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Clock, 
  Users, 
  MapPin,
  Plus
} from "lucide-react";

export default function VendorCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("November 2026");
  const [selectedDate, setSelectedDate] = useState("18");
  const [dateStatusMap, setDateStatusMap] = useState<Record<string, "BOOKED" | "AVAILABLE" | "BLOCKED">>({
    "18": "BOOKED",
    "19": "BOOKED",
    "22": "BOOKED",
    "28": "BLOCKED",
    "29": "BLOCKED",
  });

  const vendor = getCurrentVendor();

  const handleToggleStatus = (day: string) => {
    const current = dateStatusMap[day] || "AVAILABLE";
    const next = current === "AVAILABLE" ? "BLOCKED" : current === "BLOCKED" ? "BOOKED" : "AVAILABLE";
    setDateStatusMap({ ...dateStatusMap, [day]: next });
  };

  const bookedEvents: Record<string, any> = {
    "18": {
      title: "Royal Grand Wedding — Simran & Jaspreet",
      venue: "Fort Patiala Outer & Inner Lawns",
      guests: 650,
      scale: "Full 2-Day Palace Buyout",
      time: "10:00 AM - 11:30 PM",
      crewSize: "28 On-Site Specialists",
    },
    "19": {
      title: "Palace Reception Gala — Simran & Jaspreet",
      venue: "Heritage Terrace Ballroom",
      guests: 800,
      scale: "Evening Reception & Sufi Night",
      time: "6:00 PM - Midnight",
      crewSize: "32 On-Site Specialists",
    },
    "22": {
      title: "Destination Sangeet & Cocktail — Amanpreet & Vikramaditya",
      venue: "Ranbaas Royal Suite Lawns",
      guests: 350,
      scale: "Concert Acoustic Setup",
      time: "5:00 PM - 1:00 AM",
      crewSize: "16 On-Site Specialists",
    },
  };

  const currentEvent = bookedEvents[selectedDate];

  return (
    <DashboardLayout allowedRoles={["VENDOR"]}>
      <div className="space-y-6">
        {/* ──── TOP HEADER ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
              Availability Calendar & Celebration Bookings
            </h1>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Manage your locked wedding dates, block off maintenance windows, and view scheduled crews
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#287857] px-3 py-1.5 rounded-xl bg-[#EBF8F2] border border-[#C3ECD8]">
              <span className="size-2 rounded-full bg-[#287857]" /> 3 Confirmed Dates in Nov 2026
            </span>
          </div>
        </div>

        {/* ──── CALENDAR + EVENT DETAILS GRID ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#EFE3CF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F7EFE4]">
              <h3 className="font-serif font-bold text-base text-[#2A121E]">
                {currentMonth}
              </h3>
              <div className="flex items-center gap-1">
                <button type="button" className="p-1.5 rounded-lg border border-[#EFE3CF] hover:bg-gray-50">
                  <ChevronLeft className="size-4 text-[#786B70]" />
                </button>
                <button type="button" className="p-1.5 rounded-lg border border-[#EFE3CF] hover:bg-gray-50">
                  <ChevronRight className="size-4 text-[#786B70]" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-[#8A7A70] uppercase">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Dates Matrix */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 30 }, (_, i) => {
                const dayNum = String(i + 1);
                const status = dateStatusMap[dayNum] || "AVAILABLE";
                const isSelected = selectedDate === dayNum;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => setSelectedDate(dayNum)}
                    className={`h-16 rounded-xl border p-1.5 flex flex-col justify-between text-left transition-all relative ${
                      isSelected
                        ? "border-[#641E3D] ring-2 ring-[#641E3D]/20 bg-[#FAF5EC]"
                        : "border-[#EFE3CF] hover:border-[#D2AD6B] bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#2A121E]">{dayNum}</span>
                    
                    {status === "BOOKED" ? (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-[#641E3D] text-white">
                        Booked
                      </span>
                    ) : status === "BLOCKED" ? (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-gray-200 text-gray-700">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-[#EBF8F2] text-[#287857]">
                        Open
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] text-[#786B70] pt-2 border-t border-[#F7EFE4]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded bg-[#641E3D]" /> Locked Contract
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded bg-[#EBF8F2] border border-[#C3ECD8]" /> Open for Inquiries
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded bg-gray-200" /> Blocked
                </span>
              </div>
            </div>
          </div>

          {/* Selected Date Dossier (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#EFE3CF] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F7EFE4]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7A70]">Selected Date</span>
                  <h3 className="font-serif font-bold text-lg text-[#2A121E]">
                    November {selectedDate}, 2026
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedDate)}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF5EC] border border-[#EFE3CF] text-[10.5px] font-bold text-[#641E3D] hover:bg-[#F3EADB]"
                >
                  Toggle: {dateStatusMap[selectedDate] || "AVAILABLE"}
                </button>
              </div>

              {currentEvent ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl space-y-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#641E3D] text-white text-[9px] font-extrabold uppercase tracking-wider">
                      Confirmed Contract
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#2A121E]">
                      {currentEvent.title}
                    </h4>
                    <p className="text-xs text-[#786B70] flex items-center gap-1.5">
                      <MapPin className="size-3 text-[#8A6A23]" />
                      {currentEvent.venue}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-[#FCFAF6] border border-[#EFE3CF] rounded-xl">
                      <span className="text-[9px] font-bold text-[#8A7A70] uppercase block">Timeline</span>
                      <span className="font-bold text-[#2A121E]">{currentEvent.time}</span>
                    </div>
                    <div className="p-2.5 bg-[#FCFAF6] border border-[#EFE3CF] rounded-xl">
                      <span className="text-[9px] font-bold text-[#8A7A70] uppercase block">Guest Scale</span>
                      <span className="font-bold text-[#2A121E]">{currentEvent.guests} Guests</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FCFAF6] border border-[#EFE3CF] rounded-xl text-xs space-y-1">
                    <span className="text-[9px] font-bold text-[#8A7A70] uppercase block">On-Site Logistics</span>
                    <p className="font-bold text-[#2A121E]">{currentEvent.crewSize}</p>
                    <p className="text-[10px] text-[#786B70]">{currentEvent.scale}</p>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center space-y-2">
                  <CheckCircle2 className="size-8 text-[#287857] mx-auto" />
                  <p className="font-serif font-bold text-sm text-[#2A121E]">No Bookings on this Date</p>
                  <p className="text-xs text-[#786B70]">
                    This calendar slot is available to accept new custom celebration inquiries.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
