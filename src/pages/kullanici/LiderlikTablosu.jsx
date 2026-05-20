import React, { useEffect, useMemo, useState } from "react";
import KullaniciLayout from "../../components/KullaniciLayout";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  ChevronUp,
  Coffee,
  Crown,
  Home,
  LogOut,
  Map,
  Medal,
  Megaphone,
  MessageCircle,
  Search,
  Settings,
  Shirt,
  Store,
  Ticket,
  Trophy,
  Umbrella,
  User,
  Lock,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createOdulTalep, getLiderlik, getOduller } from "../../services/api";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function LiderlikTablosu({ user, setUser }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Haftalık");
  const [leaders, setLeaders] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

const tabs = ["Haftalık", "Aylık", "Ödül Pazarı", "Rozetlerim"];

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
        { label: "Bildirimler", icon: Bell, path: "/user/bildirimler" },
      ],
    },
    {
      title: "OYUNLAŞTIRMA",
      items: [
        { label: "Liderlik Tablosu", icon: Trophy, path: "/user/liderlik", active: true },
        { label: "Ödül Pazarı", icon: Store, path: "/user/odul-pazari" },
        
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const leaderData = await getLiderlik();
      const rewardData = await getOduller();

      const normalizedLeaders = Array.isArray(leaderData)
        ? leaderData.map((item, index) => ({
            id: String(item.id),
            name: item.name || `${item.ad || ""} ${item.soyad || ""}`.trim(),
            department: item.departman || item.department || "Departman yok",
            xp: Number(item.xp) || 0,
            coin: Number(item.coin) || 0,
            rank: Number(item.rank) || index + 1,
            avatar: "👤",
          }))
        : [];

      const normalizedRewards = Array.isArray(rewardData)
        ? rewardData.map((item) => ({
            id: item.id,
            name: item.title || item.name,
            cost: Number(item.price || item.cost) || 0,
            iconType: item.icon || item.iconType,
          }))
        : [];

      setLeaders(normalizedLeaders);
      setRewards(normalizedRewards);
    } catch (error) {
      console.log("Liderlik/ödül verisi yüklenemedi:", error.message);
      setLeaders([]);
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaders = useMemo(() => {
  const keyword = search.trim().toLowerCase();

  if (!keyword) return leaders;

  return leaders.filter((item) =>
    String(item.name || "")
      .toLowerCase()
      .includes(keyword) ||
    String(item.department || "")
      .toLowerCase()
      .includes(keyword) ||
    String(item.xp || "")
      .toLowerCase()
      .includes(keyword)
  );
}, [leaders, search]);

 const topThree = useMemo(() => filteredLeaders.slice(0, 3), [filteredLeaders]);
const restLeaders = useMemo(() => filteredLeaders.slice(3), [filteredLeaders]);

  const currentUser = useMemo(() => {
    return (
      leaders.find((x) => String(x.id) === String(user?.id)) || {
        id: String(user?.id || ""),
        name: user?.name || "Kullanıcı",
        xp: 0,
        coin: 0,
        rank: "-",
      }
    );
  }, [leaders, user]);

  const handleRewardRequest = async (reward) => {
    try {
      await createOdulTalep({
        userId: user?.id,
        odulId: reward.id,
        fiyat: reward.cost,
      });

      alert("Ödül talebin başarıyla oluşturuldu.");
      loadData();
    } catch (error) {
      alert(error.message || "Ödül talebi oluşturulamadı.");
    }
  };

  const renderRewardIcon = (iconType) => {
    if (iconType === "umbrella" || iconType === "beach") return <Umbrella size={30} />;
    if (iconType === "ticket" || iconType === "ticket-confirmation") return <Ticket size={30} />;
    if (iconType === "shirt" || iconType === "tshirt-crew") return <Shirt size={30} />;
    if (iconType === "coffee") return <Coffee size={30} />;
    return <Trophy size={30} />;
  };

  return (
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/liderlik" searchPlaceholder="Sıralamada ara..." >

      <main className="flex-1">

        <section className="p-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-slate-500 font-bold mb-1">
                Oyunlaştırma merkezi
              </p>
              <h1 className="text-4xl font-black text-slate-950">
                {activeTab === "Ödül Pazarı"
  ? "Ödül Pazarı 🎁"
  : activeTab === "Rozetlerim"
  ? "Rozetlerim 🏅"
  : "Liderlik Tablosu 🏆"}
              </h1>
              <p className="text-slate-500 font-semibold mt-2">
                XP sıralamanı takip et, kazandığın coinleri ödüllerle değiştir.
              </p>
            </div>

            <div className="bg-slate-950 text-white px-6 py-4 rounded-2xl">
              <p className="text-slate-400 text-xs font-black tracking-widest">
                MEVCUT COIN
              </p>
              <p className="text-2xl font-black">{currentUser.coin || 0}</p>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl text-sm font-black transition ${
                  activeTab === tab
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-slate-600">Veriler yükleniyor...</p>
              </div>
            </div>
          ) : activeTab === "Ödül Pazarı" ? (
  <RewardMarket
    rewards={rewards}
    currentUser={currentUser}
    renderRewardIcon={renderRewardIcon}
    onRequest={handleRewardRequest}
  />
) : activeTab === "Rozetlerim" ? (
  <RozetlerSection user={user} />
) : (
  <Leaderboard
    leaders={filteredLeaders}
    topThree={topThree}
    restLeaders={restLeaders}
    currentUser={currentUser}
    authUser={user}
    onProfileClick={(id) => navigate(`/user/profil-onizleme/${id}`)}
  />
)}
        </section>
      </main>
    </KullaniciLayout>
  );
}

