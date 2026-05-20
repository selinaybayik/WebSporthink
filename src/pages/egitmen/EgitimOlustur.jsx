// EgitimOlustur.jsx
import React, { useState } from "react";
import {
  ArrowLeft, BookOpen, ChevronDown, Clock3,
  Eye, Image, Rocket, Save, Sparkles, Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createInstructorTraining, uploadCoverImage } from "../../services/api";

const categories = ["Satış", "İletişim", "Operasyon", "Kurumsal", "İK", "Teknik Eğitim"];
const levels = ["Başlangıç", "Orta", "İleri"];

export default function EgitimOlustur({ user }) {
  const navigate = useNavigate();

  const [title, setTitle]       = useState("");
  const [desc, setDesc]         = useState("");
  const [category, setCategory] = useState("Satış");
  const [level, setLevel]       = useState("Başlangıç");
  const [duration, setDuration] = useState("");
  const [xp, setXp]             = useState("50");
  const [coverUrl, setCoverUrl] = useState("");
const [coverUploading, setCoverUploading] = useState(false);
  const [saving, setSaving]     = useState(false);

  const getSeviyeId = () => {
    if (level === "Orta")  return 2;
    if (level === "İleri") return 3;
    return 1;
  };


  const handleCoverSelect = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setCoverUploading(true);

    const previewUrl = URL.createObjectURL(file);
    setCoverUrl(previewUrl);

    const result = await uploadCoverImage(file);
    setCoverUrl(result.url);

    alert("Kapak görseli yüklendi.");
  } catch (error) {
    alert(error.message || "Kapak görseli yüklenemedi.");
  } finally {
    setCoverUploading(false);
  }
};

  const saveTraining = async () => {
    if (!title.trim()) {
      alert("Lütfen eğitim başlığı gir.");
      return null;
    }
    try {
      setSaving(true);
      const result = await createInstructorTraining({
        baslik:      title,
        aciklama:    desc,
        kategori:    category,
        seviye_id:   getSeviyeId(),
        sure:        duration || "0 dk",
        xp_degeri:   Number(xp) || 0,
        olusturanId: user?.id,
        kapak_url: coverUrl,
      });
      return result?.egitim || result;
    } catch (error) {
      alert(error.message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleOnizleme = async () => {
    const egitim = await saveTraining();
    if (!egitim) return;
    const id = egitim.egitim_id || egitim.id;
    if (id) {
      navigate(`/egitmen/onizleme/${id}`, { state: { egitim } });
    } else {
      navigate("/egitmen/onizleme/0", { state: { egitim } });
    }
  };

  const handleIcerikEkle = async () => {
    const egitim = await saveTraining();
    if (!egitim) return;
    navigate("/egitmen/kaynak-yonetimi", { state: { egitim } });
  };

  const handleTaslakKaydet = async () => {
    const egitim = await saveTraining();
    if (egitim) alert("✅ Taslak kaydedildi!");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="h-24 bg-white border-b border-slate-200 px-10 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-5"
          >
            <ArrowLeft size={22} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-950">Yeni Eğitim</h1>
            <p className="text-slate-400 font-bold mt-2">Eğitim taslağı oluştur</p>
          </div>
        </div>

        {/* Header önizleme butonu */}
        <button
          onClick={handleOnizleme}
          disabled={saving}
          className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition"
          title="Önizle"
        >
          <Eye size={24} className="text-red-600" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-10">
        {/* HERO */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-red-700 rounded-[2.5rem] p-10 text-white mb-10">
          <Sparkles size={180} className="absolute right-[-30px] top-[-30px] opacity-10" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/20 text-red-200 text-xs font-black tracking-[3px] mb-7">
              <Sparkles size={14} />
              GENEL AYARLAR
            </div>
            <h2 className="text-5xl font-black max-w-3xl leading-tight">
              Eğitim temel bilgilerini oluştur.
            </h2>
            <p className="text-slate-300 text-lg font-semibold leading-8 max-w-3xl mt-6">
              Başlık, kategori, seviye ve süre bilgilerini belirledikten sonra içerik ekleme aşamasına geçebilirsin.
            </p>
            <div className="flex gap-5 mt-10">
              <StatCard value="1"                    label="TASLAK" />
              <StatCard value={title ? "%45" : "%20"} label="HAZIRLIK" />
              <StatCard value={xp}                   label="XP" green />
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
            <div className="space-y-7">
              {/* BAŞLIK */}
              <div>
                <label className="block text-xs tracking-[3px] font-black text-slate-400 mb-3">
                  EĞİTİM BAŞLIĞI
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Müşteri Deneyimi ve İletişim Teknikleri"
                  className="w-full h-16 rounded-2xl border border-slate-200 bg-slate-50 px-6 font-bold outline-none focus:border-red-500"
                />
              </div>

              {/* AÇIKLAMA */}
              <div>
                <label className="block text-xs tracking-[3px] font-black text-slate-400 mb-3">
                  AÇIKLAMA
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Eğitimin amacı, kapsamı ve kazanımlarını yaz..."
                  className="w-full h-40 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 font-bold outline-none resize-none focus:border-red-500"
                />
              </div>

              {/* KATEGORİ */}
              <div>
                <label className="block text-xs tracking-[3px] font-black text-slate-400 mb-3">
                  KATEGORİ
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-16 rounded-2xl border border-slate-200 bg-slate-50 px-6 font-bold appearance-none outline-none focus:border-red-500"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* SEVİYE */}
              <div>
                <label className="block text-xs tracking-[3px] font-black text-slate-400 mb-3">
                  SEVİYE
                </label>
                <div className="flex gap-3">
                  {levels.map((item) => (
                    <button
                      key={item}
                      onClick={() => setLevel(item)}
                      className={`flex-1 h-14 rounded-2xl font-black transition ${
                        level === item ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* SÜRE & XP */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs tracking-[3px] font-black text-slate-400 mb-3">
                    SÜRE
                  </label>
                  <div className="h-16 rounded-2xl border border-slate-200 bg-slate-50 px-5 flex items-center">
                    <Clock3 size={20} className="text-slate-400 mr-3" />
                    <input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="45 dk"
                      className="bg-transparent outline-none font-bold w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-[3px] font-black text-slate-400 mb-3">
                    XP
                  </label>
                  <div className="h-16 rounded-2xl border border-slate-200 bg-slate-50 px-5 flex items-center">
                    <Star size={20} className="text-yellow-500 mr-3" />
                    <input
                      value={xp}
                      onChange={(e) => setXp(e.target.value)}
                      className="bg-transparent outline-none font-bold w-full"
                    />
                  </div>
                </div>
              </div>

              {/* KAPAK GÖRSELİ */}
<div>
  <label className="block text-xs tracking-[3px] font-black text-slate-400 mb-3">
    KAPAK GÖRSELİ
  </label>

  <label className="h-52 rounded-[2rem] border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-red-400 transition relative">
    
    <input
      type="file"
      accept="image/*"
      onChange={handleCoverSelect}
      className="hidden"
    />

    {coverUrl ? (
      <img
        src={coverUrl}
        alt="Kapak Görseli"
        className="w-full h-full object-cover"
      />
    ) : (
      <>
        <Image size={42} className="text-slate-400" />

        <p className="mt-5 font-black text-slate-500">
          Kapak görseli ekle
        </p>

        <p className="text-sm text-slate-400 font-semibold mt-2">
          PNG / JPG seç
        </p>
      </>
    )}

    {coverUploading && (
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <p className="text-white font-black text-lg">
          Yükleniyor...
        </p>
      </div>
    )}
  </label>
</div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-7">
            {/* ÖNIZLEME KARTI */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs tracking-[3px] font-black text-slate-400">ÖNİZLEME</p>
                <Eye size={18} className="text-red-600" />
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mr-4">
                  <BookOpen size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-950 line-clamp-1">
                    {title || "Eğitim başlığı burada görünecek"}
                  </h3>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 mt-2">
                    {category.toUpperCase()} · {level.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* AKSİYONLAR */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-4">
              {/* TASLAK KAYDET */}
              <button
                onClick={handleTaslakKaydet}
                disabled={saving}
                className="w-full h-16 rounded-2xl bg-slate-950 text-white font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition disabled:opacity-60"
              >
                <Save size={20} />
                {saving ? "KAYDEDİLİYOR..." : "TASLAK KAYDET"}
              </button>

              {/* İÇERİK EKLE */}
              <button
                onClick={handleIcerikEkle}
                disabled={saving}
                className="w-full h-16 rounded-2xl bg-red-600 text-white font-black flex items-center justify-center gap-3 hover:bg-red-700 transition disabled:opacity-60"
              >
                <Rocket size={20} />
                {saving ? "KAYDEDİLİYOR..." : "İÇERİK EKLE"}
              </button>

              {/* ÖNİZLE */}
              <button
                onClick={handleOnizleme}
                disabled={saving}
                className="w-full h-16 rounded-2xl border-2 border-slate-200 text-slate-700 font-black flex items-center justify-center gap-3 hover:border-red-400 hover:text-red-600 transition disabled:opacity-60"
              >
                <Eye size={20} />
                {saving ? "KAYDEDİLİYOR..." : "ÖNİZLE"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ value, label, green }) {
  return (
    <div className="w-36 h-24 rounded-3xl bg-white/10 border border-white/10 flex flex-col items-center justify-center backdrop-blur-sm">
      <h3 className={`text-2xl font-black ${green ? "text-emerald-400" : "text-sky-400"}`}>
        {value}
      </h3>
      <p className="text-xs tracking-[3px] font-black text-slate-300 mt-2">{label}</p>
    </div>
  );
}