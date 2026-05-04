import React, { useEffect, useState } from "react";
import KullaniciLayout from "../../components/KullaniciLayout";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  ClipboardList,
  Home,
  LogOut,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  Search,
  Settings,
  Store,
  Trophy,
  User,
  Star,
  Lock,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserHome } from "../../services/api";

export default function Rozetlerim({ user, setUser }) {
  const navigate = useNavigate();

  const [homeData, setHomeData] = useState(null);
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
        { label: "Rozetlerim", icon: Medal, path: "/user/rozetler", active: true },
      ],
    },
    {
      title: "HESAP",
      items: [
        { label: "Profilim", icon: User, path: "/user/profil" },
        { label: "Ayarlar", icon: Settings, path: "/user/ayarlar" },
      ],
    },
  ];

  useEffect(() => {
    loadBadges();
  }, [user?.id]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const data = await getUserHome(user.id);
      setHomeData(data);
    } catch (error) {
      console.log("Rozetler yüklenemedi:", error.message);
      setHomeData(null);
    } finally {
      setLoading(false);
    }
  };

  const earnedBadges = homeData?.badges || [];

  const lockedBadges = [
    {
      id: "locked-1",
      title: "Bilgi Avcısı",
      description: "3 eğitimi tamamlayınca açılır.",
      icon: "🎯",
    },
    {
      id: "locked-2",
      title: "Öğrenme Ustası",
      description: "5 eğitimi tamamlayınca açılır.",
      icon: "🏆",
    },
    {
      id: "locked-3",
      title: "Disiplinli Öğrenci",
      description: "7 günlük öğrenme serisi yapınca açılır.",
      icon: "🔥",
    },
    {
      id: "locked-4",
      title: "XP Toplayıcı",
      description: "1000 XP kazanınca açılır.",
      icon: "⭐",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-600">Rozetlerin yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/rozetler" searchPlaceholder="Rozetlerde ara..." >
    

      <main className="flex-1">
        <section className="p-10">
          <div className="mb-8">
            <p className="text-slate-500 font-bold mb-1">Başarı koleksiyonun</p>
            <h1 className="text-4xl font-black text-slate-950">
              Rozetlerim 🏅
            </h1>
            <p className="text-slate-500 font-semibold mt-2">
              Tamamladığın eğitimler, XP ve öğrenme serilerine göre rozetler kazanırsın.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <StatCard title="Kazanılan Rozet" value={earnedBadges.length} icon={Medal} />
            <StatCard title="Toplam XP" value={homeData?.level?.xp || 0} icon={Star} />
            <StatCard title="Coin" value={homeData?.level?.coin || 0} icon={Store} />
          </div>

          <div className="bg-slate-950 text-white rounded-[2rem] p-8 mb-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full" />
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-red-400" />
              <p className="text-slate-400 font-black text-xs tracking-[3px]">
                ROZET SİSTEMİ
              </p>
            </div>
            <h2 className="text-3xl font-black max-w-3xl">
              Eğitimleri tamamla, quizleri geç, XP kazan ve başarı rozetlerini aç.
            </h2>
          </div>

          <h2 className="text-sm font-black tracking-[3px] text-slate-400 mb-5">
            KAZANILAN ROZETLER
          </h2>

          {earnedBadges.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-5">
                <Medal size={36} />
              </div>
              <h3 className="text-2xl font-black text-slate-950">
                Henüz rozet kazanmadın
              </h3>
              <p className="text-slate-500 font-semibold mt-2">
                İlk eğitimini tamamlayınca rozetlerin burada görünecek.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-5 mb-10">
              {earnedBadges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={{
                    title: badge.title,
                    description: badge.description,
                    icon: badge.icon || "🏅",
                  }}
                  earned
                />
              ))}
            </div>
          )}

          <h2 className="text-sm font-black tracking-[3px] text-slate-400 mb-5">
            KİLİTLİ ROZETLER
          </h2>

          <div className="grid grid-cols-4 gap-5">
            {lockedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>
      </main>
    </KullaniciLayout>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-[1.7rem] p-6 border border-slate-200 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
        <Icon size={23} />
      </div>
      <p className="text-slate-400 font-black text-xs tracking-widest">
        {title.toUpperCase()}
      </p>
      <h3 className="text-3xl font-black text-slate-950 mt-2">{value}</h3>
    </div>
  );
}

function BadgeCard({ badge, earned }) {
  return (
    <div
      className={`rounded-[2rem] p-6 border shadow-sm ${
        earned
          ? "bg-white border-red-100"
          : "bg-slate-100 border-slate-200 opacity-70"
      }`}
    >
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5 ${
          earned ? "bg-red-50" : "bg-white"
        }`}
      >
        {earned ? badge.icon : <Lock size={32} className="text-slate-400" />}
      </div>

      <h3 className="text-xl font-black text-slate-950 mb-2">
        {badge.title}
      </h3>

      <p className="text-slate-500 font-semibold leading-6">
        {badge.description}
      </p>
    </div>
  );
}