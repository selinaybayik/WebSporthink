import KullaniciLayout from "../../components/KullaniciLayout";
import React, { useEffect, useMemo, useState } from "react";
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
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserSurveys,getUser360Tasks } from "../../services/api";

export default function Anketlerim({ user, setUser,searchText }) {
  const navigate = useNavigate();

  const [surveys, setSurveys] = useState([]);
  const [tasks360, setTasks360] = useState([]);
const [activeTab, setActiveTab] = useState("anketler");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [surveyFilter, setSurveyFilter] = useState("Tümü");

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
      const [surveyData, taskData] = await Promise.all([
  getUserSurveys(user.id),
  getUser360Tasks(user.id),
]);

setSurveys(Array.isArray(surveyData) ? surveyData : []);
setTasks360(Array.isArray(taskData) ? taskData : []);
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
  const filteredSurveys = useMemo(() => {
  let data = [...surveys];

  if (surveyFilter === "Bekleyen") {
    data = data.filter((item) => item.durum !== "tamamlandi");
  }

  if (surveyFilter === "Tamamlanan") {
    data = data.filter((item) => item.durum === "tamamlandi");
  }

  const q = search.trim().toLowerCase();

  if (q) {
    data = data.filter(
      (item) =>
        String(item.baslik || "").toLowerCase().includes(q) ||
        String(item.durum || "").toLowerCase().includes(q)
    );
  }

  return data;
}, [surveys, surveyFilter, search]);

const filteredTasks360 = useMemo(() => {
  let data = [...tasks360];

  if (surveyFilter === "Bekleyen") {
    data = data.filter((item) => item.durum !== "tamamlandi");
  }

  if (surveyFilter === "Tamamlanan") {
    data = data.filter((item) => item.durum === "tamamlandi");
  }

  const q = search.trim().toLowerCase();

  if (q) {
    data = data.filter(
      (item) =>
        String(item.anket_basligi || "").toLowerCase().includes(q) ||
        String(item.hedef_adi || "").toLowerCase().includes(q) ||
        String(item.hedef_departman || "").toLowerCase().includes(q) ||
        String(item.durum || "").toLowerCase().includes(q)
    );
  }

  return data;
}, [tasks360, surveyFilter, search]);

  const pendingCount = surveys.filter((x) => x.durum !== "tamamlandi").length;
  const completedCount = surveys.filter((x) => x.durum === "tamamlandi").length;
  const pending360Count = tasks360.filter((x) => x.durum !== "tamamlandi").length;
const completed360Count = tasks360.filter((x) => x.durum === "tamamlandi").length;

  return (
    <KullaniciLayout
  user={user}
  setUser={setUser}
  activePath="/user/anketler"
  searchPlaceholder="Anketlerde ara..."
  searchValue={search}
  onSearchChange={setSearch}
>

      <main className="flex-1">

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
            <div className="flex gap-3 mt-6">
              <div className="mt-5 bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
  <div className="flex items-center gap-3">
    <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
      <Filter size={20} />
    </div>

    <div>
      <p className="text-sm font-black text-slate-900">Filtrele</p>
      <p className="text-xs font-bold text-slate-400">
        Bekleyen veya tamamlananları göster
      </p>
    </div>
  </div>

  <div className="flex flex-wrap gap-2">
    {["Tümü", "Bekleyen", "Tamamlanan"].map((filter) => (
      <button
        key={filter}
        type="button"
        onClick={() => setSurveyFilter(filter)}
        className={`h-11 px-5 rounded-2xl text-sm font-black transition ${
          surveyFilter === filter
            ? activeTab === "360"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-red-600 text-white shadow-lg"
            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
        }`}
      >
        {filter}
      </button>
    ))}
  </div>
</div>
  <button
    type="button"
    onClick={() => setActiveTab("anketler")}
    className={`px-5 py-3 rounded-2xl text-sm font-black ${
      activeTab === "anketler"
        ? "bg-red-600 text-white shadow-lg"
        : "bg-white text-slate-500 border border-slate-200"
    }`}
  >
    Anketlerim ({surveys.length})
  </button>

  <button
    type="button"
    onClick={() => setActiveTab("360")}
    className={`px-5 py-3 rounded-2xl text-sm font-black ${
      activeTab === "360"
        ? "bg-purple-600 text-white shadow-lg"
        : "bg-white text-slate-500 border border-slate-200"
    }`}
  >
    360 Görevlerim ({tasks360.length})
  </button>
</div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
  <StatCard
    title={activeTab === "360" ? "Toplam 360 Görevi" : "Toplam Anket"}
    value={activeTab === "360" ? tasks360.length : surveys.length}
    icon={ClipboardList}
  />

  <StatCard
    title="Bekleyen"
    value={activeTab === "360" ? pending360Count : pendingCount}
    icon={Clock}
  />

  <StatCard
    title="Tamamlanan"
    value={activeTab === "360" ? completed360Count : completedCount}
    icon={CheckCircle2}
  />
</div>

          {loading ? (
  <div className="min-h-[350px] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="font-bold text-slate-600">Anketler yükleniyor...</p>
    </div>
  </div>
) : activeTab === "360" ? (
  filteredTasks360.length === 0 ? (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-5">
        <Medal size={36} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">
        Henüz 360 değerlendirme görevin yok
      </h3>

      <p className="text-slate-500 font-semibold mt-2">
        Yönetici sana değerlendirme görevi atadığında burada görünecek.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-6">
      {filteredTasks360.map((item) => {
        const completed = item.durum === "tamamlandi";

        return (
          <button
            key={String(item.atama_id)}
            onClick={() =>
              completed
                ? null
                : navigate(`/user/anket-detay/${item.anket_id}`, {
                    state: {
                      survey: {
                        ...item,
                        baslik: item.anket_basligi,
                        is360: true,
                        atamaId: item.atama_id,
                        hedefAdi: item.hedef_adi,
                        hedefDepartman: item.hedef_departman,
                      },
                    },
                  })
            }
            className="bg-white border border-purple-100 rounded-[2rem] p-7 text-left shadow-sm hover:-translate-y-1 transition"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Medal size={27} />
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

            <p className="text-purple-600 text-xs font-black tracking-[2px] mb-2">
              360 DEĞERLENDİRME
            </p>

            <h2 className="text-2xl font-black text-slate-950 mb-3">
              {item.anket_basligi}
            </h2>

            <p className="text-slate-500 font-bold mb-5">
              Değerlendirilecek kişi:{" "}
              <span className="text-slate-950">{item.hedef_adi}</span>
            </p>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-sm">
                {item.hedef_departman || "-"}
              </span>

              {!completed && (
                <span className="inline-flex items-center gap-2 text-purple-600 font-black">
                  Başla
                  <ChevronRight size={18} />
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  )
) : filteredSurveys.length === 0? (
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
    {filteredSurveys.map((item) => {
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
            <span className="text-slate-400 font-bold text-sm">
              {completed ? "Tamamlandı" : "Yanıt bekliyor"}
            </span>

            {!completed && (
              <span className="inline-flex items-center gap-2 text-red-600 font-black">
                Başla
                <ChevronRight size={18} />
              </span>
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