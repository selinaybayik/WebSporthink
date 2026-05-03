import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Send, User } from "lucide-react";
import { answerInstructorQuestion } from "../../services/api";

const DARK = "#081229";
const RED = "#DC2626";

export default function EgitmenSoruDetay({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const question = location.state?.question || {};

  const [answer, setAnswer] = useState(question?.cevap_metni || "");
  const [loading, setLoading] = useState(false);

  const handleAnswer = async () => {
    if (!answer.trim()) {
      window.alert("Lütfen cevap yaz.");
      return;
    }

    try {
      setLoading(true);

      await answerInstructorQuestion({
        soruId: question.soru_id || question.id,
        cevapMetni: answer.trim(),
        cevaplayanAdi: user?.name || "Sporthink Akademi",
        cevaplayanRol: "Eğitim Uzmanı",
      });

      window.alert("Cevap kullanıcıya gönderildi.");
      navigate(-1);
    } catch (error) {
      window.alert(error.message || "Cevap gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={26} color="#94A3B8" />
        </button>

        <h1 style={styles.title}>Soru Detayı</h1>
      </div>

      <main style={styles.content}>
        <section style={styles.card}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>
              <User size={18} color="#fff" />
            </div>

            <div>
              <h2 style={styles.name}>
                {question?.kullanici_adi || question?.name || "Kullanıcı"}
              </h2>

              <p style={styles.date}>
                {question?.created_at
                  ? new Date(question.created_at).toLocaleDateString("tr-TR")
                  : question?.time || "-"}
              </p>
            </div>
          </div>

          <h3 style={styles.questionTitle}>
            {question?.baslik || question?.module || "Soru"}
          </h3>

          <p style={styles.questionText}>
            {question?.soru_metni || question?.question || "Soru metni bulunamadı."}
          </p>
        </section>

        <section style={styles.answerBox}>
          <div style={styles.answerHead}>
            <MessageCircle size={18} color={RED} />
            <h3 style={styles.answerTitle}>Eğitmen Cevabı</h3>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Kullanıcıya cevap yaz..."
            style={styles.input}
          />

          <button
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            onClick={handleAnswer}
            disabled={loading}
          >
            <Send size={18} color="#fff" />
            {loading ? "Gönderiliyor..." : "CEVABI GÖNDER"}
          </button>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F4F7FB",
    fontFamily: "Inter, Arial, sans-serif",
  },
  header: {
    height: 82,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "0 20px",
    borderBottom: "1px solid #EEF2F7",
  },
  backButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    width: 42,
    height: 42,
    display: "grid",
    placeItems: "center",
  },
  title: {
    color: DARK,
    fontSize: 20,
    fontWeight: 900,
    margin: 0,
  },
  content: {
    padding: 20,
    display: "grid",
    gap: 18,
    maxWidth: 980,
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 22,
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
  },
  name: {
    color: DARK,
    fontSize: 15,
    fontWeight: 900,
    margin: 0,
  },
  date: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: 700,
    margin: "2px 0 0",
  },
  questionTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: 900,
    margin: "0 0 12px",
  },
  questionText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: "22px",
    fontWeight: 700,
    margin: 0,
  },
  answerBox: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 22,
  },
  answerHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  answerTitle: {
    color: DARK,
    fontSize: 15,
    fontWeight: 900,
    margin: 0,
  },
  input: {
    width: "100%",
    height: 170,
    border: "1px solid #E2E8F0",
    borderRadius: 22,
    padding: 18,
    color: DARK,
    fontWeight: 700,
    marginBottom: 20,
    backgroundColor: "#F8FAFC",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    backgroundColor: RED,
    border: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};