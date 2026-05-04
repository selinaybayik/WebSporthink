import React, { useEffect, useMemo, useState } from "react";
import KullaniciLayout from "../../components/KullaniciLayout";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  ClipboardList,
  Home,
  LogOut,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  Search,
  Settings,
  Star,
  Store,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/api";

export default function Profilim({ user, setUser }) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
        { label: "360 Değerlendirmelerim", icon: Medal, path: "/user/degerlendirmeler-360" },
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
        { label: "Profilim", icon: User, path: "/user/profil", active: true },
        { label: "Ayarlar", icon: Settings, path: "/user/ayarlar" },
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

      setProfile({
        name: data.name || user.name || "Kullanıcı",
        email: data.email || "",
        role: data.role || user.role || "Çalışan",
        department: data.department || user.department || "Departman",
        company: data.company || "Sporthink",
        level: Number(data.level) || 1,
        xp: Number(data.xp) || 0,
        nextLevelXp: Number(data.nextLevelXp) || 1000,
        certificates: Number(data.certificates) || 0,
        trainings: Number(data.trainings) || 0,
        ranking: data.ranking || "-",
        coin: Number(data.coin) || 0,
      });
    } catch (error) {
      console.log("Profil yüklenemedi:", error.message);

      setProfile({
        name: user?.name || "Kullanıcı",
        email: user?.email || "",
        role: user?.role || "Çalışan",
        department: user?.department || "Departman",
        company: "Sporthink",
        level: 1,
        xp: 0,
        nextLevelXp: 1000,
        certificates: 0,
        trainings: 0,
        ranking: "-",
        coin: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = useMemo(() => {
    if (!profile) return 0;
    return Math.min((profile.xp / profile.nextLevelXp) * 100, 100);
  }, [profile]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="font-black text-slate-700">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/profil" searchPlaceholder="Profilde ara..." >
      

      <main className="flex-1">
      

        <section className="p-10">
          <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-8">
            <div className="absolute -right-16 -top-16 w-72 h-72 bg-red-600/10 rounded-full" />

            <div className="relative z-10 flex items-center justify-between gap-8">
              <div className="flex items-center gap-7">
                <div className="w-32 h-32 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-5xl font-black">
                  {profile.name?.charAt(0)}
                </div>

                <div>
                  <p className="text-red-300 font-black text-xs tracking-[3px] mb-3">
                    KULLANICI PROFİLİ
                  </p>

                  <h1 className="text-5xl font-black mb-4">{profile.name}</h1>

                  <div className="flex items-center gap-3 text-slate-300 font-bold mb-3">
                    <Briefcase size={16} />
                    {profile.role}
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 font-semibold">
                    <Building2 size={16} />
                    {profile.department} • {profile.company}
                  </div>
                </div>
              </div>

              <div className="w-[360px] bg-white/5 border border-white/10 rounded-[2rem] p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-black text-sm tracking-widest text-red-400">
                    SEVİYE İLERLEMESİ
                  </p>

                  <p className="font-black text-sm">%{Math.floor(progressPercent)}</p>
                </div>

                <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden mb-3">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <p className="text-sm text-slate-400 font-semibold">
                  Sonraki seviye için{" "}
                  <span className="text-white font-black">
                    {Math.max(profile.nextLevelXp - profile.xp, 0)} XP
                  </span>{" "}
                  kaldı.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5 mb-8">
            <StatCard icon={<Award size={24} />} title={profile.certificates} subtitle="Sertifika" />
            <StatCard icon={<Zap size={24} />} title={profile.trainings} subtitle="Aktif Eğitim" />
            <StatCard icon={<Trophy size={24} />} title={profile.ranking} subtitle="Sıralama" />
            <StatCard icon={<Store size={24} />} title={profile.coin} subtitle="Coin" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <InfoPanel
              title="Öğrenme Özeti"
              text={`${profile.trainings} aktif eğitim, ${profile.certificates} sertifika ve ${profile.xp} XP ile öğrenme sürecin devam ediyor.`}
            />

            <InfoPanel
              title="Oyunlaştırma Durumu"
              text={`Sıralaman ${profile.ranking}. Coin bakiyen ${profile.coin}. Ödül pazarından talepler oluşturabilirsin.`}
            />

            <InfoPanel
              title="Hesap Yönetimi"
              text="Kişisel bilgiler, şifre, görünüm ve destek işlemleri Ayarlar sayfasına taşındı."
              buttonText="Ayarlara Git"
              onClick={() => navigate("/user/ayarlar")}
            />
          </div>
        </section>
      </main>
    </KullaniciLayout>
  );
}

function StatCard({ icon, title, subtitle }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="text-3xl font-black text-slate-950 mb-2">{title}</h3>
      <p className="text-slate-500 font-bold">{subtitle}</p>
    </div>
  );
}

function InfoPanel({ title, text, buttonText, onClick }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
      <h3 className="text-xl font-black text-slate-950 mb-3">{title}</h3>
      <p className="text-slate-500 font-semibold leading-7 mb-5">{text}</p>

      {buttonText && (
        <button
          onClick={onClick}
          className="bg-red-600 text-white px-5 py-3 rounded-2xl font-black"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}