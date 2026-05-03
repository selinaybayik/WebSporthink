import KullaniciLayout from "../../components/KullaniciLayout";
import React, { useEffect, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  Calendar,
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
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserSurveys } from "../../services/api";

export default function Anketlerim({ user, setUser }) {
  const navigate = useNavigate();

  const [surveys, setSurveys] = useState([]);
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
        { label: "Anketlerim", icon: ClipboardList, path: "/user/anketler", active: true },
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
        { label: "Profilim", icon: User, path: "/user/profil" },
        { label: "Ayarlar", icon: Settings, path: "/user/ayarlar" },
      ],
    },
  ];

  useEffect(() => {
    loadSurveys();
  }, [user?.id]);

  const loadSurveys = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getUserSurveys(user.id);
      setSurveys(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Anketler yüklenemedi:", error.message);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const pendingCount = surveys.filter((x) => x.durum !== "tamamlandi").length;
  const completedCount = surveys.filter((x) => x.durum === "tamamlandi").length;

  return (
    <KullaniciLayout
  user={user}
  setUser={setUser}
  activePath="/user/anketler"
  searchPlaceholder="Anketlerde ara..."
>

      <main className="flex-1">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="w-[430px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder="Anketlerde ara..."
              className="bg-transparent outline-none w-full text-sm font-semibold text-slate-600"
            />
          </div>

          <button
            onClick={() => navigate("/user/bildirimler")}
            className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20"
          >
            <Bell size={22} />
          </button>
        </header>

        <section className="p-10">
          <div className="mb-8">
            <p className="text-slate-500 font-bold mb-1">
              Geri bildirim merkezi
            </p>
            <h1 className="text-4xl font-black text-slate-950">
              Anketlerim 📝
            </h1>
            <p className="text-slate-500 font-semibold mt-2">
              Sana atanan değerlendirme ve memnuniyet anketlerini buradan yanıtlayabilirsin.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <StatCard title="Toplam Anket" value={surveys.length} icon={ClipboardList} />
            <StatCard title="Bekleyen" value={pendingCount} icon={Clock} />
            <StatCard title="Tamamlanan" value={completedCount} icon={CheckCircle2} />
          </div>

          {loading ? (
            <div className="min-h-[350px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-slate-600">Anketler yükleniyor...</p>
              </div>
            </div>
          ) : surveys.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-5">
                <ClipboardList size={36} />
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                Henüz atanmış anket yok
              </h3>

              <p className="text-slate-500 font-semibold mt-2">
                Yönetici sana anket atadığında burada görünecek.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {surveys.map((item) => {
                const completed = item.durum === "tamamlandi";

                return (
                  <button
                    key={String(item.atama_id || item.anket_id)}
                    onClick={() =>
                      completed
                        ? null
                        : navigate(`/user/anket-detay/${item.anket_id}`, {
                            state: { survey: item },
                          })
                    }
                    className="bg-white border border-slate-200 rounded-[2rem] p-7 text-left shadow-sm hover:-translate-y-1 transition"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                        <ClipboardList size={27} />
                      </div>

                      <span
                        className={`px-4 py-2 rounded-full text-xs font-black ${
                          completed
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {completed ? "TAMAMLANDI" : "BEKLİYOR"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-950 mb-4">
                      {item.baslik || "Değerlendirme Anketi"}
                    </h2>

                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-6">
                      <Calendar size={16} />
                      Atanma Tarihi: {formatDate(item.atanma_tarihi)}
                    </div>

                    <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                      <p className="text-slate-400 font-black text-xs tracking-[3px]">
                        DEĞERLENDİRME ANKETİ
                      </p>

                      {!completed && (
                        <div className="flex items-center gap-2 text-red-600 font-black">
                          Başla
                          <ChevronRight size={18} />
                        </div>
                      )}

                      {completed && (
                        <div className="flex items-center gap-2 text-emerald-600 font-black">
                          Gönderildi
                          <CheckCircle2 size={18} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </KullaniciLayout>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
        <Icon size={23} />
      </div>

      <p className="text-slate-400 font-black text-xs tracking-widest">
        {title.toUpperCase()}
      </p>

      <h3 className="text-3xl font-black text-slate-950 mt-2">
        {value}
      </h3>
    </div>
  );
}