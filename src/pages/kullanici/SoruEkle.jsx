import React, { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { createQuestion } from "../../services/api";
import KullaniciLayout from "../../components/KullaniciLayout";

// ✅ DÜZELTME: setUser prop'u eklendi
export default function SoruEkle({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { trainingId, trainingTitle } = location.state || {};

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !question.trim()) {
      alert("Lütfen soru başlığı ve soru detayını doldur.");
      return;
    }

    if (!trainingId || !user?.id) {
      alert("Eğitim veya kullanıcı bilgisi bulunamadı. Lütfen tekrar deneyin.");
      return;
    }

    try {
      setSending(true);

      await createQuestion({
        egitimId: trainingId,
        userId: user.id,
        baslik: title.trim(),
        soruMetni: question.trim(),
      });

      alert("Sorun eğitmene iletildi. Yanıt geldiğinde sana bildirim gönderilecek.");
      navigate(-1);
    } catch (error) {
      alert(error.message || "Soru gönderilirken bir sorun oluştu.");
    } finally {
      setSending(false);
    }
  };

  return (
    // ✅ DÜZELTME: setUser prop'u eklendi
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/sorular" searchPlaceholder="Yeni soru oluştur...">
      <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center mr-4 hover:bg-slate-200"
        >
          <ArrowLeft size={22} className="text-slate-500" />
        </button>

        <div>
          <h1 className="text-xl font-black text-slate-950">Yeni Soru</h1>
          {trainingTitle && (
            <p className="text-slate-400 font-bold text-sm">{trainingTitle}</p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-10">
        {!trainingId && (
          <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 mb-8">
            <p className="text-orange-700 font-bold">
              Eğitim bilgisi bulunamadı. Lütfen eğitim detayından soru sorma ekranına geç.
            </p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <label className="block text-slate-400 font-black text-xs tracking-[3px] mb-3">
            SORU BAŞLIĞI
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={sending}
            placeholder="Örn: Modül 2 hakkında yardım"
            className="w-full bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-slate-900 outline-none border border-transparent focus:border-red-300 mb-8"
          />

          <label className="block text-slate-400 font-black text-xs tracking-[3px] mb-3">
            SORUN NEDİR?
          </label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={sending}
            placeholder="Lütfen sorunu detaylıca buraya yaz..."
            rows={9}
            className="w-full bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-slate-900 outline-none border border-transparent focus:border-red-300 resize-none"
          />

          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="bg-red-600 disabled:bg-slate-300 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-red-600/20"
            >
              <Send size={20} />
              {sending ? "Gönderiliyor..." : "Soruyu Gönder"}
            </button>
          </div>
        </div>
      </main>
    </KullaniciLayout>
  );
}
