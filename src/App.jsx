import { useState, useEffect, useRef, useCallback } from "react";

// ─── Sample Data ───────────────────────────────────────────────────────────
const INITIAL_PATIENTS = [
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
    type: "New Consultation",
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
    type: "New Consultation",
    scheduled: "11:00 AM",
    allocatedMins: 20,
    phone: "98100-55555",
  },
  {
    id: 6,
    name: "Kavya Reddy",
    age: 22,
    type: "Follow-up",
    scheduled: "11:20 AM",
    allocatedMins: 15,
    phone: "98100-66666",
  },
].map((p) => ({ ...p, status: "waiting" }));

const TYPE_COLORS = {
  "Follow-up": { bg: "#E8F4FD", text: "#1A6FA8", dot: "#3B9ADE" },
  "New Consultation": { bg: "#EDF7EE", text: "#1A6B3A", dot: "#34A85A" },
  Emergency: { bg: "#FEF0F0", text: "#C0392B", dot: "#E74C3C" },
};

const STATUS_META = {
  waiting: { label: "Waiting", bg: "#F0F6FF", text: "#1A6FA8" },
  active: { label: "In Session", bg: "#E6FAF0", text: "#0F7B45" },
  done: { label: "Done", bg: "#F0F6FF", text: "#7A92B0" },
  cancelled: { label: "Cancelled", bg: "#FEF0F0", text: "#C0392B" },
  late: { label: "Late", bg: "#FEF9EC", text: "#92400E" },
  rescheduled: { label: "Rescheduled", bg: "#F5F0FF", text: "#6B21A8" },
  "no-show": { label: "No Show", bg: "#F9FAFB", text: "#6B7280" },
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
        : parseTimeToMinutes(INITIAL_PATIENTS[i]?.scheduled || p.scheduled) +
          Math.round(driftSeconds / 60);
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

// ─── Global Styles ────────────────────────────────────────────────────────────
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
// OFFLINE BANNER
// ═══════════════════════════════════════════════════════════════════════════
function OfflineBanner({ offline, lastSync }) {
  if (!offline) return null;
  return (
    <div
      style={{
        background: "#7C2D12",
        color: "#FED7AA",
        fontSize: 12,
        fontWeight: 500,
        textAlign: "center",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <span>⚠️</span>
      <span>
        Aap offline hain — data locally save hai.
        {lastSync ? ` Last sync: ${lastSync}` : ""}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTION MODAL  (Cancel / Late / Reschedule / No-Show)
// ═══════════════════════════════════════════════════════════════════════════
function ActionModal({ patient, onClose, onAction, patients }) {
  const [screen, setScreen] = useState("main");
  const [reschedSlot, setReschedSlot] = useState("");
  const [lateBy, setLateBy] = useState(10);
  const [reason, setReason] = useState("");
  const { isMobile } = useBreakpoint();

  if (!patient) return null;

  const lastActive = [...patients]
    .reverse()
    .find((p) => p.status === "waiting");
  const suggestedSlot = lastActive
    ? minutesToTimeStr(
        parseTimeToMinutes(lastActive.scheduled) + lastActive.allocatedMins,
      )
    : "12:00 PM";

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(15,39,68,0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: isMobile ? "flex-end" : "center",
    justifyContent: "center",
    padding: isMobile ? 0 : 16,
  };
  const box = {
    background: "#fff",
    borderRadius: isMobile ? "20px 20px 0 0" : 18,
    padding: isMobile ? "8px 16px 36px" : 24,
    width: "100%",
    maxWidth: isMobile ? "100%" : 440,
    maxHeight: "90vh",
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
        {/* Drag handle */}
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

        {/* Header */}
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
              background: "#E8F4FD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#1A6FA8",
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
              {patient.type} · Scheduled {patient.scheduled}
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
              flexShrink: 0,
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

        {/* ── Main Screen ── */}
        {screen === "main" && (
          <>
            <div style={{ fontSize: 13, color: "#7A92B0", marginBottom: 14 }}>
              Patient ki situation kya hai? Sahi option chunein:
            </div>
            {[
              {
                icon: "🚫",
                label: "Cancel Appointment",
                sub: "Patient nahi aayega — slot free karo",
                clr: "#FEF0F0",
                tc: "#C0392B",
                go: "cancel",
              },
              {
                icon: "🕐",
                label: "Patient Late Aaya",
                sub: "Der se aaya — queue ke last mein bhejo",
                clr: "#FEF9EC",
                tc: "#92400E",
                go: "late",
              },
              {
                icon: "📅",
                label: "Reschedule Karo",
                sub: "Kisi aur time ya din pe slot do",
                clr: "#F5F0FF",
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
                <span style={{ color: opt.tc, fontSize: 20, flexShrink: 0 }}>
                  ›
                </span>
              </div>
            ))}
          </>
        )}

        {/* ── Cancel Screen ── */}
        {screen === "cancel" && (
          <>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#C0392B",
                marginBottom: 12,
              }}
            >
              🚫 Appointment Cancel
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
              ⚠ Yeh slot khatam ho jaayega. Baaki patients ke times
              automatically update ho jaayenge.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <PrimaryBtn
                label="Confirm Cancel"
                bg="#C0392B"
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

        {/* ── Late Screen ── */}
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
              🕐 Patient Late — Kitni Der?
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
                    border: `1.5px solid ${lateBy === m ? "#1A6FA8" : "#D0DFF0"}`,
                    background: lateBy === m ? "#E8F4FD" : "#fff",
                    color: lateBy === m ? "#1A6FA8" : "#7A92B0",
                    fontSize: 13,
                    fontWeight: lateBy === m ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  {m} min
                </button>
              ))}
            </div>
            <div
              style={{
                background: "#F0F6FF",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 12,
                color: "#1A6FA8",
                marginBottom: 14,
              }}
            >
              Patient queue ke last mein move ho jaayega. Baaki patients ka
              schedule theek rahega.
            </div>
            <NoteArea placeholder="Note (optional)..." />
            <div style={{ display: "flex", gap: 8 }}>
              <PrimaryBtn
                label="Queue ke Last mein Bhejo"
                bg="#1A6FA8"
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

        {/* ── Reschedule Screen ── */}
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
              📅 Reschedule Appointment
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
              💡 Suggested next slot: <strong>{suggestedSlot}</strong> (queue ke
              baad)
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
                      minHeight: 38,
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

        {/* ── No Show Screen ── */}
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
              Patient aaya hi nahi aur koi response nahi. Slot skip hoga, agli
              appointments time pe chalti rahein.
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
// PATIENT WAITING ROOM VIEW
// ═══════════════════════════════════════════════════════════════════════════
function PatientView({
  patients,
  currentIdx,
  sessionSeconds,
  allocatedSeconds,
  driftSeconds,
  offline,
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
      <OfflineBanner offline={offline} />

      {/* Header */}
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
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#1A6FA8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                fill="#fff"
              />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0F2744" }}>
              MediQueue
            </div>
            <div style={{ fontSize: 11, color: "#7A92B0" }}>
              Patient Waiting Room
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {offline && (
            <div
              style={{
                fontSize: 11,
                background: "#FEF0F0",
                color: "#C0392B",
                padding: "3px 10px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              ● Offline
            </div>
          )}
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
      </div>

      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: narrow ? "14px 12px" : "24px 16px",
        }}
      >
        {/* Currently In Session Card */}
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
              Currently In Session
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: narrow ? "flex-start" : "center",
              gap: narrow ? 12 : 14,
              marginBottom: 16,
              flexWrap: narrow ? "wrap" : "nowrap",
            }}
          >
            <div
              style={{
                width: narrow ? 48 : 52,
                height: narrow ? 48 : 52,
                borderRadius: 14,
                background: "#E8F4FD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: narrow ? 18 : 20,
                fontWeight: 700,
                color: "#1A6FA8",
                flexShrink: 0,
              }}
            >
              {current ? current.name.charAt(0) : "?"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: narrow ? 15 : 17,
                  fontWeight: 600,
                  color: "#0F2744",
                  marginBottom: 3,
                }}
              >
                {current ? current.name : "Waiting..."}
              </div>
              <div style={{ fontSize: 13, color: "#7A92B0" }}>
                {current ? `${current.type} · Age ${current.age}` : ""}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: narrow ? 24 : 26,
                  fontWeight: 700,
                  color: isOvertime ? "#E74C3C" : "#1A6FA8",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTime(sessionSeconds)}
              </div>
              <div style={{ fontSize: 11, color: "#7A92B0" }}>
                /{formatTime(allocatedSeconds)} alloc.
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
                    : "#1A6FA8",
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
              ⚠ Session running {formatTime(sessionSeconds - allocatedSeconds)}{" "}
              over time
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
                ? `Schedule ~${Math.round(driftSeconds / 60)} min late hai. Aapka time automatically update ho gaya.`
                : `Doctor ~${Math.round(Math.abs(driftSeconds) / 60)} min pehle chal rahe hain! Aap jaldi bulaye ja sakte hain.`}
            </span>
          </div>
        )}

        {/* Queue list */}
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
          Waiting Queue
        </div>

        {activeQueue.map((p, i) => {
          const tc = TYPE_COLORS[p.type] || TYPE_COLORS["Follow-up"];
          const isNext = i === 0;
          return (
            <div
              key={p.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: `1.5px solid ${isNext ? "#1A6FA8" : "#E2EAF4"}`,
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
                  background: isNext ? "#1A6FA8" : "#F0F6FF",
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
                    color: isNext ? "#1A6FA8" : "#0F2744",
                  }}
                >
                  {p.scheduled}
                </div>
                {isNext && (
                  <div style={{ fontSize: 11, color: "#1A6FA8", marginTop: 2 }}>
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
            No more patients in queue
          </div>
        )}
      </div>

      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ASSISTANT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function AssistantView({
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
  offline,
  lastSync,
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

  const [addingPatient, setAddingPatient] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newType, setNewType] = useState("Follow-up");
  const [newMins, setNewMins] = useState(15);

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

  // ── Session controls ─────────────────────────────────────────────────────
  const startSession = () => {
    setIsRunning(true);
    setSessionSeconds(0);
    setPatients((prev) =>
      prev.map((p, i) => (i === currentIdx ? { ...p, status: "active" } : p)),
    );
    addLog(`▶ Session started: ${current.name}`);
  };

  const endSession = () => {
    setIsRunning(false);
    const extra = sessionSeconds - allocatedSecs;
    const newDrift = driftSeconds + extra;
    setDriftSeconds(newDrift);
    addLog(
      `⏹ Session ended: ${current.name} (${formatTime(sessionSeconds)} | drift ${extra >= 0 ? "+" : ""}${Math.round(extra / 60)}m)`,
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

  // ── Action modal handler ─────────────────────────────────────────────────
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
        addLog(`🕐 Late: ${p.name} → moved to end of queue`);
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

  // ── Adjust allocated time ────────────────────────────────────────────────
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

  // ── Add patient ──────────────────────────────────────────────────────────
  const addPatient = () => {
    if (!newName.trim()) return;
    const activePatients = patients.filter(
      (p) => !["cancelled", "no-show", "rescheduled"].includes(p.status),
    );
    const lastP = activePatients[activePatients.length - 1];
    const lastMins = parseTimeToMinutes(lastP.scheduled) + lastP.allocatedMins;
    const newP = {
      id: Date.now(),
      name: newName.trim(),
      age: parseInt(newAge) || 30,
      type: newType,
      phone: "—",
      status: "waiting",
      allocatedMins: newMins,
      scheduled: minutesToTimeStr(lastMins + Math.round(driftSeconds / 60)),
    };
    setPatients((prev) => [...prev, newP]);
    addLog(`➕ New patient added: ${newName.trim()} at ${newP.scheduled}`);
    setAddingPatient(false);
    setNewName("");
    setNewAge("");
    setNewType("Follow-up");
    setNewMins(15);
  };

  const tc = current
    ? TYPE_COLORS[current.type] || TYPE_COLORS["Follow-up"]
    : {};
  const progress =
    allocatedSecs > 0
      ? Math.min((sessionSeconds / allocatedSecs) * 100, 100)
      : 0;

  // ── Stats data ───────────────────────────────────────────────────────────
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
    { label: "Network", val: offline ? "Offline" : "Online" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFD",
        fontFamily: "'DM Sans', sans-serif",
        paddingBottom: narrow ? 80 : 0,
      }}
    >
      <OfflineBanner offline={offline} lastSync={lastSync} />

      {/* Top Nav */}
      <div
        style={{
          background: "#0F2744",
          padding: narrow ? "0 14px" : "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          position: "sticky",
          top: 0,
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#1A6FA8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                fill="#fff"
              />
            </svg>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
            MediQueue
          </span>
          {!isMobile && (
            <span style={{ color: "#4A7FA8", fontSize: 13, marginLeft: 2 }}>
              · Assistant
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: isMobile ? 6 : 8,
            alignItems: "center",
          }}
        >
          {offline && (
            <div
              style={{
                fontSize: 11,
                background: "#7C2D12",
                color: "#FED7AA",
                padding: "4px 10px",
                borderRadius: 20,
                fontWeight: 500,
              }}
            >
              ● Offline
            </div>
          )}
          {Math.abs(driftSeconds) > 60 && (
            <div
              style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 20,
                fontWeight: 500,
                background: driftSeconds > 0 ? "#7C2D12" : "#14532D",
                color: driftSeconds > 0 ? "#FED7AA" : "#BBF7D0",
              }}
            >
              {driftSeconds > 0
                ? `+${Math.round(driftSeconds / 60)}m late`
                : `${Math.round(driftSeconds / 60)}m early`}
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
          {/* Log toggle for narrow screens */}
          {narrow && (
            <button
              onClick={() => setShowLog((v) => !v)}
              style={{
                fontSize: 11,
                padding: "5px 11px",
                borderRadius: 20,
                background: showLog ? "#1A6FA8" : "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {showLog ? "✕ Log" : "📋 Log"}
            </button>
          )}
        </div>
      </div>

      {/* Body layout */}
      <div
        style={{
          display: isDesktop ? "grid" : "flex",
          gridTemplateColumns: isDesktop ? "1fr 340px" : undefined,
          flexDirection: isDesktop ? undefined : "column",
          height: isDesktop ? "calc(100vh - 56px)" : "auto",
        }}
      >
        {/* ── Main Panel ── */}
        <div style={{ padding: narrow ? "12px" : "24px", overflowY: "auto" }}>
          {/* Active Session Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1.5px solid #D0DFF0",
              padding: narrow ? 14 : 24,
              marginBottom: 18,
              boxShadow: "0 2px 16px rgba(15,39,68,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#7A92B0",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Active Session
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
                    marginBottom: 20,
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? 50 : 60,
                      height: isMobile ? 50 : 60,
                      borderRadius: 16,
                      background: tc.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMobile ? 20 : 24,
                      fontWeight: 700,
                      color: tc.text,
                      flexShrink: 0,
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

                {/* Progress bar */}
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
                          : "#1A6FA8",
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

                {/* Controls */}
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  {!isRunning ? (
                    <button
                      onClick={startSession}
                      style={{
                        flex: 1,
                        padding: "13px",
                        borderRadius: 10,
                        background: "#1A6FA8",
                        color: "#fff",
                        border: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        minHeight: 48,
                      }}
                    >
                      ▶ Start Session
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
                      ⏹ End Session & Next Patient
                    </button>
                  )}
                </div>

                {/* Note input */}
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && note.trim()) {
                      addLog(`📝 Note: ${note.trim()}`);
                      setNote("");
                    }
                  }}
                  placeholder="Add session note... (press Enter)"
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
                  All sessions complete!
                </div>
                <div style={{ fontSize: 13 }}>No more patients in queue.</div>
              </div>
            )}
          </div>

          {/* Patient Queue */}
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
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#7A92B0",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Patient Queue
              </div>
              <button
                onClick={() => setAddingPatient(true)}
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
                + Add Patient
              </button>
            </div>

            {/* Add patient form */}
            {addingPatient && (
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
                    placeholder="Patient name"
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
                    placeholder="Age"
                    type="number"
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
                    <option>Follow-up</option>
                    <option>New Consultation</option>
                    <option>Emergency</option>
                  </select>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <input
                      value={newMins}
                      onChange={(e) => setNewMins(parseInt(e.target.value))}
                      type="number"
                      min="5"
                      max="60"
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
                    onClick={addPatient}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 8,
                      background: "#1A6FA8",
                      color: "#fff",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      minHeight: 42,
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setAddingPatient(false)}
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

            {/* Queue rows */}
            {patients.map((p, i) => {
              const isDone = [
                "done",
                "cancelled",
                "no-show",
                "rescheduled",
              ].includes(p.status);
              const isCurrent = i === currentIdx;
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
                    padding: "12px 0",
                    borderBottom:
                      i < patients.length - 1 ? "1px solid #F0F6FF" : "none",
                    opacity: isDone ? 0.4 : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  {/* Number badge */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: isCurrent
                        ? "#1A6FA8"
                        : isDone
                          ? "#F0F6FF"
                          : "#F8FAFD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: isCurrent ? "#fff" : "#7A92B0",
                      border: isCurrent ? "none" : "1px solid #E2EAF4",
                    }}
                  >
                    {isDone ? doneIcon : i + 1}
                  </div>

                  {/* Name + type */}
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
                          maxWidth: isMobile ? 80 : 160,
                        }}
                      >
                        {p.name}
                      </span>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: 10,
                            background: "#E8F4FD",
                            color: "#1A6FA8",
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
                      style={{ fontSize: 11, color: "#7A92B0", marginTop: 1 }}
                    >
                      {p.type} · {p.allocatedMins} min
                    </div>
                  </div>

                  {/* Time */}
                  <div
                    style={{
                      textAlign: "right",
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: p.status === "rescheduled" ? "#6B21A8" : "#0F2744",
                    }}
                  >
                    {p.status === "rescheduled"
                      ? p.rescheduledTo || "—"
                      : p.scheduled}
                  </div>

                  {/* Actions for upcoming patients */}
                  {i > currentIdx &&
                    !isDone &&
                    (adjusting === p.id ? (
                      <div
                        style={{
                          display: "flex",
                          gap: isMobile ? 2 : 4,
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <button
                          onClick={() => setAdjustMins((m) => m - 5)}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 6,
                            border: "1px solid #D0DFF0",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 15,
                            lineHeight: 1,
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
                          {adjustMins > 0 ? `+${adjustMins}` : adjustMins}m
                        </span>
                        <button
                          onClick={() => setAdjustMins((m) => m + 5)}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 6,
                            border: "1px solid #D0DFF0",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 15,
                            lineHeight: 1,
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
                            color: "#7A92B0",
                            border: "none",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          gap: isMobile ? 3 : 4,
                          flexShrink: 0,
                        }}
                      >
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
                            whiteSpace: "nowrap",
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
                            whiteSpace: "nowrap",
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

          {/* Mobile/Tablet Log Panel (collapsible inline) */}
          {narrow && showLog && (
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1.5px solid #D0DFF0",
                marginTop: 16,
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(15,39,68,0.06)",
                animation: "fadeIn .2s ease",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #E2EAF4",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#7A92B0",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Activity Log
                </div>
                <button
                  onClick={() => setShowLog(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 16,
                    color: "#7A92B0",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Stats grid */}
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #E2EAF4",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 6,
                  }}
                >
                  {statsData.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "#F8FAFD",
                        borderRadius: 8,
                        padding: "8px 10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: "#7A92B0",
                          marginBottom: 2,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color:
                            (s.label === "Network" && s.val === "Offline") ||
                            (s.label === "Skipped" && s.val > 0)
                              ? "#C0392B"
                              : "#0F2744",
                        }}
                      >
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Log entries */}
              <div
                style={{ maxHeight: 240, overflowY: "auto", padding: "4px 0" }}
              >
                {log.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 24,
                      color: "#7A92B0",
                      fontSize: 13,
                    }}
                  >
                    No activity yet
                  </div>
                )}
                {log.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: "7px 16px",
                      borderBottom: "1px solid #F8FAFD",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#7A92B0",
                        marginBottom: 1,
                      }}
                    >
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
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Desktop Sidebar: Log + Stats ── */}
        {isDesktop && (
          <div
            style={{
              background: "#fff",
              borderLeft: "1px solid #E2EAF4",
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 56px)",
              position: "sticky",
              top: 56,
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
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#7A92B0",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Activity Log
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {log.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 32,
                    color: "#7A92B0",
                    fontSize: 13,
                  }}
                >
                  No activity yet
                </div>
              )}
              {log.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "8px 20px",
                    borderBottom: "1px solid #F8FAFD",
                  }}
                >
                  <div
                    style={{ fontSize: 11, color: "#7A92B0", marginBottom: 2 }}
                  >
                    {entry.time}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#0F2744", lineHeight: 1.5 }}
                  >
                    {entry.msg}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
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
                        color: "#7A92B0",
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
                          (s.label === "Network" && s.val === "Offline") ||
                          (s.label === "Skipped" && s.val > 0)
                            ? "#C0392B"
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
        onClose={() => setModalPatient(null)}
        onAction={handleAction}
        patients={patients}
      />
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("assistant");
  const { isMobile } = useBreakpoint();

  const [patients, setPatients] = useState(() => {
    try {
      const s = localStorage.getItem("mq_state");
      if (s) return JSON.parse(s).patients || INITIAL_PATIENTS;
    } catch (e) {}
    return INITIAL_PATIENTS;
  });
  const [currentIdx, setCurrentIdx] = useState(() => {
    try {
      const s = localStorage.getItem("mq_state");
      if (s) return JSON.parse(s).currentIdx || 0;
    } catch (e) {}
    return 0;
  });
  const [driftSeconds, setDriftSeconds] = useState(() => {
    try {
      const s = localStorage.getItem("mq_state");
      if (s) return JSON.parse(s).driftSeconds || 0;
    } catch (e) {}
    return 0;
  });

  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [lastSync, setLastSync] = useState(null);
  const tickRef = useRef(null);

  // Timer
  useEffect(() => {
    if (isRunning)
      tickRef.current = setInterval(
        () => setSessionSeconds((s) => s + 1),
        1000,
      );
    else clearInterval(tickRef.current);
    return () => clearInterval(tickRef.current);
  }, [isRunning]);

  // Online / offline
  useEffect(() => {
    const goOff = () => setOffline(true);
    const goOn = () => {
      setOffline(false);
      setLastSync(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    window.addEventListener("offline", goOff);
    window.addEventListener("online", goOn);
    return () => {
      window.removeEventListener("offline", goOff);
      window.removeEventListener("online", goOn);
    };
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(
        "mq_state",
        JSON.stringify({ patients, currentIdx, driftSeconds }),
      );
    } catch (e) {}
  }, [patients, currentIdx, driftSeconds]);

  const current = patients[currentIdx];
  const allocatedSecs = current ? current.allocatedMins * 60 : 0;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {view === "assistant" ? (
        <AssistantView
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
          offline={offline}
          lastSync={lastSync}
        />
      ) : (
        <PatientView
          patients={patients}
          currentIdx={currentIdx}
          sessionSeconds={sessionSeconds}
          allocatedSeconds={allocatedSecs}
          driftSeconds={driftSeconds}
          offline={offline}
        />
      )}

      {/* Bottom navigation pill */}
      <div
        style={{
          position: "fixed",
          bottom: isMobile ? 14 : 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999,
          background: "#0F2744",
          borderRadius: 50,
          padding: isMobile ? "6px 8px" : "6px 8px",
          display: "flex",
          gap: 4,
          boxShadow: "0 4px 24px rgba(15,39,68,0.3)",
        }}
      >
        {[
          ["assistant", "🩺 Assistant"],
          ["patient", "👤 Patient"],
        ].map(([v, label]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: isMobile ? "10px 20px" : "8px 18px",
              borderRadius: 40,
              border: "none",
              fontSize: isMobile ? 13 : 13,
              fontWeight: 600,
              cursor: "pointer",
              background: view === v ? "#1A6FA8" : "transparent",
              color: view === v ? "#fff" : "#7A9CC0",
              transition: "all .2s",
              minHeight: isMobile ? 44 : 36,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
