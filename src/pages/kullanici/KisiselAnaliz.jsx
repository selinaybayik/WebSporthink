import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Brain,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getPersonalAnalysis } from "../../services/api";

export default function KisiselAnaliz({ user }) {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, [user?.id]);

  const loadAnalysis = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data = await getPersonalAnalysis(user.id);

      setAnalysis(data);
    } catch (error) {
      console.log(error.message);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <p className="font-black text-slate-700">
            Kişisel analiz yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="font-black text-slate-900 mb-5">
            Analiz verisi alınamadı.
          </p>

          <button
            onClick={loadAnalysis}
            className="bg-red-600 text-white px-6 py-4 rounded-2xl font-black"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const overview = analysis.overview || {};
  const skills = analysis.competencies || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="bg-slate-950 rounded-b-[3rem] px-10 pt-8 pb-12">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mr-5"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-3xl font-black text-white">
              Kişisel Analiz
            </h1>

            <p className="text-slate-400 font-bold mt-2">
              {analysis.user?.department} • {analysis.user?.role}
            </p>
          </div>
        </div>
      </div>

      <main className="px-10 -mt-8 pb-12">
        {/* OVERVIEW */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center">
              <TrendingUp size={28} className="text-white" />
            </div>

            <div>
              <p className="text-xs font-black tracking-[4px] text-slate-400 mb-2">
                GENEL PERFORMANS
              </p>

              <h2 className="text-5xl font-black text-slate-950">
                %{overview.successRate || 0}
              </h2>
            </div>
          </div>

          <p className="text-slate-500 leading-8 font-semibold text-lg">
            Tamamladığın eğitimler, rozetlerin ve XP durumuna göre
            kişisel gelişim performansın hesaplandı.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          <StatCard
            icon={<Zap size={24} />}
            value={overview.xp || 0}
            label="Toplam XP"
          />

          <StatCard
            icon={<Trophy size={24} />}
            value={overview.badges || 0}
            label="Rozet"
          />

          <StatCard
            icon={<Brain size={24} />}
            value={overview.completedCount || 0}
            label="Tamamlanan"
          />
        </div>

        {/* SKILLS */}
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm mb-10">
          <p className="text-xs font-black tracking-[4px] text-red-500 mb-8">
            YETKİNLİK ANALİZİ
          </p>

          <div className="space-y-6">
            {skills.map((item) => (
              <div key={item.title}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="font-black text-slate-950">
                    %{item.progress}
                  </p>
                </div>

                <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: item.color || "#DC2626",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI */}
        <div className="bg-slate-950 text-white rounded-[2rem] p-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center">
              <Bot size={26} />
            </div>

            <div>
              <p className="text-red-400 text-xs font-black tracking-[4px] mb-2">
                AI GELİŞİM ÖNERİSİ
              </p>

              <h2 className="text-2xl font-black">
                Sporthink AI Analizi
              </h2>
            </div>
          </div>

          <p className="text-slate-300 leading-8 font-semibold text-lg">
            {analysis.aiSuggestion ||
              "Gelişim önerisi oluşturulamadı."}
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
        {icon}
      </div>

      <h2 className="text-4xl font-black text-slate-950 mb-2">
        {value}
      </h2>

      <p className="text-slate-500 font-bold">{label}</p>
    </div>
  );
}