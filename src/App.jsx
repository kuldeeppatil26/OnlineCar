import React, { useState, useMemo } from "react";
import {
  Car, MapPin, Calendar, Clock, Star, Users, Search, Plus,
  TrendingUp, IndianRupee, CheckCircle2, XCircle, Pencil, Trash2,
  Gauge, Settings2, ChevronRight, X, ShieldCheck, Zap, Snowflake,
  Music4, Camera, ParkingCircle, ArrowLeftRight, LayoutGrid, Wallet,
  ClipboardList, UserCircle2, BadgeCheck, LogIn, LogOut, UserPlus,
  UploadCloud, FileText, AlertCircle, Truck, Home as HomeIcon,
  Percent, Gift, FileEdit, Navigation, SlidersHorizontal, Crown,
  Building2, Tag, ShieldAlert, ShieldQuestion, Sparkles, KeyRound,
  ScanFace, AlertTriangle, PhoneCall, Receipt, CalendarClock, Fuel,
  Route, Ban, ChevronDown, ChevronUp
} from "lucide-react";

// ---------------------------------------------------------------
// Design tokens — asphalt ink / highway cream / signal amber
// (customer) / route teal (host) / authority plum (owner) / lane-
// marking dashes as the recurring structural motif.
// ---------------------------------------------------------------
const INK = "#171A1F";
const CREAM = "#F5F3EC";
const AMBER = "#FF7A29";
const TEAL = "#1F8A70";
const PLUM = "#5B3A8E";
const LINE = "#D8D3C7";
const MUTED = "#8A8578";
const DANGER = "#C0392B";
const SUPPORT_PHONE = "1800-419-5566";

const FEATURE_ICONS = {
  "AC": Snowflake,
  "Bluetooth": Music4,
  "Reverse Camera": Camera,
  "Auto Parking Sensors": ParkingCircle,
  "Airbags": ShieldCheck,
  "Fast Charging": Zap,
};

const BLR_CENTER = { lat: 12.9716, lng: 77.5946 };
const genOtp = () => String(Math.floor(1000 + Math.random() * 9000));

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const INITIAL_CARS = [
  {
    id: "c1", name: "Swift VXI", brand: "Maruti Suzuki", model: "Swift", year: 2022,
    type: "Hatchback", transmission: "Manual", fuel: "Petrol", seats: 5,
    pricePerHour: 129, depositAmount: 2000, location: "Indiranagar, Bengaluru", lat: 12.9784, lng: 77.6408,
    rating: 4.7, trips: 214, features: ["AC", "Bluetooth", "Reverse Camera"],
    hostName: "Ravi Kumar", available: true, verified: "verified", deliveryAvailable: true,
  },
  {
    id: "c2", name: "Creta SX", brand: "Hyundai", model: "Creta", year: 2023,
    type: "SUV", transmission: "Automatic", fuel: "Diesel", seats: 5,
    pricePerHour: 249, depositAmount: 4000, location: "Koramangala, Bengaluru", lat: 12.9352, lng: 77.6245,
    rating: 4.9, trips: 132, features: ["AC", "Bluetooth", "Reverse Camera", "Auto Parking Sensors", "Airbags"],
    hostName: "Meera S.", available: true, verified: "verified", deliveryAvailable: true,
  },
  {
    id: "c3", name: "Nexon EV", brand: "Tata", model: "Nexon EV", year: 2023,
    type: "SUV", transmission: "Automatic", fuel: "Electric", seats: 5,
    pricePerHour: 219, depositAmount: 3500, location: "HSR Layout, Bengaluru", lat: 12.9121, lng: 77.6446,
    rating: 4.8, trips: 98, features: ["AC", "Bluetooth", "Fast Charging", "Airbags"],
    hostName: "Arjun Rao", available: true, verified: "verified", deliveryAvailable: false,
  },
  {
    id: "c4", name: "City ZX", brand: "Honda", model: "City", year: 2021,
    type: "Sedan", transmission: "Automatic", fuel: "Petrol", seats: 5,
    pricePerHour: 179, depositAmount: 3000, location: "Whitefield, Bengaluru", lat: 12.9698, lng: 77.7500,
    rating: 4.5, trips: 301, features: ["AC", "Bluetooth", "Reverse Camera"],
    hostName: "Divya N.", available: false, verified: "verified", deliveryAvailable: true,
  },
  {
    id: "c5", name: "Thar LX", brand: "Mahindra", model: "Thar", year: 2022,
    type: "SUV", transmission: "Manual", fuel: "Diesel", seats: 4,
    pricePerHour: 289, depositAmount: 5000, location: "Jayanagar, Bengaluru", lat: 12.9250, lng: 77.5938,
    rating: 4.6, trips: 87, features: ["AC", "Bluetooth", "Airbags"],
    hostName: "Sanjay P.", available: true, verified: "pending", deliveryAvailable: false,
  },
  {
    id: "c6", name: "Baleno Delta", brand: "Maruti Suzuki", model: "Baleno", year: 2020,
    type: "Hatchback", transmission: "Manual", fuel: "Petrol", seats: 5,
    pricePerHour: 109, depositAmount: 1500, location: "BTM Layout, Bengaluru", lat: 12.9166, lng: 77.6101,
    rating: 4.3, trips: 176, features: ["AC", "Bluetooth"],
    hostName: "Ravi Kumar", available: true, verified: "verified", deliveryAvailable: true,
  },
];

const CAR_TYPES = ["All", "Hatchback", "Sedan", "SUV"];
const TRANSMISSIONS = ["Any", "Manual", "Automatic"];
const FUELS = ["Any", "Petrol", "Diesel", "Electric"];
const FUEL_LEVELS = ["Full", "3/4", "Half", "1/4", "Low"];
const ALL_FEATURES = Object.keys(FEATURE_ICONS);
const SORTS = [["recommended", "Recommended"], ["price_low", "Price: low to high"], ["nearby", "Nearest to me"]];
const CUST_CANCEL_REASONS = ["Change of plans", "Found a better price", "Vehicle condition concerns", "Booked by mistake", "Other"];
const HOST_CANCEL_REASONS = ["Vehicle unavailable", "Maintenance issue", "Double booking", "Emergency / unavoidable reason", "Other"];
const STATUS_TONE = { upcoming: "amber", ongoing: "teal", completed: "ink", cancelled: "danger" };

const DEFAULT_TERMS = `1. Customer must hold a valid driving license and complete KYC verification before the first trip.
2. Pickup and return require OTP confirmation, selfie capture and vehicle-condition recording.
3. Fuel must be returned at the same level as pickup; refuelling charges may be deducted from the security deposit.
4. Late return is billed at 1.5x the applicable hourly rate for each additional hour, subject to the published grace period.
5. Damage beyond normal wear may be charged against the security deposit after evidence review.
6. Hosts may report damage within the post-trip damage-report window with photos, description and estimated cost.
7. Customer and host may cancel only according to the published cancellation policy; applicable fees/refunds are shown before confirmation.
8. No-show, late pickup, late return, prohibited use, unsafe driving and misuse may result in additional charges or account suspension.
9. Customer and host can rate each other after a completed trip. Ratings must be genuine and respectful.
10. Loopcar may request additional KYC, vehicle documents, insurance information or verification evidence at any time.
11. Refunds are processed according to the selected payment method and applicable cancellation/damage rules.
12. Loopcar reserves the right to suspend accounts that violate safety, fraud or community guidelines.`;


const MOCK_KYC_QUEUE = [
  { id: "u1", name: "Ananya Iyer", doc: "Driving License · DL-KA05-2021-0417" },
  { id: "u2", name: "Karthik V.", doc: "Driving License + Aadhar" },
];

function LaneDivider() {
  return (
    <div className="flex items-center gap-2 my-6 flex-wrap" aria-hidden="true">
      {Array.from({ length: 22 }).map((_, i) => (
        <span key={i} className="h-[3px] w-5 rounded-full" style={{ background: LINE }} />
      ))}
    </div>
  );
}

function Badge({ children, tone = "ink", icon: Icon }) {
  const tones = {
    ink: { background: INK, color: CREAM },
    amber: { background: AMBER, color: INK },
    teal: { background: TEAL, color: CREAM },
    plum: { background: PLUM, color: CREAM },
    danger: { background: `${DANGER}1A`, color: DANGER },
    outline: { background: "transparent", color: INK, border: `1px solid ${INK}` },
  };
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase inline-flex items-center gap-1" style={tones[tone]}>
      {Icon && <Icon size={11} />} {children}
    </span>
  );
}

function StarInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={() => onChange(n)}>
          <Star size={20} fill={n <= value ? AMBER : "none"} color={AMBER} />
        </button>
      ))}
    </div>
  );
}

