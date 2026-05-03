import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import KullaniciLayout from "../../components/KullaniciLayout";

export default function SoruDetay({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    title = "Soru başlığı",
    message = "Soru içeriği bulunamadı.",
    date = "Bugün",
    status = "pending",
    instructorName = "Eğitmen",
    instructorRole = "Eğitim Uzmanı",
    answerText = "",
    answerTimeAgo = "",
  } = location.state || {};

  const isAnswered = status === "answered";

  return (
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/sorular" searchPlaceholder="Soru detayında ara...">
      <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center mr-4 hover:bg-slate-200"
        >
          <ArrowLeft size={22} className="text-slate-500" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-950">Soru Detayı</h1>
          <p className="text-slate-400 font-bold text-sm">
            Eğitmen yanıtı ve soru içeriği
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-400 font-black text-xs tracking-[3px]">
            SENİN SORUN
          </p>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
            <Clock size={16} />
            {date}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-3xl font-black text-slate-950">{title}</h2>
            <span
              className={`px-4 py-2 rounded-full text-xs font-black ${
                isAnswered
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              {isAnswered ? "YANITLANDI" : "BEKLİYOR"}
            </span>
          </div>
          <p className="text-slate-600 font-semibold leading-8 text-lg whitespace-pre-line">
            {message}
          </p>
        </div>

        {isAnswered ? (
          <>
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <p className="text-emerald-500 font-black text-xs tracking-[3px]">
                EĞİTMEN YANITI
              </p>
            </div>

            <div className="bg-slate-950 text-white rounded-[2rem] p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-7">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                  👨‍💻
                </div>
                <div>
                  <h3 className="text-xl font-black">{instructorName}</h3>
                  <p className="text-white/50 font-black text-xs tracking-widest mt-1">
                    {String(instructorRole).toUpperCase()}
                  </p>
                </div>
              </div>

              <p className="font-semibold leading-9 text-lg whitespace-pre-line mb-8">
                {answerText || "Eğitmen yanıtı bulunamadı."}
              </p>

              <div className="border-t border-white/10 pt-5 flex items-center justify-between">
                <p className="text-white/40 font-black text-xs tracking-widest">
                  {answerTimeAgo || "YANIT TARİHİ YOK"}
                </p>
                <button className="text-red-400 font-black flex items-center gap-2">
                  TEŞEKKÜR ET
                  <Star size={16} fill="currentColor" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border border-orange-100 rounded-[2rem] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-5">
              <Clock size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-950">
              Yanıt bekleniyor
            </h3>
            <p className="text-slate-500 font-semibold mt-2">
              Eğitmen sorunuzu yanıtladığında burada görüntülenecek.
            </p>
          </div>
        )}
      </main>
    </KullaniciLayout>
  );
}