function Leaderboard({ leaders, topThree, restLeaders, currentUser, authUser, onProfileClick }) {
  if (!leaders.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
        <h3 className="text-xl font-black text-slate-950">
          Liderlik verisi bulunamadı.
        </h3>
        <p className="text-slate-500 font-semibold mt-2">
          Kullanıcı XP bilgileri geldiğinde sıralama burada görünecek.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <PodiumUser user={topThree[1]} place={2} onProfileClick={onProfileClick} />
<PodiumUser user={topThree[0]} place={1} onProfileClick={onProfileClick} />
<PodiumUser user={topThree[2]} place={3} onProfileClick={onProfileClick} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
          <h2 className="text-sm font-black tracking-[3px] text-slate-400 mb-5">
            SIRALAMANIN DEVAMI
          </h2>

          <div className="space-y-3">
           {restLeaders.map((item) => (
  <div
    key={item.id}
    onClick={() => onProfileClick(item.id)}
    className={`flex items-center p-5 rounded-2xl border cursor-pointer hover:bg-slate-50 transition ${
      String(item.id) === String(authUser?.id)
        ? "bg-red-50 border-red-200"
        : "bg-white border-slate-100"
    }`}
  >
    <div className="w-10 text-center font-black text-slate-400">
      #{item.rank}
    </div>

    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl mx-4">
      {item.avatar}
    </div>

    <div className="flex-1">
      <p className="font-black text-slate-950">{item.name}</p>

      <p className="text-slate-400 font-bold text-sm">
        {item.department}
      </p>
    </div>

    <div className="flex items-center gap-2 text-emerald-500 mr-5">
      <ChevronUp size={18} />
      <span className="font-black text-xs">YÜKSELİŞ</span>
    </div>

    <div className="bg-slate-100 px-4 py-2 rounded-2xl font-black text-slate-700">
      {item.xp} XP
    </div>
  </div>
))}
          </div>
        </div>

        <div className="bg-slate-950 text-white rounded-[2rem] p-7 shadow-xl h-fit sticky top-28">
          <p className="text-red-300 font-black text-xs tracking-widest mb-3">
            BENİM SIRAM
          </p>

          <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center font-black text-2xl mb-5">
            #{currentUser.rank || "-"}
          </div>

          <h3 className="text-xl font-black mb-2">{currentUser.name}</h3>

          <p className="text-slate-400 font-semibold mb-5">
            {currentUser.xp || 0} XP ile sıralamadasın.
          </p>

          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-slate-400 text-xs font-black tracking-widest mb-2">
              MOTİVASYON
            </p>
            <p className="font-bold">
              Eğitimleri tamamladıkça XP kazanır ve sıralamada yükselirsin.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function RozetlerSection({ user }) {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const res = await fetch(
  `${API_URL}/api/user/public/${user.id}`
);

      const data = await res.json();

      setBadges(data.badges || []);
    } catch (err) {
      console.log(err);
      setBadges([]);
    }
  };

  const lockedBadges = [
    {
      id: "locked-1",
      title: "Bilgi Avcısı",
      description: "3 eğitimi tamamlayınca açılır.",
      icon: "🎯",
    },
    {
      id: "locked-2",
      title: "Öğrenme Ustası",
      description: "5 eğitimi tamamlayınca açılır.",
      icon: "🏆",
    },
    {
      id: "locked-3",
      title: "Disiplinli Öğrenci",
      description: "7 günlük öğrenme serisi yapınca açılır.",
      icon: "🔥",
    },
    {
      id: "locked-4",
      title: "XP Toplayıcı",
      description: "1000 XP kazanınca açılır.",
      icon: "⭐",
    },
  ];

  return (
    <div>
      {/* HERO */}
      <div className="bg-slate-950 text-white rounded-[2rem] p-8 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full" />

        <div className="flex items-center gap-3 mb-4">
          <Medal className="text-red-400" />

          <p className="text-slate-400 font-black text-xs tracking-[3px]">
            ROZET SİSTEMİ
          </p>
        </div>

        <h2 className="text-3xl font-black max-w-3xl">
          Eğitimleri tamamla, streak oluştur ve başarı rozetlerini kazan.
        </h2>

        <p className="text-slate-400 font-semibold mt-4 max-w-2xl">
          Tamamlanan eğitimler, XP puanları ve günlük öğrenme serilerine göre
          özel rozetler açılır.
        </p>
      </div>

      {/* KAZANILAN */}
      <h2 className="text-sm font-black tracking-[3px] text-slate-400 mb-5">
        KAZANILAN ROZETLER
      </h2>

      {badges.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center mb-10">
          <div className="text-5xl mb-5">🏅</div>

          <h3 className="text-2xl font-black text-slate-950">
            Henüz rozet kazanmadın
          </h3>

          <p className="text-slate-500 font-semibold mt-2">
            İlk eğitimini tamamlayınca rozetlerin burada görünecek.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-5 mb-10">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white border border-red-100 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-5xl mb-5 text-center">
                {badge.icon || "🏅"}
              </div>

              <h3 className="text-xl font-black text-slate-950 text-center">
                {badge.title}
              </h3>

              <p className="text-sm text-slate-500 text-center font-semibold mt-3">
                {badge.description}
              </p>

              <div className="mt-5 flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black">
                  KAZANILDI
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KİLİTLİ */}
      <h2 className="text-sm font-black tracking-[3px] text-slate-400 mb-5">
        KİLİTLİ ROZETLER
      </h2>

      <div className="grid grid-cols-4 gap-5">
        {lockedBadges.map((badge) => (
          <div
            key={badge.id}
            className="bg-slate-100 border border-slate-200 rounded-[2rem] p-6 shadow-sm opacity-70 relative"
          >
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-400">
              <Lock size={18} />
            </div>

            <div className="text-5xl mb-5 text-center grayscale">
              {badge.icon}
            </div>

            <h3 className="text-xl font-black text-slate-500 text-center">
              {badge.title}
            </h3>

            <p className="text-sm text-slate-400 text-center font-semibold mt-3">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PodiumUser({ user, place, onProfileClick }) {
  const isFirst = place === 1;

  return (
    <div
  onClick={() => user?.id && onProfileClick(user.id)}
  className={`relative rounded-[2rem] cursor-pointer hover:-translate-y-1 transition p-7 text-center border shadow-sm ${
    isFirst
      ? "bg-red-600 text-white border-red-600 scale-105"
      : "bg-white text-slate-950 border-slate-200"
  }`}
>
      {isFirst && (
        <Crown
          size={36}
          className="text-yellow-300 mx-auto mb-2"
          fill="currentColor"
        />
      )}

      <div
        className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 ${
          isFirst ? "bg-white/20" : "bg-slate-100"
        }`}
      >
        {place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉"}
      </div>

      <p className="text-sm font-black opacity-70 mb-1">#{place}</p>
      <h3 className="text-xl font-black truncate">
        {user?.name || "-"}
      </h3>
      <p className={`font-black mt-2 ${isFirst ? "text-white" : "text-red-600"}`}>
        {user?.xp || 0} XP
      </p>
    </div>
  );
}

function RewardMarket({ rewards, currentUser, renderRewardIcon, onRequest }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <div className="bg-slate-950 text-white rounded-[2rem] p-8 mb-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full" />
          <p className="text-slate-400 font-black text-xs tracking-[3px] mb-4">
            MAĞAZA VİTRİNİ
          </p>
          <h2 className="text-3xl font-black leading-tight max-w-2xl">
            Eğitimlerden kazandığın coinleri şirket içi özel ödüllerle takas et.
          </h2>
        </div>

        <h2 className="text-sm font-black tracking-[3px] text-slate-400 mb-5">
          TÜM ÖDÜLLER
        </h2>

        {rewards.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
            <h3 className="text-xl font-black text-slate-950">
              Ödül bulunamadı.
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white border border-slate-200 rounded-[2rem] p-7 text-center shadow-sm"
              >
                <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-5">
                  {renderRewardIcon(reward.iconType)}
                </div>

                <h3 className="text-xl font-black text-slate-950 min-h-[56px]">
                  {reward.name}
                </h3>

                <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-5 py-3 rounded-2xl font-black mt-5 mb-5">
                  <span className="w-4 h-4 bg-yellow-400 rounded-full" />
                  {reward.cost}
                </div>

                <button
                  onClick={() => onRequest(reward)}
                  className="w-full bg-red-600 text-white py-3 rounded-2xl font-black hover:bg-red-700"
                >
                  Talep Et
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="bg-orange-50 border border-orange-200 rounded-[2rem] p-7 h-fit sticky top-28">
        <p className="text-orange-700 font-black text-xs tracking-[3px] mb-3">
          MEVCUT COIN
        </p>

        <h2 className="text-5xl font-black text-slate-950 mb-5">
          {currentUser.coin || 0}
        </h2>

        <p className="text-orange-800 font-semibold leading-7">
          Eğitimleri tamamladıkça coin kazanırsın. Yeterli coin olduğunda
          ödül talebi oluşturabilirsin.
        </p>
      </aside>
    </div>
  );
}