function CarThumb({ car, className = "" }) {
  const hue = car.fuel === "Electric" ? TEAL : AMBER;
  return (
    <div className={`relative overflow-hidden rounded-2xl flex items-center justify-center ${className}`} style={{ background: `linear-gradient(135deg, ${INK} 0%, #2B2F3A 100%)` }}>
      <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-30" style={{ background: hue }} />
      <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full opacity-20" style={{ background: hue }} />
      <Car size={56} strokeWidth={1.5} color={CREAM} className="relative z-10" />
      {!car.available && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white">Unavailable</span>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = TEAL }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ border: `1px solid ${LINE}` }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${tone}1A` }}>
        <Icon size={20} color={tone} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: MUTED }}>{label}</p>
        <p className="text-2xl font-black tabular-nums" style={{ color: INK, fontFamily: "ui-monospace, monospace" }}>{value}</p>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none";
const inputStyle = { background: CREAM, color: INK };
const labelCls = "text-[11px] font-bold uppercase tracking-widest mb-1.5 block";
const labelStyle = { color: MUTED };
const fmtDateTime = (iso) => (iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");

function computeCancelFee(booking, policy) {
  if (!booking.pickupAt) return Math.round((booking.total * policy.feePercent) / 100);
  const hrsUntil = (new Date(booking.pickupAt) - new Date()) / 3600000;
  return hrsUntil >= policy.freeWindowHours ? 0 : Math.round((booking.total * policy.feePercent) / 100);
}

// ---------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------
function AuthScreen({ onAuth }) {
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "customer", agree: false });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Enter an email and password to continue.");
    if (view === "signup" && !form.agree) return setError("Please accept the Terms & Conditions to sign up.");
    setError("");
    onAuth({
      name: form.name || form.email.split("@")[0], email: form.email, phone: form.phone || "9876543210",
      role: view === "signup" ? form.role : "customer", kyc: { license: null, status: "none" }, bonusCredits: 0,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5" style={{ background: INK }}>
      <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: AMBER }}><Gauge size={20} color={INK} /></div>
          <span className="font-black tracking-tight text-xl" style={{ color: INK, letterSpacing: "-0.02em" }}>LOOPCAR</span>
        </div>

        <div className="flex rounded-full p-1 mb-6" style={{ background: CREAM }}>
          {[["login", "Log in"], ["signup", "Sign up"]].map(([k, label]) => (
            <button key={k} onClick={() => { setView(k); setError(""); }} className="flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wide" style={view === k ? { background: INK, color: CREAM } : { color: INK }}>{label}</button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {view === "signup" && (
            <label><span className={labelCls} style={labelStyle}>Full name</span>
              <input className={inputCls} style={inputStyle} placeholder="Ananya Iyer" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} /></label>
          )}
          <label><span className={labelCls} style={labelStyle}>Email</span>
            <input type="email" className={inputCls} style={inputStyle} placeholder="you@example.com" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} /></label>
          {view === "signup" && (
            <label><span className={labelCls} style={labelStyle}>Phone</span>
              <input className={inputCls} style={inputStyle} placeholder="98765 43210" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} /></label>
          )}
          <label><span className={labelCls} style={labelStyle}>Password</span>
            <input type="password" className={inputCls} style={inputStyle} placeholder="••••••••" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} /></label>

          {view === "signup" && (
            <>
              <div>
                <span className={labelCls} style={labelStyle}>I'm joining as a</span>
                <div className="flex gap-2">
                  {[["customer", "Customer", UserCircle2], ["host", "Host", Building2]].map(([val, label, Icon]) => (
                    <button type="button" key={val} onClick={() => setForm((s) => ({ ...s, role: val }))} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold" style={form.role === val ? { background: INK, color: CREAM } : { background: CREAM, color: INK }}>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-2 text-xs font-medium" style={{ color: MUTED }}>
                <input type="checkbox" className="mt-0.5" checked={form.agree} onChange={(e) => setForm((s) => ({ ...s, agree: e.target.checked }))} />
                I agree to Loopcar's Terms &amp; Conditions and Privacy Policy.
              </label>
            </>
          )}

          {error && <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: DANGER }}><AlertCircle size={13} /> {error}</p>}

          <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: AMBER, color: INK }}>
            {view === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
            {view === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => onAuth({ name: "Company Owner", email: "owner@loopcar.app", phone: "9900011122", role: "owner", kyc: { license: null, status: "verified" }, bonusCredits: 0 })}
          className="w-full text-center mt-5 text-xs font-bold flex items-center justify-center gap-1.5" style={{ color: PLUM }}
        >
          <Crown size={13} /> Continue as company owner (demo)
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// CUSTOMER SIDE
// ---------------------------------------------------------------
function CustomerSearch({ filters, setFilters, cars, userCoords, onUseLocation, locLoading }) {
  const [showSuggest, setShowSuggest] = useState(false);
  const suggestions = useMemo(() => {
    if (!filters.query) return [];
    const q = filters.query.toLowerCase();
    return cars.filter((c) => `${c.name} ${c.brand} ${c.location}`.toLowerCase().includes(q)).slice(0, 5);
  }, [filters.query, cars]);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6" style={{ border: `1px solid ${LINE}` }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <label className="flex flex-col gap-1.5 relative md:col-span-1">
          <span className={labelCls} style={labelStyle}>Search or location</span>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: CREAM }}>
            <Search size={16} color={AMBER} />
            <input value={filters.query} onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))} onFocus={() => setShowSuggest(true)} onBlur={() => setTimeout(() => setShowSuggest(false), 150)} placeholder="Car, brand or neighbourhood" className="bg-transparent outline-none text-sm w-full font-medium" style={{ color: INK }} />
          </div>
          {showSuggest && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl overflow-hidden z-20 shadow-lg" style={{ border: `1px solid ${LINE}` }}>
              {suggestions.map((c) => (
                <button type="button" key={c.id} onMouseDown={() => setFilters((f) => ({ ...f, query: c.name }))} className="w-full text-left px-3.5 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-black/[0.03]" style={{ color: INK }}>
                  <span>{c.name} <span style={{ color: MUTED }}>· {c.location}</span></span>
                  <span className="font-bold tabular-nums">₹{c.pricePerHour}/hr</span>
                </button>
              ))}
            </div>
          )}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls} style={labelStyle}>Pickup</span>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: CREAM }}>
            <Calendar size={16} color={AMBER} />
            <input type="datetime-local" value={filters.pickupAt} onChange={(e) => setFilters((f) => ({ ...f, pickupAt: e.target.value }))} className="bg-transparent outline-none text-sm w-full font-medium" style={{ color: INK }} />
          </div>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls} style={labelStyle}>Drop-off</span>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: CREAM }}>
            <Clock size={16} color={AMBER} />
            <input type="datetime-local" value={filters.dropAt} onChange={(e) => setFilters((f) => ({ ...f, dropAt: e.target.value }))} className="bg-transparent outline-none text-sm w-full font-medium" style={{ color: INK }} />
          </div>
        </label>
        <button onClick={onUseLocation} className="rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95" style={{ background: userCoords ? TEAL : INK, color: CREAM }}>
          <Navigation size={16} /> {locLoading ? "Locating…" : userCoords ? "Location set" : "Use my location"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {CAR_TYPES.map((t) => (
          <button key={t} onClick={() => setFilters((f) => ({ ...f, type: t }))} className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors" style={filters.type === t ? { background: INK, color: CREAM } : { background: CREAM, color: INK, border: `1px solid ${LINE}` }}>{t}</button>
        ))}
        <span className="w-px h-6 self-center mx-1" style={{ background: LINE }} />
        {TRANSMISSIONS.map((t) => (
          <button key={t} onClick={() => setFilters((f) => ({ ...f, transmission: t }))} className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors" style={filters.transmission === t ? { background: INK, color: CREAM } : { background: CREAM, color: INK, border: `1px solid ${LINE}` }}>{t}</button>
        ))}
        <span className="w-px h-6 self-center mx-1" style={{ background: LINE }} />
        {FUELS.map((t) => (
          <button key={t} onClick={() => setFilters((f) => ({ ...f, fuel: t }))} className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors" style={filters.fuel === t ? { background: INK, color: CREAM } : { background: CREAM, color: INK, border: `1px solid ${LINE}` }}>{t}</button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-5">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: MUTED }}>Max ₹{filters.maxPrice}/hr</span>
          <input type="range" min="80" max="320" step="10" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))} className="w-full accent-orange-500" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} color={MUTED} />
          <select value={filters.sortBy} onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))} className="rounded-full px-3 py-1.5 text-xs font-bold outline-none" style={{ background: CREAM, color: INK }}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function CarCard({ car, onOpen, distance }) {
  return (
    <button onClick={() => onOpen(car)} className="text-left bg-white rounded-3xl p-4 flex flex-col gap-3 transition-transform hover:-translate-y-1" style={{ border: `1px solid ${LINE}` }}>
      <CarThumb car={car} className="h-36 w-full" />
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-black text-base leading-tight" style={{ color: INK }}>{car.name}</p>
            <p className="text-xs font-medium" style={{ color: MUTED }}>{car.brand} · {car.year}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0"><Star size={14} fill={AMBER} color={AMBER} /><span className="text-xs font-bold" style={{ color: INK }}>{car.rating}</span></div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge tone="outline">{car.transmission}</Badge>
          <Badge tone="outline">{car.fuel}</Badge>
          {car.verified === "verified" ? <Badge tone="teal" icon={BadgeCheck}>Verified</Badge> : <Badge tone="danger" icon={ShieldQuestion}>Pending</Badge>}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs font-medium" style={{ color: MUTED }}>
          <span className="flex items-center gap-1"><MapPin size={12} /> {car.location}</span>
          {distance != null && <span className="font-bold" style={{ color: TEAL }}>{distance.toFixed(1)} km</span>}
        </div>
      </div>
      <div className="flex items-center justify-between mt-1 pt-3" style={{ borderTop: `1px dashed ${LINE}` }}>
        <p className="font-black text-lg tabular-nums" style={{ color: INK, fontFamily: "ui-monospace, monospace" }}>₹{car.pricePerHour}<span className="text-xs font-bold" style={{ color: MUTED }}>/hr</span></p>
        <span className="flex items-center gap-1 text-xs font-bold" style={{ color: AMBER }}>Details <ChevronRight size={14} /></span>
      </div>
    </button>
  );
}

