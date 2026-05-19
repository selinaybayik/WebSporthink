import React from "react";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  ClipboardList,
  HelpCircle,
  Home,
  Info,
  LogOut,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Store,
  Trophy,
  User,
  Wrench,
  ChevronRight,
  Palette,
} from "lucide-react";
import KullaniciLayout from "../../components/KullaniciLayout";
import { useNavigate } from "react-router-dom";

export default function Ayarlar({ user, setUser }) {
  const navigate = useNavigate();

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

  return (
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/ayarlar" searchPlaceholder="Ayarlarda ara..." >
      {/* SIDEBAR */}

      {/* CONTENT */}
      <main className="flex-1 min-h-screen bg-slate-50">

        {/* BODY */}
        <section className="p-10">
          <div className="mb-10">
            <p className="text-slate-500 font-bold mb-2">
              Hesap ve uygulama yönetimi
            </p>

            <h1 className="text-5xl font-black text-slate-950">
              Ayarlar ⚙️
            </h1>
          </div>

          {/* HESAP */}
          <div className="mb-12">
            <p className="text-xs font-black tracking-[4px] text-red-500 mb-5">
              HESAP & GÜVENLİK
            </p>

            <div className="grid grid-cols-2 gap-6">
              <SettingCard
  icon={<User size={22} />}
  title="Kişisel Bilgiler"
  subtitle="Profil ve iletişim bilgilerini yönet"
  onClick={() => navigate("/user/kisisel-bilgiler")}
/>

              <SettingCard
  icon={<ShieldCheck size={22} />}
  title="Şifre ve Güvenlik"
  subtitle="Hesap güvenlik ayarlarını güncelle"
  onClick={() => navigate("/user/sifre-guvenlik")}
/>

              <SettingCard
  icon={<Bot size={22} />}
  title="Kişisel Analiz"
  subtitle="AI destekli gelişim analizlerini görüntüle"
  onClick={() => navigate("/user/kisisel-analiz")}
/>

              <SettingCard
                icon={<Bell size={22} />}
                title="Bildirim Tercihleri"
                subtitle="Bildirim ve uyarı ayarlarını düzenle"
              />
            </div>
          </div>

          {/* GÖRÜNÜM */}
          <div className="mb-12">
            <p className="text-xs font-black tracking-[4px] text-blue-500 mb-5">
              UYGULAMA AYARLARI
            </p>

            <div className="grid grid-cols-2 gap-6">
              <SettingCard
  icon={<Moon size={22} />}
  title="Görünüm"
  subtitle="Tema ve ekran görünümünü değiştir"
  onClick={() => navigate("/user/gorunum")}
/>

              
            </div>
          </div>

          {/* DESTEK */}
          <div>
            <p className="text-xs font-black tracking-[4px] text-emerald-500 mb-5">
              DESTEK & YARDIM
            </p>

            <div className="grid grid-cols-2 gap-6">
              <SettingCard
  icon={<HelpCircle size={22} />}
  title="Sıkça Sorulan Sorular"
  subtitle="Sistem kullanım rehberlerini görüntüle"
  onClick={() => navigate("/user/sss")}
/>

              <SettingCard
  icon={<Wrench size={22} />}
  title="Teknik Destek"
  subtitle="Destek talebi oluştur ve yardım al"
  onClick={() => navigate("/user/teknik-destek")}
/>

              <SettingCard
                icon={<Info size={22} />}
                title="Uygulama Hakkında"
                subtitle="Sporthink platform detaylarını görüntüle"
              />
            </div>
          </div>
        </section>
      </main>
    </KullaniciLayout>
  );
}

function SettingCard({ icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-[2rem] p-7 flex items-center justify-between hover:-translate-y-1 transition shadow-sm"
    >
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
          {icon}
        </div>

        <div className="text-left">
          <h3 className="text-lg font-black text-slate-950 mb-1">{title}</h3>
          <p className="text-slate-500 font-semibold">{subtitle}</p>
        </div>
      </div>

      <ChevronRight size={20} className="text-slate-400" />
    </button>
  );
}