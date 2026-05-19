import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KullaniciLayout from "../../components/KullaniciLayout";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Flame,
  Lock,
  Medal,
  Trophy,
  User,
} from "lucide-react";
import { getPublicUserProfile } from "../../services/api";

export default function UserProfilePreview({ user, setUser }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = String(user?.id) === String(id);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getPublicUserProfile(id);
      setProfile(data);
    } catch (err) {
      alert(err.message || "Profil alınamadı.");
      navigate("/user/liderlik");
    } finally {
      setLoading(false);
    }
  };

  const pUser = profile?.user;

  return (
    <KullaniciLayout user={user} setUser={setUser} activePath="/user/liderlik">
      <main className="flex-1 bg-slate-50 min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-10 sticky top-0 z-10">
          <button
            onClick={() => navigate("/user/liderlik")}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center mr-4"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <p className="text-xs font-black tracking-[3px] text-slate-400">
              LİDERLİK PROFİLİ
            </p>
            <h1 className="text-2xl font-black text-slate-950">
              Kullanıcı Profili
            </h1>
          </div>
        </header>

        {loading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-bold text-slate-600">Profil yükleniyor...</p>
            </div>
          </div>
        ) : (
          <section className="p-10">
            <div className="bg-slate-950 text-white rounded-[2.5rem] p-10 mb-8 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-600/20 rounded-full" />

              <div className="relative flex items-center gap-6">
                <div className="w-28 h-28 rounded-[2rem] bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
                  {isOwnProfile && pUser?.profil_foto_url ? (
                    <img
                      src={pUser.profil_foto_url}
                      alt="Profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>

                <div>
                  <h2 className="text-4xl font-black">
                    {pUser?.ad} {pUser?.soyad}
                  </h2>

                  <p className="text-slate-300 font-bold mt-2">
                    {isOwnProfile
                      ? `${pUser?.departman || "Departman yok"} · ${
                          pUser?.rol || "Kullanıcı"
                        }`
                      : "Profil detayları KVKK gereği gizlidir"}
                  </p>

                  <div className="flex gap-3 mt-5 flex-wrap">
                    <span className="px-4 py-2 rounded-2xl bg-red-600 font-black">
                      {pUser?.xp || 0} XP
                    </span>

                    {isOwnProfile ? (
                      <>
                        <span className="px-4 py-2 rounded-2xl bg-white/10 font-black">
                          {pUser?.coin || 0} Coin
                        </span>

                        <span className="px-4 py-2 rounded-2xl bg-white/10 font-black">
                          🔥 {pUser?.streak || 0} Streak
                        </span>
                      </>
                    ) : (
                      <span className="px-4 py-2 rounded-2xl bg-white/10 font-black flex items-center gap-2">
                        <Lock size={16} />
                        Kişisel bilgiler kilitli
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={<BookOpen />}
                label="Tamamlanan Eğitim"
                value={isOwnProfile ? profile?.stats?.completedTrainings || 0 : "🔒"}
              />
              <StatCard
                icon={<Award />}
                label="Sertifika"
                value={isOwnProfile ? profile?.stats?.certificates || 0 : "🔒"}
              />
              <StatCard
                icon={<Flame />}
                label="Aktif Seri"
                value={isOwnProfile ? pUser?.streak || 0 : "🔒"}
              />
            </div>

            {isOwnProfile ? (
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
                  <h3 className="text-xl font-black text-slate-950 mb-5 flex items-center gap-2">
                    <Trophy className="text-red-600" />
                    Tamamladığı Eğitimler
                  </h3>

                  {profile?.completedTrainings?.length ? (
                    <div className="space-y-4">
                      {profile.completedTrainings.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-50 rounded-2xl p-4 flex justify-between"
                        >
                          <p className="font-black text-slate-900">
                            {item.title}
                          </p>
                          <p className="font-black text-red-600">
                            {item.xp || 0} XP
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 font-bold">
                      Henüz tamamlanan eğitim yok.
                    </p>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
                  <h3 className="text-xl font-black text-slate-950 mb-5 flex items-center gap-2">
                    <Medal className="text-red-600" />
                    Rozetleri
                  </h3>

                  {profile?.badges?.length ? (
                    <div className="grid grid-cols-2 gap-4">
                      {profile.badges.map((badge) => (
                        <div
                          key={badge.id}
                          className="bg-red-50 rounded-2xl p-4"
                        >
                          <p className="font-black text-red-700">
                            {badge.title}
                          </p>
                          <p className="text-sm text-red-500 font-semibold mt-1">
                            {badge.description || "Rozet kazanıldı."}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 font-bold">
                      Henüz rozet yok.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-14 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
                  <Lock size={34} className="text-slate-500" />
                </div>

                <h3 className="text-3xl font-black text-slate-950 mb-3">
                  Profil Detayları Kilitli
                </h3>

                <p className="text-slate-500 font-semibold max-w-xl mx-auto leading-8">
                  KVKK gereği diğer kullanıcıların eğitim geçmişi,
                  rozetleri, sertifikaları, coin bilgisi, streak bilgisi ve
                  kişisel öğrenme verileri görüntülenemez.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </KullaniciLayout>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-7">
      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5">
        {icon}
      </div>
      <p className="text-slate-400 text-xs font-black tracking-[3px]">
        {label}
      </p>
      <p className="text-3xl font-black text-slate-950 mt-2">{value}</p>
    </div>
  );
}