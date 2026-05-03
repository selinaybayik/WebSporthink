import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Plus,
  Wrench,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getSupportTickets } from "../../services/api";

export default function TeknikDestek({ user }) {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [user?.id]);

  const loadTickets = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data = await getSupportTickets(user.id);

      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error.message);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (
      normalized === "cozuldu" ||
      normalized === "çözüldü" ||
      normalized === "resolved"
    ) {
      return {
        label: "ÇÖZÜLDÜ",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
      };
    }

    return {
      label: "İNCELENİYOR",
      bg: "bg-orange-50",
      text: "text-orange-600",
    };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="h-24 bg-white border-b border-slate-200 px-10 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-5"
          >
            <ArrowLeft size={22} className="text-slate-500" />
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-950">
              Teknik Destek
            </h1>

            <p className="text-slate-400 font-bold mt-2">
              Destek talepleri ve yardım merkezi
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/user/yeni-talep")}
          className="bg-red-600 hover:bg-red-700 transition text-white px-7 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-red-600/20"
        >
          <Plus size={20} />
          Yeni Talep
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-10 py-10">
        {/* HELP */}
        <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center">
            <MessageSquare size={34} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-950 mb-3">
              Nasıl yardımcı olabiliriz?
            </h2>

            <p className="text-slate-500 font-semibold text-lg leading-8">
              Teknik ekibimiz genellikle 24 saat içerisinde geri dönüş
              sağlamaktadır.
            </p>
          </div>
        </div>

        {/* TITLE */}
        <div className="flex items-center gap-3 mb-6">
          <Wrench size={18} className="text-red-600" />

          <p className="text-xs font-black tracking-[4px] text-slate-400">
            GEÇMİŞ TALEPLERİN
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="bg-white rounded-[2rem] p-14 text-center border border-slate-200">
            <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

            <p className="font-black text-slate-600">
              Talepler yükleniyor...
            </p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 p-10 text-center">
            <h2 className="text-2xl font-black text-slate-950 mb-3">
              Henüz destek talebin yok
            </h2>

            <p className="text-slate-500 font-semibold leading-8 text-lg">
              Yaşadığın bir sorun varsa yeni destek talebi oluşturabilirsin.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {tickets.map((ticket) => {
              const isOpen = openId === ticket.id;
              const status = getStatusInfo(ticket.status);

              return (
                <button
                  key={ticket.id}
                  onClick={() =>
                    setOpenId(isOpen ? null : ticket.id)
                  }
                  className="w-full bg-white border border-slate-200 rounded-[2rem] p-7 text-left shadow-sm hover:border-red-200 transition"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide ${status.bg} ${status.text}`}
                    >
                      {status.label}
                    </div>

                    <p className="text-sm font-bold text-slate-400">
                      {ticket.date}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1 pr-6">
                      <h2 className="text-2xl font-black text-slate-950 leading-9">
                        {ticket.title}
                      </h2>
                    </div>

                    <div className="text-slate-400">
                      {isOpen ? (
                        <ChevronUp size={22} />
                      ) : (
                        <ChevronDown size={22} />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <p className="text-xs font-black tracking-[3px] text-slate-400 mb-3">
                        {ticket.issue_type}
                      </p>

                      <p className="text-slate-500 font-semibold leading-8 text-lg">
                        {ticket.detail}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={() => navigate("/user/yeni-talep")}
          className="mt-10 w-full bg-slate-950 hover:bg-red-600 transition text-white rounded-[2rem] py-6 font-black text-lg shadow-xl"
        >
          YENİ DESTEK TALEBİ AÇ
        </button>
      </main>
    </div>
  );
}