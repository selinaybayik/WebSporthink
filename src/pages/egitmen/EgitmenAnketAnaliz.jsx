import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  ClipboardList,
  MessageSquareText,
  Search,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  getInstructorSurveyAnalysis,
  deleteInstructorSurvey,
} from "../../services/api";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F4F5F7";

export default function EgitmenAnketAnaliz({ user }) {
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadAnalysis();
  }, [user?.id]);

  const loadAnalysis = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getInstructorSurveyAnalysis(user.id);
      setSurveys(Array.isArray(data.surveys) ? data.surveys : []);
    } catch (error) {
      console.log("Anket analiz hatası:", error.message);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    const confirmed = window.confirm(
      "Bu anketi kaldırmak istediğine emin misin?"
    );

    if (!confirmed) return;

    try {
      await deleteInstructorSurvey(surveyId);

      setSurveys((prev) => prev.filter((item) => item.id !== surveyId));

      window.alert("Anket kaldırıldı.");
    } catch (error) {
      window.alert(error.message || "Anket silinemedi.");
    }
  };

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const matchSearch = String(survey.title || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      if (filter === "answered") {
        return matchSearch && Number(survey.answeredCount || 0) > 0;
      }

      if (filter === "waiting") {
        return matchSearch && Number(survey.answeredCount || 0) === 0;
      }

      return matchSearch;
    });
  }, [surveys, search, filter]);

  const summary = useMemo(() => {
    const sent = filteredSurveys.reduce(
      (sum, item) => sum + Number(item.sentCount || 0),
      0
    );

    const answered = filteredSurveys.reduce(
      (sum, item) => sum + Number(item.answeredCount || 0),
      0
    );

    const avg =
      filteredSurveys.length > 0
        ? (
            filteredSurveys.reduce(
              (sum, item) => sum + Number(item.averageScore || 0),
              0
            ) / filteredSurveys.length
          ).toFixed(1)
        : 0;

    return {
      surveyCount: filteredSurveys.length,
      sent,
      answered,
      responseRate: sent > 0 ? Math.round((answered / sent) * 100) : 0,
      averageScore: avg,
    };
  }, [filteredSurveys]);

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Anket analizleri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.pageMini}>EĞİTMEN PANELİ</p>
          <h1 style={styles.title}>Anket Cevap Analizi</h1>
          <p style={styles.subtitle}>
            Öğrencilerine gönderdiğin anketlerin cevap oranı, ortalama puanı ve
            soru bazlı dağılımını takip et.
          </p>
        </div>

        <div style={styles.heroIcon}>
          <BarChart3 size={34} color="#fff" />
        </div>
      </section>

      <section style={styles.filterBar}>
        <div style={styles.searchBox}>
          <Search size={18} color={MUTED} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Anket ara..."
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterButtons}>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === "all" ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter("all")}
          >
            Tümü
          </button>

          <button
            style={{
              ...styles.filterButton,
              ...(filter === "answered" ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter("answered")}
          >
            Cevaplanan
          </button>

          <button
            style={{
              ...styles.filterButton,
              ...(filter === "waiting" ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter("waiting")}
          >
            Bekleyen
          </button>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <StatCard
          icon={ClipboardList}
          title="Toplam Anket"
          value={summary.surveyCount}
        />

        <StatCard icon={Users} title="Gönderilen" value={summary.sent} />

        <StatCard
          icon={TrendingUp}
          title="Cevap Oranı"
          value={`%${summary.responseRate}`}
        />

        <StatCard
          icon={Star}
          title="Ortalama Puan"
          value={`${summary.averageScore}/5`}
        />
      </section>

      {filteredSurveys.length === 0 ? (
        <div style={styles.emptyCard}>
          <h2>Analiz verisi bulunamadı</h2>
          <p>
            Arama veya filtreyi değiştirerek tekrar deneyebilirsin. Anket
            gönderildiğinde ve öğrenciler cevapladığında analizler burada
            görünür.
          </p>
        </div>
      ) : (
        <section style={styles.surveyList}>
          {filteredSurveys.map((survey) => (
            <SurveyAnalysisCard
              key={survey.id}
              survey={survey}
              onDelete={handleDeleteSurvey}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function SurveyAnalysisCard({ survey, onDelete }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <p style={styles.sectionMini}>ANKET</p>
          <h2 style={styles.cardTitle}>{survey.title}</h2>
        </div>

        <div style={styles.cardActions}>
          <div style={styles.scoreBox}>
            <span>{survey.averageScore}/5</span>
            <small>Ortalama</small>
          </div>

          <button
            style={styles.deleteSurveyButton}
            onClick={() => onDelete(survey.id)}
          >
            <Trash2 size={16} color="#fff" />
            Anketi Kaldır
          </button>
        </div>
      </div>

      <div style={styles.kpiRow}>
        <MiniKpi label="Gönderilen" value={survey.sentCount} />
        <MiniKpi label="Cevaplayan" value={survey.answeredCount} />
        <MiniKpi label="Cevap Oranı" value={`%${survey.responseRate}`} />
      </div>

      <div style={styles.sentimentGrid}>
        <div style={styles.sentimentCard}>
          <p>Olumlu</p>
          <strong>%{survey.positiveRate}</strong>
          <ProgressBar value={survey.positiveRate} color="#10B981" />
        </div>

        <div style={styles.sentimentCard}>
          <p>Olumsuz</p>
          <strong>%{survey.negativeRate}</strong>
          <ProgressBar value={survey.negativeRate} color={RED} />
        </div>
      </div>

      <div style={styles.questionsArea}>
        <div style={styles.questionTitle}>
          <MessageSquareText size={18} color={RED} />
          <span>Soru Bazlı Ortalama</span>
        </div>

        {survey.questions?.length > 0 ? (
          survey.questions.map((question) => (
            <div key={question.id} style={styles.questionRow}>
              <div>
                <p>{question.text}</p>
                <small>{question.answerCount} cevap</small>
              </div>

              <div style={styles.questionScore}>
                {question.averageScore}/5
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noQuestion}>Soru analizi bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>
        <Icon size={24} color={RED} />
      </div>

      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function MiniKpi({ label, value }) {
  return (
    <div style={styles.miniKpi}>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div style={styles.progressTrack}>
      <div
        style={{
          ...styles.progressFill,
          width: `${Math.min(100, Number(value || 0))}%`,
          backgroundColor: color,
        }}
      />
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

  loadingPage: {
    minHeight: "100vh",
    backgroundColor: BG,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  spinner: {
    width: 46,
    height: 46,
    border: "4px solid #FECACA",
    borderTopColor: RED,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: 14,
    color: MUTED,
    fontWeight: 800,
  },

  hero: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    border: "1px solid #EEF2F7",
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  pageMini: {
    margin: 0,
    color: "#A8B3C7",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 2,
  },

  title: {
    margin: "6px 0 0",
    color: DARK,
    fontSize: 42,
    fontWeight: 950,
  },

  subtitle: {
    color: MUTED,
    fontSize: 15,
    fontWeight: 700,
    maxWidth: 760,
    lineHeight: "24px",
  },

  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 14px 28px rgba(227,6,19,0.25)",
  },

  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    marginBottom: 24,
  },

  searchBox: {
    flex: 1,
    maxWidth: 430,
    height: 56,
    backgroundColor: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 20,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 14,
    fontWeight: 800,
    color: DARK,
  },

  filterButtons: {
    display: "flex",
    gap: 10,
  },

  filterButton: {
    height: 48,
    padding: "0 18px",
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    backgroundColor: "#fff",
    color: DARK,
    fontWeight: 900,
    cursor: "pointer",
  },

  filterButtonActive: {
    backgroundColor: RED,
    borderColor: RED,
    color: "#fff",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 18,
    marginBottom: 24,
  },

  statCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    border: "1px solid #EEF2F7",
    padding: 24,
    boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    marginBottom: 16,
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 40,
    border: "1px solid #EEF2F7",
    textAlign: "center",
    color: DARK,
  },

  surveyList: {
    display: "grid",
    gap: 22,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 34,
    padding: 28,
    border: "1px solid #EEF2F7",
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
    marginBottom: 22,
  },

  cardActions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  sectionMini: {
    margin: 0,
    color: "#A8B3C7",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 2,
  },

  cardTitle: {
    margin: "6px 0 0",
    color: DARK,
    fontSize: 25,
    fontWeight: 950,
  },

  scoreBox: {
    minWidth: 110,
    backgroundColor: DARK,
    color: "#fff",
    borderRadius: 22,
    padding: 16,
    textAlign: "center",
  },

  deleteSurveyButton: {
    height: 48,
    padding: "0 16px",
    borderRadius: 16,
    border: "none",
    backgroundColor: RED,
    color: "#fff",
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 14,
    marginBottom: 18,
  },

  miniKpi: {
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    padding: 18,
    border: "1px solid #E2E8F0",
  },

  sentimentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginBottom: 22,
  },

  sentimentCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    padding: 18,
    border: "1px solid #E2E8F0",
  },

  progressTrack: {
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 10,
  },

  progressFill: {
    height: "100%",
    borderRadius: 99,
  },

  questionsArea: {
    borderTop: "1px solid #EEF2F7",
    paddingTop: 20,
  },

  questionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: DARK,
    fontWeight: 950,
    marginBottom: 14,
  },

  questionRow: {
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: 20,
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    marginBottom: 10,
  },

  questionScore: {
    backgroundColor: "#FFF1F2",
    color: RED,
    borderRadius: 16,
    padding: "10px 14px",
    fontWeight: 950,
    whiteSpace: "nowrap",
  },

  noQuestion: {
    color: MUTED,
    fontWeight: 700,
  },
};