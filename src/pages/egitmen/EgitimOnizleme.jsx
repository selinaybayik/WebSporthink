import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  PlayCircle,
  Lock,
  FileText,
  Download,
  Trophy,
  Star,
  Mail,
  ChevronRight,
  Clock,
  ShieldCheck,
  Search,
  Award,
} from "lucide-react";

import { getInstructorPreview, publishTraining } from "../../services/api";

const RED = "#E5252A";
const DARK = "#071330";
const MUTED = "#94A3B8";
const BG = "#F6F8FC";

export default function EgitimOnizleme() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const egitim = location.state?.egitim || {};

  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(null);

  const getValidEgitimId = () => {
    const rawEgitimId =
      params?.id ||
      params?.egitimId ||
      location.state?.egitimId ||
      location.state?.egitim_id ||
      location.state?.id ||
      location.state?.egitim?.egitim_id ||
      location.state?.egitim?.id ||
      egitim?.egitim_id ||
      egitim?.id;

    const egitimId = Number(rawEgitimId);

    if (!egitimId || Number.isNaN(egitimId)) {
      console.log("Önizleme için geçerli eğitim ID yok:", {
        params,
        state: location.state,
      });
      return null;
    }

    return egitimId;
  };

  useEffect(() => {
    loadPreview();
  }, []);

  const loadPreview = async () => {
    try {
      setLoading(true);

      const egitimId = getValidEgitimId();

      if (!egitimId) {
        const draft = location.state?.egitim || location.state || {};

        const formattedDraft = {
          title: draft.title || draft.baslik || "Yeni Eğitim Önizleme",
          description: draft.description || draft.aciklama || "",
          duration: draft.duration || draft.sure || "0 dk",
          xp: draft.xp || draft.xp_degeri || 0,
          category: draft.category || draft.kategori || "Genel",
          level: draft.level || "Başlangıç",
          instructor: {
            avatarEmoji: "🎓",
            label: "Eğitim Uzmanı",
            name: "Sporthink Akademi",
            role: "Eğitim Uzmanı",
          },
          modules:
            draft.modules?.map((item, index) => ({
              id: item.id || index,
              title: item.title || item.baslik || `Video ${index + 1}`,
              duration: "30",
              status: "preview",
            })) || [],
          resources:
            draft.resources?.map((item, index) => ({
              id: item.id || index,
              title: item.title || item.baslik || "Kaynak",
              type: item.type || "PDF",
              size: "Kaynak",
            })) || [],
          quiz: draft.quiz || null,
          isDraftPreview: true,
        };

        setTraining(formattedDraft);
        return;
      }

      const data = await getInstructorPreview(egitimId);

      if (!data) {
        setTraining(null);
        return;
      }

      const flatContents = [];

      (data.modules || []).forEach((modul) => {
        (modul.contents || []).forEach((content) => {
          flatContents.push({
            ...content,
            moduleTitle: modul.baslik,
          });
        });
      });

      const formattedTraining = {
        title: data.course?.title || data.course?.baslik || "Eğitim Önizleme",
        description: data.course?.desc || data.course?.aciklama || "",
        duration: data.course?.duration || data.course?.sure || "0 dk",
        xp: data.course?.xp || data.course?.xp_degeri || 0,
        category: data.course?.category || data.course?.kategori || "Genel",
        level: "Başlangıç",
        instructor: {
          avatarEmoji: "👨‍🏫",
          label: "Eğitim Uzmanı",
          name: "Sporthink Akademi",
          role: "Eğitim Uzmanı",
        },
        modules: flatContents
          .filter((item) => Number(item.tip_id) === 1)
          .map((item, index) => ({
            id: item.icerik_id || item.id || index,
            title: item.baslik || `Video ${index + 1}`,
            duration: "30",
            status: "preview",
          })),
        resources: flatContents
          .filter((x) => Number(x.tip_id) === 2 || Number(x.tip_id) === 3)
          .map((res, index) => ({
            id: res.icerik_id || res.id || index,
            title: res.baslik || "Kaynak",
            type: Number(res.tip_id) === 2 ? "PDF" : "Metin",
            size: Number(res.tip_id) === 2 ? "Kaynak" : "Kaynak",
          })),
        quiz: data.quiz || null,
        isDraftPreview: false,
      };

      setTraining(formattedTraining);
    } catch (err) {
      console.log("Önizleme yükleme hatası:", err.message);
      window.alert("Önizleme yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      if (training?.isDraftPreview) {
        window.alert(
          "Bu eğitim henüz veritabanına kaydedilmedi. Önce eğitimi kaydet, sonra yayına al."
        );
        return;
      }

      const egitimId = getValidEgitimId();

      if (!egitimId) {
        window.alert("Eğitim ID bulunamadı. Yayına alınamadı.");
        return;
      }

      await publishTraining(egitimId);

      window.alert("🚀 Eğitim başarıyla yayına alındı!");
      navigate(-1);
    } catch (error) {
      console.log("Yayınlama Hatası:", error.message);
      window.alert(error.message || "Eğitim yayınlanamadı.");
    }
  };

  const totalModules = training?.modules?.length || 0;
  const completedModules = totalModules;
  const progress = totalModules > 0 ? 100 : 0;

  if (loading || !training) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingBox}>Önizleme yükleniyor...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.topBar}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Geri Dön
        </button>

        <div style={styles.searchBox}>
          <Search size={18} color={MUTED} />
          <span>Eğitim detayında ara...</span>
        </div>

        <button style={styles.bellButton}>
          <Bell size={20} color="#fff" />
        </button>
      </header>

      <main style={styles.layout}>
        <div style={styles.leftCol}>
          <section style={styles.heroCard}>
            <div style={styles.heroIcon}>
              <ShieldCheck size={62} color={RED} />
            </div>

            <div style={styles.heroContent}>
              <div style={styles.chipRow}>
                <span style={styles.softChip}>{training.category}</span>
                <span style={styles.requiredChip}>ZORUNLU</span>
              </div>

              <h1 style={styles.title}>{training.title}</h1>
              <p style={styles.desc}>{training.description || "Eğitim açıklaması bulunmuyor."}</p>

              <div style={styles.infoGrid}>
                <InfoBox icon={Clock} label="Tahmini Süre" value={training.duration} />
                <InfoBox icon={CheckCircle2} label="Modül Sayısı" value={totalModules} />
                <InfoBox icon={Star} label="Kazanılacak XP" value={`${training.xp} XP`} red />
              </div>
            </div>
          </section>

          <section style={styles.contentCard}>
            <SectionHead
              title="EĞİTİM AKIŞI"
              sub="Modülleri sırayla tamamlayarak ilerle"
              badge={`${completedModules} / ${totalModules} Tamamlandı`}
            />

            {training.modules.length === 0 ? (
              <EmptyRow text="Henüz video/modül eklenmedi." />
            ) : (
              training.modules.map((module, index) => (
                <button key={module.id} style={styles.moduleRow}>
                  <div style={styles.moduleIcon}>
                    <CheckCircle2 size={21} color={RED} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={styles.moduleTitle}>
                      {index + 1}. {module.title}
                    </h3>
                    <p style={styles.moduleMeta}>
                      <Clock size={14} /> {module.duration}
                    </p>
                  </div>

                  <span style={styles.doneBadge}>Tamamlandı</span>
                  <ChevronRight size={20} color={MUTED} />
                </button>
              ))
            )}
          </section>

          <section style={styles.contentCard}>
            <SectionHead
              title="EĞİTİM KAYNAKLARI"
              sub="Bu eğitime ait doküman ve kaynaklar"
            />

            {training.resources.length === 0 ? (
              <EmptyRow text="Henüz kaynak eklenmedi." />
            ) : (
              training.resources.map((res) => (
                <div key={res.id} style={styles.resourceRow}>
                  <div style={styles.resourceIcon}>
                    <FileText size={22} color="#fff" />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={styles.resourceTitle}>{res.title}</h3>
                    <p style={styles.resourceMeta}>
                      {res.type} • {res.size}
                    </p>
                  </div>

                  <Download size={20} color={RED} />
                </div>
              ))
            )}
          </section>

          <section style={styles.quizWideCard}>
            <div style={styles.quizIconLarge}>
              <Trophy size={34} color={RED} />
            </div>

            {training.quiz ? (
              <>
                <h2 style={styles.quizWideTitle}>
                  {training.quiz.baslik || "Eğitim Sonu Testi"}
                </h2>
                <p style={styles.quizWideSub}>
                  {training.quiz.soru_sayisi || 1} Soru • Geçme Notu: %
                  {training.quiz.gecme_notu || 70}
                </p>
              </>
            ) : (
              <>
                <h2 style={styles.quizWideTitle}>Quiz Henüz Eklenmedi</h2>
                <p style={styles.quizWideSub}>
                  Eğitmen henüz değerlendirme quiz’i oluşturmadı.
                </p>
              </>
            )}
          </section>

          <div style={styles.bottomButtons}>
            <button style={styles.publishButton} onClick={handlePublish}>
              🚀 YAYINA AL
            </button>

            <button style={styles.editButton} onClick={() => navigate(-1)}>
              DÜZENLEMEYE GERİ DÖN <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <aside style={styles.rightCol}>
          <section style={styles.progressPanel}>
            <p style={styles.panelLabel}>İLERLEME DURUMU</p>
            <h2 style={styles.progressTitle}>%{progress} Tamamlandı</h2>
            <p style={styles.progressText}>
              {completedModules} / {totalModules} modül
            </p>

            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>

            <div style={styles.successBox}>
              <strong>Tebrikler!</strong>
              <span>Tüm modülleri başarıyla tamamladınız.</span>
            </div>

            <button style={styles.quizButton}>
              <PlayCircle size={18} color="#fff" />
              Quizi Başlat
            </button>
          </section>

          <section style={styles.sideCard}>
            <p style={styles.sideLabel}>EĞİTİM UZMANI</p>

            <div style={styles.instructorRow}>
              <div style={styles.instructorAvatar}>{training.instructor.avatarEmoji}</div>
              <div>
                <h3 style={styles.instructorName}>{training.instructor.name}</h3>
                <p style={styles.instructorRole}>{training.instructor.role}</p>
              </div>
            </div>

            <button style={styles.messageButton}>
              <Mail size={18} />
              Eğitmene Soru Sor
            </button>
          </section>

          <section style={styles.sideCard}>
            <div style={styles.quizSmallRow}>
              <div style={styles.quizSmallIcon}>
                <Trophy size={28} color={RED} />
              </div>
              <div>
                <p style={styles.sideLabel}>EĞİTİM SONU TESTİ</p>
                <h3 style={styles.smallTitle}>
                  {training.quiz?.baslik || "Eğitim sonu testi"}
                </h3>
                <p style={styles.instructorRole}>
                  {training.quiz?.soru_sayisi || 1} Soru • Geçme Notu: %
                  {training.quiz?.gecme_notu || 70}
                </p>
              </div>
            </div>

            <button style={styles.outlineButton}>Quiz’i Başlat</button>
          </section>

          <section style={styles.certificateCard}>
            <div style={styles.certIcon}>
              <Award size={28} color="#F59E0B" />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={styles.smallTitle}>Başarı Sertifikası</h3>
              <p style={styles.instructorRole}>Sertifikan hazır!</p>
            </div>

            <ChevronRight size={22} color="#F59E0B" />
          </section>
        </aside>
      </main>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value, red }) {
  return (
    <div style={styles.infoBox}>
      <div style={styles.infoIcon}>
        <Icon size={20} color={red ? RED : "#475569"} />
      </div>
      <div>
        <p style={styles.infoLabel}>{label}</p>
        <h3 style={{ ...styles.infoValue, color: red ? RED : DARK }}>{value}</h3>
      </div>
    </div>
  );
}