function BookingModal({ car, offers, onClose, onConfirm, searchDates }) {
  const [hours, setHours] = useState(6);
  const [delivery, setDelivery] = useState("self");
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const base = car.pricePerHour * hours;
  const deliveryFee = delivery === "delivery" ? 149 : 0;
  const insurance = Math.round(base * 0.08);
  const taxes = Math.round(base * 0.05);
  const discount = applied ? Math.round((base * applied.discountPct) / 100) : 0;
  const total = base + insurance + taxes + deliveryFee - discount;

  const applyPromo = () => {
    const match = offers.find((o) => o.code.toLowerCase() === promo.trim().toLowerCase() && o.active);
    if (!match) { setApplied(null); setPromoMsg("Invalid or expired code."); return; }
    setApplied(match); setPromoMsg(`${match.discountPct}% off applied — ${match.title}`);
  };

  const notVerified = car.verified !== "verified";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-6">
      <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 flex items-start justify-between" style={{ borderBottom: `1px dashed ${LINE}` }}>
          <div><p className="font-black text-lg" style={{ color: INK }}>{car.name}</p><p className="text-xs font-medium" style={{ color: MUTED }}>Hosted by {car.hostName}</p></div>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: CREAM }}><X size={16} color={INK} /></button>
        </div>

        <div className="p-5 space-y-5">
          <CarThumb car={car} className="h-40 w-full" />

          {notVerified && (
            <div className="flex items-start gap-2 rounded-xl p-3" style={{ background: `${DANGER}12` }}>
              <ShieldAlert size={16} color={DANGER} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold" style={{ color: DANGER }}>This listing's documents are still under review. Booking opens once Loopcar verifies it.</p>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {car.features.map((f) => { const Icon = FEATURE_ICONS[f] || CheckCircle2; return <span key={f} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: CREAM, color: INK }}><Icon size={12} /> {f}</span>; })}
          </div>

          {(searchDates.pickupAt || searchDates.dropAt) && (
            <div className="flex items-center gap-4 text-xs font-bold" style={{ color: INK }}>
              {searchDates.pickupAt && <span>Pickup: {new Date(searchDates.pickupAt).toLocaleString()}</span>}
              {searchDates.dropAt && <span>Drop-off: {new Date(searchDates.dropAt).toLocaleString()}</span>}
            </div>
          )}

          <div>
            <p className={labelCls} style={labelStyle}>Trip duration</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setHours((h) => Math.max(1, h - 1))} className="w-9 h-9 rounded-full font-black" style={{ background: CREAM, color: INK }}>−</button>
              <span className="font-black text-lg w-16 text-center" style={{ color: INK }}>{hours} hrs</span>
              <button onClick={() => setHours((h) => Math.min(72, h + 1))} className="w-9 h-9 rounded-full font-black" style={{ background: CREAM, color: INK }}>+</button>
              <span className="text-[11px] font-medium" style={{ color: MUTED }}>Extend anytime from My Bookings</span>
            </div>
          </div>

          <div>
            <p className={labelCls} style={labelStyle}>Handover</p>
            <div className="flex gap-2">
              <button onClick={() => setDelivery("self")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold" style={delivery === "self" ? { background: INK, color: CREAM } : { background: CREAM, color: INK }}><HomeIcon size={14} /> Self pick-up</button>
              <button disabled={!car.deliveryAvailable} onClick={() => setDelivery("delivery")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40" style={delivery === "delivery" ? { background: INK, color: CREAM } : { background: CREAM, color: INK }}><Truck size={14} /> Home delivery {car.deliveryAvailable ? "· +₹149" : "· unavailable"}</button>
            </div>
          </div>

          <div>
            <p className={labelCls} style={labelStyle}>Promo code</p>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 flex-1" style={{ background: CREAM }}>
                <Tag size={14} color={AMBER} />
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="e.g. WELCOME20" className="bg-transparent outline-none text-sm w-full font-medium uppercase" style={{ color: INK }} />
              </div>
              <button onClick={applyPromo} className="px-4 rounded-xl text-xs font-bold" style={{ background: INK, color: CREAM }}>Apply</button>
            </div>
            {promoMsg && <p className="text-xs font-bold mt-1.5" style={{ color: applied ? TEAL : DANGER }}>{promoMsg}</p>}
          </div>

          <LaneDivider />

          <div className="space-y-2 text-sm font-medium" style={{ color: INK }}>
            <div className="flex justify-between"><span>Base fare ({hours} hrs × ₹{car.pricePerHour})</span><span className="tabular-nums">₹{base}</span></div>
            <div className="flex justify-between"><span>Insurance &amp; protection</span><span className="tabular-nums">₹{insurance}</span></div>
            <div className="flex justify-between"><span>Taxes &amp; fees</span><span className="tabular-nums">₹{taxes}</span></div>
            {deliveryFee > 0 && <div className="flex justify-between"><span>Home delivery</span><span className="tabular-nums">₹{deliveryFee}</span></div>}
            {discount > 0 && <div className="flex justify-between" style={{ color: TEAL }}><span>Promo discount</span><span className="tabular-nums">−₹{discount}</span></div>}
            <div className="flex justify-between font-black text-base pt-2" style={{ borderTop: `1px dashed ${LINE}` }}><span>Total</span><span className="tabular-nums">₹{total}</span></div>
            <div className="flex justify-between text-xs pt-1" style={{ color: MUTED }}><span>Refundable security deposit (not charged now)</span><span className="tabular-nums">₹{car.depositAmount}</span></div>
          </div>

          <div className="rounded-xl p-3" style={{ background: CREAM }}>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: MUTED }}>Important before booking</p>
            <ul className="text-[11px] font-medium space-y-1.5" style={{ color: INK }}>
              <li>• OTP + selfie + vehicle-condition photos are required at pickup and return.</li>
              <li>• Cancellation charges follow the published customer policy.</li>
              <li>• Fuel, late return, damage and security-deposit rules apply.</li>
            </ul>
            <label className="flex items-start gap-2 mt-3 text-[11px] font-bold" style={{ color: INK }}>
              <input type="checkbox" className="mt-0.5" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
              I agree to Loopcar's Terms &amp; Conditions and the cancellation policy.
            </label>
          </div>

          <button onClick={() => onConfirm(car, hours, total, delivery)} disabled={!car.available || notVerified || !agreeTerms} className="w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-40" style={{ background: AMBER, color: INK }}>
            {!car.available ? "Currently unavailable" : notVerified ? "Awaiting verification" : !agreeTerms ? "Accept T&C to continue" : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelPanel({ policy, isHost, booking, onConfirm, onClose }) {
  const reasons = isHost ? HOST_CANCEL_REASONS : CUST_CANCEL_REASONS;
  const [reason, setReason] = useState(reasons[0]);
  const actorPolicy = isHost ? policy.host : policy.customer;
  const fee = computeCancelFee(booking, actorPolicy);
  const refund = Math.max(0, booking.total - fee);

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: `${DANGER}0D`, border: `1px dashed ${DANGER}55` }}>
      <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: DANGER }}><Ban size={13} /> Cancel this trip</p>
      <p className="text-[11px] font-medium" style={{ color: MUTED }}>
        {isHost
          ? `Host policy: cancellations ${actorPolicy.freeWindowHours}+ hours before pickup are free; later cancellations incur a ${actorPolicy.feePercent}% host cancellation penalty.`
          : `Customer policy: cancellations ${actorPolicy.freeWindowHours}+ hours before pickup are free; later cancellations incur a ${actorPolicy.feePercent}% cancellation fee.`}
      </p>
      <select value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} style={inputStyle}>
        {reasons.map((r) => <option key={r}>{r}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl p-3" style={{ background: "#fff" }}>
          <span className="block font-bold uppercase tracking-wide" style={{ color: MUTED }}>Penalty</span>
          <span className="font-black" style={{ color: DANGER }}>₹{fee}</span>
        </div>
        <div className="rounded-xl p-3" style={{ background: "#fff" }}>
          <span className="block font-bold uppercase tracking-wide" style={{ color: MUTED }}>{isHost ? "Host payout impact" : "Estimated refund"}</span>
          <span className="font-black" style={{ color: INK }}>₹{isHost ? fee : refund}</span>
        </div>
      </div>
      <p className="text-[10px] font-medium" style={{ color: MUTED }}>Cancellation time, reason and fee are stored against the booking for audit and dispute handling.</p>
      <div className="flex gap-2">
        <button onClick={() => onConfirm(reason, fee)} className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: DANGER, color: "#fff" }}>Confirm cancellation</button>
        <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ background: CREAM, color: INK }}>Keep trip</button>
      </div>
    </div>
  );
}

function CustomerBookingRow({ booking, onExtend, onCancel, onRateHost, policy }) {
  const [panel, setPanel] = useState(null); // 'extend' | 'cancel' | 'rate' | null
  const [extra, setExtra] = useState(1);
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState("");

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3" style={{ border: `1px solid ${LINE}` }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CarThumb car={booking.car} className="w-16 h-16 shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: INK }}>{booking.car.name}</p>
            <p className="text-xs font-medium" style={{ color: MUTED }}>{booking.hours} hrs · {booking.delivery === "delivery" ? "Home delivery" : "Self pick-up"} · {booking.car.location}</p>
            <p className="text-[11px] font-medium flex items-center gap-1 mt-0.5" style={{ color: MUTED }}><CalendarClock size={11} /> {fmtDateTime(booking.pickupAt || booking.createdAt)}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-black tabular-nums" style={{ color: INK }}>₹{booking.total}</p>
          <Badge tone={STATUS_TONE[booking.status]}>{booking.status}</Badge>
        </div>
      </div>

      {(booking.status === "upcoming" || booking.status === "ongoing") && (
        <div className="flex items-center gap-3 flex-wrap text-xs font-bold" style={{ color: INK }}>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: CREAM }}><KeyRound size={12} color={AMBER} /> Pickup code: {booking.pickupOtp}</span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: CREAM }}><KeyRound size={12} color={TEAL} /> Return code: {booking.dropOtp}</span>
        </div>
      )}
      {booking.status === "ongoing" && (
        <p className="text-[11px] font-bold flex items-center gap-1.5" style={{ color: TEAL }}><PhoneCall size={12} /> Trip in progress · Emergency support: {SUPPORT_PHONE}</p>
      )}
      {(booking.pickupVerified || booking.dropVerified) && (
        <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
          {booking.pickupVerified && <Badge tone="teal" icon={CheckCircle2}>Pickup verified · OTP + selfie</Badge>}
          {booking.dropVerified && <Badge tone="teal" icon={CheckCircle2}>Return verified · OTP + selfie</Badge>}
          {booking.odoStart != null && <Badge tone="outline">Start odo {booking.odoStart} km</Badge>}
          {booking.odoEnd != null && <Badge tone="outline">End odo {booking.odoEnd} km</Badge>}
        </div>
      )}
      {booking.status === "completed" && booking.damage && (
        <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: DANGER }}><AlertTriangle size={13} /> Damage noted by host: {booking.damage.description} (₹{booking.damage.amount}) · {booking.damage.severity}</p>
        <p className="text-[10px] font-medium" style={{ color: MUTED }}>Damage review: {booking.damage.status} · Evidence {booking.damage.photos?.length || 0} photo(s)</p>
      )}
      {booking.status === "cancelled" && (
        <p className="text-xs font-medium" style={{ color: MUTED }}>Cancelled by {booking.cancelledBy} · {booking.cancelReason} {booking.cancelFee > 0 ? `· Fee ₹${booking.cancelFee}` : "· No fee"} · Refund ₹{booking.refundAmount || 0} · {fmtDateTime(booking.cancelledAt)}</p>
      )}
      {booking.status === "completed" && booking.hostRating && (
        <p className="text-xs font-bold flex items-center gap-1" style={{ color: AMBER }}>You rated this host <Star size={12} fill={AMBER} color={AMBER} /> {booking.hostRating.stars}</p>
      )}

      <div className="flex items-center justify-between pt-3 flex-wrap gap-2" style={{ borderTop: `1px dashed ${LINE}` }}>
        <div className="flex items-center gap-3 flex-wrap">
          {(booking.status === "upcoming" || booking.status === "ongoing") && (
            <button onClick={() => setPanel(panel === "extend" ? null : "extend")} className="text-xs font-bold flex items-center gap-1" style={{ color: AMBER }}><Clock size={13} /> Extend trip</button>
          )}
          {booking.status === "upcoming" && (
            <button onClick={() => setPanel(panel === "cancel" ? null : "cancel")} className="text-xs font-bold flex items-center gap-1" style={{ color: DANGER }}><Ban size={13} /> Cancel</button>
          )}
          {booking.status === "completed" && !booking.hostRating && (
            <button onClick={() => setPanel(panel === "rate" ? null : "rate")} className="text-xs font-bold flex items-center gap-1" style={{ color: TEAL }}><Star size={13} /> Rate host</button>
          )}
        </div>
      </div>

      {panel === "extend" && (
        <div className="flex items-center gap-2">
          <button onClick={() => setExtra((h) => Math.max(1, h - 1))} className="w-7 h-7 rounded-full font-black text-sm" style={{ background: CREAM, color: INK }}>−</button>
          <span className="text-xs font-bold w-16 text-center" style={{ color: INK }}>+{extra} hrs</span>
          <button onClick={() => setExtra((h) => h + 1)} className="w-7 h-7 rounded-full font-black text-sm" style={{ background: CREAM, color: INK }}>+</button>
          <button onClick={() => { onExtend(booking.id, extra); setPanel(null); setExtra(1); }} className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: TEAL, color: CREAM }}>Confirm (+₹{extra * booking.car.pricePerHour})</button>
        </div>
      )}
      {panel === "cancel" && (
        <CancelPanel policy={policy} isHost={false} booking={booking} onClose={() => setPanel(null)} onConfirm={(reason, fee) => { onCancel(booking.id, "customer", reason, fee); setPanel(null); }} />
      )}
      {panel === "rate" && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: CREAM }}>
          <p className="text-xs font-bold" style={{ color: INK }}>Rate your host &amp; vehicle</p>
          <StarInput value={stars} onChange={setStars} />
          <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="How was the car and the handover?" rows={2} className={inputCls} style={{ background: "#fff", color: INK }} />
          <button onClick={() => { onRateHost(booking.id, stars, review); setPanel(null); }} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ background: TEAL, color: CREAM }}>Submit rating</button>
        </div>
      )}
    </div>
  );
}

