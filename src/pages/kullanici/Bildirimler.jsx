import React, { useEffect, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardList,
  HelpCircle,
  Home,
  LogOut,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  Search,
  Settings,
  Store,
  Trophy,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markNotificationRead } from "../../services/api";
import KullaniciLayout from "../../components/KullaniciLayout";

export default function Bildirimler({ user, setUser }) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
        { label: "360 Değerlendirmelerim", icon: Medal, path: "/user/degerlendirmeler-360" },
        { label: "Sorularım", icon: MessageCircle, path: "/user/sorular" },
        { label: "AI Asistan", icon: Bot, path: "/user/asistan" },
        { label: "Bildirimler", icon: Bell, path: "/user/bildirimler", active: true },
      ],
    },
    {
      title: "OYUNLAŞTIRMA",
      items: [
        { label: "Liderlik Tablosu", icon: Trophy, path: "/user/liderlik" },
        { label: "Ödül Pazarı", icon: Store, path: "/user/odul-pazari" },
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

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getNotifications(user.id);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Bildirimler yüklenemedi:", error.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    if (type === "egitim") return <BookOpen size={24} className="text-red-600" />;
    if (type === "ai") return <Bot size={24} className="text-blue-600" />;
    if (type === "soru") return <HelpCircle size={24} className="text-orange-500" />;
    return <Bell size={24} className="text-slate-500" />;
  };

  const handlePress = async (item) => {
    try {
      const isRead = item.isRead || item.is_read;

      if (!isRead) {
        await markNotificationRead(item.id);
      }

      await loadNotifications();
    } catch (error) {
      console.log("Bildirim okundu yapılamadı:", error.message);
    }
  };

  const unreadCount = notifications.filter(
    (item) => !item.isRead && !item.is_read
  ).length;

  return (
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/bildirimler" searchPlaceholder="Bildirimlerde ara..." >

      <main className="flex-1 min-h-screen bg-slate-50">


        <section className="p-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-slate-500 font-bold mb-1">
                Sistem ve eğitim bildirimleri
              </p>

              <h1 className="text-4xl font-black text-slate-950">
                Bildirimler 🔔
              </h1>

              <p className="text-slate-500 font-semibold mt-2">
                {unreadCount > 0
                  ? `${unreadCount} okunmamış bildirimin var.`
                  : "Tüm bildirimler okundu."}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4">
              <p className="text-slate-400 text-xs font-black tracking-widest">
                OKUNMAMIŞ
              </p>
              <p className="text-3xl font-black text-red-600">{unreadCount}</p>
            </div>
          </div>

          {loading ? (
            <div className="min-h-[350px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-slate-600">Bildirimler yükleniyor...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-5">
                <Bell size={36} />
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                Henüz bildirim yok
              </h3>

              <p className="text-slate-500 font-semibold mt-2 max-w-xl mx-auto">
                Eğitim atamaları, soru yanıtları ve AI önerileri burada görünecek.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {notifications.map((item) => {
                const isRead = item.isRead || item.is_read;

                return (
                  <button
                    key={String(item.id)}
                    onClick={() => handlePress(item)}
                    className={`bg-white rounded-[2rem] p-6 text-left border shadow-sm hover:-translate-y-1 transition ${
                      !isRead
                        ? "border-red-200 bg-red-50/40"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                        {getIcon(item.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg font-black text-slate-950">
                            {item.title}
                          </h3>

                          {isRead ? (
                            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                          ) : (
                            <span className="w-3 h-3 bg-red-600 rounded-full shrink-0 mt-1" />
                          )}
                        </div>

                        <p className="text-slate-500 font-semibold leading-6">
                          {item.message}
                        </p>

                        <p className="text-slate-400 font-black text-xs mt-4">
                          {item.date || item.olusturma_tarihi || ""}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </KullaniciLayout>
  );
}