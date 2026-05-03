import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  Send,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { createSupportTicket } from "../../services/api";

const ISSUE_TYPES = [
  "Teknik Sorun",
  "Sertifika",
  "Eğitim İçeriği",
  "Hesap ve Güvenlik",
];

export default function YeniTalep({ user }) {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [issueType, setIssueType] = useState("Teknik Sorun");
  const [description, setDescription] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      alert(
        "Lütfen talep konusu ve detaylı açıklama alanlarını doldur."
      );
      return;
    }

    try {
      setLoading(true);

      await createSupportTicket(
        user.id,
        subject,
        issueType,
        description
      );

      alert("Destek talebin başarıyla oluşturuldu.");

      navigate("/user/teknik-destek");
    } catch (error) {
      alert(
        error.message || "Destek talebi oluşturulamadı."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="h-24 bg-white border-b border-slate-200 px-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-5"
        >
          <ArrowLeft size={22} className="text-slate-500" />
        </button>

        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Yeni Destek Talebi
          </h1>

          <p className="text-slate-400 font-bold mt-2">
            Teknik ekibe yeni destek kaydı oluştur
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-10 py-10">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
          {/* SUBJECT */}
          <div className="mb-7">
            <p className="text-xs font-black tracking-[4px] text-slate-400 mb-4">
              TALEP KONUSU
            </p>

            <div className="h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center px-5 gap-4">
              <FileText size={20} className="text-slate-400" />

              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Sorunu kısaca özetleyin"
                className="bg-transparent outline-none w-full font-bold text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* ISSUE TYPE */}
          <div className="mb-7 relative">
            <p className="text-xs font-black tracking-[4px] text-slate-400 mb-4">
              SORUN TİPİ
            </p>

            <button
              onClick={() =>
                setDropdownOpen((prev) => !prev)
              }
              className="w-full h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between px-5"
            >
              <span className="font-black text-slate-900">
                {issueType}
              </span>

              <ChevronDown
                size={20}
                className="text-slate-400"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-[95px] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                {ISSUE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setIssueType(type);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-5 py-4 text-left font-bold transition ${
                      issueType === type
                        ? "bg-red-50 text-red-600"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mb-8">
            <p className="text-xs font-black tracking-[4px] text-slate-400 mb-4">
              DETAYLI AÇIKLAMA
            </p>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Yaşadığınız sorunu detaylıca anlatın..."
              className="w-full min-h-[240px] rounded-[2rem] bg-slate-50 border border-slate-200 p-6 outline-none resize-none font-semibold text-slate-900 placeholder:text-slate-400 leading-8"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 transition text-white rounded-[2rem] py-6 font-black text-lg flex items-center justify-center gap-4 shadow-xl shadow-red-600/20"
          >
            <Send size={22} />

            {loading
              ? "TALEP GÖNDERİLİYOR..."
              : "TALEBİ GÖNDER"}
          </button>
        </div>
      </main>
    </div>
  );
}