function MyBookings({ bookings, onExtend, onCancel, onRateHost, policy }) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center" style={{ border: `1px solid ${LINE}` }}>
        <ClipboardList size={28} color={AMBER} className="mx-auto mb-3" />
        <p className="font-bold" style={{ color: INK }}>No trips booked yet</p>
        <p className="text-sm mt-1" style={{ color: MUTED }}>Search a car above and lock in your first ride.</p>
      </div>
    );
  }
  return <div className="space-y-3">{bookings.map((b) => <CustomerBookingRow key={b.id} booking={b} onExtend={onExtend} onCancel={onCancel} onRateHost={onRateHost} policy={policy} />)}</div>;
}

function AccountKYC({ user, onUpdateKyc, bonusCredits }) {
  const [fileName, setFileName] = useState(user.kyc.license);
  const upload = (e) => { const f = e.target.files?.[0]; if (!f) return; setFileName(f.name); onUpdateKyc({ license: f.name, status: "pending" }); };
  const statusTone = { none: "outline", pending: "danger", verified: "teal" }[user.kyc.status];
  const statusLabel = { none: "Not submitted", pending: "Pending review", verified: "Verified" }[user.kyc.status];

  return (
    <div className="space-y-5 max-w-xl">
      <div className="bg-white rounded-3xl p-5 flex items-center gap-4" style={{ border: `1px solid ${LINE}` }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: CREAM }}><UserCircle2 size={30} color={INK} /></div>
        <div>
          <p className="font-black" style={{ color: INK }}>{user.name}</p>
          <p className="text-xs font-medium" style={{ color: MUTED }}>{user.email} · {user.phone}</p>
          {bonusCredits > 0 && <p className="text-xs font-bold mt-1" style={{ color: TEAL }}>₹{bonusCredits} bonus credit available</p>}
        </div>
      </div>
      <div className="bg-white rounded-3xl p-5 space-y-4" style={{ border: `1px solid ${LINE}` }}>
        <div className="flex items-center justify-between">
          <p className="font-black text-sm flex items-center gap-2" style={{ color: INK }}><FileText size={16} color={AMBER} /> Identity &amp; license verification</p>
          <Badge tone={statusTone}>{statusLabel}</Badge>
        </div>
        <p className="text-xs font-medium" style={{ color: MUTED }}>Upload a valid driving license so hosts can confirm your booking instantly. Reviewed by the Loopcar team within 24 hours.</p>
        <label className="flex items-center justify-center gap-2 py-6 rounded-2xl cursor-pointer" style={{ background: CREAM, border: `1px dashed ${LINE}` }}>
          <UploadCloud size={18} color={AMBER} />
          <span className="text-xs font-bold" style={{ color: INK }}>{fileName || "Click to upload driving license"}</span>
          <input type="file" className="hidden" onChange={upload} />
        </label>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// HOST SIDE
// ---------------------------------------------------------------
function HostDashboard({ cars, requests }) {
  const earnings = cars.reduce((sum, c) => sum + c.trips * c.pricePerHour * 3, 0);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={Wallet} label="Total earnings" value={`₹${(earnings / 1000).toFixed(1)}k`} tone={TEAL} />
      <StatCard icon={Car} label="Listed cars" value={cars.length} tone={AMBER} />
      <StatCard icon={ClipboardList} label="Pending requests" value={requests.length} tone={TEAL} />
      <StatCard icon={Star} label="Avg. rating" value={cars.length ? (cars.reduce((s, c) => s + c.rating, 0) / cars.length).toFixed(1) : "—"} tone={AMBER} />
    </div>
  );
}

function HostCarRow({ car, onToggle, onDelete }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center justify-between gap-4" style={{ border: `1px solid ${LINE}` }}>
      <div className="flex items-center gap-3 min-w-0">
        <CarThumb car={car} className="w-16 h-16 shrink-0" />
        <div className="min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: INK }}>{car.name}</p>
          <p className="text-xs font-medium" style={{ color: MUTED }}>₹{car.pricePerHour}/hr · {car.trips} trips · {car.location}</p>
          <div className="mt-1">{car.verified === "verified" ? <Badge tone="teal" icon={BadgeCheck}>Verified</Badge> : <Badge tone="danger" icon={ShieldQuestion}>Pending verification</Badge>}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge tone={car.available ? "teal" : "outline"}>{car.available ? "Active" : "Paused"}</Badge>
        <button onClick={() => onToggle(car.id)} className="p-2 rounded-full" style={{ background: CREAM }} title="Toggle availability"><ArrowLeftRight size={14} color={INK} /></button>
        <button className="p-2 rounded-full" style={{ background: CREAM }} title="Edit"><Pencil size={14} color={INK} /></button>
        <button onClick={() => onDelete(car.id)} className="p-2 rounded-full" style={{ background: CREAM }} title="Remove"><Trash2 size={14} color={DANGER} /></button>
      </div>
    </div>
  );
}

function AddCarForm({ onAdd }) {
  const empty = { name: "", brand: "", model: "", year: "2023", type: "Hatchback", transmission: "Manual", fuel: "Petrol", seats: 5, pricePerHour: "", depositAmount: "", location: "", features: [], deliveryAvailable: false, rcFile: null, insuranceFile: null };
  const [form, setForm] = useState(empty);
  const [toast, setToast] = useState(false);
  const toggleFeature = (f) => setForm((s) => ({ ...s, features: s.features.includes(f) ? s.features.filter((x) => x !== f) : [...s.features, f] }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.pricePerHour || !form.location || !form.rcFile || !form.insuranceFile) return;
    onAdd({
      ...form, id: `c${Date.now()}`, year: Number(form.year), seats: Number(form.seats),
      pricePerHour: Number(form.pricePerHour), depositAmount: Number(form.depositAmount) || 2000,
      rating: 5.0, trips: 0, hostName: "You", available: true, verified: "pending",
      lat: BLR_CENTER.lat + (Math.random() - 0.5) * 0.08, lng: BLR_CENTER.lng + (Math.random() - 0.5) * 0.08,
    });
    setForm(empty); setToast(true); setTimeout(() => setToast(false), 3000);
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl p-5 md:p-6 space-y-5" style={{ border: `1px solid ${LINE}` }}>
      <div className="flex items-center gap-2"><Plus size={18} color={TEAL} /><p className="font-black" style={{ color: INK }}>List a new car</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label><span className={labelCls} style={labelStyle}>Listing name</span><input required className={inputCls} style={inputStyle} placeholder="Swift VXI" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} /></label>
        <label><span className={labelCls} style={labelStyle}>Brand</span><input required className={inputCls} style={inputStyle} placeholder="Maruti Suzuki" value={form.brand} onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))} /></label>
        <label><span className={labelCls} style={labelStyle}>Model year</span><input required type="number" min="2005" max="2026" className={inputCls} style={inputStyle} value={form.year} onChange={(e) => setForm((s) => ({ ...s, year: e.target.value }))} /></label>
        <label><span className={labelCls} style={labelStyle}>Car type</span><select className={inputCls} style={inputStyle} value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}>{CAR_TYPES.filter((t) => t !== "All").map((t) => <option key={t}>{t}</option>)}</select></label>
        <label><span className={labelCls} style={labelStyle}>Transmission</span><select className={inputCls} style={inputStyle} value={form.transmission} onChange={(e) => setForm((s) => ({ ...s, transmission: e.target.value }))}>{TRANSMISSIONS.filter((t) => t !== "Any").map((t) => <option key={t}>{t}</option>)}</select></label>
        <label><span className={labelCls} style={labelStyle}>Fuel type</span><select className={inputCls} style={inputStyle} value={form.fuel} onChange={(e) => setForm((s) => ({ ...s, fuel: e.target.value }))}>{FUELS.filter((t) => t !== "Any").map((t) => <option key={t}>{t}</option>)}</select></label>
        <label><span className={labelCls} style={labelStyle}>Seats</span><input required type="number" min="2" max="8" className={inputCls} style={inputStyle} value={form.seats} onChange={(e) => setForm((s) => ({ ...s, seats: e.target.value }))} /></label>
        <label><span className={labelCls} style={labelStyle}>Price per hour (₹)</span><input required type="number" min="50" className={inputCls} style={inputStyle} placeholder="149" value={form.pricePerHour} onChange={(e) => setForm((s) => ({ ...s, pricePerHour: e.target.value }))} /></label>
        <label><span className={labelCls} style={labelStyle}>Security deposit (₹)</span><input type="number" min="0" className={inputCls} style={inputStyle} placeholder="2000" value={form.depositAmount} onChange={(e) => setForm((s) => ({ ...s, depositAmount: e.target.value }))} /></label>
        <label><span className={labelCls} style={labelStyle}>Pickup location</span><input required className={inputCls} style={inputStyle} placeholder="Indiranagar, Bengaluru" value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} /></label>
      </div>

      <label className="flex items-center gap-2 text-xs font-bold" style={{ color: INK }}>
        <input type="checkbox" checked={form.deliveryAvailable} onChange={(e) => setForm((s) => ({ ...s, deliveryAvailable: e.target.checked }))} /><Truck size={14} /> Offer home delivery for this car
      </label>

      <div>
        <span className={labelCls} style={labelStyle}>Features</span>
        <div className="flex flex-wrap gap-2">
          {ALL_FEATURES.map((f) => { const Icon = FEATURE_ICONS[f]; const active = form.features.includes(f); return (
            <button type="button" key={f} onClick={() => toggleFeature(f)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors" style={active ? { background: TEAL, color: CREAM } : { background: CREAM, color: INK, border: `1px solid ${LINE}` }}><Icon size={13} /> {f}</button>
          ); })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><span className={labelCls} style={labelStyle}>RC book</span>
          <label className="flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer" style={{ background: CREAM, border: `1px dashed ${LINE}` }}>
            <UploadCloud size={16} color={TEAL} /><span className="text-xs font-bold" style={{ color: INK }}>{form.rcFile || "Upload RC"}</span>
            <input type="file" className="hidden" onChange={(e) => setForm((s) => ({ ...s, rcFile: e.target.files?.[0]?.name || null }))} />
          </label>
        </div>
        <div><span className={labelCls} style={labelStyle}>Insurance</span>
          <label className="flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer" style={{ background: CREAM, border: `1px dashed ${LINE}` }}>
            <UploadCloud size={16} color={TEAL} /><span className="text-xs font-bold" style={{ color: INK }}>{form.insuranceFile || "Upload insurance"}</span>
            <input type="file" className="hidden" onChange={(e) => setForm((s) => ({ ...s, insuranceFile: e.target.files?.[0]?.name || null }))} />
          </label>
        </div>
      </div>

      <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm" style={{ background: TEAL, color: CREAM }}>Submit for verification</button>
      {toast && <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: TEAL }}><CheckCircle2 size={14} /> Listing submitted — Loopcar will verify your documents shortly.</p>}
    </form>
  );
}

