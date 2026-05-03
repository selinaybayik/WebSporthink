import React, { useEffect, useState } from "react";
import {
  Bell,
  Zap,
  BookOpen,
  Users,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Wand2,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getInstructorHome } from "../../services/api";

const RED = "#ED0015";
const DARK = "#081229";
const MUTED = "#64748B";
const BG = "#F6F7FB";

export default function EgitmenAnaSayfa({ user }) {
  const navigate = useNavigate();

  const [data, setData] = useState({
    user: {
      adSoyad: user?.name || "Eğitmen",
      rol: user?.role || "Eğitmen",
    },
    stats: {
      egitimSayisi: 0,
      toplamOgrenci: 0,
      tamamlamaOrani: 0,
      bekleyenSoru: 0,
      okunmamisBildirim: 0,
    },
    performans: [],
  });

  useEffect(() => {
    const loadHome = async () => {
      if (!user?.id) return;

      const result = await getInstructorHome(user.id);

      if (result) {
        setData((prev) => ({
          user: {
            adSoyad: user?.name || result.user?.adSoyad || "Eğitmen",
            rol: user?.role || result.user?.rol || "Eğitmen",
          },
          stats: result.stats || prev.stats,
          performans: Array.isArray(result.performans) ? result.performans : [],
        }));
      }
    };

    loadHome();
  }, [user?.id, user?.name, user?.role]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroTop}>
            <div>
              <div style={styles.brandRow}>
                <Zap size={15} color="#FACC15" fill="#FACC15" />
                <span style={styles.brand}>SPORTHINK AKADEMİ</span>
              </div>

              <h1 style={styles.hello}>Merhaba, {data.user.adSoyad}</h1>

              <p style={styles.role}>
                Eğitimlerini, öğrencilerini ve içerik performansını buradan yönetebilirsin.
              </p>
            </div>

            <button
              style={styles.bellBox}
              onClick={() => navigate("/egitmen/bildirimler")}
            >
              <Bell size={21} color={RED} />
              {data.stats.okunmamisBildirim > 0 && <span style={styles.bellDot} />}
            </button>
          </div>

          <div style={styles.statsGrid}>
            <StatCard
              icon={BookOpen}
              value={data.stats.egitimSayisi}
              title="Eğitim"
              desc="Yayındaki içerik"
              color="#2563EB"
              onClick={() => navigate("/egitmen/egitimlerim")}
            />

            <StatCard
              icon={Users}
              value={data.stats.toplamOgrenci}
              title="Öğrenci"
              desc="Toplam katılım"
              color="#7C3AED"
              onClick={() => navigate("/egitmen/ogrenci-ilerlemesi")}
            />

            <StatCard
              icon={CheckCircle2}
              value={`%${data.stats.tamamlamaOrani}`}
              title="Tamamlama"
              desc="Genel başarı oranı"
              color="#059669"
              onClick={() => navigate("/egitmen/analiz")}
            />

            <StatCard
              icon={MessageSquare}
              value={data.stats.bekleyenSoru}
              title="Soru"
              desc="Yanıt bekleyen"
              color="#F59E0B"
              onClick={() => navigate("/egitmen/sorular")}
            />
          </div>
        </section>

        <div style={styles.topGrid}>
          <section style={styles.card}>
            <div style={styles.cardTitleRow}>
              <div style={styles.redIconBox}>
                <AlertCircle size={23} color={RED} />
              </div>

              <div>
                <h2 style={styles.cardTitle}>Aksiyon Bekleyenler</h2>
                <p style={styles.cardSub}>Bugün kontrol etmen gereken özetler</p>
              </div>
            </div>

            <ActionRow
              icon={MessageSquare}
              text={`${data.stats.bekleyenSoru} yeni soru yanıtlanmayı bekliyor`}
              button="Yanıtla"
              color="#F59E0B"
              onClick={() => navigate("/egitmen/sorular")}
            />

            <ActionRow
              icon={BookOpen}
              text={`${data.stats.egitimSayisi} aktif eğitim yayında`}
              button="Yönet"
              color="#2563EB"
              onClick={() => navigate("/egitmen/egitimlerim")}
            />
          </section>

          <section style={styles.aiCard} onClick={() => navigate("/egitmen/ai-studyo")}>
            <div style={styles.aiIcon}>
              <Wand2 size={24} color="#fff" />
            </div>

            <p style={styles.aiSmall}>AI İÇERİK STÜDYOSU</p>

            <h2 style={styles.aiTitle}>
              Dokümanlarını yükle, eğitimi AI hazırlasın.
            </h2>

            <p style={styles.aiLink}>AI Stüdyo’ya git ›</p>
          </section>
        </div>

        <div style={styles.sectionHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Eğitim Performansı</h3>
            <p style={styles.sectionSub}>
              Eğitimlerin tamamlanma oranlarını grafik olarak takip et.
            </p>
          </div>

          <button style={styles.allText} onClick={() => navigate("/egitmen/analiz")}>
            Tümünü Gör
          </button>
        </div>

        <section style={styles.performanceCard}>
          <div style={styles.performanceHeader}>
            <div style={styles.performanceTitleBox}>
              <div style={styles.chartIcon}>
                <TrendingUp size={22} color={RED} />
              </div>

              <div>
                <h2 style={styles.performanceMainTitle}>Performans Grafiği</h2>
                <p style={styles.performanceMainSub}>Tamamlama oranı / öğrenci sayısı</p>
              </div>
            </div>
          </div>

          {data.performans.length === 0 ? (
            <div style={styles.emptyBox}>Henüz performans verisi bulunamadı.</div>
          ) : (
            <div style={styles.chartArea}>
              {data.performans.slice(0, 6).map((item) => (
                <PerformanceBar
                  key={item.id}
                  item={item}
                  onClick={() =>
                    navigate(`/egitmen/egitim-detay/${item.id}`, {
                      state: {
                        id: item.id,
                        egitimId: item.id,
                        title: item.baslik,
                      },
                    })
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, title, desc, color, onClick }) {
  return (
    <button style={styles.statCard} onClick={onClick}>
      <div
        style={{
          ...styles.statGlow,
          background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
        }}
      />

      <div style={styles.statHeader}>
        <div
          style={{
            ...styles.statIconWrapper,
            background: `linear-gradient(135deg, ${color}, ${color}CC)`,
          }}
        >
          <Icon size={24} color="#fff" />
        </div>

        <div style={styles.statBadge}>
          <span style={{ ...styles.statDot, backgroundColor: color }} />
          Canlı
        </div>
      </div>

      <h2 style={styles.statValue}>{value}</h2>

      <div style={styles.statInfo}>
        <div>
          <p style={styles.statTitle}>{title}</p>
          <p style={styles.statDesc}>{desc}</p>
        </div>

        <div
          style={{
            ...styles.statArrow,
            color,
            backgroundColor: `${color}14`,
          }}
        >
          ↗
        </div>
      </div>

      <div style={styles.statTrack}>
        <div
          style={{
            ...styles.statFill,
            background: `linear-gradient(90deg, ${color}, ${color}AA)`,
            width:
              title === "Tamamlama"
                ? `${String(value).replace("%", "") || 0}%`
                : title === "Soru"
                ? "36%"
                : title === "Öğrenci"
                ? "68%"
                : "82%",
          }}
        />
      </div>
    </button>
  );
}

function ActionRow({ icon: Icon, text, button, color, onClick }) {
  return (
    <div style={styles.actionRow}>
      <div style={styles.smallIconCircle}>
        <Icon size={18} color={color} />
      </div>

      <p style={styles.actionText}>{text}</p>

      <button style={styles.actionButton} onClick={onClick}>
        {button}
      </button>
    </div>
  );
}

function PerformanceBar({ item, onClick }) {
  const rate = Math.min(Number(item.tamamlanma || 0), 100);
  const studentCount = item.ogrenci || 0;

  return (
    <button style={styles.barRow} onClick={onClick}>
      <div style={styles.barLeft}>
        <div style={styles.performanceIcon}>
          <BookOpen size={20} color="#94A3B8" />
        </div>

        <div>
          <div style={styles.barTitle}>{item.baslik}</div>
          <div style={styles.barSub}>{studentCount} öğrenci</div>
        </div>
      </div>

      <div style={styles.barMiddle}>
        <div style={styles.barTrack}>
          <div
            style={{
              ...styles.barFill,
              width: `${rate}%`,
              background:
                rate >= 70
                  ? "linear-gradient(90deg, #10B981, #34D399)"
                  : `linear-gradient(90deg, ${RED}, #FB7185)`,
            }}
          />
        </div>
      </div>

      <div style={styles.barRight}>
        <div style={{ ...styles.rateText, color: rate >= 70 ? "#10B981" : RED }}>
          %{rate}
        </div>
        <ChevronRight size={18} color="#CBD5E1" />
      </div>
    </button>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    fontFamily: "Inter, Arial, sans-serif",
    padding: "28px",
  },

  container: {
    width: "100%",
    maxWidth: 1440,
    margin: "0 auto",
  },

  hero: {
    background: "linear-gradient(135deg, #ED0015 0%, #D90013 45%, #B90012 100%)",
    borderRadius: 34,
    padding: "30px",
    color: "#fff",
    boxShadow: "0 18px 42px rgba(237,0,21,0.20)",
    overflow: "hidden",
  },

  heroTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    marginBottom: 28,
  },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  brand: {
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 1.8,
  },

  hello: {
    fontSize: "clamp(28px, 3vw, 44px)",
    fontWeight: 950,
    margin: 0,
  },

  role: {
    maxWidth: 690,
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    fontWeight: 600,
    lineHeight: "24px",
    marginTop: 10,
  },

  bellBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    border: "none",
    backgroundColor: "#fff",
    cursor: "pointer",
    position: "relative",
    flexShrink: 0,
    boxShadow: "0 12px 24px rgba(0,0,0,0.14)",
  },

  bellDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: "#FACC15",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
  },

  statCard: {
    position: "relative",
    overflow: "hidden",
    minHeight: 180,
    borderRadius: 32,
    background: "#fff",
    border: "1px solid #EEF2F7",
    padding: 22,
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 18px 40px rgba(15,23,42,0.10)",
  },

  statGlow: {
    position: "absolute",
    top: -45,
    right: -45,
    width: 145,
    height: 145,
    borderRadius: 999,
  },

  statHeader: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statIconWrapper: {
    width: 62,
    height: 62,
    borderRadius: 22,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 15px 30px rgba(0,0,0,0.13)",
  },

  statBadge: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#F8FAFC",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 11,
    fontWeight: 900,
    color: "#64748B",
  },

  statDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  statValue: {
    position: "relative",
    zIndex: 2,
    margin: "24px 0 0",
    fontSize: 44,
    fontWeight: 950,
    color: DARK,
    letterSpacing: "-2px",
    lineHeight: 1,
  },

  statInfo: {
    position: "relative",
    zIndex: 2,
    marginTop: 18,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
  },

  statTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 950,
    color: DARK,
  },

  statDesc: {
    margin: "6px 0 0",
    fontSize: 12,
    color: MUTED,
    fontWeight: 750,
  },

  statArrow: {
    width: 36,
    height: 36,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontSize: 16,
    fontWeight: 950,
  },

  statTrack: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: 8,
    backgroundColor: "#EEF2F7",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 22,
  },

  statFill: {
    height: "100%",
    borderRadius: 999,
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 340px",
    gap: 24,
    marginTop: 24,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
  },

  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },

  redIconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
  },

  cardTitle: {
    margin: 0,
    color: DARK,
    fontSize: 22,
    fontWeight: 950,
  },

  cardSub: {
    margin: "4px 0 0",
    color: MUTED,
    fontSize: 13,
    fontWeight: 600,
  },

  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    minHeight: 62,
    borderTop: "1px solid #F1F5F9",
  },

  smallIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
    display: "grid",
    placeItems: "center",
  },

  actionText: {
    flex: 1,
    color: DARK,
    fontSize: 14,
    fontWeight: 850,
  },

  actionButton: {
    border: "none",
    background: "#FFF1F2",
    color: RED,
    borderRadius: 13,
    padding: "10px 15px",
    fontWeight: 950,
    cursor: "pointer",
  },

  aiCard: {
    minHeight: 230,
    background: "linear-gradient(145deg, #FFFFFF 0%, #FFF1F2 100%)",
    border: "1px solid #FFE4E6",
    borderRadius: 30,
    padding: 28,
    color: DARK,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(237,0,21,0.10)",
  },

  aiIcon: {
    width: 56,
    height: 56,
    borderRadius: 19,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    marginBottom: 22,
    boxShadow: "0 12px 24px rgba(237,0,21,0.24)",
  },

  aiSmall: {
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: 2,
    color: RED,
  },

  aiTitle: {
    fontSize: 24,
    lineHeight: "31px",
    fontWeight: 950,
    margin: "14px 0",
  },

  aiLink: {
    color: RED,
    fontWeight: 950,
    marginTop: 24,
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    marginTop: 28,
    marginBottom: 16,
  },

  sectionTitle: {
    margin: 0,
    color: DARK,
    fontSize: 21,
    fontWeight: 950,
  },

  sectionSub: {
    margin: "6px 0 0",
    color: MUTED,
    fontSize: 13,
    fontWeight: 650,
  },

  allText: {
    border: "none",
    background: "#FFF1F2",
    color: RED,
    fontSize: 13,
    fontWeight: 950,
    cursor: "pointer",
    borderRadius: 14,
    padding: "11px 16px",
  },

  performanceCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 24,
    boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
  },

  performanceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  performanceTitleBox: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  chartIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
  },

  performanceMainTitle: {
    margin: 0,
    color: DARK,
    fontSize: 20,
    fontWeight: 950,
  },

  performanceMainSub: {
    margin: "4px 0 0",
    color: MUTED,
    fontSize: 13,
    fontWeight: 650,
  },

  chartArea: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  barRow: {
    width: "100%",
    border: "1px solid #F1F5F9",
    background: "#fff",
    borderRadius: 20,
    padding: "15px 16px",
    display: "grid",
    gridTemplateColumns: "270px 1fr 80px",
    alignItems: "center",
    gap: 18,
    cursor: "pointer",
    textAlign: "left",
  },

  barLeft: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    minWidth: 0,
  },

  performanceIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },

  barTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: 950,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 190,
  },

  barSub: {
    color: MUTED,
    fontSize: 12,
    fontWeight: 750,
    marginTop: 6,
  },

  barMiddle: {
    width: "100%",
  },

  barTrack: {
    width: "100%",
    height: 14,
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 999,
  },

  barRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  rateText: {
    fontSize: 15,
    fontWeight: 950,
  },

  emptyBox: {
    padding: 28,
    color: MUTED,
    fontWeight: 700,
  },
};