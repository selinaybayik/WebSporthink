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
  UserRound,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  completeModule,
  getTrainingDetail,
  sendTrainingFeedback,
  getMyTrainingFeedback,
} from "../../services/api";
import KullaniciLayout from "../../components/KullaniciLayout";

export default function EgitimDetay({ user, setUser }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
const [showFeedback, setShowFeedback] = useState(false);
const [feedbackPuan, setFeedbackPuan] = useState(5);
const [feedbackYorum, setFeedbackYorum] = useState("");
const [myFeedback, setMyFeedback] = useState(null);
const [feedbackLoading, setFeedbackLoading] = useState(true);

  useEffect(() => {
    loadTraining();
  }, [id, user?.id]);
  
  useEffect(() => {
  const loadFeedback = async () => {
    if (!training?.id || !user?.id) return;

    try {
      setFeedbackLoading(true);

      const data = await getMyTrainingFeedback(
        training.id,
        user.id
      );

      setMyFeedback(data || null);
    } catch (error) {
      console.log("Feedback yüklenemedi:", error.message);
      setMyFeedback(null);
    } finally {
      setFeedbackLoading(false);
    }
  };

  loadFeedback();
}, [training?.id, user?.id]);


  
useEffect(() => {
  if (!training || !user) return;
  if (feedbackLoading) return;

  if (
    Number(training.progress || 0) === 100 &&
    myFeedback === null
  ) {
    setShowFeedback(true);
  } else {
    setShowFeedback(false);
  }
}, [
  training?.id,
  training?.progress,
  myFeedback,
  user?.id,
  feedbackLoading,
]);

  const loadTraining = async () => {
    try {
      setLoading(true);

      const data = await getTrainingDetail(id, user?.id);

      if (!data) {
        setTraining(null);
        return;
      }

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
          label: "Eğitmen",
          avatarEmoji: "👩‍🏫",
        },
        modules,
        resources: data.resources || [],
        quiz: data.quiz || null,
        durum: data.durum,

yenidenAtandi:
  data.durum === "yeniden_atandi" ||
  data.durum === "yeniden_baslatildi",

sertifikaPasif:
  data.sertifika_pasif_mi || false,

quizResetlendi:
  data.quiz_resetlendi_mi || false,
      });
    } catch (error) {
      console.log("Eğitim detay yükleme hatası:", error.message);
      setTraining(null);
    } finally {
      setLoading(false);
    }
  };

  const completedModuleCount = useMemo(() => {
    return training?.modules?.filter((m) => m.status === "completed").length || 0;
  }, [training]);

  const nextModule = training?.modules?.find((m) => m.status === "active");
  const firstModule =
  training?.modules?.[0];
  const quizUnlocked =
  Number(training?.progress || 0) === 100 &&
  !!training?.quiz;
  const certificateReady =
  Number(training?.progress || 0) === 100 &&
  !training?.sertifikaPasif;
  const quizCompleted =
  training?.durum === "tamamlandi";

