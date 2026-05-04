import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Headphones,
  Pause,
  Play,
  PlayCircle,
  Printer,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  completeModule,
  getLessonDetail,
  saveVideoLog,
  submitLessonQuizResult,
} from "../services/api";

export default function AdminOgrenmeDetay({ user }) {
  const navigate = useNavigate();
  const { id, moduleId } = useParams();

  const videoRef = useRef(null);

  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenMode, setScreenMode] = useState("video");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rewindCount, setRewindCount] = useState(0);
  const [lastKnownTime, setLastKnownTime] = useState(0);

  const [modalType, setModalType] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadLesson();
  }, [id, moduleId, user?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (videoRef.current) {
        setLastKnownTime(videoRef.current.currentTime || 0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadLesson = async () => {
    try {
      setLoading(true);

      const data = await getLessonDetail(id, moduleId, user?.id);

      if (!data) {
        setLessonData(null);
        return;
      }

      setLessonData(data);
    } catch (error) {
      console.log("Admin ders yükleme hatası:", error.message);
      setLessonData(null);
    } finally {
      setLoading(false);
    }
  };

  const training = lessonData?.training;
  const module = lessonData?.module;
  const resources = lessonData?.resources || [];
  const modules = lessonData?.modules || [];
  const quizQuestions = lessonData?.quizQuestions || [];

  const currentModuleIndex = modules.findIndex(
    (m) => String(m.id) === String(module?.id)
  );

  const nextModule =
    currentModuleIndex !== -1 && currentModuleIndex < modules.length - 1
      ? modules[currentModuleIndex + 1]
      : null;

  const prevModule =
    currentModuleIndex > 0 ? modules[currentModuleIndex - 1] : null;

  const isLastModule =
    modules.length > 0 && currentModuleIndex === modules.length - 1;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const goToDetail = () => {
    if (!training?.id) return;
    navigate(`/admin/egitim-detay/${training.id}`);
  };

  const goToModule = (targetModuleId) => {
    if (!training?.id || !targetModuleId) return;
    navigate(`/admin/ogrenme-ders/${training.id}/${targetModuleId}`);
  };

  const saveVideoProgress = async () => {
    try {
      if (!lessonData?.kayitId || !module?.id) return;

      await saveVideoLog({
        kayitId: lessonData.kayitId,
        icerikId: module.id,
        izlenenSaniye: Math.floor(lastKnownTime || 0),
        sonKaldigiSaniye: Math.floor(lastKnownTime || 0),
        geriSarmaSayisi: rewindCount,
      });
    } catch (error) {
      console.log("Video log kayıt hatası:", error.message);
    }
  };

  const handleFinishModule = async () => {
    if (!training || !module) return;

    try {
      await saveVideoProgress();

      await completeModule(user?.id, training.id, module.id);

      if (!isLastModule && nextModule) {
        const goNext = window.confirm(
          `"${module.title}" tamamlandı. Sonraki modüle geçmek ister misin?`
        );

        if (goNext) {
          goToModule(nextModule.id);
        } else {
          goToDetail();
        }

        return;
      }

      startQuiz();
    } catch (error) {
      alert(error.message || "Modül tamamlanamadı.");
    }
  };

  const startQuiz = () => {
    if (!quizQuestions || quizQuestions.length === 0) {
      alert("Bu eğitime ait quiz sorusu bulunmuyor.");
      goToDetail();
      return;
    }

    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setScreenMode("quiz");
  };

  const handleAnswerSelect = async (optionIdx) => {
    const isCorrect = optionIdx === currentQuestion.correct;
    const newAnswers = [...userAnswers, isCorrect];

    setUserAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    const correctCount = newAnswers.filter(Boolean).length;
    setScore(correctCount);

    try {
      const result = await submitLessonQuizResult(
        user?.id,
        training.id,
        correctCount,
        quizQuestions.length
      );

      if (result.basarili) {
        setModalType("success");
      } else {
        setModalType("fail");
      }
    } catch (error) {
      alert(error.message || "Quiz sonucu kaydedilemedi.");
    }
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const rewindVideo = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    setRewindCount((prev) => prev + 1);
  };

  const certificateCode = useMemo(() => {
    if (!training || !module) return "-";
    return `SP-${training.id}-${module.id}`;
  }, [training, module]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-white">Ders yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!training || !module) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-4">
            Ders bulunamadı
          </h1>

          <button
            onClick={() => navigate("/admin/egitimlerim")}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black"
          >
            Eğitimlerime Dön
          </button>
        </div>
      </div>
    );
  }

  if (screenMode === "certificate") {
    return (
      <div className="min-h-screen bg-slate-100 p-10">
        <button
          onClick={goToDetail}
          className="mb-6 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-14 text-center border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-yellow-100 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-red-50 rounded-full" />

          <Trophy size={90} className="text-yellow-500 mx-auto mb-8 relative z-10" />

          <p className="text-slate-400 tracking-[4px] font-black mb-8">
            TEBRİKLER!
          </p>

          <p className="text-slate-500 font-semibold mb-3">
            Bu sertifika başarıyla tamamladığınız
          </p>

          <h1 className="text-4xl font-black text-slate-950 mb-8">
            {training.title}
          </h1>

          <p className="text-slate-500 italic mb-16">
            programı için verilmiştir.
          </p>

          <div className="flex justify-center gap-14 mb-14">
            <div>
              <p className="text-2xl font-black text-slate-950">
                {new Date().toLocaleDateString("tr-TR")}
              </p>
              <p className="text-slate-400 font-black text-xs tracking-widest mt-2">
                TARİH
              </p>
            </div>

            <div className="w-px bg-slate-200" />

            <div>
              <p className="text-2xl font-black text-slate-950">
                {certificateCode}
              </p>
              <p className="text-slate-400 font-black text-xs tracking-widest mt-2">
                KOD
              </p>
            </div>
          </div>

          <div className="w-20 h-1 bg-red-600 rounded-full mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-5 mt-6">
          <button
            onClick={() => window.print()}
            className="bg-white py-4 rounded-2xl font-black text-slate-700 flex items-center justify-center gap-2"
          >
            <Printer size={20} />
            Yazdır
          </button>

          <button className="bg-slate-950 py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2">
            <Download size={20} />
            İndir
          </button>
        </div>
      </div>
    );
  }

  if (screenMode === "quiz" && currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between">
          <button
            onClick={() => setScreenMode("video")}
            className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft size={22} />
          </button>

          <span className="px-5 py-3 bg-red-50 text-red-600 rounded-full font-black text-sm">
            Soru {currentQuestionIndex + 1} / {quizQuestions.length}
          </span>
        </header>

        <main className="max-w-4xl mx-auto p-10">
          <h1 className="text-4xl leading-tight font-black text-slate-950 mb-10">
            {currentQuestion.q}
          </h1>

          <div className="grid gap-5">
            {currentQuestion.options.map((option, index) => (
              <button
                key={`${currentQuestionIndex}-${index}`}
                onClick={() => handleAnswerSelect(index)}
                className="bg-white border border-slate-200 rounded-[2rem] p-7 text-left font-bold text-slate-700 hover:border-red-300 hover:bg-red-50 transition"
              >
                {option}
              </button>
            ))}
          </div>
        </main>

        {modalType && (
          <ResultModal
            modalType={modalType}
            score={score}
            total={quizQuestions.length}
            onClose={() => setModalType(null)}
            onCertificate={() => {
              setModalType(null);
              setScreenMode("certificate");
            }}
            onRetry={() => {
              setModalType(null);
              startQuiz();
            }}
            onVideo={() => {
              setModalType(null);
              setScreenMode("video");
            }}
          />
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="h-20 border-b border-white/10 px-10 flex items-center">
        <button
          onClick={goToDetail}
          className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mr-5 hover:bg-white/20 transition"
        >
          <ArrowLeft size={22} />
        </button>

        <div>
          <p className="text-white/50 font-bold text-sm">{training.title}</p>
          <h1 className="text-xl font-black">{module.title}</h1>
        </div>
      </header>

      <main className="p-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2">
          <div className="bg-slate-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
            {module.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={module.videoUrl}
                  className="w-full aspect-video bg-black"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={handleFinishModule}
                  controls
                />

                <div className="bg-slate-900 px-8 py-6 flex items-center justify-center gap-8">
                  <button
                    onClick={rewindVideo}
                    className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                  >
                    <RotateCcw size={25} />
                  </button>

                  <button
                    onClick={toggleVideo}
                    className="w-20 h-20 rounded-full bg-white text-slate-950 flex items-center justify-center"
                  >
                    {isPlaying ? <Pause size={34} /> : <Play size={34} />}
                  </button>

                  <button
                    disabled
                    className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center opacity-40"
                  >
                    <PlayCircle size={25} />
                  </button>
                </div>
              </>
            ) : (
              <div className="aspect-video bg-slate-800 flex flex-col items-center justify-center">
                <PlayCircle size={80} className="text-white/30 mb-5" />
                <p className="text-white/50 font-bold">
                  Video bağlantısı eklenmedi
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 bg-white text-slate-950 rounded-[2rem] p-8">
            <p className="text-slate-400 font-black text-xs tracking-[3px] mb-4">
              DERS BİLGİSİ
            </p>

            <h2 className="text-2xl font-black mb-4">{module.title}</h2>

            <p className="text-slate-500 font-semibold leading-8">
              {module.content ||
                "Sporthink Akademi ders oynatma alanı. Modülü bitirerek ilerleyebilirsin."}
            </p>

            <div className="flex gap-3 mt-6">
              <span className="px-4 py-2 bg-slate-100 rounded-full font-black text-sm text-slate-600">
                {module.duration || "0 dk"}
              </span>

              <span className="px-4 py-2 bg-slate-100 rounded-full font-black text-sm text-slate-600">
                {training.category || "Genel"}
              </span>

              <span className="px-4 py-2 bg-red-50 rounded-full font-black text-sm text-red-600">
                Yönetici Öğrenme Modu
              </span>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white text-slate-950 rounded-[2rem] p-7">
            <p className="text-slate-400 font-black text-xs tracking-[3px] mb-4">
              MODÜL GEÇİŞİ
            </p>

            <div className="space-y-3">
              {prevModule && (
                <button
                  onClick={() => goToModule(prevModule.id)}
                  className="w-full bg-slate-100 py-4 rounded-2xl font-black text-slate-700"
                >
                  Önceki Modül
                </button>
              )}

              {nextModule && (
                <button
                  onClick={() => goToModule(nextModule.id)}
                  className="w-full bg-slate-950 py-4 rounded-2xl font-black text-white"
                >
                  Sonraki Modül
                </button>
              )}

              <button
                onClick={handleFinishModule}
                className="w-full bg-red-600 py-4 rounded-2xl font-black text-white"
              >
                {quizQuestions.length > 0 && isLastModule
                  ? "Modülü Bitir ve Quiz'e Geç"
                  : "Modülü Tamamla"}
              </button>

              <button
                onClick={goToDetail}
                className="w-full bg-slate-100 py-4 rounded-2xl font-black text-slate-700"
              >
                Eğitim Detayına Dön
              </button>
            </div>
          </div>

          {resources.length > 0 && (
            <div className="bg-white text-slate-950 rounded-[2rem] p-7">
              <p className="text-slate-400 font-black text-xs tracking-[3px] mb-4">
                EĞİTİM KAYNAKLARI
              </p>

              <div className="space-y-3">
                {resources.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => {
                      if (resource.url) setSelectedPdf(resource);
                      else alert("Bu kaynağa ait dosya URL'i yok.");
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-left hover:bg-red-100 transition"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-red-600">
                      {resource.type === "PDF" ? (
                        <FileText size={20} />
                      ) : (
                        <Headphones size={20} />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-black text-slate-950">
                        {resource.title}
                      </p>

                      <p className="font-bold text-red-400 text-sm">
                        {resource.type} • {resource.size || "Kaynak"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white/10 border border-white/10 rounded-[2rem] p-7">
            <p className="text-white/40 font-black text-xs tracking-[3px] mb-4">
              EĞİTİM AKIŞI
            </p>

            <div className="space-y-3">
              {modules.map((item, index) => {
                const active = String(item.id) === String(module.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => goToModule(item.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition ${
                      active
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <p className="font-black text-sm">
                      {index + 1}. {item.title}
                    </p>

                    <p className="text-xs font-bold opacity-70 mt-1">
                      {item.duration || "0 dk"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </main>

      {selectedPdf && (
        <PdfModal resource={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}

      {modalType && (
        <ResultModal
          modalType={modalType}
          score={score}
          total={quizQuestions.length}
          onClose={() => setModalType(null)}
          onCertificate={() => {
            setModalType(null);
            setScreenMode("certificate");
          }}
          onRetry={() => {
            setModalType(null);
            startQuiz();
          }}
          onVideo={() => {
            setModalType(null);
            setScreenMode("video");
          }}
        />
      )}
    </main>
  );
}

function ResultModal({
  modalType,
  score,
  total,
  onClose,
  onCertificate,
  onRetry,
  onVideo,
}) {
  const success = modalType === "success";

  return (
    <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
        >
          <X size={18} />
        </button>

        <div
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-7 ${
            success ? "bg-emerald-50" : "bg-yellow-50"
          }`}
        >
          {success ? (
            <CheckCircle2 size={50} className="text-emerald-500" />
          ) : (
            <AlertTriangle size={50} className="text-yellow-500" />
          )}
        </div>

        <h2 className="text-2xl font-black text-slate-950 mb-3">
          {success ? "Eğitim Tamamlandı" : "Quiz Başarısız"}
        </h2>

        <p className="text-slate-500 font-semibold leading-7 mb-8">
          {success
            ? "Harika! Bu eğitimi başarıyla bitirdin ve sertifika almaya hak kazandın."
            : `Maalesef yeterli puanı alamadın. Skorun: ${score} / ${total}`}
        </p>

        {success ? (
          <>
            <button
              onClick={onCertificate}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-black mb-3"
            >
              Sertifikayı Göster
            </button>

            <button
              onClick={onVideo}
              className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black"
            >
              Eğitimi Tekrar İzle
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onRetry}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-black mb-3"
            >
              Quizi Tekrar Dene
            </button>

            <button
              onClick={onVideo}
              className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black"
            >
              Videoyu Tekrar İzle
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PdfModal({ resource, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-8">
      <div className="bg-white w-full max-w-6xl rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-slate-950">
            {resource.title || "Kaynak"}
          </h2>

          <button
            onClick={onClose}
            className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center"
          >
            <X size={22} />
          </button>
        </div>

        <iframe
          title={resource.title}
          src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
            resource.url
          )}`}
          className="w-full h-[78vh] rounded-2xl border border-slate-200"
        />
      </div>
    </div>
  );
}