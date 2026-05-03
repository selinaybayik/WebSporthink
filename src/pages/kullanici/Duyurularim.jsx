import React, { useEffect, useMemo, useState } from "react";
import KullaniciLayout from "../../components/KullaniciLayout";
import {
  Bell,
  Calendar,
  Megaphone,
  Search,
  UserRound,
} from "lucide-react";
import { getUserAnnouncements } from "../../services/api";

export default function Duyurularim({ user, setUser }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadAnnouncements();
  }, [user?.id]);

  const loadAnnouncements = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getUserAnnouncements(user.id);
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Duyurular yüklenemedi:", error.message);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    if (!q) return announcements;

    return announcements.filter(
      (item) =>
        String(item.title || "").toLowerCase().includes(q) ||
        String(item.content || "").toLowerCase().includes(q) ||
        String(item.creator_name || "").toLowerCase().includes(q)
    );
  }, [announcements, searchText]);

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <KullaniciLayout
      user={user}
      setUser={setUser}
      activePath="/user/duyurular"
      searchPlaceholder="Duyurularda ara..."
    >
      <main className="flex-1 bg-[#F8FAFC] min-h-screen">
        <header className="h-20 bg-white/90 border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="w-[420px] h-12 bg-slate-100 rounded-2xl flex items-center px-4 gap-3 border border-slate-200">
            <Search size={20} className="text-slate-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Duyurularda ara..."
              className="bg-transparent outline-none w-full text-sm font-bold text-slate-600"
            />
          </div>

          <button
            onClick={loadAnnouncements}
            className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/25"
          >
            <Bell size={22} />
          </button>
        </header>

        <section className="px-10 py-9">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-red-600 font-black tracking-[3px] text-xs mb-2">
                YÖNETİCİ VE KURUM DUYURULARI
              </p>

              <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                Duyurularım
                <span className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Megaphone size={27} />
                </span>
              </h1>

              <p className="text-slate-500 font-semibold mt-3">
                Sana, departmanına veya rolüne gönderilen aktif duyurular burada görünür.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl px-6 py-4 min-w-[170px] shadow-sm">
              <p className="text-slate-400 text-xs font-black tracking-widest">
                TOPLAM DUYURU
              </p>
              <p className="text-3xl font-black text-red-600">
                {filteredAnnouncements.length}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm">
            {loading ? (
              <div className="min-h-[350px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-black text-slate-600">
                    Duyurular yükleniyor...
                  </p>
                </div>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-[1.7rem] p-12 text-center">
                <div className="w-18 h-18 rounded-3xl bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-5">
                  <Megaphone size={34} />
                </div>
                <h3 className="text-2xl font-black text-slate-950">
                  Henüz duyuru yok
                </h3>
                <p className="text-slate-500 font-semibold mt-2">
                  Yeni bir duyuru yayınlandığında burada görünecek.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnnouncements.map((item) => (
                  <article
                    key={String(item.id)}
                    className="group bg-white border border-slate-200 rounded-[1.6rem] p-5 shadow-sm hover:border-red-200 hover:bg-red-50/30 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition">
                        <Megaphone size={24} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-5 mb-2">
                          <h2 className="text-xl font-black text-slate-950 leading-7">
                            {item.title}
                          </h2>

                          <div className="flex items-center gap-2 text-slate-400 font-black text-xs whitespace-nowrap">
                            <Calendar size={15} />
                            {formatDate(item.created_at)}
                          </div>
                        </div>

                        <p className="text-slate-500 font-semibold leading-6 text-sm line-clamp-2">
                          {item.content}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                              <UserRound size={17} className="text-slate-400" />
                            </div>

                            <div>
                              <p className="text-[10px] font-black tracking-[2px] text-slate-400">
                                YAYINLAYAN
                              </p>
                              <p className="text-slate-900 font-black text-sm">
                                {item.creator_name || "Sporthink Yönetim"}
                              </p>
                            </div>
                          </div>

                          <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black">
                            AKTİF
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </KullaniciLayout>
  );
}