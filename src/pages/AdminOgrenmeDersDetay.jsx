import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Edit3,
  Eye,
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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { completeModule, getTrainingDetail } from "../services/api";

export default function AdminOgrenmeDersDetay({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const routeEgitim = location.state?.egitim || {};

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

      if (!data) {
        setTraining(null);
        return;
      }

      const modules = data.modules || [];
      const completedCount = modules.filter(
        (m) => m.status === "completed"
      ).length;

      setTraining({
        ...data,
        id: String(data.id || data.egitim_id || id),
        title: data.title || data.baslik || "Eğitim Detayı",
        description:
          data.description ||
          data.aciklama ||
          "Eğitim açıklaması bulunamadı.",
        category: data.category || data.kategori || "Genel",
        mandatory: data.mandatory || false,
        duration: data.duration || data.sure || "30 dk",
        xp: data.xp || data.xp_degeri || 50,
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
          data.durum === "yeniden_atandi" ||
          data.durum === "yeniden_baslatildi",
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
    return (
      training?.modules?.filter((m) => m.status === "completed").length || 0
    );
  }, [training]);

  const nextModule = training?.modules?.find((m) => m.status === "active");
  const firstModule = training?.modules?.[0];

  const quizUnlocked =
    Number(training?.progress || 0) === 100 && !!training?.quiz;

  const certificateReady =
    Number(training?.progress || 0) === 100 && !training?.sertifikaPasif;

  const getCurrentEgitimId = () => {
    return (
      training?.id ||
      id ||
      routeEgitim?.id ||
      routeEgitim?.egitim_id ||
      location.state?.egitimId ||
      location.state?.id
    );
  };

  const goToLesson = (moduleId) => {
    if (!training?.id || !moduleId) return;
    navigate(`/admin/ogrenme-ders/${training.id}/${moduleId}`);
  };

  const goToQuiz = () => {
    if (!training?.id) return;

    navigate(`/admin/quiz/${training.id}`, {
      state: {
        egitimId: training.id,
        egitimBaslik: training.title,
        xp: training.xp || 0,
      },
    });
  };

  const goToAdminPreview = () => {
    const egitimId = getCurrentEgitimId();

    if (!egitimId) {
      alert("Eğitim ID bulunamadı.");
      return;
    }

    navigate(`/admin/onizleme/${egitimId}`, {
      state: {
        egitimId,
        id: egitimId,
        egitim: training || routeEgitim,
      },
    });
  };

  const goToAdminContentEdit = () => {
    const egitimId = getCurrentEgitimId();

    if (!egitimId) {
      alert("Eğitim ID bulunamadı.");
      return;
    }

    navigate(`/admin/icerik-ekle/${egitimId}`, {
      state: {
        egitimId,
        id: egitimId,
        egitim: training || routeEgitim,
      },
    });
  };

  const handleDraftButton = () => {
    alert("Taslağa çekme API'si henüz bağlanmadı.");
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
      <header className="h-20 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 font-black hover:text-red-600 transition"
        >
          <ArrowLeft size={20} />
          Geri Dön
        </button>

        <div className="w-[430px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3 border border-slate-200">
          <Search size={20} className="text-slate-400" />
          <input
            placeholder="Eğitim içinde ara..."
            className="bg-transparent outline-none w-full text-sm font-bold text-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goToAdminPreview}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-950 rounded-2xl font-black flex items-center gap-2 hover:border-red-300 transition"
          >
            <Eye size={18} />
            Önizle
          </button>

          <button
            onClick={handleDraftButton}
            className="px-5 py-3 bg-slate-950 text-white rounded-2xl font-black hover:bg-slate-800 transition"
          >
            Taslağa Çek
          </button>
        </div>
      </header>

      <section className="p-8 xl:p-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-7">
          <div className="space-y-6">
            <div className="bg-white border border-red-100 rounded-[2rem] p-8 shadow-sm overflow-hidden relative">
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

                    <span className="px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 font-black text-xs">
                      {training.durum === "taslak" ? "TASLAK" : "YAYINDA"}
                    </span>
                  </div>

                  <h1 className="text-4xl xl:text-5xl font-black text-slate-950 leading-tight mb-3">
                    {training.title}
                  </h1>

                  <p className="text-slate-500 font-semibold leading-7 max-w-2xl">
                    Bu alanda eğitimin içerik yapısını, modüllerini,
                    kaynaklarını ve yayın durumunu yönetebilirsin.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-7">
                    <MiniInfo
                      icon={CheckCircle2}
                      title="Modül"
                      value={training.modules.length}
                    />
                    <MiniInfo
                      icon={FileText}
                      title="İçerik"
                      value={
                        training.modules.reduce(
                          (acc, item) =>
                            acc + Number(item.contents?.length || 0),
                          0
                        ) || training.resources.length
                      }
                    />
                    <MiniInfo
                      icon={Trophy}
                      title="Quiz"
                      value={training.quiz ? "VAR" : "YOK"}
                      red
                    />
                    <MiniInfo
                      icon={ShieldCheck}
                      title="Durum"
                      value={training.durum === "taslak" ? "TASLAK" : "AKTİF"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-red-600 text-xs font-black tracking-[3px] mb-2">
                    GENEL YÖNETİM
                  </p>

                  <h2 className="text-2xl font-black text-slate-950">
                    Eğitim Bilgileri
                  </h2>
                </div>

                <button
                  onClick={goToAdminContentEdit}
                  className="px-6 py-3 bg-slate-950 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-slate-800 transition"
                >
                  <Edit3 size={18} />
                  İçeriği Düzenle
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InfoCard title="Eğitim Başlığı" value={training.title} />
                <InfoCard title="Kategori" value={training.category} />
                <InfoCard
                  title="Yayın Durumu"
                  value={training.durum === "taslak" ? "Taslak" : "Yayında"}
                />
                <InfoCard title="Eğitim ID" value={training.id} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-red-600 text-xs font-black tracking-[3px] mb-2">
                    MÜFREDAT YAPISI
                  </p>

                  <h2 className="text-2xl font-black text-slate-950">
                    Modüller ve İçerikler
                  </h2>
                </div>

                <span className="px-4 py-2 bg-slate-100 rounded-full text-slate-600 font-black text-xs">
                  {training.modules.length} Modül
                </span>
              </div>

              <div className="relative space-y-4">
                {training.modules.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-500 font-bold">
                    Henüz modül eklenmedi. İçerik eklemek için “İçeriği
                    Düzenle” butonunu kullan.
                  </div>
                ) : (
                  training.modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="bg-slate-50 border border-slate-200 rounded-3xl p-5"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-white text-red-600 flex items-center justify-center font-black text-lg">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-black text-slate-950">
                            {module.title || module.baslik || `Modül ${index + 1}`}
                          </h3>

                          <p className="text-slate-400 font-bold text-sm mt-1">
                            {(module.contents?.length || 0) +
                              (module.resources?.length || 0)}{" "}
                            içerik
                          </p>
                        </div>

                        <span className="px-4 py-2 bg-white rounded-full text-slate-500 font-black text-xs">
                          MODÜL
                        </span>
                      </div>

                      {module.contents?.length > 0 ? (
                        <div className="space-y-3">
                          {module.contents.map((content) => (
                            <div
                              key={content.id || content.icerik_id}
                              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                                <FileText size={20} />
                              </div>

                              <div className="flex-1">
                                <p className="font-black text-slate-950">
                                  {content.title || content.baslik}
                                </p>

                                <p className="text-slate-400 font-bold text-xs mt-1">
                                  İçerik
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-28 h-fit">
            <div className="bg-slate-950 text-white rounded-[2rem] p-7 shadow-xl">
              <p className="text-red-300 font-black text-xs tracking-widest mb-3">
                YÖNETİM DURUMU
              </p>

              <h2 className="text-3xl font-black mb-3">
                {training.durum === "taslak"
                  ? "Eğitim Taslakta"
                  : "Eğitim Yayında"}
              </h2>

              <p className="text-slate-300 font-bold leading-7 mb-6">
                {training.durum === "taslak"
                  ? "Bu eğitim kullanıcılar tarafından henüz görüntülenemez."
                  : "Bu eğitim kullanıcılar tarafından görüntülenebilir."}
              </p>

              <button
                onClick={handleDraftButton}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-700 transition"
              >
                Taslağa Çek
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5">
                <Star size={26} />
              </div>

              <h2 className="text-2xl font-black text-slate-950 mb-4">
                Hızlı Yönetim
              </h2>

              <div className="space-y-3">
                <button
                  onClick={goToAdminContentEdit}
                  className="w-full bg-slate-50 hover:bg-red-50 transition p-4 rounded-2xl flex items-center justify-between font-black text-slate-950"
                >
                  İçerikleri Düzenle
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={goToAdminPreview}
                  className="w-full bg-slate-50 hover:bg-red-50 transition p-4 rounded-2xl flex items-center justify-between font-black text-slate-950"
                >
                  Eğitimi Önizle
                  <ChevronRight size={18} />
                </button>
              </div>
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
                  navigate("/admin/sorular", {
                    state: {
                      trainingId: training.id,
                      trainingTitle: training.title,
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
                      {`${training.quiz.soru_sayisi || 0} Soru • Geçme Notu: %${
                        training.quiz.gecme_notu || 70
                      }`}
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
                  <button onClick={() => navigate("/admin/sertifikalar")}>
                    <ChevronRight className="text-amber-500" />
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

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
              {selectedText.content ||
                selectedText.text ||
                "Metin içeriği bulunamadı."}
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

function InfoCard({ title, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <p className="text-slate-400 font-black text-xs tracking-widest mb-3">
        {title}
      </p>

      <p className="text-slate-950 font-black">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-8">
      <div className="bg-white w-full max-w-6xl rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-slate-950">{title}</h2>

          <button
            onClick={onClose}
            className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center"
          >
            <X size={22} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}