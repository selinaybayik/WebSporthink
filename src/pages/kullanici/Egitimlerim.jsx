import React, { useEffect, useMemo, useState } from "react";
import KullaniciLayout from "../../components/KullaniciLayout";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  Flame,
  Home,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  PlayCircle,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Store,
  Trophy,
  User,
  UserRound,
  ClipboardList,
  Filter,
  Target,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getTrainings,
  getTrainingCatalog,
  startTraining,
  getUserHome,
  getTrainingAISuggestion,
} from "../../services/api";

export default function Egitimlerim({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Devam Edenler");
  const [activeSource, setActiveSource] = useState("Atananlar");
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const [trainings, setTrainings] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const tabs = ["Devam Edenler", "Tüm Eğitimler", "Tamamlananlar"];

  const categories = [
    "Tümü",
    "Güvenlik",
    "Satış Gelişimi",
    "Kişisel Gelişim",
    "Yönetim",
    "Zorunlu",
    "Genel",
  ];

  useEffect(() => {
    loadTrainings();
  }, [user?.id]);
  useEffect(() => {
  if (location.state?.openSource === "Keşfet") {
    setActiveSource("Keşfet");
    setActiveTab("Tüm Eğitimler");
  }
}, [location.state]);

  const loadTrainings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const myTrainings = await getTrainings(user.id);
      const catalogTrainings = await getTrainingCatalog(user.id);
      const homeData = await getUserHome(user.id);
      const aiData = await getTrainingAISuggestion(user.id);

      setAiSuggestion(aiData);
      setStreak(Number(homeData?.level?.streak) || 0);

      const mappedMyTrainings = (myTrainings || []).map((item) => ({
        id: String(item.id),
        title: item.title || "İsimsiz Eğitim",
        category: item.category || "Genel",
        assignmentType: item.assignment_type || "Yönetici Atadı",
        progress: item.is_completed
  ? 100
  : Number(item.progress || 0),
        duration: item.duration || "0 dk",
        xp: Number(item.xp) || 0,
        status:
  item.durum === "yeniden_atandi" ||
  item.durum === "yeniden_baslatildi"
    ? "reassigned"
    : item.is_completed
    ? "completed"
    : "continuing",
        mandatory: item.assignment_type === "Yönetici Atadı",
        isStarted: true,
        source: "assigned",
        instructor: item.instructor || "Sporthink Akademi",
        durum: item.durum,

isReassigned:
  item.durum === "yeniden_atandi" ||
  item.durum === "yeniden_baslatildi",

yenidenAtamaNo:
  item.yeniden_atama_no || 0,
      }));

      const mappedCatalog = (catalogTrainings || [])
        .filter((item) => !item.is_assigned && !item.is_started && !item.is_completed)
        .map((item) => ({
          id: String(item.id),
          title: item.title || "İsimsiz Eğitim",
          category: item.category || "Genel",
          assignmentType: "Başlanabilir",
          progress: 0,
          duration: item.duration || "0 dk",
          xp: Number(item.xp) || 0,
          status: "new",
          mandatory: false,
          isStarted: false,
          source: "discover",
          instructor: item.instructor || "Sporthink Akademi",
        }));

      setTrainings([...mappedMyTrainings, ...mappedCatalog]);
    } catch (error) {
      console.log("Eğitimler API Hatası:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const completedTrainings = useMemo(
    () => trainings.filter((item) => item.status === "completed"),
    [trainings]
  );

  const completedXp = useMemo(
    () => completedTrainings.reduce((sum, item) => sum + item.xp, 0),
    [completedTrainings]
  );

  const assignedCount = useMemo(
    () => trainings.filter((item) => item.source === "assigned").length,
    [trainings]
  );

  const discoverCount = useMemo(
    () => trainings.filter((item) => item.source === "discover").length,
    [trainings]
  );

  const filteredData = useMemo(() => {
    let data = [...trainings];

    if (activeSource === "Atananlar") {
      data = data.filter((item) => item.source === "assigned");
    } else {
      data = data.filter((item) => item.source === "discover");
    }

    if (activeTab === "Devam Edenler") {
  data = data.filter(
    (item) =>
      item.status === "continuing" ||
      item.status === "new" ||
      item.status === "reassigned"
  );
}

    if (activeTab === "Tamamlananlar") {
      data = data.filter((item) => item.status === "completed");
    }

    if (activeCategory !== "Tümü") {
      data = data.filter((item) => item.category === activeCategory);
    }

    const query = searchText.trim().toLowerCase();

    if (query.length > 0) {
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    return data;
  }, [activeSource, activeTab, activeCategory, searchText, trainings]);

  const handleTrainingPress = async (item) => {
    if (item.status === "new") {
      try {
        await startTraining(user.id, item.id);
        await loadTrainings();
        navigate(`/user/egitim-detay/${item.id}`);
      } catch (error) {
        console.log("Eğitime başlama hatası:", error.message);
      }
      return;
    }

    navigate(`/user/egitim-detay/${item.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black text-slate-600">Eğitimler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <KullaniciLayout
      user={user}
      setUser={setUser}
      activePath="/user/egitimler"
      searchPlaceholder="Eğitimlerde ara..."
    >
      <main className="flex-1 bg-[#F8FAFC] min-h-screen">
        <header className="h-20 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="w-[430px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3 border border-slate-200">
            <Search size={20} className="text-slate-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={
                activeSource === "Atananlar"
                  ? "Atanan eğitimlerde ara..."
                  : "Katalogda yeni eğitim ara..."
              }
              className="bg-transparent outline-none w-full text-sm font-bold text-slate-600"
            />
          </div>

          <button
            onClick={() => navigate("/user/bildirimler")}
            className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/25"
          >
            <Bell size={22} />
          </button>
        </header>

        <section className="p-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                Eğitimlerim <span>📚</span>
              </h1>
              <p className="text-slate-500 font-semibold mt-2">
                Bu hafta{" "}
                <span className="text-red-600 font-black">{completedXp} XP</span>{" "}
                topladın. Eğitimlerini ve keşfedebileceğin içerikleri buradan yönet.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-5 py-3 rounded-2xl font-black border border-orange-100">
              <Flame size={18} fill="#F97316" />
              {streak} Günlük Seri
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <StatCard title="Atanan Eğitim" value={assignedCount} icon={Target} color="red" />
            <StatCard title="Keşfet İçeriği" value={discoverCount} icon={Compass} color="blue" />
            <StatCard title="Tamamlanan" value={completedTrainings.length} icon={CheckCircle2} color="emerald" />
            <StatCard title="Kazanılan XP" value={completedXp} icon={Trophy} color="amber" />
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.2rem] shadow-sm overflow-hidden">
            <div className="p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="bg-slate-100 p-2 rounded-3xl flex gap-2">
                <SourceButton
                  active={activeSource === "Atananlar"}
                  icon={Target}
                  label="Atananlar"
                  count={assignedCount}
                  onClick={() => setActiveSource("Atananlar")}
                />

                <SourceButton
                  active={activeSource === "Keşfet"}
                  icon={Compass}
                  label="Keşfet"
                  count={discoverCount}
                  onClick={() => setActiveSource("Keşfet")}
                />
              </div>

              <div className="relative">
                <Filter
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="h-12 pl-11 pr-5 rounded-2xl border border-slate-200 bg-slate-50 font-black text-slate-500 outline-none"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-7 border-y border-slate-100 flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-12 px-8 rounded-full text-sm font-black transition ${
                    activeTab === tab
                      ? "bg-red-600 text-white shadow-xl shadow-red-600/25"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeSource === "Keşfet" && (
              <div className="mx-6 mt-6 bg-emerald-50 border border-emerald-100 rounded-3xl p-5">
                <p className="text-emerald-600 font-black text-xs tracking-widest mb-2">
                  🤖 AI ÖNERİSİ
                </p>
                <p className="text-emerald-900 font-bold leading-relaxed">
                  {aiSuggestion?.suggestionText ||
                    "Tamamladığın eğitimlere göre sana uygun yeni içerikleri burada keşfedebilirsin."}
                </p>
              </div>
            )}

            <div className="px-6 pt-7 pb-4 flex items-center justify-between">
              <h2 className="text-sm font-black tracking-[3px] text-slate-400">
                {activeSource === "Atananlar"
                  ? "ATANAN EĞİTİMLERİN"
                  : "SANA UYGUN İÇERİKLER"}
              </h2>

              <span className="text-xs font-black text-slate-400">
                {filteredData.length} İÇERİK
              </span>
            </div>

            {filteredData.length === 0 ? (
              <div className="m-6 bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center">
                <p className="text-xl font-black text-slate-900">
                  Eğitim bulunamadı
                </p>
                <p className="text-slate-500 font-semibold mt-2">
                  Filtreleri değiştirerek tekrar deneyebilirsin.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs font-black tracking-widest uppercase border-b border-slate-100">
                      <th className="px-6 py-4">Eğitim Detayı</th>
                      <th className="px-6 py-4">Süre</th>
                      <th className="px-6 py-4">Ödül</th>
                      <th className="px-6 py-4">Eğitmen</th>
                      <th className="px-6 py-4">Tür</th>
                      <th className="px-6 py-4 text-right">İşlem</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((item) => (
                      <TrainingRow
                        key={item.id}
                        item={item}
                        onClick={() => handleTrainingPress(item)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </KullaniciLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const styles = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-500",
  };

  return (
    <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition">
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${styles[color]}`}>
        <Icon size={30} />
      </div>

      <div>
        <p className="text-slate-400 font-black text-sm tracking-widest uppercase">
          {title}
        </p>
        <h3 className="text-4xl font-black text-slate-950 mt-1">{value}</h3>
      </div>
    </div>
  );
}

function SourceButton({ active, icon: Icon, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-14 px-6 rounded-2xl flex items-center gap-3 font-black transition ${
        active
          ? "bg-white text-red-600 shadow-md"
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      <Icon size={18} />
      <span className="tracking-widest text-sm">{label}</span>
      <span
        className={`px-3 py-1 rounded-lg text-xs ${
          active ? "bg-red-50 text-red-600" : "bg-slate-200 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function TrainingRow({ item, onClick }) {
  const isCompleted = item.status === "completed";
  const isNew = item.status === "new";
  const isReassigned =
  item.status === "reassigned";

  return (
    <tr className="group border-b border-slate-100 hover:bg-slate-50/70 transition">
      <td className="px-6 py-7">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 text-red-500 flex items-center justify-center shadow-lg shadow-slate-900/10">
            {isCompleted ? <CheckCircle2 size={30} /> : <PlayCircle size={31} />}
          </div>

          <div>
            <p className="text-slate-400 font-black text-xs tracking-[3px] uppercase mb-1">
              {item.category}
            </p>
            <h3 className="text-xl font-black text-slate-950 leading-tight max-w-[260px]">
              {item.title}
            </h3>
          </div>
        </div>
      </td>

      <td className="px-6 py-7">
        <div className="flex items-center gap-2 text-slate-500 font-black">
          <Clock3 size={16} className="text-slate-300" />
          <span>{item.duration}</span>
        </div>
      </td>

      <td className="px-6 py-7">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-orange-600 px-4 py-3 rounded-2xl font-black">
          <Trophy size={16} />
          <span>{item.xp} XP</span>
        </div>
      </td>

      <td className="px-6 py-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
            <UserRound size={18} className="text-slate-400" />
          </div>
          <div>
            <p className="font-black text-slate-800 leading-tight">
              {item.instructor}
            </p>
            <p className="text-[10px] font-black tracking-widest text-slate-400">
              EĞİTMEN
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-7">
        <span
          className={`inline-flex px-4 py-2 rounded-xl text-xs font-black ${
            item.mandatory
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          {item.mandatory ? "ZORUNLU" : "OPSİYONEL"}
        </span>
      </td>

      <td className="px-6 py-7 text-right">
        <button
          onClick={onClick}
          className={`h-12 px-7 rounded-2xl inline-flex items-center gap-2 font-black text-sm transition group-hover:scale-[1.02] ${
            isCompleted
  ? "bg-slate-100 text-slate-500"
  : isReassigned
  ? "bg-red-600 text-white shadow-xl shadow-red-600/25"
              : isNew
              ? "bg-slate-950 text-white"
              : "bg-red-600 text-white shadow-xl shadow-red-600/25"
          }`}
        >
          {isCompleted
  ? "YENİDEN İZLE"
  : isReassigned
  ? "TEKRAR BAŞLA"
  : isNew
  ? "LİSTEME EKLE"
  : "BAŞLA"}
          <ChevronRight size={18} />
        </button>
      </td>
    </tr>
  );
}