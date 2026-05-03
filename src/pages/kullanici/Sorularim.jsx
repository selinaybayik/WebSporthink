import React, { useEffect, useState } from "react";
import KullaniciLayout from "../../components/KullaniciLayout";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  Home,
  LogOut,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Store,
  Trophy,
  User,
  CheckCircle2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestions } from "../../services/api";

export default function Sorularim({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const trainingId = location.state?.trainingId || null;
  const trainingTitle = location.state?.trainingTitle || "";
  const instructorName = location.state?.instructorName || "";
  const instructorRole = location.state?.instructorRole || "";

  const [questions, setQuestions] = useState([]);
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
        { label: "Sorularım", icon: MessageCircle, path: "/user/sorular", active: true },
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
    loadQuestions();
  }, [trainingId, user?.id]);

  const loadQuestions = async () => {
    if (!trainingId || !user?.id) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getQuestions(trainingId, user.id);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Sorular yüklenemedi:", error.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const goToDetail = (item) => {
    navigate("/user/soru-detay", {
      state: {
        id: item.id,
        title: item.title,
        message: item.message,
        date: item.date,
        status: item.status,
        instructorName:
          item.answer?.instructorName || instructorName || "Sporthink Akademi",
        instructorRole:
          item.answer?.instructorRole || instructorRole || "Eğitim Uzmanı",
        answerText: item.answer?.text || "",
        answerTimeAgo: item.answer?.timeAgo || "",
      },
    });
  };

  const goToNewQuestion = () => {
    navigate("/user/soru-ekle", {
      state: {
        trainingId,
        trainingTitle,
        instructorName,
        instructorRole,
      },
    });
  };

  return (
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/sorular" searchPlaceholder="Sorularda ara..." >
      

      <main className="flex-1">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="w-[430px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder="Sorularında ara..."
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
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-slate-500 font-bold mb-1">
                Eğitmen ile iletişim
              </p>
              <h1 className="text-4xl font-black text-slate-950">
                Sorularım 💬
              </h1>
              {trainingTitle && (
                <p className="text-slate-500 font-semibold mt-2">
                  {trainingTitle}
                </p>
              )}
            </div>

            <button
              onClick={goToNewQuestion}
              disabled={!trainingId}
              className="bg-red-600 disabled:bg-slate-300 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-red-600/20"
            >
              <Plus size={20} />
              Yeni Soru
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-5 flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600">
              <HelpCircle size={24} />
            </div>
            <p className="text-blue-800 font-bold">
              Eğitmen sorularını en kısa sürede yanıtlayacaktır.
            </p>
          </div>

          {!trainingId && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                Eğitim seçilmedi
              </h3>
              <p className="text-slate-500 font-semibold mb-6">
                Soru görüntülemek için bir eğitim detayından “Eğitmene Soru Sor”
                alanına gelmelisin.
              </p>
              <button
                onClick={() => navigate("/user/egitimler")}
                className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black"
              >
                Eğitimlerime Git
              </button>
            </div>
          )}

          {trainingId && loading && (
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-slate-600">Sorular yükleniyor...</p>
              </div>
            </div>
          )}

          {trainingId && !loading && questions.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                Henüz soru yok
              </h3>
              <p className="text-slate-500 font-semibold mb-6">
                Eğitmene soru sormak için “Yeni Soru” butonunu kullanabilirsin.
              </p>
              <button
                onClick={goToNewQuestion}
                className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black"
              >
                İlk Soruyu Sor
              </button>
            </div>
          )}

          {trainingId && !loading && questions.length > 0 && (
  <div className="space-y-4">
    {questions.map((item) => {
      const isAnswered = item.status === "answered";

      return (
        <button
          key={String(item.id)}
          onClick={() => goToDetail(item)}
          className="w-full bg-white border border-slate-200 hover:border-red-200 rounded-full px-6 py-4 shadow-sm hover:shadow-md transition flex items-center gap-5 text-left"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
              isAnswered
                ? "bg-emerald-50 text-emerald-600"
                : "bg-orange-50 text-orange-500"
            }`}
          >
            {isAnswered ? (
              <CheckCircle2 size={21} />
            ) : (
              <HelpCircle size={21} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black ${
                  isAnswered
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                {isAnswered ? "YANITLANDI" : "BEKLİYOR"}
              </span>

              <span className="text-slate-400 text-xs font-black">
                {item.date}
              </span>
            </div>

            <h3
              className={`text-lg font-black truncate ${
                isAnswered ? "text-red-600" : "text-slate-950"
              }`}
            >
              {item.title}
            </h3>

            <p className="text-slate-500 font-semibold text-sm truncate mt-1">
              {item.message}
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-black text-sm shrink-0">
            Detay Gör
            <ChevronRight size={18} />
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