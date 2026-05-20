import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Loader2, Trophy, Zap } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AdminQuizScreen({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const egitimId = id || location.state?.egitimId || "";
  const egitimBaslik = location.state?.egitimBaslik || "Eğitim Quizi";
  const xp = Number(location.state?.xp || 0);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);

  useEffect(() => {
    if (!egitimId) {
      setLoading(false);
      return;
    }

    fetchQuestions();
  }, [egitimId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/quiz/${egitimId}`);
      const data = await res.json();

      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Eğitmen quiz soru hatası:", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const finishQuiz = async (finalScore, total) => {
    try {
      setFinishing(true);

      const res = await fetch(`${BASE_URL}/api/quiz-tamamla`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          egitimId,
          dogruSayisi: finalScore,
          toplamSoru: total,
          kazanilanXp: xp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Quiz tamamlanamadı.");
        navigate(`/egitmen/ogrenme-detay/${egitimId}`);
        return;
      }

      alert(
        data.message ||
          "Quiz tamamlandı. Sertifikan Eğitmen Sertifikalarım sayfasına eklendi."
      );

      navigate("/egitmen/sertifikalar");
    } catch (err) {
      alert("Bir hata oluştu.");
      navigate(`/egitmen/ogrenme-detay/${egitimId}`);
    } finally {
      setFinishing(false);
    }
  };

  const handleAnswer = (key) => {
    if (selectedChoice || finishing) return;

    setSelectedChoice(key);

    const soru = questions[currentIndex];
    if (!soru) return;

    const dogru = String(soru.dogru_cevap || "").toUpperCase().trim();
    const secim = String(key || "").toUpperCase().trim();

    const isCorrect = secim === dogru;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) setScore(newScore);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedChoice(null);
      } else {
        finishQuiz(newScore, questions.length);
      }
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 text-center shadow border border-slate-200">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="font-black text-slate-600">Quiz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!egitimId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-10 text-center shadow border border-slate-200 max-w-md">
          <h1 className="text-2xl font-black text-slate-950 mb-3">
            Eğitim bulunamadı
          </h1>

          <button
            onClick={() => navigate("/egitmen/ogrenme-alanim")}
            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-2xl font-black"
          >
            Öğrenme Alanıma Dön
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-10 text-center shadow border border-slate-200 max-w-md">
          <Trophy size={60} className="text-yellow-500 mx-auto mb-4" />

          <h1 className="text-2xl font-black text-slate-950 mb-3">
            Quiz Tanımlanmamış
          </h1>

          <p className="text-slate-500 font-semibold mb-6">
            Bu eğitime henüz quiz eklenmemiş. Eğitimi direkt tamamlayabilirsin.
          </p>

          <button
            onClick={() => finishQuiz(1, 1)}
            disabled={finishing}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black disabled:opacity-60"
          >
            {finishing ? "İşleniyor..." : "Tamamla ve Sertifika Al"}
          </button>
        </div>
      </div>
    );
  }

  const soru = questions[currentIndex];
  if (!soru) return null;

  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <button
          onClick={() => navigate(`/egitmen/ogrenme-detay/${egitimId}`)}
          className="flex items-center gap-2 text-slate-600 font-black hover:text-red-600 transition"
        >
          <ArrowLeft size={20} />
          Eğitime Dön
        </button>

        <span className="px-4 py-2 bg-red-50 text-red-600 rounded-2xl font-black text-sm">
          {currentIndex + 1} / {questions.length}
        </span>

        {xp > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl font-black text-sm">
            <Zap size={16} />
            {xp} XP
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-slate-950">{egitimBaslik}</p>
            <span className="text-red-600 font-black text-sm">
              %{progress}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <p className="text-red-600 font-black text-xs tracking-[3px] mb-4">
            SORU {currentIndex + 1}
          </p>

          <h2 className="text-2xl font-black text-slate-950 leading-9">
            {soru.soru_metni}
          </h2>
        </div>

        <div className="space-y-3">
          {["a", "b", "c", "d"].map((k) => {
            const metin = soru[`secenek_${k}`];
            if (!metin) return null;

            const KEY = k.toUpperCase();
            const isSelected = selectedChoice === KEY;
            const dogru = String(soru.dogru_cevap || "").toUpperCase().trim();
            const isCorrect = KEY === dogru;

            let btnClass =
              "w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 flex items-center gap-4 text-left transition shadow-sm hover:border-red-300 hover:bg-red-50/40";

            if (isSelected) {
              btnClass = isCorrect
                ? "w-full bg-emerald-50 border border-emerald-300 rounded-[1.5rem] p-5 flex items-center gap-4 text-left transition shadow-sm"
                : "w-full bg-red-50 border border-red-300 rounded-[1.5rem] p-5 flex items-center gap-4 text-left transition shadow-sm";
            }

            return (
              <button
                key={k}
                onClick={() => handleAnswer(KEY)}
                disabled={!!selectedChoice || finishing}
                className={btnClass}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 ${
                    isSelected
                      ? isCorrect
                        ? "bg-emerald-600 text-white"
                        : "bg-red-600 text-white"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {KEY}
                </div>

                <span className="flex-1 font-semibold text-slate-800">
                  {metin}
                </span>

                <ChevronRight
                  size={18}
                  className="text-slate-300 flex-shrink-0"
                />
              </button>
            );
          })}
        </div>

        <div className="bg-slate-950 text-white rounded-[2rem] p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-black text-xs tracking-[3px] mb-1">
              DOĞRU CEVAP
            </p>

            <p className="text-3xl font-black">
              {score}
              <span className="text-slate-500 text-lg">
                {" "}
                / {questions.length}
              </span>
            </p>
          </div>

          <Trophy size={36} className="text-amber-400" />
        </div>
      </main>
    </div>
  );
}