const quizButtonText = quizCompleted
  ? "Quizi Tekrar Başlat"
  : "Quiz’i Başlat";

  const goToLesson = (moduleId) => {
    navigate(`/user/ders-detay/${training.id}/${moduleId}`);
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

    if (resource.url) {
      setSelectedPdf(resource);
      return;
    }

    alert("Bu kaynağın bağlantısı veya içeriği bulunamadı.");
  };

  const handleSubmitFeedback = async () => {
  if (!training?.id || !user?.id) {
    return alert("Eğitim veya kullanıcı bilgisi eksik.");
  }

  try {
    await sendTrainingFeedback({
      egitimId: training.id,
      kullaniciId: user.id,
      puan: Number(feedbackPuan),
      yorum: feedbackYorum,
    });


    alert("Geri bildirimin kaydedildi. Teşekkürler!");
    setShowFeedback(false);
    setFeedbackYorum("");
    setFeedbackPuan(5);
  } catch (error) {
    alert(error.message || "Geri bildirim gönderilemedi.");
  }
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
          <h1 className="text-2xl font-black text-slate-900 mb-3">
            Eğitim bulunamadı
          </h1>
          <button
            onClick={() => navigate("/user/egitimler")}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black"
          >
            Eğitimlere Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <KullaniciLayout
      user={user}
      setUser={setUser}
      activePath="/user/egitimler"
      searchPlaceholder="Eğitim detayında ara..."
    >
      <main className="flex-1 bg-[#F8FAFC] min-h-screen">
        <header className="h-20 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
          <button
            onClick={() => navigate("/user/egitimler")}
            className="flex items-center gap-2 text-slate-600 font-black hover:text-red-600 transition"
          >
            <ArrowLeft size={20} />
            Eğitimlere Dön
          </button>

          <div className="w-[430px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3 border border-slate-200">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder="Eğitim içinde ara..."
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

        <section className="p-8 xl:p-10">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-7">
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm overflow-hidden relative">
                <div className="absolute right-0 top-0 w-64 h-64 bg-red-50 rounded-bl-full opacity-70" />

                <div className="relative flex gap-8 items-center">
                  <div className="hidden md:flex w-36 h-36 rounded-[2rem] bg-red-50 border border-red-100 items-center justify-center">
                    <ShieldCheck size={78} className="text-red-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex gap-3 mb-5">
                      <span className="px-4 py-2 bg-slate-100 rounded-full text-slate-600 font-black text-xs">
                        {training.category}
                      </span>

                      {training.mandatory && (
                        <span className="px-4 py-2 bg-red-50 rounded-full text-red-600 font-black text-xs">
                          ZORUNLU
                        </span>
                      )}
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-black text-slate-950 leading-tight mb-3">
                      {training.title}
                    </h1>

                    <p className="text-slate-500 font-semibold leading-7 max-w-2xl">
                      {training.description}
                    </p>
                    {myFeedback && (
  <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl">
    <h3 className="text-lg font-black text-slate-950 mb-3">
      Geribildirimim
    </h3>

    <div className="flex items-center gap-2 mb-2">
      <span className="text-yellow-500 text-xl">⭐</span>
      <span className="font-bold text-slate-800">
        {myFeedback.puan} / 5
      </span>
    </div>

    <p className="text-slate-600 font-semibold leading-7">
      {myFeedback.yorum || "Yorum eklenmemiş"}
    </p>

    <p className="text-xs text-slate-400 mt-3 font-bold">
      {myFeedback.created_at
        ? new Date(myFeedback.created_at).toLocaleString("tr-TR")
        : ""}
    </p>
  </div>
)}
                    
                    {training.yenidenAtandi && (
  <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl p-5">
    <p className="text-red-600 font-black text-xs tracking-widest mb-2">
      YENİDEN ATANDI
    </p>

    <p className="text-slate-800 font-bold leading-7">
      Bu eğitim yönetici/eğitmen tarafından tekrar atanmıştır.
      Eğitimi yeniden tamamlamanız gerekmektedir.
    </p>
  </div>
)}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
                      <MiniInfo icon={Clock3} title="Tahmini Süre" value="30 dk" />
                      <MiniInfo
                        icon={CheckCircle2}
                        title="Modül Sayısı"
                        value={training.modules.length}
                      />
                      <MiniInfo icon={Star} title="Kazanılacak XP" value="50 XP" red />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-sm font-black tracking-[3px] text-slate-400">
                      EĞİTİM AKIŞI
                    </h2>
                    <p className="text-slate-400 font-bold text-sm mt-1">
                      Modülleri sırayla tamamlayarak ilerle
                    </p>
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

              {training.resources?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
                  <div className="mb-5">
                    <h2 className="text-sm font-black tracking-[3px] text-slate-400">
                      EĞİTİM KAYNAKLARI
                    </h2>
                    <p className="text-slate-400 font-bold text-sm mt-1">
                      Bu eğitime ait doküman ve kaynaklar
                    </p>
                  </div>

                  <div className="space-y-3">
                    {training.resources.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => handleResourceClick(res)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:bg-red-50 hover:border-red-200 transition"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center">
                          {res.type === "PDF" ? (
                            <FileText size={22} />
                          ) : (
                            <Headphones size={22} />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-black text-slate-950">{res.title}</p>
                          <p className="font-bold text-red-500 text-sm">
                            {res.type} • {res.size || "Kaynak"}
                          </p>
                        </div>

                        <Download size={19} className="text-red-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-6 xl:sticky xl:top-28 h-fit">
              <div className="bg-slate-950 text-white rounded-[2rem] p-7 shadow-xl">
                <p className="text-red-300 font-black text-xs tracking-widest mb-3">
                  İLERLEME DURUMU
                </p>

                <h2 className="text-3xl font-black mb-2">
                  %{training.progress} Tamamlandı
                </h2>

                <p className="text-slate-400 font-bold mb-5">
                  {completedModuleCount} / {training.modules.length} modül
                </p>

                <div className="w-full h-4 bg-white/15 rounded-full overflow-hidden mb-5">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${training.progress}%` }}
                  />
                </div>

                {quizUnlocked && (
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4 mb-5">
                    <p className="font-black">Tebrikler!</p>
                    <p className="text-slate-300 font-semibold text-sm mt-1">
                      Tüm modülleri başarıyla tamamladınız.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (training?.yenidenAtandi && firstModule) {
  goToLesson(firstModule.id);
}
else if (nextModule) {
  goToLesson(nextModule.id);
}
else if (quizUnlocked) {
  navigate(`/user/quiz/${training.id}`);
}
else if (firstModule) {
  goToLesson(firstModule.id);
}
                  }}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-600/25"
                >
                  <PlayCircle size={20} />
                  {quizUnlocked ? "Quizi Başlat" : "Derse Devam Et"}
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                <p className="text-red-600 font-black text-xs tracking-widest mb-4">
                  EĞİTİM UZMANI
                </p>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-2xl">
                    {training.instructor.avatarEmoji || "👩‍🏫"}
                  </div>

                  <div>
                    <h3 className="font-black text-slate-950">
                      {training.instructor.name}
                    </h3>
                    <p className="text-slate-400 font-bold text-sm">
                      {training.instructor.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/user/sorular", {
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
              {training.quiz && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Trophy size={30} />
                  </div>

                  <div>
                    <p className="text-red-600 font-black text-xs tracking-widest">
                      EĞİTİM SONU TESTİ
                    </p>
                    <h3 className="font-black text-slate-950 mt-1">
                      {training.quiz?.baslik || "Quiz"}
                    </h3>
                    <p className="text-slate-400 font-bold text-sm mt-1">
                      {training.quiz
                        ? `${training.quiz.soru_sayisi || 0} Soru • Geçme Notu: %${
                            training.quiz.gecme_notu || 70
                          }`
                        : "Henüz quiz oluşturulmadı"}
                    </p>
                  </div>
                </div>

                <button
  disabled={!quizUnlocked}
  onClick={() => {
    if (quizUnlocked) {
      navigate(`/user/quiz/${training.id}`);
    }
  }}
  className={`w-full py-3 rounded-2xl font-black transition ${
    quizUnlocked
      ? "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
      : "bg-slate-100 text-slate-400 cursor-not-allowed"
  }`}
>
  {!quizUnlocked
    ? "Önce Eğitimi Tamamla"
    : quizButtonText}
</button>

{!quizUnlocked && (
  <p className="text-slate-400 font-bold text-sm mt-3 text-center">
    Quiz açılması için tüm videolar tamamlanmalı.
  </p>
)}
              </div>)}

              <div
                className={`rounded-[2rem] p-6 border ${
                  certificateReady
                    ? "bg-amber-50 border-amber-200"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        certificateReady
                          ? "bg-amber-100 text-amber-500"
                          : "bg-slate-100 text-slate-300"
                      }`}
                    >
                      {certificateReady ? <Trophy size={28} /> : <Lock size={24} />}
                    </div>

                    <div>
                      <h3 className="font-black text-slate-950">
                        Başarı Sertifikası
                      </h3>
                      <p className="text-slate-400 font-bold text-sm mt-1">
                        {certificateReady
                          ? "Sertifikan hazır!"
                          : "Eğitimi ve quizi tamamlayınca açılacak"}
                      </p>
                    </div>
                  </div>

                  {certificateReady && (
  <button
    onClick={() =>
      navigate("/user/sertifikalar")
    }
  >
    <ChevronRight className="text-amber-500" />
  </button>
)}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {selectedPdf && (
        <Modal title={selectedPdf.title} onClose={() => setSelectedPdf(null)}>
          <iframe
            title={selectedPdf.title}
            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
              selectedPdf.url
            )}`}
            className="w-full h-[78vh] rounded-2xl border border-slate-200"
          />
        </Modal>
      )}

      {selectedText && (
        <Modal title={selectedText.title} onClose={() => setSelectedText(null)}>
          <div className="bg-slate-50 rounded-2xl p-6">
            <h2 className="text-2xl font-black text-slate-950 mb-4">
              {selectedText.title}
            </h2>
            <p className="text-slate-700 font-semibold leading-8 whitespace-pre-line">
              {selectedText.content || selectedText.text || "Metin içeriği bulunamadı."}
            </p>
          </div>
        </Modal>
      )}
      {showFeedback && (
  <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl">
      <h2 className="text-2xl font-black text-slate-950 mb-2">
        Eğitim Değerlendirme
      </h2>

      <p className="text-slate-500 font-semibold mb-6">
        “{training?.title}” eğitimi hakkında geri bildirim bırak.
      </p>

      <label className="block text-xs font-black text-slate-400 tracking-widest mb-2">
        PUAN
      </label>

      <select
        value={feedbackPuan}
        onChange={(e) => setFeedbackPuan(e.target.value)}
        className="w-full mb-5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
      >
        <option value="5">5 - Çok iyi</option>
        <option value="4">4 - İyi</option>
        <option value="3">3 - Orta</option>
        <option value="2">2 - Zayıf</option>
        <option value="1">1 - Kötü</option>
      </select>

      <label className="block text-xs font-black text-slate-400 tracking-widest mb-2">
        YORUM
      </label>

      <textarea
        value={feedbackYorum}
        onChange={(e) => setFeedbackYorum(e.target.value)}
        placeholder="Eğitimle ilgili yorumunu yaz..."
        className="w-full h-32 mb-6 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none resize-none"
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setShowFeedback(false)}
          className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black"
        >
          Sonra
        </button>

        <button
          type="button"
          onClick={handleSubmitFeedback}
          className="flex-[2] py-3 bg-red-600 text-white rounded-2xl font-black"
        >
          Gönder
        </button>
      </div>
    </div>
  </div>
)}
    </KullaniciLayout>
  );
}

function MiniInfo({ icon: Icon, title, value, red }) {
  return (
    <div className="bg-white/90 border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          red ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
        }`}
      >
        <Icon size={20} />
      </div>

      <div>
        <p className="text-slate-400 font-bold text-xs">{title}</p>
        <p className={`font-black ${red ? "text-red-600" : "text-slate-950"}`}>
          {value}
        </p>
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
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center"
          >
            <X size={22} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}