import React, { useState } from "react";
import {
  ClipboardList,
  Send,
  Plus,
  Trash2,
  BarChart3,
  Sparkles,
  CheckCircle2,
  MessageSquareText,
  ListChecks,
} from "lucide-react";

import { assignInstructorSurvey } from "../../services/api";
import { useNavigate } from "react-router-dom";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F4F5F7";

export default function EgitmenAnketYonetimi({ user }) {
  const [hedefKitle, setHedefKitle] = useState("my_students");
  const navigate = useNavigate();
  const [baslik, setBaslik] = useState("");
  const [sorular, setSorular] = useState([
    "Bu eğitim içeriğini faydalı buldunuz mu?",
    "Eğitimin anlatımı anlaşılır mıydı?",
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setSorular((prev) => [...prev, ""]);
  };

  const updateQuestion = (index, value) => {
    setSorular((prev) =>
      prev.map((soru, i) => (i === index ? value : soru))
    );
  };

  const removeQuestion = (index) => {
    if (sorular.length === 1) {
      window.alert("En az 1 soru olmalı.");
      return;
    }

    setSorular((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const cleanQuestions = sorular.map((s) => s.trim()).filter(Boolean);

    if (!baslik.trim()) {
      window.alert("Anket başlığı boş olamaz.");
      return;
    }

    if (cleanQuestions.length === 0) {
      window.alert("En az 1 anket sorusu eklemelisin.");
      return;
    }

    try {
      setLoading(true);

      const result = await assignInstructorSurvey({
        egitmenId: user?.id,
        hedefKitle,
        baslik: baslik.trim(),
        sorular: cleanQuestions,
      });

      window.alert(
        `Anket başarıyla atandı. ${result.atanan_kisi_sayisi || 0} kişiye gönderildi.`
      );

      setBaslik("");
      setSorular([""]);
      setHedefKitle("my_students");
    } catch (error) {
      window.alert(error.message || "Anket atanamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.iconBox}>
            <ClipboardList size={30} color="#fff" />
          </div>

          <div>
            <p style={styles.pageMini}>EĞİTMEN PANELİ</p>
            <h1 style={styles.title}>Anket Yönetimi</h1>
            <p style={styles.subtitle}>
              Öğrencilerine memnuniyet, eğitim kalitesi ve gelişim geri bildirimi anketleri ata.
            </p>
          </div>
        </div>

       <button
  type="button"
  style={styles.heroBadge}
  onClick={() => navigate("/egitmen/anket-analiz")}
>
  <BarChart3 size={23} color={RED} />
  <div>
    <strong>Geri Bildirim Analizi</strong>
    <span>Cevap analizlerini görüntüle</span>
  </div>
</button>
      </section>

      <main style={styles.contentGrid}>
        <section style={styles.card}>
          <div style={styles.cardHead}>
            <div>
              <p style={styles.sectionMini}>ANKET FORMU</p>
              <h2 style={styles.cardTitle}>Yeni Anket Oluştur</h2>
            </div>

            <div style={styles.formIcon}>
              <MessageSquareText size={24} color={RED} />
            </div>
          </div>

          

          <label style={styles.label}>ANKET BAŞLIĞI</label>

          <input
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            placeholder="Örn: Etkili İletişim Eğitimi Memnuniyet Anketi"
            style={styles.input}
          />

          <div style={styles.questionHeader}>
            <div>
              <label style={styles.label}>ANKET SORULARI</label>
              <p style={styles.questionHint}>
                Kullanıcıların cevaplayacağı soruları buradan düzenleyebilirsin.
              </p>
            </div>

            <button style={styles.addButton} onClick={addQuestion}>
              <Plus size={17} color="#fff" />
              Soru Ekle
            </button>
          </div>

          <div style={styles.questionList}>
            {sorular.map((soru, index) => (
              <div key={index} style={styles.questionBox}>
                <span style={styles.questionNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <input
                  value={soru}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder="Anket sorusunu yaz..."
                  style={styles.questionInput}
                />

                <button
                  style={styles.deleteButton}
                  onClick={() => removeQuestion(index)}
                >
                  <Trash2 size={18} color={RED} />
                </button>
              </div>
            ))}
          </div>

          <button
            style={{
              ...styles.submitButton,
              ...(loading ? styles.disabledButton : {}),
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            <Send size={18} color="#fff" />
            {loading ? "ATANIYOR..." : "ANKETİ ATA"}
          </button>
        </section>

        <aside style={styles.previewCard}>
          <div style={styles.previewTop}>
            <div style={styles.previewIcon}>
              <Sparkles size={23} color="#fff" />
            </div>

            <div>
              <p style={styles.previewMini}>CANLI ÖNİZLEME</p>
              <h3 style={styles.previewTitle}>Anket Kartı</h3>
            </div>
          </div>

          <div style={styles.surveyPreview}>
            <div style={styles.surveyHeader}>
              <div style={styles.surveyIcon}>
                <ClipboardList size={22} color={RED} />
              </div>

              <div>
                <h4 style={styles.surveyTitle}>
                  {baslik.trim() || "Anket başlığı burada görünecek"}
                </h4>

                <p style={styles.surveyTarget}>
  Benim Öğrencilerim
</p>
              </div>
            </div>

            <div style={styles.previewQuestions}>
              {sorular.filter(Boolean).slice(0, 3).map((soru, index) => (
                <div key={index} style={styles.previewQuestion}>
                  <CheckCircle2 size={15} color="#10B981" />
                  <span>{soru}</span>
                </div>
              ))}

              {sorular.filter(Boolean).length === 0 && (
                <div style={styles.previewQuestion}>
                  <CheckCircle2 size={15} color="#CBD5E1" />
                  <span>Sorularını yazdıkça burada önizleme oluşur.</span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.tipsBox}>
            <div style={styles.tipsIcon}>
              <ListChecks size={20} color={RED} />
            </div>

            <div>
              <p style={styles.tipsTitle}>Kısa ipucu</p>
              <p style={styles.tipsText}>
                Soruları kısa, net ve ölçülebilir tutarsan geri bildirim kalitesi artar.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function TargetButton({ active, icon: Icon, title, text, onClick }) {
  return (
    <button
      style={{
        ...styles.targetButton,
        ...(active ? styles.targetButtonActive : {}),
      }}
      onClick={onClick}
      type="button"
    >
      <div
        style={{
          ...styles.targetIcon,
          ...(active ? styles.targetIconActive : {}),
        }}
      >
        <Icon size={21} color={active ? "#fff" : RED} />
      </div>

      <div style={{ textAlign: "left" }}>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </button>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    fontFamily: "Inter, Arial, sans-serif",
    padding: 28,
  },

  hero: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 30,
    border: "1px solid #EEF2F7",
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 24,
  },
  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 14px 28px rgba(227,6,19,0.25)",
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
    margin: "6px 0 0",
    letterSpacing: "-1px",
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    fontWeight: 700,
    margin: "8px 0 0",
    maxWidth: 720,
  },
  heroBadge: {
  backgroundColor: "#FFF1F2",
  color: DARK,
  borderRadius: 22,
  padding: "16px 18px",
  border: "1px solid #FFE4E6",
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 300,
  cursor: "pointer",
},

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 360px",
    gap: 24,
    alignItems: "start",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 34,
    padding: 30,
    border: "1px solid #EEF2F7",
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
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
    fontSize: 27,
    fontWeight: 950,
  },
  formIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
  },
  label: {
    display: "block",
    color: "#475569",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: 1.3,
    marginBottom: 10,
    marginTop: 18,
  },
  targetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 14,
    marginBottom: 18,
  },
  targetButton: {
    minHeight: 96,
    borderRadius: 24,
    border: "1px solid #E5E7EB",
    backgroundColor: "#F8FAFC",
    color: DARK,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 13,
    cursor: "pointer",
  },
  targetButtonActive: {
    backgroundColor: DARK,
    borderColor: DARK,
    color: "#fff",
    boxShadow: "0 14px 30px rgba(8,18,41,0.18)",
  },
  targetIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#fff",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  targetIconActive: {
    backgroundColor: RED,
  },
  input: {
    width: "100%",
    height: 60,
    borderRadius: 22,
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    padding: "0 18px",
    color: DARK,
    fontSize: 15,
    fontWeight: 800,
    outline: "none",
    boxSizing: "border-box",
  },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 18,
    marginTop: 8,
  },
  questionHint: {
    margin: "-4px 0 0",
    color: MUTED,
    fontSize: 12,
    fontWeight: 700,
  },
  addButton: {
    height: 44,
    padding: "0 16px",
    borderRadius: 16,
    border: "none",
    backgroundColor: RED,
    color: "#fff",
    fontSize: 12,
    fontWeight: 950,
    display: "flex",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(227,6,19,0.2)",
    whiteSpace: "nowrap",
  },
  questionList: {
    display: "grid",
    gap: 12,
    marginTop: 16,
  },
  questionBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: 24,
    padding: 13,
  },
  questionNumber: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: DARK,
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontSize: 12,
    fontWeight: 950,
    flexShrink: 0,
  },
  questionInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: DARK,
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "inherit",
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    border: "none",
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  submitButton: {
    marginTop: 24,
    width: "100%",
    height: 62,
    borderRadius: 22,
    backgroundColor: RED,
    color: "#fff",
    border: "none",
    fontSize: 14,
    fontWeight: 950,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    cursor: "pointer",
    boxShadow: "0 14px 28px rgba(227,6,19,0.23)",
  },
  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
  },

  previewCard: {
    backgroundColor: DARK,
    color: "#fff",
    borderRadius: 34,
    padding: 26,
    position: "sticky",
    top: 24,
    boxShadow: "0 16px 36px rgba(8,18,41,0.22)",
  },
  previewTop: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
  },
  previewIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
  },
  previewMini: {
    margin: 0,
    color: "#FCA5A5",
    fontSize: 11,
    fontWeight: 950,
    letterSpacing: 2,
  },
  previewTitle: {
    margin: "5px 0 0",
    color: "#fff",
    fontSize: 22,
    fontWeight: 950,
  },
  surveyPreview: {
  backgroundColor: "rgba(255,255,255,0.07)",
  borderRadius: 28,
  padding: 16,
  border: "1px solid rgba(255,255,255,0.08)",
},
  surveyHeader: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    color: DARK,
    display: "flex",
    gap: 13,
    marginBottom: 14,
  },
  surveyIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  surveyTitle: {
    margin: 0,
    color: DARK,
    fontSize: 15,
    fontWeight: 950,
  },
  surveyTarget: {
    margin: "7px 0 0",
    color: MUTED,
    fontSize: 12,
    fontWeight: 850,
  },
  previewQuestions: {
    display: "grid",
    gap: 10,
  },
  previewQuestion: {
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 13,
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: 750,
    lineHeight: "19px",
  },
  tipsBox: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 18,
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  tipsIcon: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  tipsTitle: {
    margin: 0,
    color: "#fff",
    fontSize: 14,
    fontWeight: 950,
  },
  tipsText: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: "21px",
    margin: "7px 0 0",
  },
};