function SectionHead({ title, sub, badge }) {
  return (
    <div style={styles.sectionHead}>
      <div>
        <h2 style={styles.sectionTitle}>{title}</h2>
        <p style={styles.sectionSub}>{sub}</p>
      </div>

      {badge && <span style={styles.sectionBadge}>{badge}</span>}
    </div>
  );
}

function EmptyRow({ text }) {
  return <div style={styles.emptyRow}>{text}</div>;
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    fontFamily: "Inter, Arial, sans-serif",
    color: DARK,
  },

  topBar: {
    height: 72,
    backgroundColor: "#fff",
    borderBottom: "1px solid #E5EAF1",
    display: "flex",
    alignItems: "center",
    gap: 18,
    padding: "0 22px",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },

  backButton: {
    border: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: MUTED,
    fontWeight: 800,
    cursor: "pointer",
  },

  searchBox: {
    width: 400,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 15px",
    color: MUTED,
    fontSize: 13,
    fontWeight: 700,
  },

  bellButton: {
    marginLeft: "auto",
    width: 46,
    height: 46,
    borderRadius: 15,
    border: "none",
    backgroundColor: RED,
    boxShadow: "0 10px 22px rgba(229,37,42,0.25)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 370px",
    gap: 26,
    padding: "34px 22px 48px",
    maxWidth: 1600,
    margin: "0 auto",
  },

  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
    minWidth: 0,
  },

  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },

  heroCard: {
    backgroundColor: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 28,
    padding: 30,
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: 28,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
  },

  heroIcon: {
    width: 136,
    height: 136,
    borderRadius: 30,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
  },

  chipRow: {
    display: "flex",
    gap: 10,
    marginBottom: 14,
  },

  softChip: {
    backgroundColor: "#F1F5F9",
    color: DARK,
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
  },

  requiredChip: {
    backgroundColor: "#FFF1F2",
    color: RED,
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 950,
  },

  title: {
    margin: 0,
    fontSize: "clamp(34px, 4vw, 50px)",
    lineHeight: 1.05,
    fontWeight: 950,
    color: DARK,
  },

  desc: {
    margin: "14px 0 24px",
    color: "#475569",
    fontSize: 15,
    fontWeight: 650,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },

  infoBox: {
    backgroundColor: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 16,
    padding: 15,
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 6px 16px rgba(15,23,42,0.04)",
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    display: "grid",
    placeItems: "center",
  },

  infoLabel: {
    margin: 0,
    fontSize: 11,
    fontWeight: 850,
    color: MUTED,
  },

  infoValue: {
    margin: "4px 0 0",
    fontSize: 15,
    fontWeight: 950,
  },

  contentCard: {
    backgroundColor: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 28,
    padding: 26,
    boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
  },

  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 22,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 15,
    letterSpacing: 3,
    color: MUTED,
    fontWeight: 950,
  },

  sectionSub: {
    margin: "8px 0 0",
    color: MUTED,
    fontSize: 13,
    fontWeight: 700,
  },

  sectionBadge: {
    backgroundColor: "#ECFDF5",
    color: "#059669",
    padding: "9px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 950,
  },

  moduleRow: {
    width: "100%",
    border: "1px solid #E2E8F0",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 12,
    textAlign: "left",
    cursor: "pointer",
  },

  moduleIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
  },

  moduleTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 950,
    color: DARK,
  },

  moduleMeta: {
    margin: "8px 0 0",
    color: MUTED,
    fontSize: 13,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 5,
  },

  doneBadge: {
    backgroundColor: "#ECFDF5",
    color: "#059669",
    padding: "10px 15px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 950,
  },

  emptyRow: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 18,
    color: MUTED,
    fontSize: 13,
    fontWeight: 800,
  },

  resourceRow: {
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  resourceIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
  },

  resourceTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 950,
    color: DARK,
  },

  resourceMeta: {
    margin: "6px 0 0",
    color: RED,
    fontSize: 12,
    fontWeight: 900,
  },

  quizWideCard: {
    backgroundColor: "#fff",
    border: "1.5px dashed #FCA5A5",
    borderRadius: 28,
    padding: 34,
    textAlign: "center",
  },

  quizIconLarge: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 18px",
  },

  quizWideTitle: {
    margin: 0,
    fontSize: 22,
    color: DARK,
    fontWeight: 950,
  },

  quizWideSub: {
    margin: "9px 0 0",
    color: MUTED,
    fontSize: 13,
    fontWeight: 750,
  },

  bottomButtons: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  publishButton: {
    height: 58,
    border: "none",
    borderRadius: 18,
    backgroundColor: RED,
    color: "#fff",
    fontWeight: 950,
    fontSize: 15,
    letterSpacing: 0.8,
    cursor: "pointer",
  },

  editButton: {
    height: 58,
    border: "none",
    borderRadius: 18,
    backgroundColor: DARK,
    color: "#fff",
    fontWeight: 950,
    fontSize: 14,
    letterSpacing: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  progressPanel: {
    backgroundColor: "#030A1D",
    color: "#fff",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 18px 35px rgba(3,10,29,0.18)",
  },

  panelLabel: {
    margin: 0,
    color: "#FCA5A5",
    letterSpacing: 1.4,
    fontSize: 12,
    fontWeight: 950,
  },

  progressTitle: {
    margin: "13px 0 8px",
    fontSize: 30,
    fontWeight: 950,
  },

  progressText: {
    margin: 0,
    color: "#CBD5E1",
    fontWeight: 800,
  },

  progressTrack: {
    height: 15,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    overflow: "hidden",
    margin: "22px 0 18px",
  },

  progressFill: {
    height: "100%",
    backgroundColor: RED,
    borderRadius: 999,
  },

  successBox: {
    backgroundColor: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "#D7DEEA",
    marginBottom: 20,
  },

  quizButton: {
    width: "100%",
    height: 54,
    border: "none",
    borderRadius: 16,
    backgroundColor: RED,
    color: "#fff",
    fontWeight: 950,
    fontSize: 15,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 12px 20px rgba(229,37,42,0.30)",
  },

  sideCard: {
    backgroundColor: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
  },

  sideLabel: {
    margin: "0 0 13px",
    color: RED,
    letterSpacing: 1.3,
    fontSize: 12,
    fontWeight: 950,
  },

  instructorRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },

  instructorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: DARK,
    display: "grid",
    placeItems: "center",
    fontSize: 24,
  },

  instructorName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 950,
    color: DARK,
  },

  instructorRole: {
    margin: "5px 0 0",
    color: MUTED,
    fontSize: 13,
    fontWeight: 750,
  },

  messageButton: {
    width: "100%",
    height: 46,
    border: "none",
    borderRadius: 14,
    backgroundColor: "#EEF2F7",
    color: "#334155",
    fontWeight: 950,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },

  quizSmallRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },

  quizSmallIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
  },

  smallTitle: {
    margin: 0,
    color: DARK,
    fontSize: 16,
    fontWeight: 950,
  },

  outlineButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    border: `1.5px solid ${RED}`,
    backgroundColor: "#fff",
    color: RED,
    fontWeight: 950,
    cursor: "pointer",
    fontSize: 14,
  },

  certificateCard: {
    backgroundColor: "#FFFBEB",
    border: "1px solid #FCD34D",
    borderRadius: 24,
    padding: 22,
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  certIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#FEF3C7",
    display: "grid",
    placeItems: "center",
  },

  loadingBox: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    color: MUTED,
    fontWeight: 900,
  },
};