import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Target,
  Video,
  BookOpen,
  Award,
  FileText,
  Table2,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Lightbulb,
  Activity,
  GraduationCap,
  Download,
} from "lucide-react";
import {
  getInstructorTrainings,
  getInstructorTrainingAnalysis,
} from "../../services/api";

const RED = "#ED0015";
const DARK = "#081229";
const MUTED = "#64748B";
const BG = "#F4F5F7";
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function EgitmenAnaliz({ user }) {
  const location = useLocation();

  const egitmenId = user?.id || user?.kullanici_id || 1;

  const initialEgitimId =
    location.state?.egitimId ||
    location.state?.course?.id ||
    location.state?.course?.egitim_id ||
    "";

  const [trainings, setTrainings] = useState([]);
  const [selectedEgitimId, setSelectedEgitimId] = useState(initialEgitimId);
  const [analysis, setAnalysis] = useState(location.state?.analysisData || null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const loadTrainings = async () => {
      const data = await getInstructorTrainings(egitmenId);
      const list = Array.isArray(data) ? data : [];

      setTrainings(list);

      if (!selectedEgitimId && list.length > 0) {
        setSelectedEgitimId(list[0].id || list[0].egitim_id);
      }
    };

    loadTrainings();
  }, [egitmenId]);

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!selectedEgitimId) return;

      try {
        setLoading(true);
        const data = await getInstructorTrainingAnalysis(selectedEgitimId);
        setAnalysis(data);
      } catch (error) {
        console.error("Eğitim analizi alınamadı:", error);
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [selectedEgitimId]);

  const selectedTraining = trainings.find(
    (item) => String(item.id || item.egitim_id) === String(selectedEgitimId)
  );

  const data = analysis || {
    activeUser: 0,
    completion: 0,
    avgQuiz: 0,
    riskUser: 0,
    totalWatchMinutes: 0,
    rewindCount: 0,
    videoDepth: 0,
    documentViews: 0,
    smartRecommendations: [],
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <p style={styles.pageMini}>EĞİTMEN PANELİ</p>
          <h1 style={styles.title}>Eğitim Analizi</h1>
          <p style={styles.desc}>
            Seçili eğitime göre katılım, tamamlama, quiz ve içerik etkileşimlerini tek ekrandan izle.
          </p>
        </div>

        <div style={styles.heroRight}>
          <select
            value={selectedEgitimId}
            onChange={(e) => {
              setSelectedEgitimId(e.target.value);
              setAnalysis(null);
            }}
            style={styles.select}
          >
            {trainings.length === 0 ? (
              <option value="">Eğitim bulunamadı</option>
            ) : (
              trainings.map((item) => (
                <option key={item.id || item.egitim_id} value={item.id || item.egitim_id}>
                  {item.title || item.baslik || "İsimsiz Eğitim"}
                </option>
              ))
            )}
          </select>
        </div>
      </section>

      {selectedTraining && (
        <section style={styles.courseBanner}>
          <div style={styles.courseLeft}>
            <div style={styles.courseIcon}>
              <GraduationCap size={28} color="#fff" />
            </div>

            <div>
              <p style={styles.courseLabel}>SEÇİLİ EĞİTİM</p>
              <h2 style={styles.courseTitle}>
                {selectedTraining.title || selectedTraining.baslik}
              </h2>
              <p style={styles.courseMeta}>
                {selectedTraining.category || selectedTraining.kategori || "Genel"} ·{" "}
                {selectedTraining.aktif_mi ? "Yayında" : "Taslak"}
              </p>
            </div>
          </div>

          <div style={styles.courseMiniStats}>
            <div style={styles.courseMiniBox}>
              <strong>{data.activeUser || 0}</strong>
              <span>Katılımcı</span>
            </div>

            <div style={styles.courseMiniBox}>
              <strong>%{data.completion || 0}</strong>
              <span>Tamamlanma</span>
            </div>
          </div>
        </section>
      )}

      {loading ? (
        <div style={styles.emptyCard}>Analiz yükleniyor...</div>
      ) : (
        <>
          <section style={styles.kpiGrid}>
            <Kpi icon={Users} value={data.activeUser} label="Aktif Katılımcı" color="blue" />
            <Kpi icon={CheckCircle2} value={`%${data.completion}`} label="Tamamlama" color="green" />
            <Kpi icon={Target} value={data.avgQuiz} label="Ortalama Quiz" color="amber" />
            <Kpi icon={AlertTriangle} value={data.riskUser} label="Riskli Öğrenci" color="red" />
          </section>

          <section style={styles.mainGrid}>
            <div style={styles.leftColumn}>
              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div>
                    <p style={styles.sectionMini}>ÖĞRENME ANALİTİĞİ</p>
                    <h2 style={styles.sectionTitle}>Etkileşim Özeti</h2>
                  </div>

                  <Activity size={24} color={RED} />
                </div>

                <div style={styles.analyticsGrid}>
                  <MiniAnalysisCard
                    icon={Video}
                    title="Video Derinliği"
                    value={`%${data.videoDepth || 0}`}
                    desc="Ortalama izleme oranı"
                    color="#2563EB"
                  />

                  <MiniAnalysisCard
                    icon={Timer}
                    title="Ortalama Süre"
                    value={`${data.totalWatchMinutes || 0} dk`}
                    desc="Toplam öğrenme süresi"
                    color="#8B5CF6"
                  />

                  <MiniAnalysisCard
                    icon={BookOpen}
                    title="Doküman"
                    value={data.documentViews || 0}
                    desc="Toplam doküman görüntüleme"
                    color="#A855F7"
                  />

                  <MiniAnalysisCard
                    icon={Award}
                    title="Başarı"
                    value={`%${data.avgQuiz || 0}`}
                    desc="Quiz performans ortalaması"
                    color="#F59E0B"
                  />
                </div>
              </div>

              <div style={styles.reportCard}>
                <div style={styles.reportLeft}>
                  <div style={styles.reportIcon}>
                    <Download size={23} color={RED} />
                  </div>

                  <div>
                    <h3 style={styles.reportTitle}>Rapor Dosyaları</h3>
                    <p style={styles.reportDesc}>
                      Seçili eğitimin analiz raporlarını dışa aktar.
                    </p>
                  </div>
                </div>

                <div style={styles.reportIcons}>
                  <button
                    style={styles.excelIcon}
                    disabled={!selectedEgitimId}
                    onClick={() =>
                      window.open(
  `${BASE_URL}/api/egitmen/egitim/${selectedEgitimId}/rapor/csv`,
  "_blank"
)
                    }
                  >
                    <Table2 size={22} color="#059669" />
                    CSV
                  </button>

                  <button style={styles.pdfIcon}>
                    <FileText size={22} color={RED} />
                    PDF
                  </button>
                </div>
              </div>
            </div>

            <aside style={styles.smartCard}>
              <div style={styles.smartGlowOne} />
              <div style={styles.smartGlowTwo} />

              <div style={styles.smartHeader}>
                <div style={styles.smartIcon}>
                  <BrainCircuit size={28} color="#fff" />
                </div>

                <div>
                  <p style={styles.smartMini}>AKILLI ÖNERİLER</p>
                  <h3 style={styles.smartTitle}>Eğitim Koçu Analizi</h3>
                </div>
              </div>

              <p style={styles.smartDesc}>
                Katılım, tamamlama ve quiz verilerine göre eğitimi iyileştirmek için öneriler.
              </p>

              <div style={styles.smartList}>
                {(data.smartRecommendations || []).length === 0 ? (
                  <>
                    <SmartSuggestion
                      title="Henüz özel öneri oluşmadı"
                      text="Analiz verisi arttıkça sistem burada eğitim kalitesini iyileştirecek öneriler gösterecek."
                      icon={Lightbulb}
                      color="#F59E0B"
                    />
                    <SmartSuggestion
                      title="İçerik etkileşimlerini takip et"
                      text="Video izleme, doküman görüntüleme ve quiz başarısı arttıkça daha anlamlı içgörüler oluşur."
                      icon={TrendingUp}
                      color="#22C55E"
                    />
                  </>
                ) : (
                  data.smartRecommendations.map((item, index) => (
                    <SmartSuggestion
                      key={index}
                      title={`Öneri ${index + 1}`}
                      text={item}
                      icon={Sparkles}
                      color="#F59E0B"
                    />
                  ))
                )}
              </div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, value, label, color }) {
  const colors = {
    blue: {
      bg: "#EFF6FF",
      text: "#2563EB",
    },
    green: {
      bg: "#ECFDF5",
      text: "#059669",
    },
    amber: {
      bg: "#FFFBEB",
      text: "#F59E0B",
    },
    red: {
      bg: "#FEF2F2",
      text: RED,
    },
  };

  return (
    <div style={styles.kpiCard}>
      <div
        style={{
          ...styles.kpiIcon,
          backgroundColor: colors[color].bg,
          color: colors[color].text,
        }}
      >
        <Icon size={26} />
      </div>

      <div>
        <strong style={styles.kpiValue}>{value}</strong>
        <span style={styles.kpiLabel}>{label}</span>
      </div>
    </div>
  );
}

function MiniAnalysisCard({ icon: Icon, title, value, desc, color }) {
  return (
    <div style={styles.miniAnalysisCard}>
      <div style={{ ...styles.miniIcon, backgroundColor: color }}>
        <Icon size={20} color="#fff" />
      </div>

      <div>
        <strong style={styles.miniValue}>{value}</strong>
        <span style={styles.miniTitle}>{title}</span>
        <p style={styles.miniDesc}>{desc}</p>
      </div>
    </div>
  );
}

function SmartSuggestion({ icon: Icon, title, text, color }) {
  return (
    <div style={styles.smartRow}>
      <div style={{ ...styles.smartRowIcon, backgroundColor: `${color}22`, color }}>
        <Icon size={20} />
      </div>

      <div>
        <h4 style={styles.smartRowTitle}>{title}</h4>
        <p style={styles.smartText}>{text}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    padding: 28,
    fontFamily: "Inter, Arial, sans-serif",
  },

  hero: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 30,
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    marginBottom: 22,
  },
  heroLeft: {
    maxWidth: 760,
  },
  heroRight: {
    flexShrink: 0,
  },
  pageMini: {
    margin: 0,
    color: "#A8B3C7",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 2,
  },
  title: {
    color: DARK,
    fontSize: 42,
    fontWeight: 950,
    margin: "8px 0 0",
    letterSpacing: "-1px",
  },
  desc: {
    color: MUTED,
    fontWeight: 700,
    margin: "12px 0 0",
    lineHeight: "25px",
  },
  select: {
    minWidth: 360,
    height: 56,
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    color: DARK,
    fontWeight: 850,
    padding: "0 16px",
    outline: "none",
  },

  courseBanner: {
    backgroundColor: DARK,
    color: "#fff",
    borderRadius: 30,
    padding: 24,
    marginBottom: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    boxShadow: "0 14px 32px rgba(8,18,41,0.16)",
    overflow: "hidden",
  },
  courseLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  courseIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  courseLabel: {
    margin: 0,
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 2,
  },
  courseTitle: {
    margin: "6px 0 0",
    color: "#fff",
    fontSize: 24,
    fontWeight: 950,
  },
  courseMeta: {
    margin: "6px 0 0",
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 800,
  },
  courseMiniStats: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  courseMiniBox: {
    minWidth: 120,
    height: 76,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 18,
    marginBottom: 24,
  },
  kpiCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 22,
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 8px 22px rgba(15,23,42,0.055)",
    border: "1px solid #EEF2F7",
  },
  kpiIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  kpiValue: {
    color: DARK,
    fontSize: 30,
    fontWeight: 950,
    display: "block",
  },
  kpiLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: 900,
    marginTop: 4,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 420px",
    gap: 24,
    alignItems: "stretch",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
  panel: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 26,
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
    border: "1px solid #EEF2F7",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  sectionMini: {
    margin: 0,
    color: "#A8B3C7",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 2,
  },
  sectionTitle: {
    margin: "6px 0 0",
    color: DARK,
    fontSize: 26,
    fontWeight: 950,
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  },
  miniAnalysisCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 26,
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 16,
    border: "1px solid #EEF2F7",
  },
  miniIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  miniValue: {
    color: DARK,
    fontSize: 26,
    fontWeight: 950,
    display: "block",
  },
  miniTitle: {
    color: "#475569",
    fontSize: 12,
    fontWeight: 950,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
  miniDesc: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: 750,
    margin: "5px 0 0",
  },

  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
    border: "1px solid #EEF2F7",
  },
  reportLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  reportIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
  },
  reportTitle: {
    color: DARK,
    fontSize: 19,
    fontWeight: 950,
    margin: 0,
  },
  reportDesc: {
    color: MUTED,
    fontSize: 13,
    fontWeight: 700,
    margin: "6px 0 0",
  },
  reportIcons: {
    display: "flex",
    gap: 10,
  },
  excelIcon: {
    height: 46,
    borderRadius: 15,
    border: "none",
    backgroundColor: "#ECFDF5",
    color: "#059669",
    padding: "0 14px",
    display: "flex",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    fontWeight: 900,
  },
  pdfIcon: {
    height: 46,
    borderRadius: 15,
    border: "none",
    backgroundColor: "#FFF1F2",
    color: RED,
    padding: "0 14px",
    display: "flex",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    fontWeight: 900,
  },

  smartCard: {
    backgroundColor: DARK,
    borderRadius: 32,
    padding: 26,
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 16px 34px rgba(8,18,41,0.22)",
  },
  smartGlowOne: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: "50%",
    backgroundColor: "rgba(237,0,21,0.22)",
    filter: "blur(40px)",
  },
  smartGlowTwo: {
    position: "absolute",
    bottom: -90,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: "50%",
    backgroundColor: "rgba(99,102,241,0.2)",
    filter: "blur(40px)",
  },
  smartHeader: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  smartIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  smartMini: {
    margin: 0,
    color: "#FCA5A5",
    fontSize: 11,
    fontWeight: 950,
    letterSpacing: 2.5,
  },
  smartTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: 950,
    margin: "5px 0 0",
  },
  smartDesc: {
    position: "relative",
    zIndex: 1,
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: 750,
    lineHeight: "24px",
    marginBottom: 22,
  },
  smartList: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  smartRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 13,
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: 16,
  },
  smartRowIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  smartRowTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 950,
    margin: 0,
  },
  smartText: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: "21px",
    margin: "5px 0 0",
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    color: MUTED,
    fontWeight: 800,
    marginTop: 20,
  },
};