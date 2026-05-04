import React, { useEffect, useMemo, useState } from "react";
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
import { getQuestions, getTrainings } from "../../services/api";

export default function Sorularim({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const initialTrainingId = location.state?.trainingId || "";
  const initialTrainingTitle = location.state?.trainingTitle || "";
  const instructorName = location.state?.instructorName || "Sporthink Akademi";
  const instructorRole = location.state?.instructorRole || "Eğitim Uzmanı";

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [trainings, setTrainings] = useState([]);
  const [selectedTrainingId, setSelectedTrainingId] = useState(initialTrainingId);

  const [loading, setLoading] = useState(false);
  const [trainingsLoading, setTrainingsLoading] = useState(true);

  const selectedTraining = useMemo(() => {
    return trainings.find(
      (item) =>
        String(item.id || item.egitim_id) === String(selectedTrainingId)
    );
  }, [trainings, selectedTrainingId]);

  const selectedTrainingTitle =
    selectedTraining?.title ||
    selectedTraining?.baslik ||
    initialTrainingTitle ||
    "";

  useEffect(() => {
    loadTrainings();
  }, [user?.id]);

  useEffect(() => {
    if (selectedTrainingId) {
      loadQuestions(selectedTrainingId);
    } else {
      setQuestions([]);
    }
  }, [selectedTrainingId, user?.id]);

  const loadTrainings = async () => {
    if (!user?.id) {
      setTrainings([]);
      setTrainingsLoading(false);
      return;
    }

    try {
      setTrainingsLoading(true);
      const data = await getTrainings(user.id);
      const list = Array.isArray(data) ? data : [];

      setTrainings(list);

      if (!selectedTrainingId && list.length > 0) {
        setSelectedTrainingId(String(list[0].id || list[0].egitim_id));
      }
    } catch (err) {
      console.log("Eğitimler yüklenemedi:", err.message);
      setTrainings([]);
    } finally {
      setTrainingsLoading(false);
    }
  };

  const loadQuestions = async (egitimId) => {
    if (!egitimId || !user?.id) {
      setQuestions([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getQuestions(egitimId, user.id);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Sorular yüklenemedi:", error.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value === "answered" ||
      value === "cevaplandi" ||
      value === "cevaplandı" ||
      value === "yanitlandi" ||
      value === "yanıtlandı"
    ) {
      return "answered";
    }

    return "pending";
  };

  const goToNewQuestion = () => {
    if (!selectedTrainingId) {
      alert("Lütfen önce eğitim seç.");
      return;
    }

    navigate("/user/soru-ekle", {
      state: {
        trainingId: selectedTrainingId,
        trainingTitle: selectedTrainingTitle,
        instructorName,
        instructorRole,
      },
    });
  };

  const goToDetail = (item) => {
    const status = normalizeStatus(item.status);

    navigate("/user/soru-detay", {
      state: {
        id: item.id,
        title: item.title || item.baslik || "Soru başlığı",
        message: item.message || item.soru_metni || "Soru içeriği bulunamadı.",
        date: item.date || item.created_at || "Bugün",
        status,
        instructorName:
          item.answer?.instructorName ||
          item.cevaplayan_adi ||
          instructorName,
        instructorRole:
          item.answer?.instructorRole ||
          item.cevaplayan_rol ||
          instructorRole,
        answerText:
          item.answer?.text ||
          item.cevap_metni ||
          "",
        answerTimeAgo:
          item.answer?.timeAgo ||
          item.cevap_tarihi ||
          "",
      },
    });
  };
  const filteredQuestions = questions.filter((item) => {
  const keyword = search.trim().toLowerCase();

  if (!keyword) return true;

  return (
    String(item.title || item.baslik || "")
      .toLowerCase()
      .includes(keyword) ||

    String(item.message || item.soru_metni || "")
      .toLowerCase()
      .includes(keyword) ||

    String(item.status || "")
      .toLowerCase()
      .includes(keyword)
  );
});

  return (
    <KullaniciLayout
      user={user}
  setUser={setUser}
  activePath="/user/sorular"
  searchPlaceholder="Sorularda ara..."
  searchValue={search}
  onSearchChange={setSearch}
    >
      <main className="flex-1">
        

        <section className="p-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-slate-500 font-bold mb-1">
                Eğitmen ile iletişim
              </p>

              <h1 className="text-4xl font-black text-slate-950">
                Sorularım 💬
              </h1>

              <p className="text-slate-500 font-semibold mt-2">
                Eğitim seç, sorularını ve eğitmen cevaplarını görüntüle.
              </p>
            </div>

            <button
              onClick={goToNewQuestion}
              disabled={!selectedTrainingId}
              className="bg-red-600 disabled:bg-slate-300 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-red-600/20"
            >
              <Plus size={20} />
              Eğitmene Soru Sor
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <p className="text-red-600 text-xs font-black tracking-[3px] mb-2">
                  EĞİTİM SEÇ
                </p>
                <h2 className="text-2xl font-black text-slate-950">
                  Hangi eğitim hakkında soru sormak istiyorsun?
                </h2>
              </div>

              <select
                value={selectedTrainingId}
                onChange={(e) => setSelectedTrainingId(e.target.value)}
                className="w-full lg:w-[420px] px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none focus:border-red-400"
              >
                <option value="">Eğitim seç</option>

                {trainings.map((training) => {
                  const id = training.id || training.egitim_id;

                  return (
                    <option key={id} value={id}>
                      {training.title || training.baslik}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-5 flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600">
              <HelpCircle size={24} />
            </div>

            <p className="text-blue-800 font-bold">
              Yanıtlanan soruların cevabı kartın içinde kısa şekilde görünür.
              Detay için sorunun üzerine tıkla.
            </p>
          </div>

          {trainingsLoading && (
            <div className="min-h-[260px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-slate-600">
                  Eğitimler yükleniyor...
                </p>
              </div>
            </div>
          )}

          {!trainingsLoading && trainings.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                Henüz eğitimin yok
              </h3>

              <p className="text-slate-500 font-semibold mb-6">
                Soru sorabilmek için önce bir eğitimin olmalı.
              </p>

              <button
                onClick={() => navigate("/user/egitimler")}
                className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black"
              >
                Eğitimlerime Git
              </button>
            </div>
          )}

          {!trainingsLoading && trainings.length > 0 && !selectedTrainingId && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                Eğitim seçilmedi
              </h3>

              <p className="text-slate-500 font-semibold">
                Sorularını görmek ve yeni soru sormak için üstten eğitim seç.
              </p>
            </div>
          )}

          {selectedTrainingId && loading && (
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-slate-600">
                  Sorular yükleniyor...
                </p>
              </div>
            </div>
          )}

          {selectedTrainingId && !loading && questions.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                Bu eğitim için soru yok
              </h3>

              <p className="text-slate-500 font-semibold mb-6">
                Eğitmene soru sormak için butonu kullanabilirsin.
              </p>

              <button
                onClick={goToNewQuestion}
                className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black"
              >
                İlk Soruyu Sor
              </button>
            </div>
          )}

          {selectedTrainingId && !loading && questions.length > 0 && (
            <div className="space-y-5">
              {filteredQuestions.map((item) => {
                const isAnswered = normalizeStatus(item.status) === "answered";

                const title = item.title || item.baslik || "Soru başlığı";
                const message =
                  item.message || item.soru_metni || "Soru içeriği bulunamadı.";

                const answerText =
                  item.answer?.text || item.cevap_metni || "";

                return (
                  <button
                    key={String(item.id)}
                    onClick={() => goToDetail(item)}
                    className="w-full bg-white border border-slate-200 hover:border-red-200 rounded-[2rem] px-6 py-5 shadow-sm hover:shadow-md transition text-left"
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          isAnswered
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-orange-50 text-orange-500"
                        }`}
                      >
                        {isAnswered ? (
                          <CheckCircle2 size={23} />
                        ) : (
                          <HelpCircle size={23} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
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
                            {item.date || item.created_at || "Bugün"}
                          </span>
                        </div>

                        <h3
                          className={`text-xl font-black ${
                            isAnswered ? "text-red-600" : "text-slate-950"
                          }`}
                        >
                          {title}
                        </h3>

                        <p className="text-slate-500 font-semibold text-sm mt-2 line-clamp-2">
                          {message}
                        </p>

                        {isAnswered && (
                          <div className="mt-4 bg-slate-950 text-white rounded-2xl p-4">
                            <p className="text-[10px] font-black text-emerald-300 tracking-[2px] mb-2">
                              EĞİTMEN CEVABI
                            </p>

                            <p className="text-sm font-semibold text-white/90 line-clamp-2">
                              {answerText || "Eğitmen yanıtı detayda görüntülenebilir."}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 font-black text-sm shrink-0 pt-2">
                        Detay Gör
                        <ChevronRight size={18} />
                      </div>
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