function HostRequests({ requests, onRespond }) {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center" style={{ border: `1px solid ${LINE}` }}>
        <BadgeCheck size={28} color={TEAL} className="mx-auto mb-3" />
        <p className="font-bold" style={{ color: INK }}>No pending requests</p>
        <p className="text-sm mt-1" style={{ color: MUTED }}>New booking requests for your cars will show up here.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <div key={r.id} className="bg-white rounded-2xl p-4 flex items-center justify-between gap-3" style={{ border: `1px solid ${LINE}` }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: CREAM }}><UserCircle2 size={22} color={INK} /></div>
            <div><p className="font-bold text-sm" style={{ color: INK }}>{r.customer} → {r.car.name}</p><p className="text-xs font-medium" style={{ color: MUTED }}>{r.hours} hrs · ₹{r.total}</p></div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => onRespond(r.id, "accepted")} className="p-2 rounded-full" style={{ background: `${TEAL}1A` }}><CheckCircle2 size={16} color={TEAL} /></button>
            <button onClick={() => onRespond(r.id, "declined")} className="p-2 rounded-full" style={{ background: `${DANGER}1A` }}><XCircle size={16} color={DANGER} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OtpSelfieForm({ label, otpExpected, onSubmit, showOdo, showFuel }) {
  const [otp, setOtp] = useState("");
  const [selfie, setSelfie] = useState(null);
  const [vehiclePhotos, setVehiclePhotos] = useState([]);
  const [fuel, setFuel] = useState(FUEL_LEVELS[0]);
  const [odo, setOdo] = useState("");
  const [notes, setNotes] = useState("");
  const [ack, setAck] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (otp !== otpExpected) { setError("OTP doesn't match — ask the customer to re-check their code."); return; }
    if (!selfie) { setError("Selfie capture is required to verify identity."); return; }
    if (vehiclePhotos.length < 2) { setError("Upload at least 2 vehicle-condition photos."); return; }
    if (showOdo && (!odo || Number(odo) < 0)) { setError("Enter a valid odometer reading."); return; }
    if (!ack) { setError("Confirm that the recorded vehicle condition is correct."); return; }
    setError("");
    onSubmit({ selfie, vehiclePhotos, fuel: showFuel ? fuel : undefined, odo: showOdo ? Number(odo) : undefined, notes });
  };

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: CREAM }}>
      <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: INK }}><KeyRound size={13} color={AMBER} /> {label}</p>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={4} placeholder="4-digit OTP from customer" className={inputCls} style={{ background: "#fff", color: INK }} />
      <label className="flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer" style={{ background: "#fff", border: `1px dashed ${LINE}` }}>
        <ScanFace size={16} color={TEAL} /><span className="text-xs font-bold" style={{ color: INK }}>{selfie || "Capture / upload verification selfie"}</span>
        <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => setSelfie(e.target.files?.[0]?.name || null)} />
      </label>
      {showFuel && (
        <div><span className={labelCls} style={labelStyle}>Fuel level</span>
          <select value={fuel} onChange={(e) => setFuel(e.target.value)} className={inputCls} style={{ background: "#fff", color: INK }}>{FUEL_LEVELS.map((f) => <option key={f}>{f}</option>)}</select>
        </div>
      )}
      <label className="flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer" style={{ background: "#fff", border: `1px dashed ${LINE}` }}>
        <Camera size={16} color={AMBER} /><span className="text-xs font-bold" style={{ color: INK }}>{vehiclePhotos.length ? `${vehiclePhotos.length} vehicle photos selected` : "Upload vehicle condition photos (min 2)"}</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setVehiclePhotos(Array.from(e.target.files || []).map((f) => f.name))} />
      </label>
      {showOdo && (
        <div><span className={labelCls} style={labelStyle}>Odometer reading (km)</span>
          <input type="number" value={odo} onChange={(e) => setOdo(e.target.value)} placeholder="45210" className={inputCls} style={{ background: "#fff", color: INK }} />
        </div>
      )}
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Condition notes: scratches, dents, fuel/charging observations..." rows={2} className={inputCls} style={{ background: "#fff", color: INK }} />
      <label className="flex items-start gap-2 text-[11px] font-medium" style={{ color: MUTED }}>
        <input type="checkbox" className="mt-0.5" checked={ack} onChange={(e) => setAck(e.target.checked)} />
        I confirm the OTP, identity selfie and vehicle condition evidence are correct.
      </label>
      {error && <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: DANGER }}><AlertCircle size={12} /> {error}</p>}
      <button onClick={submit} className="w-full py-2.5 rounded-xl text-xs font-bold" style={{ background: TEAL, color: CREAM }}>Verify &amp; confirm</button>
    </div>
  );
}

function DamageForm({ onSubmit }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [severity, setSeverity] = useState("Minor");
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState("");

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: `${DANGER}0D`, border: `1px dashed ${DANGER}55` }}>
      <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: DANGER }}><AlertTriangle size={13} /> Report trip damage</p>
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Damage description, e.g. scratch on rear bumper" className={inputCls} style={{ background: "#fff", color: INK }} />
      <div className="grid grid-cols-2 gap-2">
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={inputCls} style={{ background: "#fff", color: INK }}>
          <option>Minor</option><option>Moderate</option><option>Major</option><option>Safety critical</option>
        </select>
        <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Estimated cost ₹" className={inputCls} style={{ background: "#fff", color: INK }} />
      </div>
      <label className="flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer" style={{ background: "#fff", border: `1px dashed ${LINE}` }}>
        <Camera size={16} color={DANGER} /><span className="text-xs font-bold" style={{ color: INK }}>{photos.length ? `${photos.length} evidence photos selected` : "Upload damage evidence photos (recommended)"}</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setPhotos(Array.from(e.target.files || []).map((f) => f.name))} />
      </label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes / location / circumstances" rows={2} className={inputCls} style={{ background: "#fff", color: INK }} />
      <button onClick={() => desc && amount && onSubmit({ description: desc, amount: Number(amount), severity, photos, notes, reportedAt: new Date().toISOString(), status: "pending_review" })} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ background: DANGER, color: "#fff" }}>Submit damage report</button>
    </div>
  );
}

function HostBookingRow({ booking, policy, onStart, onEnd, onCancel, onDamage, onRateCustomer }) {
  const [panel, setPanel] = useState(null);
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState("");

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3" style={{ border: `1px solid ${LINE}` }}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <CarThumb car={booking.car} className="w-14 h-14 shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-sm" style={{ color: INK }}>{booking.car.name} <span style={{ color: MUTED, fontWeight: 500 }}>· {booking.customerName}</span></p>
            <p className="text-xs font-medium flex items-center gap-1" style={{ color: MUTED }}><CalendarClock size={11} /> Pickup {fmtDateTime(booking.pickupAt || booking.createdAt)} · Drop {fmtDateTime(booking.dropAt)} · {booking.hours} hrs</p>
             <p className="text-[10px] font-medium mt-1" style={{ color: MUTED }}>Booking {booking.id} · Created {fmtDateTime(booking.createdAt)} · {booking.delivery === "delivery" ? "Home delivery" : "Self pick-up"}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-black tabular-nums" style={{ color: INK }}>₹{booking.total}</p>
          <Badge tone={STATUS_TONE[booking.status]}>{booking.status}</Badge>
        </div>
      </div>

      {booking.status === "completed" && booking.damage && (
        <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: DANGER }}><AlertTriangle size={13} /> Damage: {booking.damage.description} — ₹{booking.damage.amount} · {booking.damage.severity}</p>
        <p className="text-[10px] font-medium" style={{ color: MUTED }}>Evidence: {booking.damage.photos?.length || 0} photo(s) · Reported {fmtDateTime(booking.damage.reportedAt)} · {booking.damage.status}</p>
      )}
      {booking.status === "completed" && booking.customerRating && (
        <p className="text-xs font-bold flex items-center gap-1" style={{ color: AMBER }}>You rated this customer <Star size={12} fill={AMBER} color={AMBER} /> {booking.customerRating.stars}</p>
      )}
      {booking.status === "cancelled" && (
        <p className="text-xs font-medium" style={{ color: MUTED }}>Cancelled by {booking.cancelledBy} · {booking.cancelReason}</p>
      )}

      <div className="flex items-center gap-3 flex-wrap pt-3" style={{ borderTop: `1px dashed ${LINE}` }}>
        {booking.status === "upcoming" && (
          <>
            <button onClick={() => setPanel(panel === "start" ? null : "start")} className="text-xs font-bold flex items-center gap-1" style={{ color: TEAL }}><ScanFace size={13} /> Start trip</button>
            <button onClick={() => setPanel(panel === "cancel" ? null : "cancel")} className="text-xs font-bold flex items-center gap-1" style={{ color: DANGER }}><Ban size={13} /> Cancel</button>
          </>
        )}
        {booking.status === "ongoing" && (
          <button onClick={() => setPanel(panel === "end" ? null : "end")} className="text-xs font-bold flex items-center gap-1" style={{ color: AMBER }}><ScanFace size={13} /> End trip</button>
        )}
        {booking.status === "completed" && !booking.damage && (
          <button onClick={() => setPanel(panel === "damage" ? null : "damage")} className="text-xs font-bold flex items-center gap-1" style={{ color: DANGER }}><AlertTriangle size={13} /> Report damage</button>
        )}
        {booking.status === "completed" && !booking.customerRating && (
          <button onClick={() => setPanel(panel === "rate" ? null : "rate")} className="text-xs font-bold flex items-center gap-1" style={{ color: TEAL }}><Star size={13} /> Rate customer</button>
        )}
      </div>

      {panel === "start" && <OtpSelfieForm label="Verify pickup OTP + selfie" otpExpected={booking.pickupOtp} showFuel showOdo onSubmit={(data) => { onStart(booking.id, data); setPanel(null); }} />}
      {panel === "end" && <OtpSelfieForm label="Verify return OTP + selfie" otpExpected={booking.dropOtp} showFuel showOdo onSubmit={(data) => { onEnd(booking.id, data); setPanel(null); }} />}
      {panel === "cancel" && <CancelPanel policy={policy} isHost booking={booking} onClose={() => setPanel(null)} onConfirm={(reason, fee) => { onCancel(booking.id, "host", reason, fee); setPanel(null); }} />}
      {panel === "damage" && <DamageForm onSubmit={(damage) => { onDamage(booking.id, damage); setPanel(null); }} />}
      {panel === "rate" && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: CREAM }}>
          <p className="text-xs font-bold" style={{ color: INK }}>Rate this customer</p>
          <StarInput value={stars} onChange={setStars} />
          <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="How did they treat the vehicle?" rows={2} className={inputCls} style={{ background: "#fff", color: INK }} />
          <button onClick={() => { onRateCustomer(booking.id, stars, review); setPanel(null); }} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ background: TEAL, color: CREAM }}>Submit rating</button>
        </div>
      )}
    </div>
  );
}

