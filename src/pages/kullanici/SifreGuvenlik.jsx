import React, { useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardList,
  Fingerprint,
  Home,
  KeyRound,
  LogOut,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Store,
  Trophy,
  User,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../services/api";

export default function SifreGuvenlik({ user, setUser }) {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

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
        { label: "Ayarlar", icon: Settings, path: "/user/ayarlar", active: true },
      ],
    },
  ];

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !repeatPassword) {
      alert("Lütfen tüm şifre alanlarını doldur.");
      return;
    }

    if (newPassword !== repeatPassword) {
      alert("Yeni şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (newPassword.length < 3) {
      alert("Yeni şifre en az 3 karakter olmalı.");
      return;
    }

    try {
      setSaving(true);

      await updatePassword(user.id, currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");

      alert("Şifren başarıyla güncellendi.");
    } catch (error) {
      alert(error.message || "Şifre güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      

      <main className="flex-1">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10">
          <div className="w-[430px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder="Güvenlik ayarlarında ara..."
              className="bg-transparent outline-none w-full text-sm font-semibold text-slate-600"
            />
          </div>

          <button
            onClick={() => navigate("/user/bildirimler")}
            className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center"
          >
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
              Hesap güvenliği ve erişim yönetimi
            </p>
            <h1 className="text-5xl font-black text-slate-950">
              Şifre ve Güvenlik 🔐
            </h1>
          </div>

          <div className="grid grid-cols-[1fr_360px] gap-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-7">
                <KeyRound size={20} className="text-red-600" />
                <p className="text-xs font-black tracking-[4px] text-slate-400">
                  ŞİFRE DEĞİŞTİR
                </p>
              </div>

              <div className="grid gap-6">
                <PasswordInput
                  label="MEVCUT ŞİFRE"
                  icon={<Shield size={18} />}
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  placeholder="Mevcut şifren"
                />

                <PasswordInput
                  label="YENİ ŞİFRE"
                  icon={<KeyRound size={18} />}
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Yeni şifren"
                />

                <PasswordInput
                  label="YENİ ŞİFRE TEKRAR"
                  icon={<CheckCircle2 size={18} />}
                  value={repeatPassword}
                  onChange={setRepeatPassword}
                  placeholder="Yeni şifre tekrar"
                />
              </div>

              <button
                onClick={handleUpdatePassword}
                disabled={saving}
                className="mt-8 w-full bg-slate-950 hover:bg-red-600 disabled:bg-slate-300 transition text-white rounded-2xl py-5 font-black text-lg"
              >
                {saving ? "GÜNCELLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-950 text-white rounded-[2rem] p-7 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mb-5">
                  <ShieldCheck size={28} />
                </div>

                <h2 className="text-2xl font-black mb-3">
                  Güvenlik Durumu
                </h2>

                <p className="text-slate-400 font-semibold leading-7">
                  Güçlü bir şifre kullanman hesabını ve eğitim verilerini daha güvenli hale getirir.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <Fingerprint size={20} className="text-red-600" />
                  <p className="text-xs font-black tracking-[4px] text-slate-400">
                    EKSTRA GÜVENLİK
                  </p>
                </div>

                <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-5">
                  <div>
                    <h3 className="font-black text-slate-950">
                      Biyometrik Giriş
                    </h3>
                    <p className="text-slate-500 font-semibold text-sm mt-1">
                      FaceID veya parmak izi
                    </p>
                  </div>

                  <button
                    onClick={() => setBiometricEnabled((prev) => !prev)}
                    className={`w-14 h-8 rounded-full p-1 transition ${
                      biometricEnabled ? "bg-red-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full transition ${
                        biometricEnabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PasswordInput({ label, value, onChange, icon, placeholder }) {
  return (
    <div>
      <p className="text-xs font-black tracking-[3px] text-slate-400 mb-3">
        {label}
      </p>

      <div className="h-16 rounded-2xl border border-slate-300 bg-white flex items-center px-5 gap-3">
        <div className="text-slate-400">{icon}</div>

        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent outline-none w-full font-bold text-slate-900 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}