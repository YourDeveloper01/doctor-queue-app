import { useState, useEffect, useRef, useCallback } from "react";

// ─── Business Configurations ────────────────────────────────────────────────
const BUSINESSES = [
  {
    id: "clinic",
    icon: "🏥",
    name: "Clinic / Hospital",
    color: "#0EA5E9",
    bg: "#E0F2FE",
    desc: "Doctor appointments & OPD",
    queueLabel: "Patient Queue",
    sessionLabel: "Consultation",
    staffLabel: "Doctor/Staff",
    customers: [
      {
        id: 1,
        name: "Rahul Sharma",
        age: 34,
        type: "Follow-up",
        scheduled: "10:00 AM",
        allocatedMins: 15,
        phone: "98100-11111",
      },
      {
        id: 2,
        name: "Priya Mehta",
        age: 28,
        type: "New Consult",
        scheduled: "10:15 AM",
        allocatedMins: 20,
        phone: "98100-22222",
      },
      {
        id: 3,
        name: "Anil Verma",
        age: 52,
        type: "Follow-up",
        scheduled: "10:35 AM",
        allocatedMins: 15,
        phone: "98100-33333",
      },
      {
        id: 4,
        name: "Sunita Patel",
        age: 45,
        type: "Emergency",
        scheduled: "10:50 AM",
        allocatedMins: 10,
        phone: "98100-44444",
      },
      {
        id: 5,
        name: "Deepak Joshi",
        age: 61,
        type: "New Consult",
        scheduled: "11:00 AM",
        allocatedMins: 20,
        phone: "98100-55555",
      },
    ],
    types: ["Follow-up", "New Consult", "Emergency", "Check-up"],
    defaultMins: 15,
  },
  {
    id: "salon",
    icon: "✂️",
    name: "Salon / Barbershop",
    color: "#A855F7",
    bg: "#F3E8FF",
    desc: "Haircut, color, styling & more",
    queueLabel: "Client Queue",
    sessionLabel: "Service",
    staffLabel: "Stylist",
    customers: [
      {
        id: 1,
        name: "Vikram Malhotra",
        age: 28,
        type: "Haircut",
        scheduled: "11:00 AM",
        allocatedMins: 30,
        phone: "99001-11111",
      },
      {
        id: 2,
        name: "Sneha Kapoor",
        age: 24,
        type: "Hair Color",
        scheduled: "11:30 AM",
        allocatedMins: 60,
        phone: "99001-22222",
      },
      {
        id: 3,
        name: "Rohan Singh",
        age: 35,
        type: "Beard Trim",
        scheduled: "12:30 PM",
        allocatedMins: 20,
        phone: "99001-33333",
      },
      {
        id: 4,
        name: "Ananya Bose",
        age: 30,
        type: "Styling",
        scheduled: "12:50 PM",
        allocatedMins: 45,
        phone: "99001-44444",
      },
      {
        id: 5,
        name: "Karan Mehta",
        age: 22,
        type: "Haircut",
        scheduled: "01:35 PM",
        allocatedMins: 30,
        phone: "99001-55555",
      },
    ],
    types: [
      "Haircut",
      "Beard Trim",
      "Hair Color",
      "Styling",
      "Spa Treatment",
      "Facial",
    ],
    defaultMins: 30,
  },
  {
    id: "pharmacy",
    icon: "💊",
    name: "Medical Store",
    color: "#10B981",
    bg: "#D1FAE5",
    desc: "Prescription & OTC medicines",
    queueLabel: "Customer Queue",
    sessionLabel: "Dispensing",
    staffLabel: "Pharmacist",
    customers: [
      {
        id: 1,
        name: "Mohan Das",
        age: 65,
        type: "Prescription",
        scheduled: "09:00 AM",
        allocatedMins: 10,
        phone: "97001-11111",
      },
      {
        id: 2,
        name: "Radha Gupta",
        age: 42,
        type: "OTC",
        scheduled: "09:10 AM",
        allocatedMins: 5,
        phone: "97001-22222",
      },
      {
        id: 3,
        name: "Suresh Yadav",
        age: 55,
        type: "Prescription",
        scheduled: "09:15 AM",
        allocatedMins: 10,
        phone: "97001-33333",
      },
      {
        id: 4,
        name: "Pooja Sharma",
        age: 31,
        type: "Consultation",
        scheduled: "09:25 AM",
        allocatedMins: 15,
        phone: "97001-44444",
      },
      {
        id: 5,
        name: "Neeraj Tiwari",
        age: 48,
        type: "OTC",
        scheduled: "09:40 AM",
        allocatedMins: 5,
        phone: "97001-55555",
      },
    ],
    types: ["Prescription", "OTC", "Consultation", "Refill", "Insurance"],
    defaultMins: 8,
  },
  {
    id: "hotel",
    icon: "🏨",
    name: "Hotel / Resort",
    color: "#F59E0B",
    bg: "#FEF3C7",
    desc: "Check-in, concierge & services",
    queueLabel: "Guest Queue",
    sessionLabel: "Check-in",
    staffLabel: "Receptionist",
    customers: [
      {
        id: 1,
        name: "Arjun Nair",
        age: 38,
        type: "Check-in",
        scheduled: "02:00 PM",
        allocatedMins: 10,
        phone: "96001-11111",
      },
      {
        id: 2,
        name: "Meera Iyer",
        age: 45,
        type: "Check-out",
        scheduled: "02:10 PM",
        allocatedMins: 8,
        phone: "96001-22222",
      },
      {
        id: 3,
        name: "Kartik Rao",
        age: 52,
        type: "Concierge",
        scheduled: "02:18 PM",
        allocatedMins: 15,
        phone: "96001-33333",
      },
      {
        id: 4,
        name: "Divya Shetty",
        age: 29,
        type: "Room Service",
        scheduled: "02:33 PM",
        allocatedMins: 5,
        phone: "96001-44444",
      },
      {
        id: 5,
        name: "Prakash Menon",
        age: 60,
        type: "Check-in",
        scheduled: "02:38 PM",
        allocatedMins: 10,
        phone: "96001-55555",
      },
    ],
    types: [
      "Check-in",
      "Check-out",
      "Concierge",
      "Room Service",
      "Complaint",
      "Amenity",
    ],
    defaultMins: 10,
  },
  {
    id: "cafe",
    icon: "☕",
    name: "Cafe / Restaurant",
    color: "#EF4444",
    bg: "#FEE2E2",
    desc: "Orders, table service & takeaway",
    queueLabel: "Order Queue",
    sessionLabel: "Service",
    staffLabel: "Staff",
    customers: [
      {
        id: 1,
        name: "Table 3 - Amit",
        age: 30,
        type: "Dine-in",
        scheduled: "01:00 PM",
        allocatedMins: 45,
        phone: "—",
      },
      {
        id: 2,
        name: "Riya Sharma",
        age: 25,
        type: "Takeaway",
        scheduled: "01:05 PM",
        allocatedMins: 10,
        phone: "95001-22222",
      },
      {
        id: 3,
        name: "Table 7 - Roy",
        age: 40,
        type: "Dine-in",
        scheduled: "01:15 PM",
        allocatedMins: 40,
        phone: "—",
      },
      {
        id: 4,
        name: "Neha Pant",
        age: 28,
        type: "Takeaway",
        scheduled: "01:25 PM",
        allocatedMins: 8,
        phone: "95001-44444",
      },
      {
        id: 5,
        name: "Table 2 - Kumar",
        age: 35,
        type: "Dine-in",
        scheduled: "01:33 PM",
        allocatedMins: 50,
        phone: "—",
      },
    ],
    types: ["Dine-in", "Takeaway", "Delivery", "Reservation", "Special Order"],
    defaultMins: 20,
  },
  {
    id: "bank",
    icon: "🏦",
    name: "Bank / Post Office",
    color: "#3B82F6",
    bg: "#DBEAFE",
    desc: "Accounts, loans & transactions",
    queueLabel: "Customer Queue",
    sessionLabel: "Transaction",
    staffLabel: "Teller",
    customers: [
      {
        id: 1,
        name: "Ashok Jain",
        age: 55,
        type: "Withdrawal",
        scheduled: "10:00 AM",
        allocatedMins: 8,
        phone: "94001-11111",
      },
      {
        id: 2,
        name: "Sunita Rao",
        age: 40,
        type: "Account Open",
        scheduled: "10:08 AM",
        allocatedMins: 20,
        phone: "94001-22222",
      },
      {
        id: 3,
        name: "Vijay Kumar",
        age: 62,
        type: "Loan Inquiry",
        scheduled: "10:28 AM",
        allocatedMins: 25,
        phone: "94001-33333",
      },
      {
        id: 4,
        name: "Kavita Joshi",
        age: 35,
        type: "Deposit",
        scheduled: "10:53 AM",
        allocatedMins: 5,
        phone: "94001-44444",
      },
      {
        id: 5,
        name: "Manoj Pandey",
        age: 48,
        type: "DD/Cheque",
        scheduled: "10:58 AM",
        allocatedMins: 10,
        phone: "94001-55555",
      },
    ],
    types: [
      "Deposit",
      "Withdrawal",
      "Account Open",
      "Loan Inquiry",
      "DD/Cheque",
      "KYC Update",
    ],
    defaultMins: 12,
  },
  {
    id: "govt",
    icon: "🏛️",
    name: "Govt. Office / RTO",
    color: "#64748B",
    bg: "#F1F5F9",
    desc: "Licences, permits & certificates",
    queueLabel: "Applicant Queue",
    sessionLabel: "Processing",
    staffLabel: "Officer",
    customers: [
      {
        id: 1,
        name: "Ramesh Pal",
        age: 28,
        type: "Driving Licence",
        scheduled: "09:30 AM",
        allocatedMins: 15,
        phone: "93001-11111",
      },
      {
        id: 2,
        name: "Shanti Devi",
        age: 50,
        type: "Certificate",
        scheduled: "09:45 AM",
        allocatedMins: 20,
        phone: "93001-22222",
      },
      {
        id: 3,
        name: "Ajay Mishra",
        age: 35,
        type: "Passport",
        scheduled: "10:05 AM",
        allocatedMins: 25,
        phone: "93001-33333",
      },
      {
        id: 4,
        name: "Geeta Singh",
        age: 44,
        type: "Property Reg.",
        scheduled: "10:30 AM",
        allocatedMins: 30,
        phone: "93001-44444",
      },
      {
        id: 5,
        name: "Harish Tomar",
        age: 39,
        type: "RC Transfer",
        scheduled: "11:00 AM",
        allocatedMins: 15,
        phone: "93001-55555",
      },
    ],
    types: [
      "Driving Licence",
      "RC Transfer",
      "Passport",
      "Certificate",
      "Property Reg.",
      "Ration Card",
    ],
    defaultMins: 20,
  },
  {
    id: "gym",
    icon: "💪",
    name: "Gym / Wellness Center",
    color: "#F97316",
    bg: "#FFEDD5",
    desc: "Trainer sessions & equipment slots",
    queueLabel: "Member Queue",
    sessionLabel: "Training",
    staffLabel: "Trainer",
    customers: [
      {
        id: 1,
        name: "Sameer Khan",
        age: 25,
        type: "Personal Training",
        scheduled: "06:00 AM",
        allocatedMins: 60,
        phone: "92001-11111",
      },
      {
        id: 2,
        name: "Ritika Verma",
        age: 30,
        type: "Yoga",
        scheduled: "07:00 AM",
        allocatedMins: 45,
        phone: "92001-22222",
      },
      {
        id: 3,
        name: "Dev Anand",
        age: 42,
        type: "Cardio",
        scheduled: "07:45 AM",
        allocatedMins: 30,
        phone: "92001-33333",
      },
      {
        id: 4,
        name: "Pooja Rawat",
        age: 27,
        type: "Personal Training",
        scheduled: "08:15 AM",
        allocatedMins: 60,
        phone: "92001-44444",
      },
      {
        id: 5,
        name: "Rohit Tiwari",
        age: 35,
        type: "Zumba",
        scheduled: "09:15 AM",
        allocatedMins: 45,
        phone: "92001-55555",
      },
    ],
    types: [
      "Personal Training",
      "Yoga",
      "Zumba",
      "Cardio",
      "Strength",
      "Massage",
    ],
    defaultMins: 45,
  },
];

