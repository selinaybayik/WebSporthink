import React, { useEffect, useState } from "react";
import KullaniciLayout from "../../components/KullaniciLayout";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ClipboardList,
  Compass,
  Home,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  Trophy,
  User,
  Target,
  BrainCircuit,
  Rocket,
  CheckCircle2,
  ArrowRight,
  UserRound,
  Route,
  Flag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoadmap } from "../../services/api";

export default function YolHaritam({ user, setUser }) {
  const navigate = useNavigate();

  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmap();
  }, [user?.id]);

  const loadRoadmap = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getRoadmap(user.id);
      setRoadmapData(data);
    } catch (error) {
      console.log("Yol haritası yüklenemedi:", error.message);
      setRoadmapData(null);
    } finally {
      setLoading(false);
    }
  };

  const kurumAtamalari = roadmapData?.assignments || [];
  const yolAdimlari = roadmapData?.roadmap || [];

  const tamamlananSayisi = yolAdimlari.filter(
    (x) => Number(x.progress) === 100 || x.label === "TAMAMLANDI"
  ).length;

  const genelIlerleme =
    yolAdimlari.length > 0
      ? Math.round(
          yolAdimlari.reduce(
            (acc, item) => acc + Number(item.progress || 0),
            0
          ) / yolAdimlari.length
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-600">Yol haritan yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <KullaniciLayout
      user={user}
      setUser={setUser}
      activePath="/user/yol-haritam"
      searchPlaceholder="Yol haritasında ara..."
    >
      <main className="flex-1 bg-[#F8FAFC] min-h-screen">
        <section className="p-8 xl:p-10 space-y-8">
          <div className="relative overflow-hidden bg-white rounded-[2.5rem] border border-slate-200 p-8 xl:p-10 shadow-sm">
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-red-50 rounded-full blur-3xl" />
            <div className="absolute right-40 bottom-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
              <div>
                <p className="text-red-500 font-black tracking-[3px] text-xs mb-4">
                  KİŞİSEL GELİŞİM ROTAN
                </p>

                <h1 className="text-5xl font-black text-slate-950 mb-4 leading-tight">
                  Gelişim Planım 🧭
                </h1>

                <p className="text-slate-500 text-lg font-semibold leading-8 max-w-3xl">
                  Kurum atamalarını ve kendi seçtiğin öğrenme adımlarını buradan takip et.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <InfoPill icon={ShieldCheck} text="Atamaları takip et" color="red" />
                <InfoPill icon={Route} text="Rotanı gör" color="blue" />
                <InfoPill icon={Flag} text="Hedefe ilerle" color="emerald" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <ModernStatCard
              title="Kurum Ataması"
              value={kurumAtamalari.length}
              icon={ShieldCheck}
              color="red"
              desc="Sana atanan eğitimler"
            />

            <ModernStatCard
              title="Yol Adımı"
              value={yolAdimlari.length}
              icon={Map}
              color="blue"
              desc="Rotandaki toplam adım"
            />

            <ModernStatCard
              title="Tamamlanan"
              value={tamamlananSayisi}
              icon={CheckCircle2}
              color="emerald"
              desc="Başarıyla tamamlananlar"
            />

            <ModernStatCard
              title="Genel İlerleme"
              value={`%${genelIlerleme}`}
              icon={Rocket}
              color="amber"
              desc="Gelişim durumun"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-7 shadow-sm">
                <div className="flex items-center justify-between mb-7">
                  <PanelTitle icon={ShieldCheck} title="Kurum Atamaları" />

                  <span className="px-4 py-2 rounded-2xl bg-red-50 text-red-600 text-xs font-black">
                    {kurumAtamalari.length} EĞİTİM
                  </span>
                </div>

                {kurumAtamalari.length === 0 ? (
                  <EmptyCard
                    title="Atanmış eğitim yok"
                    text="Kurum tarafından atanan eğitimler burada görünecek."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {kurumAtamalari.map((item) => (
                      <AssignmentCard
                        key={String(item.id)}
                        item={item}
                        onClick={() => navigate(`/user/egitim-detay/${item.id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <PanelTitle icon={Compass} title="Öğrenme Rotan" />

                  <button
  onClick={() =>
    navigate("/user/egitimler", {
      state: {
        openSource: "Keşfet",
      },
    })
  }
  className="px-4 py-2 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-100 transition"
>
  + KATALOG
</button>
                </div>

                {yolAdimlari.length === 0 ? (
                  <EmptyCard
                    title="Yol haritan boş"
                    text="Katalogdan eğitim ekleyerek gelişim planını oluşturabilirsin."
                  />
                ) : (
                  <div className="relative">
                    <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-red-100 hidden md:block" />

                    <div className="space-y-5">
                      {yolAdimlari.map((item, index) => {
                        const isCompleted =
                          item.label === "TAMAMLANDI" ||
                          Number(item.progress) === 100;

                        const progress = Number(item.progress) || 0;

                        return (
                          <button
                            key={String(item.id)}
                            onClick={() => navigate(`/user/egitim-detay/${item.id}`)}
                            className="relative w-full grid grid-cols-1 md:grid-cols-[90px_1fr_auto] gap-5 items-center bg-slate-50 hover:bg-white border border-slate-100 hover:border-red-200 rounded-[2rem] p-5 transition-all duration-300 text-left group"
                          >
                            <div className="hidden md:flex items-center justify-center relative z-10">
                              <div className="w-16 h-16 rounded-full bg-white border border-red-100 text-red-600 flex items-center justify-center font-black text-xl shadow-sm">
                                {String(index + 1).padStart(2, "0")}
                              </div>
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                    isCompleted
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {item.label || "SEN EKLEDİN"}
                                </span>

                                <span className="text-slate-300 text-xs font-black">
                                  {isCompleted ? "TAMAMLANDI" : "DEVAM EDİYOR"}
                                </span>
                              </div>

                              <h3 className="text-2xl font-black text-slate-950 mb-3 group-hover:text-red-600 transition">
                                {item.title}
                              </h3>

                              <div className="flex items-center gap-3">
                                <UserRound size={16} className="text-slate-400" />
                                <p className="text-slate-500 font-semibold text-sm">
                                  Atanan: Yönetici
                                </p>
                              </div>
                            </div>

                            <div className="md:min-w-[230px]">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-slate-950 font-black">
                                  %{progress}
                                </span>

                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      isCompleted ? "bg-emerald-500" : "bg-red-600"
                                    }`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <span className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-2xl font-black text-sm group-hover:bg-red-700 transition">
                                  Devam Et
                                  <ChevronRight size={17} />
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-7 shadow-sm sticky top-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Bot size={23} />
                  </div>

                  <div>
                    <p className="text-red-500 text-xs font-black tracking-[3px]">
                      AI YOL KOÇU
                    </p>
                    <h3 className="text-xl font-black text-slate-950 mt-1">
                      Rota Önerisi
                    </h3>
                  </div>
                </div>

                <p className="text-slate-500 font-semibold leading-7 mb-6">
                  {roadmapData?.aiText ||
                    "Kariyer hedefine uygun yeni bir adım eklemek için AI asistandan öneri alabilirsin."}
                </p>

                <button
                  onClick={() =>
                    navigate("/user/asistan", {
                      state: {
                        source: "roadmap",
                        prompt:
                          "Bana kariyer hedefime uygun yeni bir yol haritası adımı öner.",
                      },
                    })
                  }
                  className="w-full bg-red-600 hover:bg-red-700 transition text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  <Sparkles size={18} />
                  Yol Haritama Adım Öner
                  <ArrowRight size={18} />
                </button>

                <div className="mt-7 pt-7 border-t border-slate-100 space-y-4">
                  <SmallFeature
                    icon={BrainCircuit}
                    title="Eksik konuları gör"
                    text="Gelişim alanlarını belirle"
                  />

                  <SmallFeature
                    icon={Compass}
                    title="Sıranı planla"
                    text="Eğitimleri doğru sıraya koy"
                  />

                  <SmallFeature
                    icon={Target}
                    title="Hedefe bağla"
                    text="Kariyer rotana uygun ilerle"
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </KullaniciLayout>
  );
}

function InfoPill({ icon: Icon, text, color }) {
  const colors = {
    red: "bg-red-50 text-red-600 border-red-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div
      className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 border ${colors[color]}`}
    >
      <Icon size={18} />
      {text}
    </div>
  );
}

function ModernStatCard({ title, value, icon: Icon, color, desc }) {
  const colors = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 p-7 shadow-sm hover:shadow-md transition">
      <div
        className={`w-14 h-14 rounded-2xl ${colors[color]} flex items-center justify-center mb-6`}
      >
        <Icon size={27} />
      </div>

      <p className="text-slate-400 text-xs font-black tracking-[3px] uppercase">
        {title}
      </p>

      <h3 className="text-4xl font-black text-slate-950 mt-3">{value}</h3>

      <p className="text-slate-500 font-semibold mt-3">{desc}</p>
    </div>
  );
}

function AssignmentCard({ item, onClick }) {
  const progress = Number(item.progress) || 0;

  return (
    <button
      onClick={onClick}
      className="bg-white border border-red-100 rounded-[2rem] p-6 text-left shadow-sm hover:border-red-300 hover:shadow-md transition group"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-black">
          {item.label || "ATANDI"}
        </span>

        <span className="text-slate-300 text-xs font-black">ATANAN</span>
      </div>

      <h3 className="text-xl font-black text-slate-950 mb-6 group-hover:text-red-600 transition">
        {item.title}
      </h3>

      <div className="flex items-center gap-3">
        <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-slate-400 font-black text-xs">%{progress}</span>

        <div className="flex-1" />

        <span className="text-red-600 font-black text-xs">DEVAM ET</span>
        <ChevronRight size={16} className="text-red-600" />
      </div>
    </button>
  );
}

function PanelTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
        <Icon size={18} />
      </div>

      <h2 className="text-sm font-black tracking-[3px] text-slate-500">
        {title.toUpperCase()}
      </h2>
    </div>
  );
}

function EmptyCard({ title, text }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8">
      <h3 className="text-xl font-black text-slate-950 mb-2">{title}</h3>
      <p className="text-slate-400 font-bold leading-6">{text}</p>
    </div>
  );
}

function SmallFeature({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-slate-50 text-red-600 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>

      <div>
        <h4 className="font-black text-slate-950">{title}</h4>
        <p className="text-slate-500 font-semibold text-sm mt-1">{text}</p>
      </div>
    </div>
  );
}