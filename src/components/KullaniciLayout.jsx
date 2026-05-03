import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  ClipboardList,
  Home,
  LogOut,
  Map,
  Medal,
  Megaphone,
  Menu,
  MessageCircle,
  Search,
  Settings,
  Trophy,
  User,
  X,
} from "lucide-react";

export default function KullaniciLayout({
  user,
  setUser,
  activePath,
  searchPlaceholder = "Sistem içinde ara...",
  children,
}) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuSections = [
    {
      title: "ÖĞRENME",
      items: [
        { label: "Ana Sayfa", icon: Home, path: "/user/dashboard" },
        { label: "Eğitimlerim", icon: BookOpen, path: "/user/egitimler" },
        { label: "Yol Haritam", icon: Map, path: "/user/yol-haritam" },
        { label: "Sertifikalarım", icon: Award, path: "/user/sertifikalar" },
      ],
    },
    {
      title: "GÖREVLER & İLETİŞİM",
      items: [
        { label: "Duyurularım", icon: Megaphone, path: "/user/duyurular" },
        { label: "Anketlerim", icon: ClipboardList, path: "/user/anketler" },
        { label: "Sorularım", icon: MessageCircle, path: "/user/sorular" },
        { label: "AI Asistan", icon: Bot, path: "/user/asistan" },
        { label: "Bildirimler", icon: Bell, path: "/user/bildirimler" },
      ],
    },
    {
      title: "OYUNLAŞTIRMA",
      items: [
        { label: "Liderlik Tablosu", icon: Trophy, path: "/user/liderlik" },
        { label: "Rozetlerim", icon: Medal, path: "/user/rozetler" },
      ],
    },
    {
      title: "HESAP",
      items: [
        { label: "Profilim", icon: User, path: "/user/profil" },
        { label: "Ayarlar", icon: Settings, path: "/user/ayarlar" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`bg-slate-950 text-white min-h-screen fixed left-0 top-0 z-50 transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-24"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black shrink-0">
              S
            </div>

            {sidebarOpen && (
              <span className="font-black italic text-xl whitespace-nowrap">
                SPORTHINK
              </span>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="h-[calc(100vh-210px)] overflow-y-auto px-4 py-6 custom-scroll">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-7">
              {sidebarOpen && (
                <p className="text-[11px] tracking-[4px] text-slate-500 font-black px-3 mb-3">
                  {section.title}
                </p>
              )}

              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePath === item.path;

                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      title={!sidebarOpen ? item.label : ""}
                      className={`w-full flex items-center ${
                        sidebarOpen
                          ? "justify-start gap-3 px-4"
                          : "justify-center px-0"
                      } py-3 rounded-xl font-bold text-sm transition ${
                        active
                          ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                          : "text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={20} className="shrink-0" />

                      {sidebarOpen && (
                        <span className="whitespace-nowrap">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[130px] p-5 border-t border-white/10 bg-slate-950">
          {sidebarOpen ? (
            <>
              <p className="text-[11px] text-red-400 font-black tracking-widest">
                ÖĞRENEN
              </p>

              <p className="font-bold text-sm mb-4 truncate">
                {user?.name || "Kullanıcı"}
              </p>

              <button
                onClick={() => setUser(null)}
                className="w-full py-3 rounded-xl border border-red-500/40 text-red-300 font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition"
              >
                <LogOut size={18} />
                Güvenli Çıkış
              </button>
            </>
          ) : (
            <button
              onClick={() => setUser(null)}
              title="Güvenli Çıkış"
              className="w-full h-12 rounded-xl border border-red-500/40 text-red-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
            >
              <LogOut size={19} />
            </button>
          )}
        </div>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-72" : "ml-24"
        }`}
      >
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="w-[430px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder={searchPlaceholder}
              className="bg-transparent outline-none w-full text-sm font-semibold text-slate-600"
            />
          </div>

          <button
            onClick={() => navigate("/user/bildirimler")}
            className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20"
          >
            <Bell size={22} />
          </button>
        </header>

        {children}
      </main>
    </div>
  );
}