// ─── Type color map ──────────────────────────────────────────────────────────
const TYPE_COLORS_MAP = {
  "Follow-up": { bg: "#E0F2FE", text: "#0369A1" },
  "New Consult": { bg: "#D1FAE5", text: "#065F46" },
  Emergency: { bg: "#FEE2E2", text: "#991B1B" },
  "Check-up": { bg: "#FEF3C7", text: "#92400E" },
  Haircut: { bg: "#F3E8FF", text: "#6B21A8" },
  "Hair Color": { bg: "#FCE7F3", text: "#9D174D" },
  "Beard Trim": { bg: "#E0E7FF", text: "#3730A3" },
  Styling: { bg: "#FDF4FF", text: "#7E22CE" },
  "Spa Treatment": { bg: "#FEE2E2", text: "#9F1239" },
  Facial: { bg: "#FCE7F3", text: "#831843" },
  Prescription: { bg: "#D1FAE5", text: "#065F46" },
  OTC: { bg: "#F0FDF4", text: "#14532D" },
  Consultation: { bg: "#DBEAFE", text: "#1E40AF" },
  Refill: { bg: "#EDE9FE", text: "#4C1D95" },
  Insurance: { bg: "#FEF9C3", text: "#713F12" },
  "Check-in": { bg: "#FEF3C7", text: "#78350F" },
  "Check-out": { bg: "#FEF9C3", text: "#713F12" },
  Concierge: { bg: "#E0F2FE", text: "#0C4A6E" },
  "Room Service": { bg: "#D1FAE5", text: "#064E3B" },
  Complaint: { bg: "#FEE2E2", text: "#7F1D1D" },
  Amenity: { bg: "#EDE9FE", text: "#4C1D95" },
  "Dine-in": { bg: "#FEE2E2", text: "#7F1D1D" },
  Takeaway: { bg: "#FFF7ED", text: "#7C2D12" },
  Delivery: { bg: "#FDF4FF", text: "#581C87" },
  Reservation: { bg: "#F0FDF4", text: "#14532D" },
  "Special Order": { bg: "#FEF3C7", text: "#78350F" },
  Withdrawal: { bg: "#EFF6FF", text: "#1D4ED8" },
  Deposit: { bg: "#F0FDF4", text: "#15803D" },
  "Account Open": { bg: "#DBEAFE", text: "#1E40AF" },
  "Loan Inquiry": { bg: "#FEF3C7", text: "#92400E" },
  "DD/Cheque": { bg: "#E0E7FF", text: "#3730A3" },
  "KYC Update": { bg: "#FEF9C3", text: "#713F12" },
  "Driving Licence": { bg: "#F1F5F9", text: "#334155" },
  "RC Transfer": { bg: "#E0E7FF", text: "#3730A3" },
  Passport: { bg: "#E0F2FE", text: "#0C4A6E" },
  Certificate: { bg: "#D1FAE5", text: "#064E3B" },
  "Property Reg.": { bg: "#FEF3C7", text: "#78350F" },
  "Ration Card": { bg: "#FEF9C3", text: "#713F12" },
  "Personal Training": { bg: "#FFEDD5", text: "#7C2D12" },
  Yoga: { bg: "#F3E8FF", text: "#6B21A8" },
  Zumba: { bg: "#FCE7F3", text: "#9D174D" },
  Cardio: { bg: "#FEE2E2", text: "#991B1B" },
  Strength: { bg: "#FFF7ED", text: "#7C2D12" },
  Massage: { bg: "#F0FDF4", text: "#14532D" },
};
function getTypeColor(type) {
  return TYPE_COLORS_MAP[type] || { bg: "#F1F5F9", text: "#475569" };
}

