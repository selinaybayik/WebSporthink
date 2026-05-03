import React, { useEffect, useState } from "react";
import KullaniciLayout from "../../components/KullaniciLayout";
import {
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  Clock3,
  Coins,
  Map,
  Megaphone,
  MessageCircle,
  PlayCircle,
  Sparkles,
  Trophy,
  Medal,
  Target,
  Brain,
  WandSparkles,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserHome } from "../../services/api";

export default function KullaniciAnaSayfa({ user, setUser }) {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      try {
        if (!user?.id) return;
        const data = await getUserHome(user.id);
        setHomeData(data);
      } catch (error) {
        console.log("Kullanıcı ana sayfa hatası:", error);

        setHomeData({
          user: {
            name: user?.name || "Kullanıcı",
            department: user?.department || "Departman",
            role: user?.role || "Çalışan",
          },
          level: {
            level: 1,
            title: "Yeni Öğrenen",
            xp: 0,
            coin: 0,
            progress: 0,
            nextLevelRemainingXp: 100,
          },
          continueTraining: null,
          notifications: { unread: 0 },
          stats: {
            completionRate: 0,
            activeTrainings: 0,
            weeklyTime: "0dk",
            badges: 0,
          },
          badges: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-700">Ana sayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  const level = homeData?.level || {};
  const stats = homeData?.stats || {};
  const continueTraining = homeData?.continueTraining;
  const unread = homeData?.notifications?.unread || 0;

  return (
    <KullaniciLayout
      user={user}
      setUser={setUser}
      activePath="/user/dashboard"
      searchPlaceholder="Sistem içinde ara..."
    >
      <section className="p-8 xl:p-10 space-y-7 bg-[#F8FAFC] min-h-screen">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-slate-500 font-bold mb-1">Tekrar hoş geldin,</p>
            <h1 className="text-4xl font-black text-slate-950">
              {homeData?.user?.name} 👋
            </h1>
            <p className="text-slate-500 font-semibold mt-2">
              {homeData?.user?.department} • {homeData?.user?.role}
            </p>
          </div>

          <button
            onClick={() => navigate("/user/bildirimler")}
            className="relative w-14 h-14 bg-white border border-slate-200 text-slate-900 rounded-2xl flex items-center justify-center shadow-sm hover:border-red-300 transition"
          >
            <Bell size={23} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full text-xs font-black flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard icon={Medal} title="Toplam XP" value={level.xp || 0} note="↗ 12% bu hafta" color="red" />
          <StatCard icon={Coins} title="Coin" value={level.coin || 0} note="↗ 8% bu hafta" color="amber" />
          <StatCard icon={Trophy} title="Tamamlanma" value={`%${stats.completionRate || 0}`} note="↗ 5% bu hafta" color="emerald" />
          <StatCard icon={BookOpen} title="Aktif Eğitim" value={stats.activeTrainings || 0} note="Değişiklik yok" color="blue" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 relative overflow-hidden rounded-[2rem] bg-[#07111F] text-white p-8 shadow-xl">
            <div className="absolute right-8 top-8 opacity-10">
              <Sparkles size={140} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-7 items-stretch relative">
              <div className="xl:col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="inline-flex px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black tracking-[2px]">
                    SEVİYE DURUMU
                  </span>

                  <div className="w-12 h-12 rounded-full bg-white text-red-600 flex items-center justify-center text-xl font-black shadow-xl">
                    {level.level || 1}
                  </div>
                </div>

                <h2 className="text-3xl xl:text-4xl font-black mb-6">
                  Seviye {level.level || 1} • {level.title || "Gelişmiş"}
                </h2>

                <div className="w-full h-4 bg-white/15 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400 rounded-full"
                    style={{ width: `${level.progress || 0}%` }}
                  />
                </div>

                <p className="text-slate-300 font-semibold">
                  Bir sonraki seviye için{" "}
                  <span className="text-white font-black">
                    {level.nextLevelRemainingXp || 0} XP
                  </span>{" "}
                  daha kazanmalısın.
                </p>
              </div>

              <div className="bg-white/8 border border-white/10 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center backdrop-blur">
                <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-300 flex items-center justify-center mb-5">
                  <Clock3 size={34} />
                </div>

                <p className="text-slate-400 font-black text-xs tracking-[2px] mb-4">
                  BU HAFTAKİ PERFORMANS
                </p>

                <h3 className="text-4xl font-black mb-2">
                  {stats.weeklyTime || "0dk"}
                </h3>

                <p className="text-slate-400 font-semibold mb-6">
                  Öğrenme süren
                </p>

                <button
                  onClick={() => navigate("/user/egitimler")}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <PlayCircle size={20} />
                  EĞİTİME GİT
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-slate-950">Bekleyen Görevler</h2>
              <button className="text-red-600 font-black text-sm flex items-center gap-1">
                Tümünü Gör <ChevronRight size={17} />
              </button>
            </div>

            <div className="space-y-3">
              <Task icon={Megaphone} text="Duyurularını kontrol et" path="/user/duyurular" />
              <Task icon={MessageCircle} text="Sorularını takip et" path="/user/sorular" />
              <Task icon={Trophy} text="Liderlik sıralamana bak" path="/user/liderlik" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-950">
                Kaldığın Yerden Devam Et
              </h2>

              <button
                onClick={() => navigate("/user/egitimler")}
                className="text-red-600 font-black text-sm flex items-center gap-1"
              >
                Tümünü Gör <ChevronRight size={18} />
              </button>
            </div>

            {continueTraining ? (
              <button
                onClick={() => navigate(`/user/egitim-detay/${continueTraining.id}`)}
                className="w-full flex items-center gap-5 p-5 bg-slate-50 rounded-3xl border border-slate-200 hover:border-red-300 transition text-left"
              >
                <div className="w-24 h-24 rounded-3xl bg-slate-950 text-white flex items-center justify-center shrink-0">
                  <BookOpen size={36} />
                </div>

                <div className="flex-1">
                  <p className="font-black text-xl text-slate-950">
                    {continueTraining.title}
                  </p>
                  <p className="text-slate-500 font-semibold mt-1">
                    {continueTraining.completed}/{continueTraining.total} modül tamamlandı
                  </p>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${continueTraining.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="text-red-600 font-black">
                  %{continueTraining.progress || 0}
                </div>
              </button>
            ) : (
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <p className="font-black text-slate-950">Aktif eğitim bulunamadı.</p>
                <p className="text-slate-500 font-semibold mt-1">
                  Yeni eğitim atandığında burada görünecek.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/user/asistan")}
            className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#151B2E] to-[#28111A] rounded-[2rem] p-7 border border-slate-900 shadow-xl text-left group"
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-red-600/30 rounded-full blur-3xl" />
            <div className="absolute -left-10 bottom-0 w-32 h-32 bg-violet-600/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/10 text-red-300 flex items-center justify-center">
                  <Bot size={34} />
                </div>

                <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center group-hover:translate-x-1 transition">
                  <Send size={20} />
                </div>
              </div>

              <p className="text-red-300 font-black text-xs tracking-[2px] mb-3">
                AI ASİSTAN
              </p>

              <h2 className="text-2xl font-black text-white mb-3">
                Takıldığın yerde AI Koçuna sor
              </h2>

              <p className="text-slate-300 font-semibold leading-relaxed mb-6">
                Eğitim önerisi al, konuları özetlet, sorularını hızlıca çöz.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <MiniAiItem icon={Brain} text="Özet" />
                <MiniAiItem icon={Target} text="Yol" />
                <MiniAiItem icon={WandSparkles} text="Destek" />
              </div>
            </div>
          </button>
        </div>

        
      </section>
    </KullaniciLayout>
  );
}

function StatCard({ icon: Icon, title, value, note, color }) {
  const styles = {
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-5">
        <div className={`w-16 h-16 rounded-full ${styles[color]} flex items-center justify-center shrink-0`}>
          <Icon size={31} />
        </div>

        <div>
          <p className="text-slate-400 font-black text-xs tracking-widest">
            {title.toUpperCase()}
          </p>
          <h3 className="text-3xl font-black text-slate-950 mt-2">{value}</h3>
          <p className="text-emerald-500 text-sm font-bold mt-2">{note}</p>
        </div>
      </div>
    </div>
  );
}

function Task({ text, path, icon: Icon }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white text-red-600 flex items-center justify-center">
          <Icon size={19} />
        </div>
        <span className="font-bold text-slate-700">{text}</span>
      </div>

      <ChevronRight size={18} className="text-slate-400" />
    </button>
  );
}


function MiniAiItem({ icon: Icon, text }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3 text-center">
      <Icon size={20} className="text-red-300 mx-auto mb-2" />
      <p className="text-white text-xs font-black">{text}</p>
    </div>
  );
}