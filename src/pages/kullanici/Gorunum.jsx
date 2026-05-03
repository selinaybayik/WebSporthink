import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Gorunum() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  const options = [
    {
      type: "light",
      title: "Aydınlık Mod",
      sub: "Göz yormayan açık tema",
      icon: Sun,
    },
    {
      type: "dark",
      title: "Karanlık Mod",
      sub: "Yüksek kontrastlı koyu tema",
      icon: Moon,
    },
    {
      type: "system",
      title: "Sistem Varsayılanı",
      sub: "Cihaz ayarlarına göre değişir",
      icon: Monitor,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center mr-4"
        >
          <ArrowLeft size={22} className="text-slate-500" />
        </button>

        <div>
          <h1 className="text-xl font-black text-slate-950">Görünüm</h1>
          <p className="text-slate-400 font-bold text-sm">
            Tema tercihlerini yönet
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-10">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <p className="text-xs font-black tracking-[4px] text-red-500 mb-6">
            TEMA SEÇİMİ
          </p>

          <div className="grid gap-5">
            {options.map((option) => {
              const Icon = option.icon;
              const active = theme === option.type;

              return (
                <button
                  key={option.type}
                  onClick={() => setTheme(option.type)}
                  className={`flex items-center gap-5 p-6 rounded-[2rem] border transition text-left ${
                    active
                      ? "bg-red-50 border-red-300"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      active
                        ? "bg-red-600 text-white"
                        : "bg-white text-slate-400"
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-black text-slate-950">
                      {option.title}
                    </h2>
                    <p className="text-slate-500 font-semibold mt-1">
                      {option.sub}
                    </p>
                  </div>

                  {active && (
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                      <Check size={18} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}