const STATUS_META = {
  waiting: { label: "Waiting", bg: "#EFF6FF", text: "#1D4ED8" },
  active: { label: "In Progress", bg: "#D1FAE5", text: "#065F46" },
  done: { label: "Done", bg: "#F8FAFC", text: "#94A3B8" },
  cancelled: { label: "Cancelled", bg: "#FEE2E2", text: "#991B1B" },
  late: { label: "Late", bg: "#FEF3C7", text: "#92400E" },
  rescheduled: { label: "Rescheduled", bg: "#EDE9FE", text: "#6B21A8" },
  "no-show": { label: "No Show", bg: "#F8FAFC", text: "#64748B" },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatTime(totalSeconds) {
  const m = Math.floor(Math.abs(totalSeconds) / 60);
  const s = Math.abs(totalSeconds) % 60;
  const sign = totalSeconds < 0 ? "-" : "";
  return `${sign}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function parseTimeToMinutes(timeStr) {
  const [time, period] = timeStr.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}
function minutesToTimeStr(totalMins) {
  let h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  const period = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}
function recomputeSchedule(patients, driftSeconds) {
  let cursor = null;
  return patients.map((p, i) => {
    if (["cancelled", "no-show", "rescheduled"].includes(p.status)) return p;
    if (i === 0) {
      cursor = parseTimeToMinutes(p.scheduled) + p.allocatedMins;
      return p;
    }
    const base =
      cursor != null
        ? cursor + Math.round(driftSeconds / 60)
        : parseTimeToMinutes(p.scheduled) + Math.round(driftSeconds / 60);
    const newSched = minutesToTimeStr(base);
    cursor = base + p.allocatedMins;
    return { ...p, scheduled: newSched };
  });
}

// ─── Responsive Hook ─────────────────────────────────────────────────────────
function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

// ─── Global CSS ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  * { box-sizing: border-box; }
  button { transition: opacity .15s, transform .1s; }
  button:hover { opacity: .88; }
  button:active { transform: scale(.97); }
  input:focus, select:focus, textarea:focus { border-color: #1A6FA8 !important; outline: none; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #D0DFF0; border-radius: 99px; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// BUSINESS SELECTOR SCREEN
// ═══════════════════════════════════════════════════════════════════════════
function SelectorScreen({ onSelect }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔢</div>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 10px",
          }}
        >
          QueueMaster
        </h1>
        <p style={{ fontSize: 15, color: "#94A3B8", margin: 0 }}>
          Apna business chunein — queue instantly manage karein
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
          width: "100%",
          maxWidth: 820,
        }}
      >
        {BUSINESSES.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b.id)}
            style={{
              background: "#1E293B",
              border: "1.5px solid #334155",
              borderRadius: 16,
              padding: "20px 18px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              cursor: "pointer",
              color: "white",
              transition: "border-color .2s, background .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = b.color;
              e.currentTarget.style.background = "#243044";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.background = "#1E293B";
            }}
          >
            <div style={{ fontSize: 30 }}>{b.icon}</div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#F1F5F9",
                  marginBottom: 4,
                }}
              >
                {b.name}
              </div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{b.desc}</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: b.color,
                }}
              />
              <span style={{ fontSize: 11, color: "#94A3B8" }}>
                {b.customers.length} sample entries
              </span>
            </div>
          </button>
        ))}
      </div>
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTION MODAL
// ═══════════════════════════════════════════════════════════════════════════
function ActionModal({ patient, biz, onClose, onAction, patients }) {
  const [screen, setScreen] = useState("main");
  const [reschedSlot, setReschedSlot] = useState("");
  const [lateBy, setLateBy] = useState(10);
  const [reason, setReason] = useState("");
  const { isMobile } = useBreakpoint();
  if (!patient) return null;

  const lastWaiting = [...patients]
    .reverse()
    .find((p) => p.status === "waiting");
  const suggestedSlot = lastWaiting
    ? minutesToTimeStr(
        parseTimeToMinutes(lastWaiting.scheduled) + lastWaiting.allocatedMins,
      )
    : "12:00 PM";

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(15,39,68,0.55)",
    zIndex: 1000,
    display: "flex",
    alignItems: isMobile ? "flex-end" : "center",
    justifyContent: "center",
    padding: isMobile ? 0 : 16,
  };
  const box = {
    background: "#fff",
    borderRadius: isMobile ? "20px 20px 0 0" : 18,
    padding: isMobile ? "8px 16px 40px" : 28,
    width: "100%",
    maxWidth: isMobile ? "100%" : 460,
    maxHeight: "92vh",
    overflowY: "auto",
    boxShadow: "0 8px 40px rgba(15,39,68,0.22)",
    fontFamily: "'DM Sans', sans-serif",
    animation: isMobile ? "slideUp .28s ease" : "fadeIn .2s ease",
  };

  const PrimaryBtn = ({ label, bg, color, onClick }) => (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "13px 10px",
        borderRadius: 10,
        background: bg,
        color,
        border: "none",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        minHeight: 46,
      }}
    >
      {label}
    </button>
  );
  const BackBtn = () => (
    <button
      onClick={() => setScreen("main")}
      style={{
        padding: "13px 18px",
        borderRadius: 10,
        background: "#F0F6FF",
        color: "#7A92B0",
        border: "none",
        fontSize: 13,
        cursor: "pointer",
        minHeight: 46,
      }}
    >
      Back
    </button>
  );
  const NoteArea = ({ placeholder }) => (
    <textarea
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      placeholder={placeholder}
      rows={2}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #D0DFF0",
        fontSize: 13,
        resize: "none",
        marginBottom: 12,
        boxSizing: "border-box",
      }}
    />
  );

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        {isMobile && (
          <div
            style={{
              width: 36,
              height: 4,
              background: "#D0DFF0",
              borderRadius: 99,
              margin: "8px auto 18px",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: biz.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: biz.color,
              flexShrink: 0,
            }}
          >
            {patient.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0F2744",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {patient.name}
            </div>
            <div style={{ fontSize: 12, color: "#7A92B0" }}>
              {patient.type} · {patient.scheduled}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              color: "#7A92B0",
              cursor: "pointer",
              minWidth: 36,
              minHeight: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {screen === "main" && (
          <>
            <div style={{ fontSize: 13, color: "#7A92B0", marginBottom: 14 }}>
              Kya situation hai? Sahi option chunein:
            </div>
            {[
              {
                icon: "🚫",
                label: "Cancel",
                sub: "Slot free karo — woh nahi aayega",
                clr: "#FEE2E2",
                tc: "#991B1B",
                go: "cancel",
              },
              {
                icon: "🕐",
                label: "Late Aaya",
                sub: "Queue ke last mein bhejo",
                clr: "#FEF3C7",
                tc: "#92400E",
                go: "late",
              },
              {
                icon: "📅",
                label: "Reschedule",
                sub: "Kisi aur time pe slot do",
                clr: "#EDE9FE",
                tc: "#6B21A8",
                go: "reschedule",
              },
              {
                icon: "❓",
                label: "No Show",
                sub: "Aaya hi nahi, koi response nahi",
                clr: "#F9FAFB",
                tc: "#374151",
                go: "noshow",
              },
            ].map((opt) => (
              <div
                key={opt.label}
                onClick={() => setScreen(opt.go)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 14px",
                  borderRadius: 12,
                  background: opt.clr,
                  marginBottom: 8,
                  cursor: "pointer",
                  minHeight: 60,
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: opt.tc }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#7A92B0" }}>
                    {opt.sub}
                  </div>
                </div>
                <span style={{ color: opt.tc, fontSize: 20 }}>›</span>
              </div>
            ))}
          </>
        )}

        {screen === "cancel" && (
          <>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#991B1B",
                marginBottom: 12,
              }}
            >
              🚫 Cancel Confirm
            </div>
            <NoteArea placeholder="Reason likhein (optional)..." />
            <div
              style={{
                background: "#FEF9EC",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 12,
                color: "#92400E",
                marginBottom: 14,
              }}
            >
              ⚠ Yeh slot khatam ho jaayega. Baaki schedule update ho jaayega.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <PrimaryBtn
                label="Confirm Cancel"
                bg="#991B1B"
                color="#fff"
                onClick={() => {
                  onAction("cancel", patient.id, { reason });
                  onClose();
                }}
              />
              <BackBtn />
            </div>
          </>
        )}

        {screen === "late" && (
          <>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#92400E",
                marginBottom: 12,
              }}
            >
              🕐 Kitni Der Late?
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              {[10, 15, 20, 30].map((m) => (
                <button
                  key={m}
                  onClick={() => setLateBy(m)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 20,
                    minHeight: 42,
                    border: `1.5px solid ${lateBy === m ? biz.color : "#D0DFF0"}`,
                    background: lateBy === m ? biz.bg : "#fff",
                    color: lateBy === m ? biz.color : "#7A92B0",
                    fontSize: 13,
                    fontWeight: lateBy === m ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  {m} min
                </button>
              ))}
            </div>
            <NoteArea placeholder="Note (optional)..." />
            <div style={{ display: "flex", gap: 8 }}>
              <PrimaryBtn
                label="Queue End pe Bhejo"
                bg={biz.color}
                color="#fff"
                onClick={() => {
                  onAction("late", patient.id, { lateBy, reason });
                  onClose();
                }}
              />
              <BackBtn />
            </div>
          </>
        )}

        {screen === "reschedule" && (
          <>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#6B21A8",
                marginBottom: 12,
              }}
            >
              📅 Reschedule
            </div>
            <div
              style={{
                background: "#F5F0FF",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 12,
                color: "#6B21A8",
                marginBottom: 12,
              }}
            >
              💡 Suggested slot: <strong>{suggestedSlot}</strong>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              {[suggestedSlot, "02:00 PM", "04:00 PM", "Kal 10:00 AM"].map(
                (slot) => (
                  <button
                    key={slot}
                    onClick={() => setReschedSlot(slot)}
                    style={{
                      padding: "8px 13px",
                      borderRadius: 20,
                      minHeight: 36,
                      border: `1.5px solid ${reschedSlot === slot ? "#6B21A8" : "#D0DFF0"}`,
                      background: reschedSlot === slot ? "#F5F0FF" : "#fff",
                      color: reschedSlot === slot ? "#6B21A8" : "#7A92B0",
                      fontSize: 12,
                      fontWeight: reschedSlot === slot ? 600 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {slot}
                  </button>
                ),
              )}
            </div>
            <NoteArea placeholder="Reason (optional)..." />
            <div style={{ display: "flex", gap: 8 }}>
              <PrimaryBtn
                label="Confirm Reschedule"
                bg="#6B21A8"
                color="#fff"
                onClick={() => {
                  onAction("reschedule", patient.id, {
                    newTime: reschedSlot || suggestedSlot,
                    reason,
                  });
                  onClose();
                }}
              />
              <BackBtn />
            </div>
          </>
        )}

        {screen === "noshow" && (
          <>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 12,
              }}
            >
              ❓ No Show Mark Karo
            </div>
            <div
              style={{
                background: "#F9FAFB",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 12,
                color: "#374151",
                marginBottom: 12,
              }}
            >
              Patient aaya hi nahi aur koi response nahi. Slot skip hoga, agle
              time pe chalti rahein.
            </div>
            <NoteArea placeholder="Note (optional)..." />
            <div style={{ display: "flex", gap: 8 }}>
              <PrimaryBtn
                label="No Show Mark Karo"
                bg="#374151"
                color="#fff"
                onClick={() => {
                  onAction("no-show", patient.id, { reason });
                  onClose();
                }}
              />
              <BackBtn />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMER / PATIENT WAITING ROOM VIEW
// ═══════════════════════════════════════════════════════════════════════════
function CustomerView({
  biz,
  patients,
  currentIdx,
  sessionSeconds,
  allocatedSeconds,
  driftSeconds,
}) {
  const current = patients[currentIdx];
  const progress =
    allocatedSeconds > 0
      ? Math.min((sessionSeconds / allocatedSeconds) * 100, 100)
      : 0;
  const isOvertime = sessionSeconds > allocatedSeconds;
  const activeQueue = patients.filter(
    (_, i) =>
      i > currentIdx &&
      !["cancelled", "no-show", "rescheduled"].includes(_.status),
  );
  const { isMobile, isTablet } = useBreakpoint();
  const narrow = isMobile || isTablet;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0F6FF",
        fontFamily: "'DM Sans', sans-serif",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #E2EAF4",
          padding: narrow ? "12px 16px" : "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 26 }}>{biz.icon}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0F2744" }}>
              {biz.name}
            </div>
            <div style={{ fontSize: 11, color: "#7A92B0" }}>
              Live Waiting Room
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#7A92B0",
            background: "#F0F6FF",
            padding: "4px 12px",
            borderRadius: 20,
            border: "1px solid #D0DFF0",
          }}
        >
          Live
        </div>
      </div>

      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: narrow ? "14px 12px" : "24px 16px",
        }}
      >
        {/* In-session card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #D0DFF0",
            padding: narrow ? 14 : 20,
            marginBottom: 16,
            boxShadow: "0 2px 12px rgba(26,111,168,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22C55E",
                boxShadow: "0 0 0 3px #DCFCE7",
                animation: "pulse 2s infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#16A34A",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Currently In {biz.sessionLabel}
            </span>
          </div>
          {current && currentIdx < patients.length ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: biz.bg,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    color: biz.color,
                  }}
                >
                  {current.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: "#0F2744",
                      marginBottom: 3,
                    }}
                  >
                    {current.name}
                  </div>
                  <div style={{ fontSize: 13, color: "#7A92B0" }}>
                    {current.type}
                    {current.age ? ` · Age ${current.age}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: isOvertime ? "#E74C3C" : biz.color,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatTime(sessionSeconds)}
                  </div>
                  <div style={{ fontSize: 11, color: "#7A92B0" }}>
                    /{formatTime(allocatedSeconds)}
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: 6,
                  background: "#F0F6FF",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: isOvertime
                      ? "#E74C3C"
                      : progress > 80
                        ? "#F59E0B"
                        : biz.color,
                    borderRadius: 99,
                    transition: "width 0.5s",
                  }}
                />
              </div>
              {isOvertime && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "#E74C3C",
                    fontWeight: 500,
                  }}
                >
                  ⚠ Session {formatTime(sessionSeconds - allocatedSeconds)} over
                  time chal raha hai
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: "#7A92B0",
                fontSize: 14,
              }}
            >
              Abhi koi active session nahi
            </div>
          )}
        </div>

        {/* Drift notice */}
        {Math.abs(driftSeconds) > 60 && (
          <div
            style={{
              background: driftSeconds > 0 ? "#FEF9EC" : "#F0FDF4",
              border: `1px solid ${driftSeconds > 0 ? "#FDE68A" : "#BBF7D0"}`,
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>
              {driftSeconds > 0 ? "⏰" : "🎉"}
            </span>
            <span
              style={{
                fontSize: 13,
                color: driftSeconds > 0 ? "#92400E" : "#14532D",
                fontWeight: 500,
              }}
            >
              {driftSeconds > 0
                ? `Schedule ~${Math.round(driftSeconds / 60)} min late chal raha hai. Aapka time update ho gaya.`
                : `${biz.staffLabel} ~${Math.round(Math.abs(driftSeconds) / 60)} min pehle chal rahe hain!`}
            </span>
          </div>
        )}

        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#7A92B0",
            marginBottom: 10,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {biz.queueLabel}
        </div>

        {activeQueue.map((p, i) => {
          const tc = getTypeColor(p.type);
          const isNext = i === 0;
          return (
            <div
              key={p.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: `1.5px solid ${isNext ? biz.color : "#E2EAF4"}`,
                padding: narrow ? "12px 13px" : "14px 16px",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: isNext ? biz.color : "#F0F6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: isNext ? "#fff" : "#7A92B0",
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: narrow ? 13 : 14,
                    fontWeight: 600,
                    color: "#0F2744",
                    marginBottom: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      background: tc.bg,
                      color: tc.text,
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontWeight: 500,
                    }}
                  >
                    {p.type}
                  </div>
                  <div style={{ fontSize: 11, color: "#7A92B0" }}>
                    {p.allocatedMins} min
                  </div>
                  {p.status === "late" && (
                    <div
                      style={{
                        fontSize: 11,
                        background: "#FEF9EC",
                        color: "#92400E",
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontWeight: 500,
                      }}
                    >
                      Late
                    </div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: narrow ? 13 : 14,
                    fontWeight: 700,
                    color: isNext ? biz.color : "#0F2744",
                  }}
                >
                  {p.scheduled}
                </div>
                {isNext && (
                  <div style={{ fontSize: 11, color: biz.color, marginTop: 2 }}>
                    Aap next hain!
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {activeQueue.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#7A92B0",
              fontSize: 14,
            }}
          >
            Queue mein koi nahi
          </div>
        )}
      </div>
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STAFF / ASSISTANT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function StaffView({
  biz,
  patients,
  setPatients,
  currentIdx,
  setCurrentIdx,
  sessionSeconds,
  setSessionSeconds,
  isRunning,
  setIsRunning,
  driftSeconds,
  setDriftSeconds,
}) {
  const current = patients[currentIdx];
  const allocatedSecs = current ? current.allocatedMins * 60 : 0;
  const isOvertime = sessionSeconds > allocatedSecs;
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const narrow = isMobile || isTablet;

  const [adjusting, setAdjusting] = useState(null);
  const [adjustMins, setAdjustMins] = useState(0);
  const [log, setLog] = useState([]);
  const [note, setNote] = useState("");
  const [modalPatient, setModalPatient] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newType, setNewType] = useState(biz.types[0]);
  const [newMins, setNewMins] = useState(biz.defaultMins);

  const addLog = useCallback((msg) => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLog((prev) =>
      [{ msg, time: timeStr, id: Date.now() }, ...prev].slice(0, 25),
    );
  }, []);

  const startSession = () => {
    setIsRunning(true);
    setSessionSeconds(0);
    setPatients((prev) =>
      prev.map((p, i) => (i === currentIdx ? { ...p, status: "active" } : p)),
    );
    addLog(`▶ ${biz.sessionLabel} started: ${current.name}`);
  };

  const endSession = () => {
    setIsRunning(false);
    const extra = sessionSeconds - allocatedSecs;
    const newDrift = driftSeconds + extra;
    setDriftSeconds(newDrift);
    addLog(
      `⏹ Done: ${current.name} (${formatTime(sessionSeconds)} | drift ${extra >= 0 ? "+" : ""}${Math.round(extra / 60)}m)`,
    );
    setPatients((prev) => {
      const updated = prev.map((p, i) =>
        i === currentIdx ? { ...p, status: "done" } : p,
      );
      return recomputeSchedule(updated, newDrift);
    });
    if (currentIdx < patients.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSessionSeconds(0);
    } else {
      setCurrentIdx((c) => c + 1);
    }
  };

  const handleAction = (action, pid, extra) => {
    setPatients((prev) => {
      let updated = [...prev];
      const idx = updated.findIndex((p) => p.id === pid);
      if (action === "cancel") {
        updated[idx] = { ...updated[idx], status: "cancelled" };
        addLog(
          `🚫 Cancelled: ${updated[idx].name}${extra.reason ? ` — "${extra.reason}"` : ""}`,
        );
      } else if (action === "no-show") {
        updated[idx] = { ...updated[idx], status: "no-show" };
        addLog(`❓ No Show: ${updated[idx].name}`);
      } else if (action === "late") {
        const p = { ...updated[idx], status: "late", lateBy: extra.lateBy };
        updated.splice(idx, 1);
        updated.push(p);
        addLog(`🕐 Late: ${p.name} → moved to end`);
      } else if (action === "reschedule") {
        updated[idx] = {
          ...updated[idx],
          status: "rescheduled",
          rescheduledTo: extra.newTime,
        };
        addLog(`📅 Rescheduled: ${updated[idx].name} → ${extra.newTime}`);
      }
      return recomputeSchedule(updated, driftSeconds);
    });
  };

  const applyAdjust = (pid) => {
    const updated = patients.map((p) =>
      p.id === pid
        ? { ...p, allocatedMins: Math.max(5, p.allocatedMins + adjustMins) }
        : p,
    );
    setPatients(updated);
    addLog(
      `⏱ Time adjusted for #${pid}: ${adjustMins > 0 ? "+" : ""}${adjustMins} min`,
    );
    setAdjusting(null);
    setAdjustMins(0);
  };

  const addCustomer = () => {
    if (!newName.trim()) return;
    const activeP = patients.filter(
      (p) => !["cancelled", "no-show", "rescheduled"].includes(p.status),
    );
    const lastP = activeP[activeP.length - 1];
    const lastMins = parseTimeToMinutes(lastP.scheduled) + lastP.allocatedMins;
    const newP = {
      id: Date.now(),
      name: newName.trim(),
      age: parseInt(newAge) || "",
      type: newType,
      phone: "—",
      status: "waiting",
      allocatedMins: newMins,
      scheduled: minutesToTimeStr(lastMins + Math.round(driftSeconds / 60)),
    };
    setPatients((prev) => [...prev, newP]);
    addLog(`➕ Added: ${newName.trim()} at ${newP.scheduled}`);
    setAddingCustomer(false);
    setNewName("");
    setNewAge("");
    setNewType(biz.types[0]);
    setNewMins(biz.defaultMins);
  };

  const tc = current ? getTypeColor(current.type) : {};
  const progress =
    allocatedSecs > 0
      ? Math.min((sessionSeconds / allocatedSecs) * 100, 100)
      : 0;
  const statsData = [
    { label: "Total", val: patients.length },
    { label: "Done", val: patients.filter((p) => p.status === "done").length },
    {
      label: "Waiting",
      val: patients.filter((p) => ["waiting", "late"].includes(p.status))
        .length,
    },
    {
      label: "Skipped",
      val: patients.filter((p) =>
        ["cancelled", "no-show", "rescheduled"].includes(p.status),
      ).length,
    },
    {
      label: "Drift",
      val: `${driftSeconds >= 0 ? "+" : ""}${Math.round(driftSeconds / 60)}m`,
    },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: isDesktop ? "grid" : "flex",
          gridTemplateColumns: isDesktop ? "1fr 320px" : undefined,
          flexDirection: isDesktop ? undefined : "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Main Panel */}
        <div
          style={{
            overflowY: "auto",
            padding: narrow ? "12px" : "20px",
            paddingBottom: narrow ? 80 : 20,
          }}
        >
          {/* Session Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1.5px solid #D0DFF0",
              padding: narrow ? 14 : 22,
              marginBottom: 16,
              boxShadow: "0 2px 16px rgba(15,39,68,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94A3B8",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {biz.sessionLabel} · Active
              </div>
              {isRunning && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "#16A34A",
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#22C55E",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                  LIVE
                </div>
              )}
            </div>

            {current && currentIdx < patients.length ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: isMobile ? 12 : 16,
                    marginBottom: 18,
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? 50 : 58,
                      height: isMobile ? 50 : 58,
                      borderRadius: 14,
                      flexShrink: 0,
                      background: tc.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMobile ? 20 : 22,
                      fontWeight: 700,
                      color: tc.text,
                    }}
                  >
                    {current.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: isMobile ? 17 : 20,
                        fontWeight: 700,
                        color: "#0F2744",
                        marginBottom: 6,
                      }}
                    >
                      {current.name}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: 12,
                          background: tc.bg,
                          color: tc.text,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontWeight: 600,
                        }}
                      >
                        {current.type}
                      </span>
                      {current.age && (
                        <span
                          style={{
                            fontSize: 12,
                            background: "#F0F6FF",
                            color: "#1A6FA8",
                            padding: "3px 10px",
                            borderRadius: 20,
                          }}
                        >
                          Age {current.age}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 12,
                          background: "#F0F6FF",
                          color: "#1A6FA8",
                          padding: "3px 10px",
                          borderRadius: 20,
                        }}
                      >
                        {current.allocatedMins} min
                      </span>
                      {current.phone && current.phone !== "—" && (
                        <span
                          style={{
                            fontSize: 12,
                            background: "#F8FAFC",
                            color: "#475569",
                            padding: "3px 10px",
                            borderRadius: 20,
                          }}
                        >
                          📞 {current.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: isMobile ? 32 : 38,
                        fontWeight: 700,
                        color: isOvertime ? "#E74C3C" : "#0F2744",
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1,
                      }}
                    >
                      {formatTime(sessionSeconds)}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#7A92B0", marginTop: 4 }}
                    >
                      of {formatTime(allocatedSecs)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    height: 8,
                    background: "#F0F6FF",
                    borderRadius: 99,
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: isOvertime
                        ? "#E74C3C"
                        : progress > 80
                          ? "#F59E0B"
                          : biz.color,
                      borderRadius: 99,
                      transition: "width 0.5s, background 0.3s",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 18,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#7A92B0" }}>
                    {Math.round(progress)}% used
                  </span>
                  {isOvertime ? (
                    <span
                      style={{
                        fontSize: 12,
                        color: "#E74C3C",
                        fontWeight: 600,
                      }}
                    >
                      +{formatTime(sessionSeconds - allocatedSecs)} overtime
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: "#7A92B0" }}>
                      {formatTime(allocatedSecs - sessionSeconds)} remaining
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  {!isRunning ? (
                    <button
                      onClick={startSession}
                      style={{
                        flex: 1,
                        padding: "13px",
                        borderRadius: 10,
                        background: biz.color,
                        color: "#fff",
                        border: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        minHeight: 48,
                      }}
                    >
                      ▶ Start {biz.sessionLabel}
                    </button>
                  ) : (
                    <button
                      onClick={endSession}
                      style={{
                        flex: 1,
                        padding: "13px",
                        borderRadius: 10,
                        background: "#0F2744",
                        color: "#fff",
                        border: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        minHeight: 48,
                      }}
                    >
                      ⏹ End & Next
                    </button>
                  )}
                </div>

                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && note.trim()) {
                      addLog(`📝 Note: ${note.trim()}`);
                      setNote("");
                    }
                  }}
                  placeholder="Note add karein... (Enter dabayein)"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #D0DFF0",
                    fontSize: 13,
                    color: "#0F2744",
                    background: "#F8FAFD",
                    boxSizing: "border-box",
                  }}
                />
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#7A92B0",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <div
                  style={{ fontSize: 16, fontWeight: 600, color: "#0F2744" }}
                >
                  Sab kaam ho gaya!
                </div>
                <div style={{ fontSize: 13 }}>Queue mein koi nahi.</div>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {statsData.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #E2EAF4",
                  padding: "10px 8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color:
                      s.label === "Skipped" && s.val > 0
                        ? "#E74C3C"
                        : "#0F2744",
                  }}
                >
                  {s.val}
                </div>
              </div>
            ))}
          </div>

          {/* Queue Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1.5px solid #D0DFF0",
              padding: narrow ? "14px 12px" : 20,
              boxShadow: "0 2px 16px rgba(15,39,68,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94A3B8",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {biz.queueLabel}
              </div>
              <button
                onClick={() => setAddingCustomer(true)}
                style={{
                  fontSize: 12,
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: "#E8F4FD",
                  color: "#1A6FA8",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  minHeight: 34,
                }}
              >
                + Add
              </button>
            </div>

            {addingCustomer && (
              <div
                style={{
                  background: "#F0F6FF",
                  borderRadius: 12,
                  padding: narrow ? 12 : 16,
                  marginBottom: 14,
                  border: "1.5px dashed #A8C7E0",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Name"
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid #D0DFF0",
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="Age / ID"
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid #D0DFF0",
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid #D0DFF0",
                      fontSize: 13,
                      background: "#fff",
                      boxSizing: "border-box",
                    }}
                  >
                    {biz.types.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <input
                      value={newMins}
                      onChange={(e) => setNewMins(parseInt(e.target.value))}
                      type="number"
                      min="5"
                      max="120"
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: "1px solid #D0DFF0",
                        fontSize: 13,
                        minWidth: 0,
                        boxSizing: "border-box",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: "#7A92B0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      mins
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={addCustomer}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 8,
                      background: biz.color,
                      color: "#fff",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      minHeight: 42,
                    }}
                  >
                    Add to Queue
                  </button>
                  <button
                    onClick={() => setAddingCustomer(false)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      background: "#fff",
                      color: "#7A92B0",
                      border: "1px solid #D0DFF0",
                      fontSize: 13,
                      cursor: "pointer",
                      minHeight: 42,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {patients.map((p, i) => {
              const isDone = [
                "done",
                "cancelled",
                "no-show",
                "rescheduled",
              ].includes(p.status);
              const isCur = i === currentIdx;
              const sm = STATUS_META[p.status] || STATUS_META.waiting;
              const doneIcon =
                { done: "✓", cancelled: "✕", "no-show": "?", rescheduled: "↩" }[
                  p.status
                ] || "✓";
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? 8 : 12,
                    padding: "11px 0",
                    borderBottom:
                      i < patients.length - 1 ? "1px solid #F0F6FF" : "none",
                    opacity: isDone ? 0.4 : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: isCur
                        ? biz.color
                        : isDone
                          ? "#F0F6FF"
                          : "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: isCur ? "#fff" : "#94A3B8",
                      border: isCur ? "none" : "1px solid #E2EAF4",
                    }}
                  >
                    {isDone ? doneIcon : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#0F2744",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: isMobile ? 80 : 150,
                        }}
                      >
                        {p.name}
                      </span>
                      {isCur && (
                        <span
                          style={{
                            fontSize: 10,
                            background: biz.color,
                            color: "#fff",
                            padding: "1px 6px",
                            borderRadius: 10,
                          }}
                        >
                          Active
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 10,
                          background: sm.bg,
                          color: sm.text,
                          padding: "1px 6px",
                          borderRadius: 10,
                          fontWeight: 500,
                        }}
                      >
                        {sm.label}
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}
                    >
                      {p.type} · {p.allocatedMins}m
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: p.status === "rescheduled" ? "#7C3AED" : "#0F2744",
                    }}
                  >
                    {p.status === "rescheduled"
                      ? p.rescheduledTo || "—"
                      : p.scheduled}
                  </div>
                  {i > currentIdx &&
                    !isDone &&
                    (adjusting === p.id ? (
                      <div
                        style={{
                          display: "flex",
                          gap: 3,
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <button
                          onClick={() => setAdjustMins((m) => m - 5)}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            border: "1px solid #D0DFF0",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#1A6FA8",
                            minWidth: 28,
                            textAlign: "center",
                          }}
                        >
                          {adjustMins > 0 ? "+" : ""}
                          {adjustMins}m
                        </span>
                        <button
                          onClick={() => setAdjustMins((m) => m + 5)}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            border: "1px solid #D0DFF0",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => applyAdjust(p.id)}
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "#1A6FA8",
                            color: "#fff",
                            border: "none",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          OK
                        </button>
                        <button
                          onClick={() => {
                            setAdjusting(null);
                            setAdjustMins(0);
                          }}
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "#F0F6FF",
                            color: "#94A3B8",
                            border: "none",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                        <button
                          onClick={() => {
                            setAdjusting(p.id);
                            setAdjustMins(0);
                          }}
                          style={{
                            fontSize: isMobile ? 10 : 11,
                            padding: isMobile ? "4px 7px" : "4px 10px",
                            borderRadius: 6,
                            background: "#F0F6FF",
                            color: "#1A6FA8",
                            border: "1px solid #D0DFF0",
                            cursor: "pointer",
                            fontWeight: 500,
                            minHeight: 30,
                          }}
                        >
                          ⏱{!isMobile && " Adjust"}
                        </button>
                        <button
                          onClick={() => setModalPatient(p)}
                          style={{
                            fontSize: isMobile ? 10 : 11,
                            padding: isMobile ? "4px 7px" : "4px 10px",
                            borderRadius: 6,
                            background: "#FEF9EC",
                            color: "#92400E",
                            border: "1px solid #FDE68A",
                            cursor: "pointer",
                            fontWeight: 500,
                            minHeight: 30,
                          }}
                        >
                          ⚠{!isMobile && " Action"}
                        </button>
                      </div>
                    ))}
                </div>
              );
            })}
          </div>

          {/* Mobile Log */}
          {narrow && (
            <div style={{ marginTop: 14 }}>
              <button
                onClick={() => setShowLog((v) => !v)}
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: 12,
                  background: "#fff",
                  border: "1.5px solid #D0DFF0",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0F2744",
                  cursor: "pointer",
                }}
              >
                {showLog ? "✕ Hide Log" : "📋 Activity Log dekhein"}
              </button>
              {showLog && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1.5px solid #D0DFF0",
                    marginTop: 8,
                    overflow: "hidden",
                    animation: "fadeIn .2s ease",
                  }}
                >
                  {log.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 24,
                        color: "#94A3B8",
                        fontSize: 13,
                      }}
                    >
                      No activity yet
                    </div>
                  ) : (
                    log.map((entry) => (
                      <div
                        key={entry.id}
                        style={{
                          padding: "8px 14px",
                          borderBottom: "1px solid #F8FAFC",
                        }}
                      >
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>
                          {entry.time}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#0F2744",
                            lineHeight: 1.5,
                          }}
                        >
                          {entry.msg}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        {isDesktop && (
          <div
            style={{
              background: "#fff",
              borderLeft: "1px solid #E2EAF4",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #E2EAF4",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94A3B8",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Activity Log
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {log.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: 32,
                    color: "#94A3B8",
                    fontSize: 13,
                  }}
                >
                  No activity yet
                </div>
              ) : (
                log.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: "8px 20px",
                      borderBottom: "1px solid #F8FAFC",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94A3B8",
                        marginBottom: 2,
                      }}
                    >
                      {entry.time}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#0F2744",
                        lineHeight: 1.5,
                      }}
                    >
                      {entry.msg}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ padding: 16, borderTop: "1px solid #E2EAF4" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {statsData.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "#F8FAFD",
                      borderRadius: 10,
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94A3B8",
                        marginBottom: 3,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color:
                          s.label === "Skipped" && s.val > 0
                            ? "#E74C3C"
                            : "#0F2744",
                      }}
                    >
                      {s.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <ActionModal
        patient={modalPatient}
        biz={biz}
        onClose={() => setModalPatient(null)}
        onAction={handleAction}
        patients={patients}
      />
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// Fix: hoist modalPatient state properly inside StaffView
// (Already correctly placed above — the duplicate at bottom was a comment artifact)

// ═══════════════════════════════════════════════════════════════════════════
// APP SHELL (with tabs: Staff / Customer)
// ═══════════════════════════════════════════════════════════════════════════
function AppShell({ bizId, onBack }) {
  const biz = BUSINESSES.find((b) => b.id === bizId);
  const { isMobile, isDesktop } = useBreakpoint();

  const [patients, setPatients] = useState(() =>
    biz.customers.map((c) => ({ ...c, status: "waiting" })),
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [driftSeconds, setDriftSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState("staff");
  const tickRef = useRef(null);

  useEffect(() => {
    if (isRunning)
      tickRef.current = setInterval(
        () => setSessionSeconds((s) => s + 1),
        1000,
      );
    else clearInterval(tickRef.current);
    return () => clearInterval(tickRef.current);
  }, [isRunning]);

  const current = patients[currentIdx];
  const allocatedSecs = current ? current.allocatedMins * 60 : 0;

  const tabStyle = (tab) => ({
    padding: "8px 18px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: activeTab === tab ? biz.color : "transparent",
    color: activeTab === tab ? "#fff" : "#64748B",
    border: `1px solid ${activeTab === tab ? biz.color : "#334155"}`,
    cursor: "pointer",
    minHeight: 36,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F2F4F8",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Nav */}
      <div
        style={{
          background: "#0F2744",
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={onBack}
              style={{
                background: "rgba(255,255,255,.1)",
                border: "none",
                color: "#94A3B8",
                borderRadius: 8,
                width: 32,
                height: 32,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ←
            </button>
            <span style={{ fontSize: 24 }}>{biz.icon}</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
                {biz.name}
              </div>
              <div style={{ color: "#64748B", fontSize: 11 }}>QueueMaster</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {Math.abs(driftSeconds) > 60 && (
              <div
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontWeight: 600,
                  background: driftSeconds > 0 ? "#7C2D12" : "#14532D",
                  color: driftSeconds > 0 ? "#FED7AA" : "#BBF7D0",
                }}
              >
                {driftSeconds > 0 ? "+" : ""}
                {Math.round(driftSeconds / 60)}m{" "}
                {driftSeconds > 0 ? "late" : "early"}
              </div>
            )}
            {!isMobile && (
              <div style={{ fontSize: 12, color: "#7A9CC0" }}>
                {
                  patients.filter((p) => ["waiting", "late"].includes(p.status))
                    .length
                }{" "}
                waiting
              </div>
            )}
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ padding: "0 0 10px", display: "flex", gap: 6 }}>
          <button
            style={tabStyle("staff")}
            onClick={() => setActiveTab("staff")}
          >
            🧑‍💼 {isMobile ? "Staff" : `${biz.staffLabel} View`}
          </button>
          <button
            style={tabStyle("customer")}
            onClick={() => setActiveTab("customer")}
          >
            👤 {isMobile ? "Customer" : "Customer View"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {activeTab === "staff" ? (
          <StaffViewWrapper
            biz={biz}
            patients={patients}
            setPatients={setPatients}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
            sessionSeconds={sessionSeconds}
            setSessionSeconds={setSessionSeconds}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            driftSeconds={driftSeconds}
            setDriftSeconds={setDriftSeconds}
          />
        ) : (
          <CustomerView
            biz={biz}
            patients={patients}
            currentIdx={currentIdx}
            sessionSeconds={sessionSeconds}
            allocatedSeconds={allocatedSecs}
            driftSeconds={driftSeconds}
          />
        )}
      </div>
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// Wrapper to keep modalPatient state inside StaffView properly
function StaffViewWrapper(props) {
  const [modalPatient, setModalPatient] = useState(null);
  const {
    biz,
    patients,
    setPatients,
    currentIdx,
    setCurrentIdx,
    sessionSeconds,
    setSessionSeconds,
    isRunning,
    setIsRunning,
    driftSeconds,
    setDriftSeconds,
  } = props;
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const narrow = isMobile || isTablet;

  const current = patients[currentIdx];
  const allocatedSecs = current ? current.allocatedMins * 60 : 0;
  const isOvertime = sessionSeconds > allocatedSecs;
  const [adjusting, setAdjusting] = useState(null);
  const [adjustMins, setAdjustMins] = useState(0);
  const [log, setLog] = useState([]);
  const [note, setNote] = useState("");
  const [showLog, setShowLog] = useState(false);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newType, setNewType] = useState(biz.types[0]);
  const [newMins, setNewMins] = useState(biz.defaultMins);

  const addLog = useCallback((msg) => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLog((prev) =>
      [{ msg, time: timeStr, id: Date.now() }, ...prev].slice(0, 25),
    );
  }, []);

  const startSession = () => {
    setIsRunning(true);
    setSessionSeconds(0);
    setPatients((prev) =>
      prev.map((p, i) => (i === currentIdx ? { ...p, status: "active" } : p)),
    );
    addLog(`▶ ${biz.sessionLabel} started: ${current.name}`);
  };

  const endSession = () => {
    setIsRunning(false);
    const extra = sessionSeconds - allocatedSecs;
    const newDrift = driftSeconds + extra;
    setDriftSeconds(newDrift);
    addLog(
      `⏹ Done: ${current.name} (${formatTime(sessionSeconds)} | drift ${extra >= 0 ? "+" : ""}${Math.round(extra / 60)}m)`,
    );
    setPatients((prev) => {
      const updated = prev.map((p, i) =>
        i === currentIdx ? { ...p, status: "done" } : p,
      );
      return recomputeSchedule(updated, newDrift);
    });
    if (currentIdx < patients.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSessionSeconds(0);
    } else setCurrentIdx((c) => c + 1);
  };

  const handleAction = (action, pid, extra) => {
    setPatients((prev) => {
      let updated = [...prev];
      const idx = updated.findIndex((p) => p.id === pid);
      if (action === "cancel") {
        updated[idx] = { ...updated[idx], status: "cancelled" };
        addLog(`🚫 Cancelled: ${updated[idx].name}`);
      } else if (action === "no-show") {
        updated[idx] = { ...updated[idx], status: "no-show" };
        addLog(`❓ No Show: ${updated[idx].name}`);
      } else if (action === "late") {
        const p = { ...updated[idx], status: "late", lateBy: extra.lateBy };
        updated.splice(idx, 1);
        updated.push(p);
        addLog(`🕐 Late: ${p.name} → end`);
      } else if (action === "reschedule") {
        updated[idx] = {
          ...updated[idx],
          status: "rescheduled",
          rescheduledTo: extra.newTime,
        };
        addLog(`📅 Rescheduled: ${updated[idx].name} → ${extra.newTime}`);
      }
      return recomputeSchedule(updated, driftSeconds);
    });
  };

  const applyAdjust = (pid) => {
    setPatients(
      patients.map((p) =>
        p.id === pid
          ? { ...p, allocatedMins: Math.max(5, p.allocatedMins + adjustMins) }
          : p,
      ),
    );
    addLog(
      `⏱ Adjusted: ${adjustMins > 0 ? "+" : ""}${adjustMins}m for ${patients.find((p) => p.id === pid)?.name}`,
    );
    setAdjusting(null);
    setAdjustMins(0);
  };

  const addCustomer = () => {
    if (!newName.trim()) return;
    const activeP = patients.filter(
      (p) => !["cancelled", "no-show", "rescheduled"].includes(p.status),
    );
    const lastP = activeP[activeP.length - 1];
    const lastMins = parseTimeToMinutes(lastP.scheduled) + lastP.allocatedMins;
    const newP = {
      id: Date.now(),
      name: newName.trim(),
      age: newAge || "",
      type: newType,
      phone: "—",
      status: "waiting",
      allocatedMins: newMins,
      scheduled: minutesToTimeStr(lastMins + Math.round(driftSeconds / 60)),
    };
    setPatients((prev) => [...prev, newP]);
    addLog(`➕ Added: ${newName.trim()} at ${newP.scheduled}`);
    setAddingCustomer(false);
    setNewName("");
    setNewAge("");
    setNewType(biz.types[0]);
    setNewMins(biz.defaultMins);
  };

  const tc = current ? getTypeColor(current.type) : {};
  const progress =
    allocatedSecs > 0
      ? Math.min((sessionSeconds / allocatedSecs) * 100, 100)
      : 0;
  const statsData = [
    { label: "Total", val: patients.length },
    { label: "Done", val: patients.filter((p) => p.status === "done").length },
    {
      label: "Waiting",
      val: patients.filter((p) => ["waiting", "late"].includes(p.status))
        .length,
    },
    {
      label: "Skipped",
      val: patients.filter((p) =>
        ["cancelled", "no-show", "rescheduled"].includes(p.status),
      ).length,
    },
    {
      label: "Drift",
      val: `${driftSeconds >= 0 ? "+" : ""}${Math.round(driftSeconds / 60)}m`,
    },
  ];

  return (
    <div
      style={{
        display: isDesktop ? "grid" : "flex",
        gridTemplateColumns: isDesktop ? "1fr 320px" : undefined,
        flexDirection: isDesktop ? undefined : "column",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          overflowY: "auto",
          padding: narrow ? "12px" : "20px",
          paddingBottom: narrow ? 80 : 20,
        }}
      >
        {/* Session Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #D0DFF0",
            padding: narrow ? 14 : 22,
            marginBottom: 16,
            boxShadow: "0 2px 16px rgba(15,39,68,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {biz.sessionLabel} · Active
            </div>
            {isRunning && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#16A34A",
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22C55E",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                LIVE
              </div>
            )}
          </div>
          {current && currentIdx < patients.length ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: isMobile ? 12 : 16,
                  marginBottom: 18,
                  flexWrap: isMobile ? "wrap" : "nowrap",
                }}
              >
                <div
                  style={{
                    width: isMobile ? 50 : 58,
                    height: isMobile ? 50 : 58,
                    borderRadius: 14,
                    flexShrink: 0,
                    background: tc.bg || "#F0F6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 20 : 22,
                    fontWeight: 700,
                    color: tc.text || "#1A6FA8",
                  }}
                >
                  {current.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: isMobile ? 17 : 20,
                      fontWeight: 700,
                      color: "#0F2744",
                      marginBottom: 6,
                    }}
                  >
                    {current.name}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 12,
                        background: tc.bg || "#F0F6FF",
                        color: tc.text || "#1A6FA8",
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      {current.type}
                    </span>
                    {current.age && (
                      <span
                        style={{
                          fontSize: 12,
                          background: "#F0F6FF",
                          color: "#1A6FA8",
                          padding: "3px 10px",
                          borderRadius: 20,
                        }}
                      >
                        Age {current.age}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 12,
                        background: "#F0F6FF",
                        color: "#1A6FA8",
                        padding: "3px 10px",
                        borderRadius: 20,
                      }}
                    >
                      {current.allocatedMins} min
                    </span>
                    {current.phone && current.phone !== "—" && (
                      <span
                        style={{
                          fontSize: 12,
                          background: "#F8FAFC",
                          color: "#475569",
                          padding: "3px 10px",
                          borderRadius: 20,
                        }}
                      >
                        📞 {current.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: isMobile ? 32 : 38,
                      fontWeight: 700,
                      color: isOvertime ? "#E74C3C" : "#0F2744",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1,
                    }}
                  >
                    {formatTime(sessionSeconds)}
                  </div>
                  <div style={{ fontSize: 12, color: "#7A92B0", marginTop: 4 }}>
                    of {formatTime(allocatedSecs)}
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: 8,
                  background: "#F0F6FF",
                  borderRadius: 99,
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: isOvertime
                      ? "#E74C3C"
                      : progress > 80
                        ? "#F59E0B"
                        : biz.color,
                    borderRadius: 99,
                    transition: "width 0.5s, background 0.3s",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <span style={{ fontSize: 12, color: "#7A92B0" }}>
                  {Math.round(progress)}% used
                </span>
                {isOvertime ? (
                  <span
                    style={{ fontSize: 12, color: "#E74C3C", fontWeight: 600 }}
                  >
                    +{formatTime(sessionSeconds - allocatedSecs)} overtime
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: "#7A92B0" }}>
                    {formatTime(allocatedSecs - sessionSeconds)} remaining
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                {!isRunning ? (
                  <button
                    onClick={startSession}
                    style={{
                      flex: 1,
                      padding: "13px",
                      borderRadius: 10,
                      background: biz.color,
                      color: "#fff",
                      border: "none",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      minHeight: 48,
                    }}
                  >
                    ▶ Start {biz.sessionLabel}
                  </button>
                ) : (
                  <button
                    onClick={endSession}
                    style={{
                      flex: 1,
                      padding: "13px",
                      borderRadius: 10,
                      background: "#0F2744",
                      color: "#fff",
                      border: "none",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      minHeight: 48,
                    }}
                  >
                    ⏹ End & Next
                  </button>
                )}
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && note.trim()) {
                    addLog(`📝 Note: ${note.trim()}`);
                    setNote("");
                  }
                }}
                placeholder="Note add karein... (Enter dabayein)"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #D0DFF0",
                  fontSize: 13,
                  color: "#0F2744",
                  background: "#F8FAFD",
                  boxSizing: "border-box",
                }}
              />
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#7A92B0",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#0F2744" }}>
                Sab kaam ho gaya!
              </div>
              <div style={{ fontSize: 13 }}>Queue mein koi nahi.</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {statsData.map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #E2EAF4",
                padding: "10px 8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  marginBottom: 4,
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color:
                    s.label === "Skipped" && s.val > 0 ? "#E74C3C" : "#0F2744",
                }}
              >
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Queue */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #D0DFF0",
            padding: narrow ? "14px 12px" : 20,
            boxShadow: "0 2px 16px rgba(15,39,68,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {biz.queueLabel}
            </div>
            <button
              onClick={() => setAddingCustomer(true)}
              style={{
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 8,
                background: "#E8F4FD",
                color: "#1A6FA8",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
                minHeight: 34,
              }}
            >
              + Add
            </button>
          </div>

          {addingCustomer && (
            <div
              style={{
                background: "#F0F6FF",
                borderRadius: 12,
                padding: 14,
                marginBottom: 14,
                border: "1.5px dashed #A8C7E0",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name"
                  style={{
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #D0DFF0",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
                <input
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  placeholder="Age / ID"
                  style={{
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #D0DFF0",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  style={{
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #D0DFF0",
                    fontSize: 13,
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                >
                  {biz.types.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    value={newMins}
                    onChange={(e) => setNewMins(parseInt(e.target.value))}
                    type="number"
                    min="5"
                    max="120"
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid #D0DFF0",
                      fontSize: 13,
                      minWidth: 0,
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: "#7A92B0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    mins
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={addCustomer}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 8,
                    background: biz.color,
                    color: "#fff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    minHeight: 42,
                  }}
                >
                  Add to Queue
                </button>
                <button
                  onClick={() => setAddingCustomer(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    background: "#fff",
                    color: "#7A92B0",
                    border: "1px solid #D0DFF0",
                    fontSize: 13,
                    cursor: "pointer",
                    minHeight: 42,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {patients.map((p, i) => {
            const isDone = [
              "done",
              "cancelled",
              "no-show",
              "rescheduled",
            ].includes(p.status);
            const isCur = i === currentIdx;
            const sm = STATUS_META[p.status] || STATUS_META.waiting;
            const doneIcon =
              { done: "✓", cancelled: "✕", "no-show": "?", rescheduled: "↩" }[
                p.status
              ] || "✓";
            return (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 8 : 12,
                  padding: "11px 0",
                  borderBottom:
                    i < patients.length - 1 ? "1px solid #F0F6FF" : "none",
                  opacity: isDone ? 0.4 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: isCur
                      ? biz.color
                      : isDone
                        ? "#F0F6FF"
                        : "#F8FAFC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: isCur ? "#fff" : "#94A3B8",
                    border: isCur ? "none" : "1px solid #E2EAF4",
                  }}
                >
                  {isDone ? doneIcon : i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0F2744",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: isMobile ? 80 : 150,
                      }}
                    >
                      {p.name}
                    </span>
                    {isCur && (
                      <span
                        style={{
                          fontSize: 10,
                          background: biz.color,
                          color: "#fff",
                          padding: "1px 6px",
                          borderRadius: 10,
                        }}
                      >
                        Active
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 10,
                        background: sm.bg,
                        color: sm.text,
                        padding: "1px 6px",
                        borderRadius: 10,
                        fontWeight: 500,
                      }}
                    >
                      {sm.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                    {p.type} · {p.allocatedMins}m
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: p.status === "rescheduled" ? "#7C3AED" : "#0F2744",
                  }}
                >
                  {p.status === "rescheduled"
                    ? p.rescheduledTo || "—"
                    : p.scheduled}
                </div>
                {i > currentIdx &&
                  !isDone &&
                  (adjusting === p.id ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 3,
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <button
                        onClick={() => setAdjustMins((m) => m - 5)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: "1px solid #D0DFF0",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#1A6FA8",
                          minWidth: 28,
                          textAlign: "center",
                        }}
                      >
                        {adjustMins > 0 ? "+" : ""}
                        {adjustMins}m
                      </span>
                      <button
                        onClick={() => setAdjustMins((m) => m + 5)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: "1px solid #D0DFF0",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => applyAdjust(p.id)}
                        style={{
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "#1A6FA8",
                          color: "#fff",
                          border: "none",
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        OK
                      </button>
                      <button
                        onClick={() => {
                          setAdjusting(null);
                          setAdjustMins(0);
                        }}
                        style={{
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "#F0F6FF",
                          color: "#94A3B8",
                          border: "none",
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                      <button
                        onClick={() => {
                          setAdjusting(p.id);
                          setAdjustMins(0);
                        }}
                        style={{
                          fontSize: isMobile ? 10 : 11,
                          padding: isMobile ? "4px 7px" : "4px 10px",
                          borderRadius: 6,
                          background: "#F0F6FF",
                          color: "#1A6FA8",
                          border: "1px solid #D0DFF0",
                          cursor: "pointer",
                          fontWeight: 500,
                          minHeight: 30,
                        }}
                      >
                        ⏱{!isMobile && " Adjust"}
                      </button>
                      <button
                        onClick={() => setModalPatient(p)}
                        style={{
                          fontSize: isMobile ? 10 : 11,
                          padding: isMobile ? "4px 7px" : "4px 10px",
                          borderRadius: 6,
                          background: "#FEF9EC",
                          color: "#92400E",
                          border: "1px solid #FDE68A",
                          cursor: "pointer",
                          fontWeight: 500,
                          minHeight: 30,
                        }}
                      >
                        ⚠{!isMobile && " Action"}
                      </button>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>

        {narrow && (
          <div style={{ marginTop: 14 }}>
            <button
              onClick={() => setShowLog((v) => !v)}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 12,
                background: "#fff",
                border: "1.5px solid #D0DFF0",
                fontSize: 13,
                fontWeight: 600,
                color: "#0F2744",
                cursor: "pointer",
              }}
            >
              {showLog ? "✕ Hide Log" : "📋 Activity Log"}
            </button>
            {showLog && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1.5px solid #D0DFF0",
                  marginTop: 8,
                  overflow: "hidden",
                }}
              >
                {log.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 24,
                      color: "#94A3B8",
                      fontSize: 13,
                    }}
                  >
                    No activity yet
                  </div>
                ) : (
                  log.map((e) => (
                    <div
                      key={e.id}
                      style={{
                        padding: "8px 14px",
                        borderBottom: "1px solid #F8FAFC",
                      }}
                    >
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>
                        {e.time}
                      </div>
                      <div style={{ fontSize: 12, color: "#0F2744" }}>
                        {e.msg}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {isDesktop && (
        <div
          style={{
            background: "#fff",
            borderLeft: "1px solid #E2EAF4",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{ padding: "16px 20px", borderBottom: "1px solid #E2EAF4" }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Activity Log
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {log.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 32,
                  color: "#94A3B8",
                  fontSize: 13,
                }}
              >
                No activity yet
              </div>
            ) : (
              log.map((e) => (
                <div
                  key={e.id}
                  style={{
                    padding: "8px 20px",
                    borderBottom: "1px solid #F8FAFC",
                  }}
                >
                  <div
                    style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}
                  >
                    {e.time}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#0F2744", lineHeight: 1.5 }}
                  >
                    {e.msg}
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: 16, borderTop: "1px solid #E2EAF4" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {statsData.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "#F8FAFD",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color:
                        s.label === "Skipped" && s.val > 0
                          ? "#E74C3C"
                          : "#0F2744",
                    }}
                  >
                    {s.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ActionModal
        patient={modalPatient}
        biz={biz}
        onClose={() => setModalPatient(null)}
        onAction={handleAction}
        patients={patients}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [selectedBiz, setSelectedBiz] = useState(null);

  if (!selectedBiz) {
    return <SelectorScreen onSelect={(id) => setSelectedBiz(id)} />;
  }
  return <AppShell bizId={selectedBiz} onBack={() => setSelectedBiz(null)} />;
}
