import React, { useEffect, useRef, useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  Hash,
  Printer,
  Search,
  ShieldCheck,
  Star,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import KullaniciLayout from "../../components/KullaniciLayout";
 
const BASE_URL = "http://10.204.138.92:4000";
 
export default function Sertifikalarim({ user, setUser }) {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // modal için seçili sertifika
  const printRef = useRef(null);
 
  useEffect(() => {
    if (user?.id) fetchCertificates();
  }, [user?.id]);
 
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/sertifikalar/${user.id}`);
      const data = await res.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Sertifika hatası:", err);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };
 
  const filtered = certificates
  .filter(
    (c) =>
      !c.sertifika_pasif_mi &&
      c.aktif_mi !== false
  )
  .filter((c) =>
    (c.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
 
  const handlePrint = () => {
    window.print();
  };
 
  return (
    <KullaniciLayout
      user={user}
      setUser={setUser}
      activePath="/user/sertifikalar"
      searchPlaceholder="Sertifika ara..."
    >
      {/* ── PRINT STİLİ ── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cert-print-area, #cert-print-area * { visibility: visible !important; }
          #cert-print-area {
            position: fixed !important;
            inset: 0 !important;
            z-index: 9999 !important;
            background: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
 
      {/* ── HEADER ── */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Sertifikalarım</h1>
          <p className="text-slate-400 font-bold text-sm">
            {certificates.length} sertifika kazandın
          </p>
        </div>
 
        <div className="flex items-center gap-4">
          <div className="w-80 h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3 border border-slate-200">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sertifika ara..."
              className="bg-transparent outline-none w-full text-sm font-bold text-slate-600"
            />
          </div>
        </div>
      </header>
 
      <main className="p-8 xl:p-10">
        {/* ── HERO STAT BAR ── */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          <StatCard
            icon={Trophy}
            label="Toplam Sertifika"
            value={filtered.length}
            color="amber"
          />
          <StatCard
            icon={Star}
            label="Bu Ay Kazanılan"
            value={certificates.filter((c) => {
              if (!c.date) return false;
              const d = new Date(c.date.split(".").reverse().join("-"));
              const now = new Date();
              return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
              );
            }).length}
            color="red"
          />
          <StatCard
            icon={ShieldCheck}
            label="Doğrulanmış"
            value={filtered.length}
            color="emerald"
          />
        </div>
 
        {/* ── LOADING ── */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-black text-slate-500">Sertifikalar yükleniyor...</p>
            </div>
          </div>
        )}
 
        {/* ── BOŞ DURUM ── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-28 h-28 rounded-[2rem] bg-amber-50 flex items-center justify-center mb-6">
              <Award size={56} className="text-amber-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-950 mb-3">
              {search ? "Sertifika bulunamadı" : "Henüz sertifikan yok"}
            </h2>
            <p className="text-slate-400 font-semibold max-w-sm leading-7">
              {search
                ? "Farklı bir arama kelimesi dene."
                : "Eğitimleri tamamlayarak sertifika kazan ve burada görüntüle."}
            </p>
            {!search && (
              <button
                onClick={() => navigate("/user/egitimler")}
                className="mt-8 px-8 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/25"
              >
                Eğitimlere Git
              </button>
            )}
          </div>
        )}
 
        {/* ── SERTİFİKA GRID ── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((cert, i) => (
              <CertCard
                key={cert.id || i}
                cert={cert}
                userName={user?.name || cert.userName || ""}
                onView={() => setSelected(cert)}
              />
            ))}
          </div>
        )}
      </main>
 
      {/* ── SERTİFİKA MODAL ── */}
      {selected && (
        <CertModal
          cert={selected}
          userName={user?.name || selected.userName || ""}
          onClose={() => setSelected(null)}
        />
      )}
    </KullaniciLayout>
  );
}
 
// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    amber: "bg-amber-50 text-amber-500",
    red: "bg-red-50 text-red-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
 
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-7 flex items-center gap-5 shadow-sm">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={30} />
      </div>
      <div>
        <p className="text-slate-400 font-bold text-sm">{label}</p>
        <p className="text-4xl font-black text-slate-950">{value}</p>
      </div>
    </div>
  );
}
 
// ─────────────────────────────────────────────
// SERTİFİKA KARTI
// ─────────────────────────────────────────────
function CertCard({ cert, userName, onView }) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Dekoratif üst şerit */}
      <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-amber-500" />
 
      {/* İkon alanı */}
      <div className="px-7 pt-7 pb-5">
        <div className="flex items-start justify-between mb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Trophy size={28} className="text-amber-500" />
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black flex items-center gap-1">
            <CheckCircle2 size={12} />
            Doğrulandı
          </span>
        </div>
 
        <h3 className="text-xl font-black text-slate-950 leading-tight mb-2 line-clamp-2">
          {cert.title || "Eğitim Sertifikası"}
        </h3>
 
        <p className="text-slate-400 font-semibold text-sm mb-5">{userName}</p>
 
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
            <Calendar size={14} className="text-slate-400" />
            {cert.date || "—"}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
            <Hash size={14} className="text-slate-400" />
            <span className="font-mono text-xs truncate">{cert.certificateId || "—"}</span>
          </div>
        </div>
      </div>
 
      {/* Alt buton */}
      <div className="px-7 pb-7">
        <button
          onClick={onView}
          className="w-full py-3 bg-slate-950 text-white rounded-2xl font-black flex items-center justify-center gap-2 group-hover:bg-red-600 transition-colors duration-300"
        >
          <ExternalLink size={16} />
          Sertifikayı Görüntüle
        </button>
      </div>
    </div>
  );
}
 
// ─────────────────────────────────────────────
// SERTİFİKA MODAL (yazdırılabilir)
// ─────────────────────────────────────────────
function CertModal({ cert, userName, onClose }) {
  const handlePrint = () => window.print();
 
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-950">Sertifika Önizleme</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black text-slate-700 transition text-sm"
            >
              <Printer size={16} />
              Yazdır
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black transition text-sm"
            >
              <Download size={16} />
              İndir
            </button>
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
 
        {/* Sertifika içeriği */}
        <div className="p-8 bg-slate-50" id="cert-print-area">
          <CertificateDocument cert={cert} userName={userName} />
        </div>
      </div>
    </div>
  );
}
 
// ─────────────────────────────────────────────
// SERTİFİKA BELGESI (yazdırılabilir görsel)
// ─────────────────────────────────────────────
function CertificateDocument({ cert, userName }) {
  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden"
      style={{
        padding: "60px 70px",
        minHeight: "520px",
        border: "2px solid #e2e8f0",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Köşe dekorları */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 80,
          height: 80,
          background: "linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 80,
          height: 80,
          background: "linear-gradient(315deg, #dc2626 0%, #f59e0b 100%)",
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }}
      />
 
      {/* Üst şerit */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "linear-gradient(90deg, #dc2626, #f59e0b, #dc2626)",
        }}
      />
      {/* Alt şerit */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "linear-gradient(90deg, #dc2626, #f59e0b, #dc2626)",
        }}
      />
 
      {/* İçerik */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Logo / Marka */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 32,
            padding: "10px 24px",
            background: "#0f172a",
            borderRadius: 50,
            color: "white",
          }}
        >
          <Zap size={18} color="#f59e0b" />
          <span style={{ fontFamily: "system-ui", fontWeight: 900, fontSize: 14, letterSpacing: 3 }}>
            SPORTHINK AKADEMİ
          </span>
        </div>
 
        <p
          style={{
            fontFamily: "system-ui",
            fontWeight: 900,
            fontSize: 11,
            letterSpacing: 5,
            color: "#dc2626",
            marginBottom: 16,
          }}
        >
          BAŞARI SERTİFİKASI
        </p>
 
        <p style={{ color: "#64748b", fontSize: 15, marginBottom: 10, fontFamily: "system-ui" }}>
          Bu belge,
        </p>
 
        {/* İsim */}
        <h1
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 10,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            lineHeight: 1.1,
          }}
        >
          {userName}
        </h1>
 
        <p style={{ color: "#64748b", fontSize: 15, marginBottom: 28, fontFamily: "system-ui" }}>
          adına verilmiştir.
        </p>
 
        {/* Ayraç */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div style={{ height: 1, width: 80, background: "#e2e8f0" }} />
          <Trophy size={24} color="#f59e0b" />
          <div style={{ height: 1, width: 80, background: "#e2e8f0" }} />
        </div>
 
        {/* Eğitim adı */}
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 8,
            fontFamily: "Georgia, serif",
            lineHeight: 1.3,
          }}
        >
          {cert.title || "Eğitim Sertifikası"}
        </h2>
 
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 36, fontFamily: "system-ui" }}>
          eğitimini başarıyla tamamlamıştır.
        </p>
 
        {/* Alt bilgi */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #e2e8f0",
            paddingTop: 24,
            fontFamily: "system-ui",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
              SERTİFİKA NO
            </p>
            <p style={{ fontSize: 12, color: "#475569", fontWeight: 700, fontFamily: "monospace" }}>
              {cert.certificateId || "—"}
            </p>
          </div>
 
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #dc2626, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 6px",
              }}
            >
              <ShieldCheck size={24} color="white" />
            </div>
            <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: 2 }}>
              DOĞRULANMIŞ
            </p>
          </div>
 
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
              TARİH
            </p>
            <p style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>
              {cert.date || new Date().toLocaleDateString("tr-TR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}