function HostBookingsList({ bookings, policy, onStart, onEnd, onCancel, onDamage, onRateCustomer }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const visible = bookings.filter((b) => {
    if (status !== "all" && b.status !== status) return false;
    if (query) {
      const q = query.toLowerCase();
      return `${b.id} ${b.customerName} ${b.car.name} ${b.car.location}`.toLowerCase().includes(q);
    }
    return true;
  });

  const totalValue = bookings.reduce((sum, b) => sum + (b.status === "cancelled" ? 0 : b.total), 0);
  const completed = bookings.filter((b) => b.status === "completed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const hours = bookings.reduce((sum, b) => sum + b.hours, 0);

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center" style={{ border: `1px solid ${LINE}` }}>
        <Receipt size={28} color={TEAL} className="mx-auto mb-3" />
        <p className="font-bold" style={{ color: INK }}>No bookings yet</p>
        <p className="text-sm mt-1" style={{ color: MUTED }}>Trips booked on your cars will show up here with full details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={ClipboardList} label="Total bookings" value={bookings.length} tone={TEAL} />
        <StatCard icon={Wallet} label="Booking value" value={`₹${totalValue}`} tone={AMBER} />
        <StatCard icon={Clock} label="Booked hours" value={hours} tone={TEAL} />
        <StatCard icon={CheckCircle2} label="Completed / cancelled" value={`${completed} / ${cancelled}`} tone={INK} />
      </div>

      <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-3" style={{ border: `1px solid ${LINE}` }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search booking ID, customer, car or location" className={inputCls} style={{ background: CREAM, color: INK }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls} style={{ background: CREAM, color: INK }}>
          <option value="all">All statuses</option><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-3">
        {visible.map((b) => <HostBookingRow key={b.id} booking={b} policy={policy} onStart={onStart} onEnd={onEnd} onCancel={onCancel} onDamage={onDamage} onRateCustomer={onRateCustomer} />)}
        {visible.length === 0 && <div className="bg-white rounded-2xl p-8 text-center" style={{ border: `1px solid ${LINE}` }}><p className="font-bold" style={{ color: INK }}>No bookings match the filter.</p></div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// OWNER / ADMIN SIDE
// ---------------------------------------------------------------
function OwnerOverview({ cars, bookings, offers, kycQueue }) {
  const revenue = bookings.reduce((s, b) => s + b.total, 0) + cars.reduce((s, c) => s + c.trips * c.pricePerHour * 3, 0);
  const pendingVerifications = cars.filter((c) => c.verified === "pending").length + kycQueue.length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Platform revenue" value={`₹${(revenue / 1000).toFixed(1)}k`} tone={PLUM} />
        <StatCard icon={Car} label="Total cars" value={cars.length} tone={TEAL} />
        <StatCard icon={ClipboardList} label="Total bookings" value={bookings.length} tone={AMBER} />
        <StatCard icon={ShieldQuestion} label="Pending verifications" value={pendingVerifications} tone={PLUM} />
      </div>
      <div className="bg-white rounded-3xl p-5" style={{ border: `1px solid ${LINE}` }}>
        <p className="font-black text-sm mb-3 flex items-center gap-2" style={{ color: INK }}><Sparkles size={16} color={PLUM} /> Active offers</p>
        <div className="flex flex-wrap gap-2">
          {offers.filter((o) => o.active).map((o) => <span key={o.id} className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${PLUM}14`, color: PLUM }}>{o.code} · {o.discountPct}% off</span>)}
          {offers.every((o) => !o.active) && <span className="text-xs font-medium" style={{ color: MUTED }}>No active offers right now.</span>}
        </div>
      </div>
    </div>
  );
}

function OwnerOffers({ offers, onAdd, onToggle, onDelete }) {
  const [form, setForm] = useState({ title: "", code: "", discountPct: 10, validTill: "" });
  const submit = (e) => { e.preventDefault(); if (!form.title || !form.code) return; onAdd({ id: `o${Date.now()}`, ...form, discountPct: Number(form.discountPct), active: true }); setForm({ title: "", code: "", discountPct: 10, validTill: "" }); };
  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="bg-white rounded-3xl p-5 md:p-6 space-y-4" style={{ border: `1px solid ${LINE}` }}>
        <p className="font-black text-sm flex items-center gap-2" style={{ color: INK }}><Plus size={16} color={PLUM} /> Create an offer</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="md:col-span-2"><span className={labelCls} style={labelStyle}>Offer title</span><input className={inputCls} style={inputStyle} placeholder="Festive weekend — 15% off" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} /></label>
          <label><span className={labelCls} style={labelStyle}>Promo code</span><input className={inputCls} style={inputStyle} placeholder="FEST15" value={form.code} onChange={(e) => setForm((s) => ({ ...s, code: e.target.value.toUpperCase() }))} /></label>
          <label><span className={labelCls} style={labelStyle}>Discount %</span><input type="number" min="1" max="90" className={inputCls} style={inputStyle} value={form.discountPct} onChange={(e) => setForm((s) => ({ ...s, discountPct: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className={labelCls} style={labelStyle}>Valid till</span><input type="date" className={inputCls} style={inputStyle} value={form.validTill} onChange={(e) => setForm((s) => ({ ...s, validTill: e.target.value }))} /></label>
        </div>
        <button type="submit" className="py-3 px-6 rounded-xl font-bold text-sm" style={{ background: PLUM, color: CREAM }}>Publish offer</button>
      </form>
      <div className="space-y-3">
        {offers.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl p-4 flex items-center justify-between gap-3" style={{ border: `1px solid ${LINE}` }}>
            <div><p className="font-bold text-sm flex items-center gap-2" style={{ color: INK }}>{o.title} <Badge tone={o.active ? "teal" : "outline"}>{o.active ? "Active" : "Paused"}</Badge></p><p className="text-xs font-medium mt-1" style={{ color: MUTED }}>Code <span className="font-black" style={{ color: PLUM }}>{o.code}</span> · {o.discountPct}% off{o.validTill ? ` · valid till ${o.validTill}` : ""}</p></div>
            <div className="flex items-center gap-2"><button onClick={() => onToggle(o.id)} className="p-2 rounded-full" style={{ background: CREAM }}><ArrowLeftRight size={14} color={INK} /></button><button onClick={() => onDelete(o.id)} className="p-2 rounded-full" style={{ background: CREAM }}><Trash2 size={14} color={DANGER} /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OwnerBonuses({ bonuses, onAdd }) {
  const [form, setForm] = useState({ recipient: "", role: "Customer", amount: 100, reason: "" });
  const submit = (e) => { e.preventDefault(); if (!form.recipient || !form.amount) return; onAdd({ id: `b${Date.now()}`, ...form, amount: Number(form.amount), date: new Date().toLocaleDateString() }); setForm({ recipient: "", role: "Customer", amount: 100, reason: "" }); };
  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="bg-white rounded-3xl p-5 md:p-6 space-y-4" style={{ border: `1px solid ${LINE}` }}>
        <p className="font-black text-sm flex items-center gap-2" style={{ color: INK }}><Gift size={16} color={PLUM} /> Grant a bonus</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="md:col-span-2"><span className={labelCls} style={labelStyle}>Recipient name</span><input className={inputCls} style={inputStyle} placeholder="Ravi Kumar" value={form.recipient} onChange={(e) => setForm((s) => ({ ...s, recipient: e.target.value }))} /></label>
          <label><span className={labelCls} style={labelStyle}>Role</span><select className={inputCls} style={inputStyle} value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}><option>Customer</option><option>Host</option></select></label>
          <label><span className={labelCls} style={labelStyle}>Amount (₹)</span><input type="number" min="10" className={inputCls} style={inputStyle} value={form.amount} onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))} /></label>
          <label className="md:col-span-4"><span className={labelCls} style={labelStyle}>Reason</span><input className={inputCls} style={inputStyle} placeholder="Loyalty milestone — 50 trips completed" value={form.reason} onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))} /></label>
        </div>
        <button type="submit" className="py-3 px-6 rounded-xl font-bold text-sm" style={{ background: PLUM, color: CREAM }}>Grant bonus</button>
      </form>
      <div className="space-y-3">
        {bonuses.length === 0 && <p className="text-sm font-medium" style={{ color: MUTED }}>No bonuses granted yet.</p>}
        {bonuses.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-4 flex items-center justify-between" style={{ border: `1px solid ${LINE}` }}>
            <div><p className="font-bold text-sm" style={{ color: INK }}>{b.recipient} <Badge tone="outline">{b.role}</Badge></p><p className="text-xs font-medium mt-1" style={{ color: MUTED }}>{b.reason || "No reason given"} · {b.date}</p></div>
            <p className="font-black tabular-nums" style={{ color: TEAL }}>+₹{b.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OwnerVerification({ cars, kycQueue, onVerifyCar, onResolveKyc }) {
  const pendingCars = cars.filter((c) => c.verified === "pending");
  return (
    <div className="space-y-6">
      <div>
        <p className="font-black text-sm mb-3" style={{ color: INK }}>Vehicle documents awaiting review</p>
        {pendingCars.length === 0 && <p className="text-sm font-medium" style={{ color: MUTED }}>Nothing pending — every listing is verified.</p>}
        <div className="space-y-3">
          {pendingCars.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-4 flex items-center justify-between gap-3" style={{ border: `1px solid ${LINE}` }}>
              <div className="flex items-center gap-3"><CarThumb car={c} className="w-14 h-14" /><div><p className="font-bold text-sm" style={{ color: INK }}>{c.name}</p><p className="text-xs font-medium" style={{ color: MUTED }}>Host: {c.hostName} · RC + insurance submitted</p></div></div>
              <div className="flex items-center gap-2"><button onClick={() => onVerifyCar(c.id, "verified")} className="p-2 rounded-full" style={{ background: `${TEAL}1A` }}><CheckCircle2 size={16} color={TEAL} /></button><button onClick={() => onVerifyCar(c.id, "rejected")} className="p-2 rounded-full" style={{ background: `${DANGER}1A` }}><XCircle size={16} color={DANGER} /></button></div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="font-black text-sm mb-3" style={{ color: INK }}>Customer KYC awaiting review</p>
        {kycQueue.length === 0 && <p className="text-sm font-medium" style={{ color: MUTED }}>No customer verifications pending.</p>}
        <div className="space-y-3">
          {kycQueue.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl p-4 flex items-center justify-between gap-3" style={{ border: `1px solid ${LINE}` }}>
              <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: CREAM }}><UserCircle2 size={22} color={INK} /></div><div><p className="font-bold text-sm" style={{ color: INK }}>{u.name}</p><p className="text-xs font-medium" style={{ color: MUTED }}>{u.doc}</p></div></div>
              <div className="flex items-center gap-2"><button onClick={() => onResolveKyc(u.id)} className="p-2 rounded-full" style={{ background: `${TEAL}1A` }}><CheckCircle2 size={16} color={TEAL} /></button><button onClick={() => onResolveKyc(u.id)} className="p-2 rounded-full" style={{ background: `${DANGER}1A` }}><XCircle size={16} color={DANGER} /></button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OwnerTerms({ terms, onSave }) {
  const [text, setText] = useState(terms.text);
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 space-y-4" style={{ border: `1px solid ${LINE}` }}>
      <div className="flex items-center justify-between"><p className="font-black text-sm flex items-center gap-2" style={{ color: INK }}><FileEdit size={16} color={PLUM} /> Terms &amp; Conditions</p><span className="text-[11px] font-bold" style={{ color: MUTED }}>Last updated {terms.updatedAt}</span></div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={11} className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none leading-relaxed" style={{ background: CREAM, color: INK }} />
      <button onClick={() => onSave(text)} className="py-3 px-6 rounded-xl font-bold text-sm" style={{ background: PLUM, color: CREAM }}>Save &amp; publish</button>
    </div>
  );
}

function OwnerSettings({ commission, onSaveCommission, policy, onSavePolicy }) {
  const [val, setVal] = useState(commission);
  const [customerFree, setCustomerFree] = useState(policy.customer.freeWindowHours);
  const [customerFee, setCustomerFee] = useState(policy.customer.feePercent);
  const [hostFree, setHostFree] = useState(policy.host.freeWindowHours);
  const [hostFee, setHostFee] = useState(policy.host.feePercent);
  const [damageWindow, setDamageWindow] = useState(policy.damageReportWindowHours);

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="bg-white rounded-3xl p-5 md:p-6 space-y-4" style={{ border: `1px solid ${LINE}` }}>
        <p className="font-black text-sm flex items-center gap-2" style={{ color: INK }}><Percent size={16} color={PLUM} /> Platform commission</p>
        <p className="text-xs font-medium" style={{ color: MUTED }}>The cut Loopcar takes from every host payout.</p>
        <div className="flex items-center gap-4"><input type="range" min="5" max="35" value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full accent-purple-700" /><span className="font-black tabular-nums w-14 text-right" style={{ color: INK }}>{val}%</span></div>
        <button onClick={() => onSaveCommission(val)} className="py-3 px-6 rounded-xl font-bold text-sm" style={{ background: PLUM, color: CREAM }}>Save commission</button>
      </div>

      <div className="bg-white rounded-3xl p-5 md:p-6 space-y-5" style={{ border: `1px solid ${LINE}` }}>
        <p className="font-black text-sm flex items-center gap-2" style={{ color: INK }}><Ban size={16} color={PLUM} /> Cancellation &amp; damage policy</p>
        <p className="text-xs font-medium" style={{ color: MUTED }}>These values are displayed to users before cancellation and referenced in the Terms &amp; Conditions.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-4" style={{ background: CREAM }}>
            <p className="font-bold text-xs mb-3" style={{ color: INK }}>Customer cancellation</p>
            <label><span className={labelCls} style={labelStyle}>Free window (hours)</span><input type="number" min="0" max="72" value={customerFree} onChange={(e) => setCustomerFree(Number(e.target.value))} className={inputCls} style={{ background: "#fff", color: INK }} /></label>
            <label className="block mt-3"><span className={labelCls} style={labelStyle}>Late fee %</span><input type="number" min="0" max="100" value={customerFee} onChange={(e) => setCustomerFee(Number(e.target.value))} className={inputCls} style={{ background: "#fff", color: INK }} /></label>
          </div>
          <div className="rounded-2xl p-4" style={{ background: CREAM }}>
            <p className="font-bold text-xs mb-3" style={{ color: INK }}>Host cancellation</p>
            <label><span className={labelCls} style={labelStyle}>Free window (hours)</span><input type="number" min="0" max="72" value={hostFree} onChange={(e) => setHostFree(Number(e.target.value))} className={inputCls} style={{ background: "#fff", color: INK }} /></label>
            <label className="block mt-3"><span className={labelCls} style={labelStyle}>Host penalty %</span><input type="number" min="0" max="100" value={hostFee} onChange={(e) => setHostFee(Number(e.target.value))} className={inputCls} style={{ background: "#fff", color: INK }} /></label>
          </div>
        </div>

        <label><span className={labelCls} style={labelStyle}>Damage reporting window after trip (hours)</span><input type="number" min="1" max="168" value={damageWindow} onChange={(e) => setDamageWindow(Number(e.target.value))} className={inputCls} style={{ background: CREAM, color: INK }} /></label>

        <button onClick={() => onSavePolicy({
          customer: { freeWindowHours: customerFree, feePercent: customerFee },
          host: { freeWindowHours: hostFree, feePercent: hostFee },
          damageReportWindowHours: damageWindow
        })} className="py-3 px-6 rounded-xl font-bold text-sm" style={{ background: PLUM, color: CREAM }}>Save policy</button>
      </div>

      <div className="bg-white rounded-3xl p-5 md:p-6 space-y-3" style={{ border: `1px solid ${LINE}` }}>
        <p className="font-black text-sm" style={{ color: INK }}>Important operational parameters</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-medium" style={{ color: MUTED }}>
          {["KYC + driving license verification", "OTP at pickup and return", "Selfie capture at both handovers", "Minimum 2 vehicle-condition photos", "Fuel level + odometer at pickup/return", "Damage evidence + repair estimate", "Customer ↔ host mutual rating", "Booking ID + audit timestamps", "Payment / refund / deposit status", "Late return & trip extension tracking", "Emergency support contact", "Admin verification & dispute review"].map((x) => <div key={x} className="flex items-center gap-2 rounded-xl p-3" style={{ background: CREAM }}><CheckCircle2 size={13} color={TEAL} />{x}</div>)}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// ROOT APP
// ---------------------------------------------------------------
export default function LoopcarApp() {
  const [authUser, setAuthUser] = useState(null);
  const [mode, setMode] = useState("customer");

  const [cars, setCars] = useState(INITIAL_CARS);
  const [filters, setFilters] = useState({ query: "", type: "All", transmission: "Any", fuel: "Any", maxPrice: 320, sortBy: "recommended", pickupAt: "", dropAt: "" });
  const [userCoords, setUserCoords] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [activeCar, setActiveCar] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [custTab, setCustTab] = useState("browse");
  const [hostTab, setHostTab] = useState("dashboard");
  const [ownerTab, setOwnerTab] = useState("overview");
  const [requests, setRequests] = useState([
    { id: "r1", customer: "Ananya Iyer", car: INITIAL_CARS[0], hours: 5, total: 780 },
    { id: "r2", customer: "Karthik V.", car: INITIAL_CARS[4], hours: 10, total: 3350 },
  ]);
  const [offers, setOffers] = useState([
    { id: "o1", code: "WELCOME20", title: "20% off your first ride", discountPct: 20, validTill: "2026-12-31", active: true },
    { id: "o2", code: "WEEKEND10", title: "Weekend getaway — 10% off SUVs", discountPct: 10, validTill: "2026-09-30", active: true },
  ]);
  const [bonuses, setBonuses] = useState([]);
  const [terms, setTerms] = useState({ text: DEFAULT_TERMS, updatedAt: new Date().toLocaleDateString() });
  const [commission, setCommission] = useState(15);
  const [cancelPolicy, setCancelPolicy] = useState({
    customer: { freeWindowHours: 2, feePercent: 25 },
    host: { freeWindowHours: 12, feePercent: 50 },
    damageReportWindowHours: 24
  });
  const [kycQueue, setKycQueue] = useState(MOCK_KYC_QUEUE);

  const useMyLocation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) { setUserCoords(BLR_CENTER); setLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocLoading(false); },
      () => { setUserCoords(BLR_CENTER); setLocLoading(false); },
      { timeout: 5000 }
    );
  };

  const filteredCars = useMemo(() => {
    let list = cars.filter((c) => {
      if (filters.type !== "All" && c.type !== filters.type) return false;
      if (filters.transmission !== "Any" && c.transmission !== filters.transmission) return false;
      if (filters.fuel !== "Any" && c.fuel !== filters.fuel) return false;
      if (c.pricePerHour > filters.maxPrice) return false;
      if (filters.query) { const q = filters.query.toLowerCase(); if (!`${c.name} ${c.brand} ${c.location}`.toLowerCase().includes(q)) return false; }
      return true;
    });
    const origin = userCoords || BLR_CENTER;
    if (filters.sortBy === "price_low") list = [...list].sort((a, b) => a.pricePerHour - b.pricePerHour);
    if (filters.sortBy === "nearby") list = [...list].sort((a, b) => distanceKm(origin.lat, origin.lng, a.lat, a.lng) - distanceKm(origin.lat, origin.lng, b.lat, b.lng));
    return list;
  }, [cars, filters, userCoords]);

  const confirmBooking = (car, hours, total, delivery) => {
    setBookings((b) => [{
      id: `bk${Date.now()}`, car, hours, total, delivery, status: "upcoming",
      pickupOtp: genOtp(), dropOtp: genOtp(), pickupAt: filters.pickupAt || null, dropAt: filters.dropAt || null,
      createdAt: new Date().toISOString(), customerName: authUser.name, customerPhone: authUser.phone, customerEmail: authUser.email,
      pickupVerified: false, dropVerified: false, pickupVerifiedAt: null, dropVerifiedAt: null,
      pickupSelfie: null, dropSelfie: null, pickupVehiclePhotos: [], dropVehiclePhotos: [],
      pickupNotes: "", dropNotes: "", fuelStart: null, fuelEnd: null, odoStart: null, odoEnd: null,
      cancelledBy: null, cancelReason: null, cancelFee: 0, cancelledAt: null, refundAmount: 0,
      damage: null, customerRating: null, hostRating: null, termsAcceptedAt: new Date().toISOString(), paymentStatus: "paid", securityDepositStatus: "pending",
      tripStartedAt: null, tripCompletedAt: null,
    }, ...b]);
    setActiveCar(null);
    setCustTab("bookings");
  };

  const extendBooking = (id, extraHours) => setBookings((bs) => bs.map((b) => {
    if (b.id !== id) return b;
    const nextDrop = b.dropAt ? new Date(new Date(b.dropAt).getTime() + extraHours * 3600000).toISOString() : b.dropAt;
    return { ...b, hours: b.hours + extraHours, total: b.total + extraHours * b.car.pricePerHour, dropAt: nextDrop };
  }));
  const cancelBooking = (id, actor, reason, fee) => setBookings((bs) => bs.map((b) => (b.id === id ? {
    ...b, status: "cancelled", cancelledBy: actor, cancelReason: reason, cancelFee: fee,
    cancelledAt: new Date().toISOString(), refundAmount: actor === "customer" ? Math.max(0, b.total - fee) : 0
  } : b)));
  const startTrip = (id, data) => setBookings((bs) => bs.map((b) => (b.id === id ? {
    ...b, status: "ongoing", pickupVerified: true, pickupVerifiedAt: new Date().toISOString(),
    pickupSelfie: data.selfie, pickupVehiclePhotos: data.vehiclePhotos || [], pickupNotes: data.notes || "",
    fuelStart: data.fuel, odoStart: data.odo, tripStartedAt: new Date().toISOString()
  } : b)));
  const endTrip = (id, data) => setBookings((bs) => bs.map((b) => (b.id === id ? {
    ...b, status: "completed", dropVerified: true, dropVerifiedAt: new Date().toISOString(),
    dropSelfie: data.selfie, dropVehiclePhotos: data.vehiclePhotos || [], dropNotes: data.notes || "",
    fuelEnd: data.fuel, odoEnd: data.odo, tripCompletedAt: new Date().toISOString()
  } : b)));
  const addDamage = (id, damage) => setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, damage } : b)));
  const rateCustomer = (id, stars, review) => setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, customerRating: { stars, review, ratedAt: new Date().toISOString() } } : b)));
  const rateHost = (id, stars, review) => setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, hostRating: { stars, review, ratedAt: new Date().toISOString() } } : b)));

  const addCar = (car) => setCars((c) => [car, ...c]);
  const toggleCarAvailability = (id) => setCars((c) => c.map((x) => (x.id === id ? { ...x, available: !x.available } : x)));
  const deleteCar = (id) => setCars((c) => c.filter((x) => x.id !== id));
  const respondRequest = (id) => setRequests((r) => r.filter((x) => x.id !== id));
  const verifyCar = (id, status) => setCars((c) => c.map((x) => (x.id === id ? { ...x, verified: status === "verified" ? "verified" : "pending" } : x)));
  const resolveKyc = (id) => setKycQueue((q) => q.filter((u) => u.id !== id));
  const updateKyc = (patch) => setAuthUser((u) => ({ ...u, kyc: { ...u.kyc, ...patch } }));

  const myCars = cars.filter((c) => ["Ravi Kumar", "Meera S.", "Arjun Rao", "Divya N.", "Sanjay P.", "You"].includes(c.hostName));
  const myCarIds = new Set(myCars.map((c) => c.id));
  const hostBookings = useMemo(() => [...bookings].filter((b) => myCarIds.has(b.car.id)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [bookings, cars]);

  if (!authUser) return <AuthScreen onAuth={setAuthUser} />;

  const modeTone = { customer: AMBER, host: TEAL, owner: PLUM }[mode];

  return (
    <div className="min-h-screen w-full" style={{ background: CREAM, fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      <header className="sticky top-0 z-40" style={{ background: INK }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: modeTone }}><Gauge size={18} color={INK} /></div>
            <span className="font-black tracking-tight text-lg" style={{ color: CREAM, letterSpacing: "-0.02em" }}>LOOPCAR</span>
          </div>
          <div className="flex items-center rounded-full p-1" style={{ background: "#2B2F3A" }}>
            {[["customer", "Customer", LayoutGrid, AMBER], ["host", "Host", Settings2, TEAL], ["owner", "Owner", Crown, PLUM]].map(([k, label, Icon, tone]) => (
              <button key={k} onClick={() => setMode(k)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors" style={mode === k ? { background: tone, color: k === "customer" ? INK : CREAM } : { color: "#9CA0AA" }}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block"><p className="text-xs font-bold" style={{ color: CREAM }}>{authUser.name}</p><p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "#9CA0AA" }}>{authUser.role}</p></div>
            <button onClick={() => setAuthUser(null)} className="p-2 rounded-full" style={{ background: "#2B2F3A" }} title="Log out"><LogOut size={15} color={CREAM} /></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        {mode === "customer" && (
          <>
            <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
              <div><p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: AMBER }}>Self-drive, by the hour</p><h1 className="text-3xl font-black tracking-tight" style={{ color: INK }}>Find your next ride</h1></div>
              <div className="flex rounded-full p-1 flex-wrap" style={{ background: "#EAE6D9" }}>
                {[["browse", "Browse"], ["bookings", "My bookings"], ["account", "Account"]].map(([k, label]) => (
                  <button key={k} onClick={() => setCustTab(k)} className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap" style={custTab === k ? { background: INK, color: CREAM } : { color: INK }}>{label}</button>
                ))}
              </div>
            </div>

            {custTab === "browse" && (
              <>
                <CustomerSearch filters={filters} setFilters={setFilters} cars={cars} userCoords={userCoords} onUseLocation={useMyLocation} locLoading={locLoading} />
                <LaneDivider />
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: MUTED }}>{filteredCars.length} cars available near you</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCars.map((car) => { const origin = userCoords || BLR_CENTER; return <CarCard key={car.id} car={car} onOpen={setActiveCar} distance={userCoords ? distanceKm(origin.lat, origin.lng, car.lat, car.lng) : null} />; })}
                </div>
                {filteredCars.length === 0 && (
                  <div className="bg-white rounded-3xl p-10 text-center mt-4" style={{ border: `1px solid ${LINE}` }}><p className="font-bold" style={{ color: INK }}>No cars match those filters</p><p className="text-sm mt-1" style={{ color: MUTED }}>Try widening your price range or changing location.</p></div>
                )}
              </>
            )}
            {custTab === "bookings" && <MyBookings bookings={bookings} onExtend={extendBooking} onCancel={cancelBooking} onRateHost={rateHost} policy={cancelPolicy} />}
            {custTab === "account" && <AccountKYC user={authUser} onUpdateKyc={updateKyc} bonusCredits={authUser.bonusCredits} />}
          </>
        )}

        {mode === "host" && (
          <>
            <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
              <div><p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: TEAL }}>Your fleet, your earnings</p><h1 className="text-3xl font-black tracking-tight" style={{ color: INK }}>Host dashboard</h1></div>
              <div className="flex rounded-full p-1 flex-wrap" style={{ background: "#EAE6D9" }}>
                {[["dashboard", "Dashboard"], ["cars", "My cars"], ["add", "Add car"], ["bookings", "Total bookings"], ["requests", "Requests"]].map(([k, label]) => (
                  <button key={k} onClick={() => setHostTab(k)} className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap" style={hostTab === k ? { background: INK, color: CREAM } : { color: INK }}>{label}</button>
                ))}
              </div>
            </div>

            {hostTab === "dashboard" && (
              <>
                <HostDashboard cars={myCars} requests={requests} />
                <LaneDivider />
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: MUTED }}>Recent requests</p>
                <HostRequests requests={requests} onRespond={respondRequest} />
              </>
            )}
            {hostTab === "cars" && <div className="space-y-3">{myCars.map((car) => <HostCarRow key={car.id} car={car} onToggle={toggleCarAvailability} onDelete={deleteCar} />)}</div>}
            {hostTab === "add" && <AddCarForm onAdd={addCar} />}
            {hostTab === "bookings" && (
              <HostBookingsList bookings={hostBookings} policy={cancelPolicy} onStart={startTrip} onEnd={endTrip} onCancel={cancelBooking} onDamage={addDamage} onRateCustomer={rateCustomer} />
            )}
            {hostTab === "requests" && <HostRequests requests={requests} onRespond={respondRequest} />}
          </>
        )}

        {mode === "owner" && (
          <>
            <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
              <div><p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: PLUM }}>Company control room</p><h1 className="text-3xl font-black tracking-tight" style={{ color: INK }}>Owner panel</h1></div>
              <div className="flex rounded-full p-1 flex-wrap" style={{ background: "#EAE6D9" }}>
                {[["overview", "Overview"], ["offers", "Offers"], ["bonuses", "Bonuses"], ["verification", "Verification"], ["terms", "Terms"], ["settings", "Settings"]].map(([k, label]) => (
                  <button key={k} onClick={() => setOwnerTab(k)} className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap" style={ownerTab === k ? { background: INK, color: CREAM } : { color: INK }}>{label}</button>
                ))}
              </div>
            </div>

            {ownerTab === "overview" && <OwnerOverview cars={cars} bookings={bookings} offers={offers} kycQueue={kycQueue} />}
            {ownerTab === "offers" && <OwnerOffers offers={offers} onAdd={(o) => setOffers((os) => [o, ...os])} onToggle={(id) => setOffers((os) => os.map((o) => (o.id === id ? { ...o, active: !o.active } : o)))} onDelete={(id) => setOffers((os) => os.filter((o) => o.id !== id))} />}
            {ownerTab === "bonuses" && <OwnerBonuses bonuses={bonuses} onAdd={(b) => setBonuses((bs) => [b, ...bs])} />}
            {ownerTab === "verification" && <OwnerVerification cars={cars} kycQueue={kycQueue} onVerifyCar={verifyCar} onResolveKyc={resolveKyc} />}
            {ownerTab === "terms" && <OwnerTerms terms={terms} onSave={(text) => setTerms({ text, updatedAt: new Date().toLocaleDateString() })} />}
            {ownerTab === "settings" && <OwnerSettings commission={commission} onSaveCommission={setCommission} policy={cancelPolicy} onSavePolicy={setCancelPolicy} />}
          </>
        )}
      </main>

      {activeCar && <BookingModal car={activeCar} offers={offers} onClose={() => setActiveCar(null)} onConfirm={confirmBooking} searchDates={{ pickupAt: filters.pickupAt, dropAt: filters.dropAt }} />}
    </div>
  );
}
