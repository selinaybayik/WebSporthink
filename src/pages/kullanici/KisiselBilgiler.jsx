import React, { useEffect, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  Building2,
  Camera,
  ClipboardList,
  Home,
  LogOut,
  Mail,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  Phone,
  Search,
  Settings,
  Store,
  Trophy,
  User,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../services/api";

export default function KisiselBilgiler({ user, setUser }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    departman: "",
    rol: "",
    avatar: "",
  });

  const menuSections = [
    {
      title: "ÖĞRENME",
      items: [
        { label: "Ana Sayfa", icon: Home, path: "/user/dashboard" },
        { label: "Eğitimlerim", icon: BookOpen, path: "/user/egitimler" },
        { label: "Yol Haritam", icon: Map, path: "/user/yol-haritam" },
        { label: "Sertifikalarım", icon: Award, path: "/user/sertifikalar" },
      ],
    },
    {
      title: "GÖREVLER & İLETİŞİM",
      items: [
        { label: "Duyurularım", icon: Megaphone, path: "/user/duyurular" },
        { label: "Anketlerim", icon: ClipboardList, path: "/user/anketler" },
        { label: "360 Değerlendirmelerim", icon: Medal, path: "/user/360" },
        { label: "Sorularım", icon: MessageCircle, path: "/user/sorular" },
        { label: "AI Asistan", icon: Bot, path: "/user/asistan" },
        { label: "Bildirimler", icon: Bell, path: "/user/bildirimler" },
      ],
    },
    {
      title: "OYUNLAŞTIRMA",
      items: [
        { label: "Liderlik Tablosu", icon: Trophy, path: "/user/liderlik" },
        { label: "Ödül Pazarı", icon: Store, path: "/user/odul-pazari" },
        { label: "Rozetlerim", icon: Medal, path: "/user/rozetler" },
      ],
    },
    {
      title: "HESAP",
      items: [
        { label: "Profilim", icon: User, path: "/user/profil" },
        {
          label: "Ayarlar",
          icon: Settings,
          path: "/user/ayarlar",
          active: true,
        },
      ],
    },
  ];

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data = await getProfile(user.id);

      const parts = String(data.name || "").split(" ");

      setForm({
        ad: parts[0] || "",
        soyad: parts.slice(1).join(" ") || "",
        email: data.email || "",
        telefon: data.phone || "",
        departman: data.department || "",
        rol: data.role || "",
        avatar: data.avatar || "",
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateProfile(user.id, {
        ad: form.ad,
        soyad: form.soyad,
        email: form.email,
        telefon: form.telefon,
      });

      alert("Bilgiler güncellendi.");
    } catch (error) {
      alert("Güncelleme başarısız.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="font-black text-slate-700">
            Bilgiler yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}

      {/* CONTENT */}
      <main className="flex-1">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10">
          <div className="w-[430px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3">
            <Search size={20} className="text-slate-400" />

            <input
              placeholder="Kişisel bilgilerde ara..."
              className="bg-transparent outline-none w-full text-sm font-semibold text-slate-600"
            />
          </div>

          <button className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center">
            <Bell size={22} />
          </button>
        </header>

        <section className="p-10">
          <div className="mb-6">
  <button
    type="button"
    onClick={() => navigate("/user/ayarlar")}
    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-black hover:bg-slate-50 hover:border-red-200 transition shadow-sm"
  >
    <ArrowLeft size={18} />
    Ayarlara Dön
  </button>
</div>
          <div className="mb-10">
            <p className="text-slate-500 font-bold mb-2">
              Profil düzenleme alanı
            </p>

            <h1 className="text-5xl font-black text-slate-950">
              Kişisel Bilgiler 👤
            </h1>
          </div>

          <div className="grid grid-cols-[320px_1fr] gap-8">
            {/* LEFT */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 h-fit shadow-sm">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-44 h-44 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    {form.avatar ? (
                      <img
                        src={form.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={70} className="text-slate-400" />
                    )}
                  </div>

                  <button className="absolute bottom-2 right-2 w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center border-4 border-white shadow-lg">
                    <Camera size={22} />
                  </button>
                </div>

                <h2 className="text-2xl font-black text-slate-950">
                  {form.ad} {form.soyad}
                </h2>

                <p className="text-slate-500 font-bold mt-2">
                  {form.rol}
                </p>

                <div className="mt-6 w-full bg-slate-100 rounded-2xl p-5">
                  <p className="text-xs font-black tracking-[3px] text-slate-400 mb-2">
                    DEPARTMAN
                  </p>

                  <p className="font-black text-slate-900">
                    {form.departman}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                <InputCard
                  label="AD"
                  icon={<User size={18} />}
                  value={form.ad}
                  onChange={(v) => updateField("ad", v)}
                />

                <InputCard
                  label="SOYAD"
                  icon={<User size={18} />}
                  value={form.soyad}
                  onChange={(v) => updateField("soyad", v)}
                />

                <InputCard
                  label="E-POSTA"
                  icon={<Mail size={18} />}
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                />

                <InputCard
                  label="TELEFON"
                  icon={<Phone size={18} />}
                  value={form.telefon}
                  onChange={(v) => updateField("telefon", v)}
                />

                <InputCard
                  label="DEPARTMAN"
                  icon={<Building2 size={18} />}
                  value={form.departman}
                  disabled
                />

                <InputCard
                  label="ROL"
                  icon={<User size={18} />}
                  value={form.rol}
                  disabled
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-8 w-full bg-slate-950 hover:bg-red-600 transition text-white rounded-2xl py-5 font-black text-lg"
              >
                {saving
                  ? "GÜNCELLENİYOR..."
                  : "BİLGİLERİ GÜNCELLE"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function InputCard({
  label,
  value,
  onChange,
  icon,
  disabled = false,
}) {
  return (
    <div>
      <p className="text-xs font-black tracking-[3px] text-slate-400 mb-3">
        {label}
      </p>

      <div
        className={`h-16 rounded-2xl border flex items-center px-5 gap-3 ${
          disabled
            ? "bg-slate-100 border-slate-200"
            : "bg-white border-slate-300"
        }`}
      >
        <div className="text-slate-400">{icon}</div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="bg-transparent outline-none w-full font-bold text-slate-900"
        />
      </div>
    </div>
  );
}