import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import KullaniciLayout from "../../components/KullaniciLayout";

const LIKERT_OPTIONS = [
  { label: "Kesinlikle Katılmıyorum", score: 1 },
  { label: "Katılmıyorum", score: 2 },
  { label: "Kararsızım", score: 3 },
  { label: "Katılıyorum", score: 4 },
  { label: "Kesinlikle Katılıyorum", score: 5 },
];

// ✅ DÜZELTME: setUser prop'u eklendi
export default function AnketCevapla({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const surveyFromState = location.state?.survey || {};

  const [survey, setSurvey] = useState(surveyFromState);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    loadSurvey();
  }, [id]);

  // ✅ DÜZELTME: getSurveyDetail doğrudan burada fetch ile çağrılıyor
  // (api.js'de tanımlı olmayabilir diye inline yazıldı)
  const loadSurvey = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/user/anket/${id}`);
      const data = await response.json();
      setSurvey({
  ...(data.anket || {}),
  ...surveyFromState,
});
      setQuestions(Array.isArray(data.sorular) ? data.sorular : []);
    } catch (error) {
      console.log("Anket detayı alınamadı:", error.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const setAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getQuestionText = (question) => {
    return question?.soru_metni || question?.question || "Soru metni bulunamadı.";
  };

  const isTextQuestion = (question) => {
    const text = getQuestionText(question).toLowerCase();
    return (
      text.includes("önerdiğiniz alanlar") ||
      text.includes("görüşler") ||
      text.includes("eklemek istediğiniz")
    );
  };

  const goNext = () => {
    if (!currentQuestion) return;

    const questionId = currentQuestion.anket_soru_id;
    const value = answers[questionId];

    if (!value) {
      alert("Bu soru zorunludur. Lütfen cevap ver.");
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const goBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  // ✅ DÜZELTME: submitSurvey doğrudan burada fetch ile çağrılıyor
  const handleSubmit = async () => {
    try {
      setSending(true);

      const payload = questions.map((question) => {
        const questionId = question.anket_soru_id;
        const value = answers[questionId];

        if (typeof value === "object") {
          return { questionId, answer: value.label, score: value.score };
        }
        return { questionId, answer: value, score: null };
      });

      const is360 = survey?.is360 === true;

const endpoint = is360
  ? `${BASE_URL}/api/user/360-cevapla`
  : `${BASE_URL}/api/user/anket-cevapla`;

const body = is360
  ? {
      userId: user?.id,
      atamaId: survey.atamaId,
      anketId: Number(id),
      answers: payload,
    }
  : {
      userId: user?.id,
      anketId: Number(id),
      answers: payload,
    };

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Anket gönderilemedi.");
      }

      alert(
  survey?.is360
    ? "360 değerlendirme başarıyla gönderildi."
    : "Anket yanıtların başarıyla gönderildi."
);
      navigate("/user/anketler");
    } catch (error) {
      alert(error.message || "Anket gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-600">Anket yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-950 mb-3">
            Anket sorusu bulunamadı
          </h2>
          <button
            onClick={() => navigate("/user/anketler")}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black"
          >
            Anketlerime Dön
          </button>
        </div>
      </div>
    );
  }

  const questionId = currentQuestion.anket_soru_id;
  const selectedValue = answers[questionId];
  const textQuestion = isTextQuestion(currentQuestion);

  return (
    // ✅ DÜZELTME: user ve setUser doğru geçiliyor
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/anketler" searchPlaceholder="Anket sorularında ara...">
      <header className="h-20 px-10 flex items-center justify-between border-b border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center"
        >
          <ArrowLeft size={22} className="text-slate-500" />
        </button>

        <div className="text-right">
          <p className="text-slate-400 font-black text-xs tracking-[3px]">
            {survey?.is360
  ? `360 • ${survey?.hedefAdi || ""}`
  : survey?.baslik || "DEĞERLENDİRME ANKETİ"}
          </p>
          <p className="text-slate-950 font-black">
            {currentIndex + 1} / {questions.length}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-10 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-950 mb-6">
  {survey?.is360 ? "360 Değerlendirme" : "Açıklama"}
</h1>
          {survey?.is360 && (
  <div className="bg-purple-50 border border-purple-100 rounded-[2rem] p-6 mb-8">
    <p className="text-purple-600 font-black text-xs tracking-[3px] mb-2">
      ŞU KİŞİYİ DEĞERLENDİRİYORSUN
    </p>

    <h3 className="text-3xl font-black text-slate-950">
      {survey.hedefAdi || "-"}
    </h3>

    <p className="text-slate-500 font-semibold mt-1">
      {survey.hedefDepartman || "-"}
    </p>

    <p className="text-slate-600 font-bold mt-5 leading-7">
      Aşağıdaki soruları bu kişi için cevapla. Seçtiğin puanlar
      yöneticinin 360 analiz ekranında bu kişiye ait değerlendirme olarak görünecek.
    </p>
  </div>
)}
          <p className="text-lg font-semibold text-slate-700 mb-4">
            <span className="text-red-600 text-3xl font-black mr-2">*</span>
            İşaretli sorular zorunlu sorulardır.
          </p>
          <p className="text-slate-700 font-black text-lg">
            Toplam {questions.length} sorudan {currentIndex + 1}. soruyu cevaplıyorsun.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-6 w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black">
            {currentIndex + 1}
          </div>

          <div className="bg-white rounded-[2rem] p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-100 min-h-[360px]">
            <h2 className="text-2xl font-semibold text-slate-800 leading-9 mb-8">
              <span className="text-red-600 text-3xl font-black mr-3">*</span>
              {getQuestionText(currentQuestion)}
            </h2>

            {textQuestion ? (
              <div>
                <textarea
                  value={typeof selectedValue === "string" ? selectedValue : ""}
                  onChange={(e) => {
                    if (e.target.value.length <= 4000) {
                      setAnswer(questionId, e.target.value);
                    }
                  }}
                  placeholder="Cevabınızı yazınız"
                  className="w-full min-h-[180px] border border-slate-300 rounded-2xl p-5 outline-none resize-none text-lg font-semibold text-slate-800 placeholder:text-slate-400"
                />
                <p className="text-right text-slate-400 font-bold mt-2">
                  {typeof selectedValue === "string" ? selectedValue.length : 0} / 4000
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {LIKERT_OPTIONS.map((option) => {
                  const active =
                    typeof selectedValue === "object" &&
                    selectedValue?.score === option.score;

                  return (
                    <button
                      key={option.score}
                      onClick={() => setAnswer(questionId, option)}
                      className="flex items-center gap-4 text-left group"
                    >
                      <span
                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                          active
                            ? "border-red-600 bg-red-600"
                            : "border-slate-400 bg-white"
                        }`}
                      >
                        {active && <span className="w-3 h-3 bg-white rounded-full" />}
                      </span>
                      <span className="text-xl font-semibold text-slate-900 group-hover:text-red-600">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button
            onClick={() => navigate("/user/anketler")}
            className="px-8 py-4 rounded-2xl border border-slate-900 text-slate-900 font-black"
          >
            KAPAT
          </button>

          {currentIndex > 0 && (
            <button
              onClick={goBack}
              className="px-8 py-4 rounded-2xl border border-slate-900 text-slate-900 font-black flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              GERİ
            </button>
          )}

          <button
            onClick={goNext}
            disabled={sending}
            className="px-8 py-4 rounded-2xl bg-slate-950 text-white font-black flex items-center gap-2 disabled:bg-slate-300"
          >
            {sending ? (
              "GÖNDERİLİYOR..."
            ) : isLastQuestion ? (
              <>
                {survey?.is360 ? "DEĞERLENDİRMEYİ GÖNDER" : "GÖNDER"}
                <CheckCircle2 size={18} />
              </>
            ) : (
              <>
                İLERİ
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </main>
    </KullaniciLayout>
  );
}
