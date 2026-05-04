import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Headphones,
  Lock,
  Mail,
  PlayCircle,
  Search,
  ShieldCheck,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { completeModule, getTrainingDetail } from "../services/api";

export default function AdminEgitimDetay({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedText, setSelectedText] = useState(null);

  useEffect(() => {
    loadTraining();
  }, [id, user?.id]);

  const loadTraining = async () => {
    try {
      setLoading(true);
      const data = await getTrainingDetail(id, user?.id);
      if (!data) { setTraining(null); return; }

      const modules = data.modules || [];
      const completedCount = modules.filter((m) => m.status === "completed").length;

      setTraining({
        ...data,
        id: String(data.id || id),
        title: data.title || "Eğitim Detayı",
        description: data.description || data.aciklama || "Eğitim açıklaması bulunamadı.",
        category: data.category || "Genel",
        mandatory: data.mandatory || false,
        progress:
          modules.length > 0
            ? Math.round((completedCount / modules.length) * 100)
            : Number(data.progress || 0),
        instructor: data.instructor || {
          name: "Sporthink Akademi",
          role: "Eğitim Uzmanı",
          avatarEmoji: "👩‍🏫",
        },
        modules,
        resources: data.resources || [],
        quiz: data.quiz || null,
        durum: data.durum,
        yenidenAtandi:
          data.durum === "yeniden_atandi" || data.durum === "yeniden_baslatildi",
        sertifikaPasif: data.sertifika_pasif_mi || false,
      });
    } catch (error) {
      console.log("Admin eğitim detay yükleme hatası:", error.message);
      setTraining(null);
    } finally {
      setLoading(false);
    }
  };

  const completedModuleCount = useMemo(() => {
    return training?.modules?.filter((m) => m.status === "completed").length || 0;
  }, [training]);

  const nextModule = training?.modules?.find((m) => m.status === "active");
  const firstModule = training?.modules?.[0];
  const quizUnlocked = Number(training?.progress || 0) === 100 && !!training?.quiz;
  const certificateReady = Number(training?.progress || 0) === 100 && !training?.sertifikaPasif;

  // Admin için navigate hedefleri /admin/... 
  const goToLesson = (moduleId) => {
    navigate(`/admin/ogrenme-ders/${training.id}/${moduleId}`);
  };

  const goToQuiz = () => {
    navigate(`/admin/quiz/${training.id}`, {
      state: {
        egitimId: training.id,
        egitimBaslik: training.title,
        xp: training.xp || 0,
      },
    });
  };

  const handleResourceClick = async (resource) => {
    try {
      await completeModule(user?.id, training.id, resource.id);
    } catch (error) {
      console.log("Kaynak tamamlama log hatası:", error.message);
    }

    if (resource.type === "METIN" || resource.type === "METİN") {
      setSelectedText(resource);
      return;
    }
    if (resource.url) { setSelectedPdf(resource); return; }
    alert("Bu kaynağın bağlantısı veya içeriği bulunamadı.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black text-slate-600">Eğitim yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 mb-3">Eğitim bulunamadı</h1>
          <button
            onClick={() => navigate("/admin/egitimlerim")}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black"
          >
            Eğitimlerime Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <header className="h-20 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
        <button
          onClick={() => navigate("/admin/egitimlerim")}
          className="flex items-center gap-2 text-slate-600 font-black hover:text-red-600 transition"
        >
          <ArrowLeft size={20} />
          Eğitimlerime Dön
        </button>

        <div className="w-[430px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3 border border-slate-200">
          <Search size={20} className="text-slate-400" />
          <input
            placeholder="Eğitim içinde ara..."
            className="bg-transparent outline-none w-full text-sm font-bold text-slate-600"
          />
        </div>

        <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
          {user?.name?.charAt(0) || "A"}
        </div>
      </header>

      <section className="p-8 xl:p-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-7">
          {/* Sol kolon */}
          <div className="space-y-6">
            {/* Eğitim başlık kartı */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm overflow-hidden relative">
              <div className="absolute right-0 top-0 w-64 h-64 bg-red-50 rounded-bl-full opacity-70" />
              <div className="relative flex gap-8 items-center">
                <div className="hidden md:flex w-36 h-36 rounded-[2rem] bg-red-50 border border-red-100 items-center justify-center">
                  <ShieldCheck size={78} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex gap-3 mb-5 flex-wrap">
                    <span className="px-4 py-2 bg-slate-100 rounded-full text-slate-600 font-black text-xs">
                      {training.category}
                    </span>
                    {training.mandatory && (
                      <span className="px-4 py-2 bg-red-50 rounded-full text-red-600 font-black text-xs">
                        ZORUNLU
                      </span>
                    )}
                    <span className="px-4 py-2 bg-slate-950 rounded-full text-white font-black text-xs">
                      YÖNETİCİ ÖĞRENME MODU
                    </span>
                  </div>
                  <h1 className="text-4xl xl:text-5xl font-black text-slate-950 leading-tight mb-3">
                    {training.title}
                  </h1>
                  <p className="text-slate-500 font-semibold leading-7 max-w-2xl">
                    {training.description}
                  </p>
                  {training.yenidenAtandi && (
                    <div className="mt-5 bg-red-50 border border-red-200 rounded-2xl p-5">
                      <p className="text-red-600 font-black text-xs tracking-widest mb-2">YENİDEN ATANDI</p>
                      <p className="text-slate-800 font-bold leading-7">
                        Bu eğitim tekrar atanmıştır. Eğitimi yeniden tamamlamanız gerekir.
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
                    <MiniInfo icon={Clock3} title="Tahmini Süre" value={training.duration || "30 dk"} />
                    <MiniInfo icon={CheckCircle2} title="Modül Sayısı" value={training.modules.length} />
                    <MiniInfo icon={Star} title="Kazanılacak XP" value={`${training.xp || 50} XP`} red />
                  </div>
                </div>
              </div>
            </div>

            {/* Modüller */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-black tracking-[3px] text-slate-400">EĞİTİM AKIŞI</h2>
                  <p className="text-slate-400 font-bold text-sm mt-1">Modülleri sırayla tamamla</p>
                </div>
                <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black">
                  {completedModuleCount} / {training.modules.length} Tamamlandı
                </span>
              </div>

              <div className="relative space-y-3">
                {training.modules.map((module, index) => {
                  const isLocked = module.status === "locked";
                  const isCompleted = module.status === "completed";
                  const isActive = module.status === "active";

                  return (
                    <button
                      key={module.id}
                      disabled={isLocked}
                      onClick={() => goToLesson(module.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition ${
                        isLocked
                          ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
                          : "bg-white border-slate-200 hover:border-red-300 hover:shadow-md"
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${
                          isCompleted
                            ? "bg-red-50 text-red-600"
                            : isActive
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={24} />
                        ) : isActive ? (
                          String(index + 1).padStart(2, "0")
                        ) : (
                          <Lock size={21} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-slate-950">
                          {index + 1}. {module.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock3 size={15} />
                            {module.duration || "0 dk"}
                          </span>
                        </div>
                      </div>
                      {isCompleted && (
                        <span className="hidden md:inline-flex px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black">
                          Tamamlandı
                        </span>
                      )}
                      {isActive && (
                        <span className="hidden md:inline-flex px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-black">
                          Devam Et
                        </span>
                      )}
                      <ChevronRight size={22} className="text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kaynaklar */}
            {training.resources?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-sm font-black tracking-[3px] text-slate-400">EĞİTİM KAYNAKLARI</h2>
                  <p className="text-slate-400 font-bold text-sm mt-1">Doküman, PDF, metin ve ek kaynaklar</p>
                </div>
                <div className="space-y-3">
                  {training.resources.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleResourceClick(res)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:bg-red-50 hover:border-red-200 transition"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center">
                        {res.type === "PDF" ? <FileText size={22} /> : <Headphones size={22} />}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-950">{res.title}</p>
                        <p className="font-bold text-red-500 text-sm">{res.type} • {res.size || "Kaynak"}</p>
                      </div>
                      <Download size={19} className="text-red-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sağ kolon */}
          <aside className="space-y-6 xl:sticky xl:top-28 h-fit">
            {/* İlerleme */}
            <div className="bg-slate-950 text-white rounded-[2rem] p-7 shadow-xl">
              <p className="text-red-300 font-black text-xs tracking-widest mb-3">İLERLEME DURUMU</p>
              <h2 className="text-3xl font-black mb-2">%{training.progress} Tamamlandı</h2>
              <p className="text-slate-400 font-bold mb-5">
                {completedModuleCount} / {training.modules.length} modül
              </p>
              <div className="w-full h-4 bg-white/15 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${training.progress}%` }}
                />
              </div>
              <button
                onClick={() => {
                  if (training?.yenidenAtandi && firstModule) goToLesson(firstModule.id);
                  else if (nextModule) goToLesson(nextModule.id);
                  else if (quizUnlocked) goToQuiz();
                  else if (firstModule) goToLesson(firstModule.id);
                }}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-600/25"
              >
                <PlayCircle size={20} />
                {quizUnlocked ? "Quizi Başlat" : "Derse Devam Et"}
              </button>
            </div>

            {/* Eğitim Uzmanı */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
              <p className="text-red-600 font-black text-xs tracking-widest mb-4">EĞİTİM UZMANI</p>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-2xl">
                  {training.instructor.avatarEmoji || "👩‍🏫"}
                </div>
                <div>
                  <h3 className="font-black text-slate-950">{training.instructor.name}</h3>
                  <p className="text-slate-400 font-bold text-sm">{training.instructor.role}</p>
                </div>
              </div>
              <button
                onClick={() =>
                  navigate("/admin/sorular", {
                    state: {
                      trainingId: training.id,
                      trainingTitle: training.title,
                      instructorName: training.instructor.name,
                    },
                  })
                }
                className="w-full bg-slate-100 py-3 rounded-2xl font-black text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-200 transition"
              >
                <Mail size={18} />
                Eğitmene Soru Sor
              </button>
            </div>

            {/* Quiz */}
            {training.quiz && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Trophy size={30} />
                  </div>
                  <div>
                    <p className="text-red-600 font-black text-xs tracking-widest">EĞİTİM SONU TESTİ</p>
                    <h3 className="font-black text-slate-950 mt-1">{training.quiz?.baslik || "Quiz"}</h3>
                    <p className="text-slate-400 font-bold text-sm mt-1">
                      {`${training.quiz.soru_sayisi || 0} Soru • Geçme Notu: %${training.quiz.gecme_notu || 70}`}
                    </p>
                  </div>
                </div>
                {quizUnlocked ? (
                  <button
                    onClick={goToQuiz}
                    className="w-full border border-red-600 text-red-600 py-3 rounded-2xl font-black hover:bg-red-600 hover:text-white transition"
                  >
                    Quiz'i Başlat
                  </button>
                ) : (
                  <p className="text-slate-400 font-bold text-sm">
                    Quiz için tüm modülleri tamamlamalısın.
                  </p>
                )}
              </div>
            )}

            {/* Sertifika */}
            <div
              className={`rounded-[2rem] p-6 border ${
                certificateReady ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      certificateReady ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-300"
                    }`}
                  >
                    {certificateReady ? <Trophy size={28} /> : <Lock size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950">Başarı Sertifikası</h3>
                    <p className="text-slate-400 font-bold text-sm mt-1">
                      {certificateReady
                        ? "Sertifikan hazır!"
                        : "Eğitimi ve quizi tamamlayınca açılacak"}
                    </p>
                  </div>
                </div>
                {certificateReady && (
                  <button onClick={() => navigate("/admin/sertifikalar")}>
                    <ChevronRight className="text-amber-500" />
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* PDF Modal */}
      {selectedPdf && (
        <Modal title={selectedPdf.title} onClose={() => setSelectedPdf(null)}>
          <iframe
            title={selectedPdf.title}
            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(selectedPdf.url)}`}
            className="w-full h-[78vh] rounded-2xl border border-slate-200"
          />
        </Modal>
      )}

      {/* Metin Modal */}
      {selectedText && (
        <Modal title={selectedText.title} onClose={() => setSelectedText(null)}>
          <div className="bg-slate-50 rounded-2xl p-6">
            <h2 className="text-2xl font-black text-slate-950 mb-4">{selectedText.title}</h2>
            <p className="text-slate-700 font-semibold leading-8 whitespace-pre-line">
              {selectedText.content || selectedText.text || "Metin içeriği bulunamadı."}
            </p>
          </div>
        </Modal>
      )}
    </main>
  );
}

function MiniInfo({ icon: Icon, title, value, red }) {
  return (
    <div className="bg-white/90 border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${red ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-slate-400 font-bold text-xs">{title}</p>
        <p className={`font-black ${red ? "text-red-600" : "text-slate-950"}`}>{value}</p>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white rounded-[2rem] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-slate-950">{title}</h2>
          <button onClick={onClose} className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}