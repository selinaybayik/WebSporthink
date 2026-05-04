import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Video,
  BookOpen,
  Award,
  Edit3,
  Eye,
  UploadCloud,
  Layers,
  CheckCircle2,
  Clock3,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import {
  getInstructorTrainingDetail,
  updateTrainingPublishStatus,
} from "../../services/api";

const RED = "#ED0015";
const DARK = "#081229";
const MUTED = "#64748B";
const BG = "#F4F5F7";

export default function EgitmenEgitimDetay({ user }) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const adminMode = location.state?.adminMode;

  const egitimId = location.state?.egitimId || location.state?.id || params.id;

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const courseTitle = course?.title || location.state?.title || "Eğitim Detayı";

  const loadTrainingDetail = async () => {
    if (!egitimId) return;

    try {
      setLoading(true);

      const data = await getInstructorTrainingDetail(egitimId);

      if (data?.course) setCourse(data.course);
      if (Array.isArray(data?.modules)) setModules(data.modules);
      setQuiz(data?.quiz || null);
    } catch (error) {
      console.error("Eğitim detay yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainingDetail();
  }, [egitimId]);

  const handlePublishStatus = async (aktifMi) => {
    const ok = window.confirm(
      aktifMi
        ? "Bu eğitim kullanıcılar tarafından görünür olacak. Devam edilsin mi?"
        : "Bu eğitim kullanıcılardan gizlenecek. Devam edilsin mi?"
    );

    if (!ok) return;

    try {
      await updateTrainingPublishStatus(egitimId, aktifMi);
      await loadTrainingDetail();
      window.alert(aktifMi ? "Eğitim yayına alındı." : "Eğitim taslağa çekildi.");
    } catch (error) {
      window.alert(error.message || "İşlem gerçekleştirilemedi.");
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>Eğitim detayı yükleniyor...</div>
      </div>
    );
  }

  const totalContents = modules.reduce(
    (sum, module) => sum + Number(module.contents?.length || 0),
    0
  );

  return (
    <div style={styles.page}>
      <section style={styles.topBar}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Geri Dön
        </button>

        <div style={styles.topActions}>
          <button
            style={styles.softButton}
            onClick={() =>
              navigate(`/egitmen/onizleme/${course?.id || egitimId}`, {
                state: {
                  id: course?.id || egitimId,
                  egitimId: course?.id || egitimId,
                  egitim: course,
                },
              })
            }
          >
            <Eye size={18} />
            Önizle
          </button>

          <button
            style={course?.aktif_mi ? styles.draftButton : styles.publishButton}
            onClick={() => handlePublishStatus(!course?.aktif_mi)}
          >
            <UploadCloud size={18} />
            {course?.aktif_mi ? "Taslağa Çek" : "Yayına Al"}
          </button>
        </div>
      </section>

     <section style={styles.hero}>

  {course?.kapak_url ? (
    <img
      src={course.kapak_url}
      alt={courseTitle}
      style={styles.heroCover}
    />
  ) : (
    <div style={styles.heroIcon}>
      <BookOpen size={44} color={RED} />
    </div>
  )}

  <div style={{ flex: 1 }}>
          <div style={styles.badgeRow}>
            <span style={styles.categoryBadge}>
              {String(course?.category || "GENEL").toUpperCase()}
            </span>

            <span style={course?.aktif_mi ? styles.liveBadge : styles.draftBadge}>
              {course?.aktif_mi ? "YAYINDA" : "TASLAK"}
            </span>
          </div>

          <h1 style={styles.heroTitle}>{courseTitle}</h1>

          <p style={styles.heroDesc}>
            Bu alanda eğitimin içerik yapısını, modüllerini, kaynaklarını ve yayın durumunu yönetebilirsin.
          </p>

          <div style={styles.heroStats}>
            <HeroStat icon={Layers} value={modules.length} label="MODÜL" />
            <HeroStat icon={FileText} value={totalContents} label="İÇERİK" />
            <HeroStat icon={Award} value={quiz ? "VAR" : "YOK"} label="QUIZ" />
            <HeroStat
              icon={CheckCircle2}
              value={course?.aktif_mi ? "AKTİF" : "PASİF"}
              label="DURUM"
            />
          </div>
        </div>
      </section>

      <section style={styles.manageGrid}>
        <div style={styles.leftCol}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.kicker}>GENEL YÖNETİM</p>
                <h2 style={styles.cardTitle}>Eğitim Bilgileri</h2>
              </div>

              <button
                style={styles.editButton}
                onClick={() =>
                  navigate("/egitmen/kaynak-yonetimi", {
                    state: {
                      mode: "edit",
                      egitimId: course?.id,
                      egitim: course,
                    },
                  })
                }
              >
                <Edit3 size={18} />
                İçeriği Düzenle
              </button>
            </div>

            <div style={styles.infoGrid}>
              <InfoItem label="Eğitim Başlığı" value={course?.title || "-"} />
              <InfoItem label="Kategori" value={course?.category || "Genel"} />
              <InfoItem label="Yayın Durumu" value={course?.aktif_mi ? "Yayında" : "Taslak"} />
              <InfoItem label="Eğitim ID" value={course?.id || egitimId} />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.kicker}>MÜFREDAT YAPISI</p>
                <h2 style={styles.cardTitle}>Modüller ve İçerikler</h2>
              </div>

              <span style={styles.countBadge}>{modules.length} Modül</span>
            </div>

            {modules.length === 0 ? (
              <div style={styles.emptyCard}>Bu eğitime ait modül bulunamadı.</div>
            ) : (
              <div style={styles.moduleList}>
                {modules.map((module, index) => (
                  <ModuleBlock key={module.bolum_id || index} module={module} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside style={styles.rightCol}>
          <div style={styles.sideCardDark}>
            <p style={styles.darkKicker}>YÖNETİM DURUMU</p>
            <h2 style={styles.darkTitle}>
              {course?.aktif_mi ? "Eğitim Yayında" : "Eğitim Taslakta"}
            </h2>

            <p style={styles.darkText}>
              {course?.aktif_mi
                ? "Bu eğitim kullanıcılar tarafından görüntülenebilir."
                : "Eğitim henüz kullanıcı tarafında görünür değil."}
            </p>

            <button
              style={styles.bigRedButton}
              onClick={() => handlePublishStatus(!course?.aktif_mi)}
            >
              {course?.aktif_mi ? "Taslağa Çek" : "Yayına Al"}
              <ChevronRight size={19} />
            </button>
          </div>

          <div style={styles.sideCard}>
            <div style={styles.sideIcon}>
              <Sparkles size={24} color={RED} />
            </div>

            <h3 style={styles.sideTitle}>Hızlı Yönetim</h3>

            <button
              style={styles.sideAction}
              onClick={() =>
                navigate("/egitmen/kaynak-yonetimi", {
                  state: {
                    mode: "edit",
                    egitimId: course?.id,
                    egitim: course,
                  },
                })
              }
            >
              İçerikleri Düzenle
              <ChevronRight size={18} />
            </button>

            <button
              style={styles.sideAction}
              onClick={() =>
                navigate(`/egitmen/onizleme/${course?.id || egitimId}`, {
                  state: {
                    id: course?.id || egitimId,
                    egitimId: course?.id || egitimId,
                    egitim: course,
                  },
                })
              }
            >
              Eğitimi Önizle
              <ChevronRight size={18} />
            </button>
          </div>

          <div style={styles.quizCard}>
            <div style={styles.quizIcon}>
              <Award size={28} color={RED} />
            </div>

            <div>
              <p style={styles.kicker}>DEĞERLENDİRME</p>
              <h3 style={styles.quizTitle}>
                {quiz ? quiz.baslik || "Eğitim Sonu Quiz" : "Quiz Yok"}
              </h3>
              <p style={styles.quizDesc}>
                {quiz
                  ? `${quiz.soru_sayisi || 0} Soru · Geçme Notu %${quiz.gecme_notu || 70}`
                  : "Bu eğitim için henüz quiz oluşturulmamış."}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function HeroStat({ icon: Icon, value, label }) {
  return (
    <div style={styles.heroStat}>
      <Icon size={20} color={RED} />
      <div>
        <strong style={styles.heroStatValue}>{value}</strong>
        <span style={styles.heroStatLabel}>{label}</span>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <p style={styles.infoLabel}>{label}</p>
      <h3 style={styles.infoValue}>{value}</h3>
    </div>
  );
}

function ModuleBlock({ module, index }) {
  return (
    <div style={styles.moduleBlock}>
      <div style={styles.moduleHeader}>
        <div style={styles.moduleNo}>{String(index + 1).padStart(2, "0")}</div>

        <div style={{ flex: 1 }}>
          <h3 style={styles.moduleTitle}>{module.baslik || "Modül"}</h3>
          <p style={styles.moduleDesc}>{module.contents?.length || 0} içerik</p>
        </div>

        <span style={styles.moduleBadge}>MODÜL</span>
      </div>

      {module.contents?.length > 0 && (
        <div style={styles.contentList}>
          {module.contents.map((content) => {
            let IconComponent = FileText;
            let desc = "İçerik";

            if (content.tip_id === 1) {
              IconComponent = Video;
              desc = "Video Ders";
            }

            if (content.tip_id === 2) {
              IconComponent = FileText;
              desc = "PDF / Doküman";
            }

            if (content.tip_id === 3) {
              IconComponent = BookOpen;
              desc = "Metin İçeriği";
            }

            if (content.tip_id === 4) {
              IconComponent = Award;
              desc = "Quiz";
            }

            return (
              <div key={content.icerik_id} style={styles.contentRow}>
                <div style={styles.contentIcon}>
                  <IconComponent size={20} color={RED} />
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={styles.contentTitle}>{content.baslik || "İsimsiz İçerik"}</h4>
                  <p style={styles.contentDesc}>{desc}</p>
                </div>

                <Clock3 size={17} color="#CBD5E1" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    fontFamily: "Inter, Arial, sans-serif",
    padding: 28,
  },

  loadingCard: {
    background: "#fff",
    borderRadius: 28,
    padding: 30,
    fontWeight: 900,
    color: DARK,
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
    gap: 16,
  },

  backButton: {
    height: 46,
    border: "none",
    background: "#fff",
    color: MUTED,
    borderRadius: 16,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontWeight: 900,
    boxShadow: "0 8px 22px rgba(15,23,42,0.05)",
  },

  topActions: {
    display: "flex",
    gap: 10,
  },

  softButton: {
    height: 46,
    border: "1px solid #E2E8F0",
    background: "#fff",
    color: DARK,
    borderRadius: 16,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontWeight: 900,
  },

  publishButton: {
    height: 46,
    border: "none",
    background: RED,
    color: "#fff",
    borderRadius: 16,
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontWeight: 900,
    boxShadow: "0 12px 28px rgba(237,0,21,0.22)",
  },

  draftButton: {
    height: 46,
    border: "none",
    background: DARK,
    color: "#fff",
    borderRadius: 16,
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontWeight: 900,
  },

  hero: {
    background: "linear-gradient(135deg, #FFFFFF 0%, #FFF1F2 100%)",
    border: "1px solid #FFE1E4",
    borderRadius: 34,
    padding: 30,
    display: "flex",
    gap: 28,
    alignItems: "center",
    boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
    marginBottom: 26,
  },

  heroIcon: {
    width: 110,
    height: 110,
    borderRadius: 30,
    background: "#fff",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 14px 30px rgba(237,0,21,0.10)",
    flexShrink: 0,
  },
   heroCover: {
  width: 120,
  height: 120,
  borderRadius: 32,
  objectFit: "cover",
  flexShrink: 0,
  boxShadow: "0 14px 30px rgba(237,0,21,0.10)",
},

  badgeRow: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  categoryBadge: {
    background: "#F1F5F9",
    color: MUTED,
    borderRadius: 999,
    padding: "9px 14px",
    fontSize: 11,
    fontWeight: 900,
  },

  liveBadge: {
    background: "#ECFDF5",
    color: "#059669",
    borderRadius: 999,
    padding: "9px 14px",
    fontSize: 11,
    fontWeight: 900,
  },

  draftBadge: {
    background: "#FFF7ED",
    color: "#EA580C",
    borderRadius: 999,
    padding: "9px 14px",
    fontSize: 11,
    fontWeight: 900,
  },

  heroTitle: {
    fontSize: "clamp(30px, 3vw, 46px)",
    fontWeight: 950,
    color: DARK,
    margin: 0,
    lineHeight: 1.1,
  },

  heroDesc: {
    color: MUTED,
    fontWeight: 700,
    fontSize: 14,
    marginTop: 12,
    maxWidth: 760,
    lineHeight: "22px",
  },

  heroStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
    gap: 12,
    marginTop: 22,
  },

  heroStat: {
    minHeight: 70,
    borderRadius: 20,
    background: "rgba(255,255,255,0.78)",
    border: "1px solid #F1F5F9",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 16px",
  },

  heroStatValue: {
    display: "block",
    color: DARK,
    fontSize: 18,
    fontWeight: 950,
  },

  heroStatLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 1.4,
  },

  manageGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: 24,
    alignItems: "start",
  },

  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },

  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    position: "sticky",
    top: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 30,
    padding: 24,
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
    border: "1px solid #E2E8F0",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },

  kicker: {
    color: RED,
    fontSize: 11,
    fontWeight: 950,
    letterSpacing: 2.5,
    margin: 0,
  },

  cardTitle: {
    color: DARK,
    fontSize: 22,
    fontWeight: 950,
    margin: "6px 0 0",
  },

  editButton: {
    height: 46,
    background: DARK,
    color: "#fff",
    border: "none",
    borderRadius: 16,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 900,
    cursor: "pointer",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 14,
  },

  infoItem: {
    background: "#F8FAFC",
    borderRadius: 20,
    padding: 18,
    border: "1px solid #EEF2F7",
  },

  infoLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.6,
    margin: 0,
    textTransform: "uppercase",
  },

  infoValue: {
    color: DARK,
    fontSize: 16,
    fontWeight: 950,
    margin: "8px 0 0",
  },

  countBadge: {
    background: "#F1F5F9",
    color: MUTED,
    padding: "10px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
  },

  emptyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 24,
    color: MUTED,
    fontWeight: 800,
  },

  moduleList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  moduleBlock: {
    background: "#F8FAFC",
    border: "1px solid #EEF2F7",
    borderRadius: 26,
    padding: 18,
  },

  moduleHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  moduleNo: {
    width: 54,
    height: 54,
    borderRadius: 18,
    background: "#fff",
    display: "grid",
    placeItems: "center",
    color: RED,
    fontWeight: 950,
    boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
  },

  moduleTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: 950,
    margin: 0,
  },

  moduleDesc: {
    color: MUTED,
    fontSize: 12,
    fontWeight: 800,
    margin: "5px 0 0",
  },

  moduleBadge: {
    background: "#fff",
    color: MUTED,
    padding: "9px 12px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 900,
  },

  contentList: {
    marginTop: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  contentRow: {
    background: "#fff",
    borderRadius: 18,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 13,
    border: "1px solid #EEF2F7",
  },

  contentIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    background: "#FFF1F2",
    display: "grid",
    placeItems: "center",
  },

  contentTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: 950,
    margin: 0,
  },

  contentDesc: {
    color: MUTED,
    fontSize: 11,
    fontWeight: 800,
    margin: "4px 0 0",
  },

  sideCardDark: {
    background: DARK,
    color: "#fff",
    borderRadius: 30,
    padding: 24,
    boxShadow: "0 16px 34px rgba(8,18,41,0.22)",
  },

  darkKicker: {
    color: "#FCA5A5",
    fontSize: 11,
    fontWeight: 950,
    letterSpacing: 2.5,
    margin: 0,
  },

  darkTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: 950,
    margin: "14px 0 8px",
  },

  darkText: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: "22px",
    marginBottom: 22,
  },

  bigRedButton: {
    width: "100%",
    height: 54,
    background: RED,
    color: "#fff",
    border: "none",
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 950,
    cursor: "pointer",
  },

  sideCard: {
    background: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 30,
    padding: 22,
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
  },

  sideIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    background: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    marginBottom: 14,
  },

  sideTitle: {
    color: DARK,
    fontSize: 20,
    fontWeight: 950,
    margin: "0 0 14px",
  },

  sideAction: {
    width: "100%",
    minHeight: 48,
    border: "none",
    borderRadius: 16,
    background: "#F8FAFC",
    color: DARK,
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 15px",
    marginBottom: 10,
    cursor: "pointer",
  },

  quizCard: {
    background: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 30,
    padding: 22,
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
  },

  quizIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    background: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },

  quizTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: 950,
    margin: "5px 0 4px",
  },

  quizDesc: {
    color: MUTED,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: "20px",
    margin: 0,
  },
};