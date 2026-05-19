import React from "react";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Clock3,
  PlayCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import KullaniciLayout from "../../components/KullaniciLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// ✅ DÜZELTME: user ve setUser prop'ları eklendi
export default function AnketDetay({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const survey = location.state?.survey || {};
  const is360 = survey.is360 === true;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    // ✅ DÜZELTME: user ve setUser doğru geçiliyor
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/anketler" searchPlaceholder="Anket detayında ara...">
      {/* HEADER */}
      <header className="h-24 bg-white border-b border-slate-200 px-10 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-5 hover:bg-slate-200 transition"
          >
            <ArrowLeft size={22} className="text-slate-500" />
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-950">Anket Detayı</h1>
            <p className="text-slate-400 font-bold mt-2">
              Kurumsal değerlendirme ve geri bildirim formu
            </p>
          </div>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-orange-50 text-orange-600 font-black text-xs tracking-[2px]">
          BEKLİYOR
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10 py-10">
        {/* HERO */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-red-700 rounded-[2.5rem] p-10 text-white mb-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center justify-between gap-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-xs font-black tracking-[3px] mb-6">
                <ClipboardList size={15} />
                {is360
  ? "360 DERECE DEĞERLENDİRME"
  : "GERİ BİLDİRİM ANKETİ"}
              </div>

              <h2 className="text-5xl font-black leading-tight mb-5">
                {survey.baslik || "Eğitim Memnuniyet Değerlendirmesi"}
              </h2>

              <p className="text-slate-200 text-lg leading-8 font-semibold">
               {is360 ? (
  <>
    <p>
      Bu görev kapsamında çalışma arkadaşını belirli yetkinlikler
      açısından değerlendireceksin.
    </p>

    <p>
      Yanıtların gelişim ve performans analizlerinde kullanılacaktır.
    </p>

    <div className="bg-purple-50 border border-purple-100 rounded-[2rem] p-6 mt-5">
      <p className="text-purple-700 font-black text-sm tracking-[2px] mb-2">
        DEĞERLENDİRİLECEK KİŞİ
      </p>

      <h4 className="text-2xl font-black text-slate-950">
        {survey.hedefAdi || "-"}
      </h4>

      <p className="text-slate-500 font-semibold">
        {survey.hedefDepartman || "Departman bilgisi yok"}
      </p>
    </div>
  </>
) : (
  <>
    <p>
      Eğitim deneyimini geliştirmek için görüşlerin bizim için çok
      değerli.
    </p>

    <p>
      Vereceğin yanıtlar yöneticiler ve eğitim ekipleri tarafından
      analizlerde kullanılabilir.
    </p>

    <p>
      Samimi geri bildirimlerin kurum gelişimine katkı sağlar.
    </p>
  </>
)}
              </p>

              <div className="flex items-center gap-8 mt-8">
                <div className="flex items-center gap-3">
                  <Calendar size={20} />
                  <div>
                    <p className="text-xs font-black tracking-[2px] text-slate-300">ATANMA TARİHİ</p>
                    <p className="font-bold">{formatDate(survey.atanma_tarihi)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 size={20} />
                  <div>
                    <p className="text-xs font-black tracking-[2px] text-slate-300">TAHMİNİ SÜRE</p>
                    <p className="font-bold">3-5 Dakika</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden xl:flex w-44 h-44 rounded-[3rem] bg-white/10 backdrop-blur-sm items-center justify-center border border-white/10">
              <ClipboardList size={80} />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-7">
                <Sparkles size={22} className="text-red-600" />
                <h3 className="text-3xl font-black text-slate-950">Açıklama</h3>
              </div>

              <div className="space-y-6 text-slate-600 font-semibold text-lg leading-9">
                <p>
                  Bu değerlendirme formu; eğitim içeriklerinin kalitesini,
                  öğrenme deneyimini ve gelişim süreçlerini iyileştirmek amacıyla hazırlanmıştır.
                </p>
                <p>
                  Vereceğin yanıtlar yöneticiler ve eğitim ekipleri tarafından
                  anonim analizlerde kullanılabilir.
                </p>
                <p>
                  Samimi ve objektif geri bildirimlerin, kurum içi gelişim
                  süreçlerine doğrudan katkı sağlayacaktır.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-7">
                <ShieldCheck size={22} className="text-emerald-600" />
                <h3 className="text-3xl font-black text-slate-950">Bilgilendirme</h3>
              </div>

              <div className="space-y-5">
                <InfoRow text="Tüm zorunlu sorular cevaplanmalıdır." />
                <InfoRow text="Anket tamamlandıktan sonra tekrar düzenlenemez." />
                <InfoRow text="Yanıtlar gelişim ve analiz amaçlı kullanılır." />
                <InfoRow text="Tahmini tamamlanma süresi 5 dakikadan kısadır." />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <p className="text-xs font-black tracking-[4px] text-slate-400 mb-4">ANKET DURUMU</p>
              <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden mb-5">
                <div className="w-[10%] h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-950">Başlanmadı</p>
                <p className="font-black text-red-600">%0</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-red-600/20">
              <p className="text-xs font-black tracking-[4px] text-red-100 mb-4">SON ADIM</p>
              <h3 className="text-3xl font-black leading-tight mb-5">Ankete Hazır mısın?</h3>
              <p className="text-red-100 font-semibold leading-8 mb-8">
                Değerlendirmeyi başlatarak geri bildirim sürecine katkıda bulunabilirsin.
              </p>

              <button
                onClick={() =>
                  navigate(`/user/anket-cevapla/${id}`, {
  state: {
    survey: {
      ...survey,
      is360,
      atamaId: survey.atamaId,
    },
  },
})
                }
                className="w-full bg-white hover:bg-slate-100 transition text-red-600 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl"
              >
                <PlayCircle size={22} />
                ANKETİ BAŞLAT
              </button>
            </div>
          </div>
        </div>
      </main>
    </KullaniciLayout>
  );
}

function InfoRow({ text }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
      <div className="w-3 h-3 rounded-full bg-red-600 mt-2" />
      <p className="font-semibold text-slate-700 leading-7">{text}</p>
    </div>
  );
}
