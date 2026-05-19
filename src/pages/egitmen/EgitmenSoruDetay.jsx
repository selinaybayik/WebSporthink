import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, User } from "lucide-react";
import { getQuestionMessages, sendQuestionMessage } from "../../services/api";

const DARK = "#081229";
const RED = "#DC2626";

export default function EgitmenSoruDetay({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const question = location.state?.question || {};
  const soruId = question.soru_id || question.id;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMessages = async () => {
    if (!soruId) return;
    const data = await getQuestionMessages(soruId);
    setMessages(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadMessages();
  }, [soruId]);

  const handleSend = async () => {
    if (!message.trim()) {
      window.alert("Lütfen mesaj yaz.");
      return;
    }

    try {
      setLoading(true);

      await sendQuestionMessage({
        soruId,
        gonderenId: user?.id || user?.kullanici_id || 1,
        gonderenRol: "egitmen",
        mesaj: message.trim(),
      });

      setMessage("");
      await loadMessages();
    } catch (error) {
      window.alert(error.message || "Mesaj gönderilemedi.");
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

        <h1 style={styles.title}>Soru Sohbeti</h1>
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
            {question?.soru_metni ||
              question?.question ||
              "Soru metni bulunamadı."}
          </p>
        </section>

        <section style={styles.chatBox}>
          {messages.length === 0 ? (
            <div style={styles.empty}>Henüz ek mesaj yok.</div>
          ) : (
            messages.map((item) => {
              const isInstructor = item.gonderen_rol === "egitmen";

              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.messageRow,
                    justifyContent: isInstructor ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...styles.bubble,
                      backgroundColor: isInstructor ? RED : DARK,
                    }}
                  >
                    <p style={styles.bubbleRole}>
                      {isInstructor ? "EĞİTMEN" : "KULLANICI"}
                    </p>

                    <p style={styles.bubbleText}>{item.mesaj}</p>

                    <p style={styles.bubbleDate}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("tr-TR")
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <div style={styles.answerBar}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesaj yaz..."
          style={styles.input}
        />

        <button
          style={{
            ...styles.sendButton,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          onClick={handleSend}
          disabled={loading}
        >
          <Send size={22} color="#fff" />
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F4F7FB",
    fontFamily: "Inter, Arial, sans-serif",
    paddingBottom: 110,
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
  chatBox: {
    display: "grid",
    gap: 12,
  },
  empty: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    color: "#94A3B8",
    fontWeight: 900,
    textAlign: "center",
  },
  messageRow: {
    display: "flex",
  },
  bubble: {
    maxWidth: "72%",
    borderRadius: 24,
    padding: 18,
    color: "#fff",
  },
  bubbleRole: {
    fontSize: 10,
    fontWeight: 900,
    opacity: 0.55,
    margin: "0 0 8px",
    letterSpacing: 1.5,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: "23px",
    fontWeight: 700,
    margin: 0,
    whiteSpace: "pre-line",
  },
  bubbleDate: {
    fontSize: 10,
    fontWeight: 900,
    opacity: 0.4,
    margin: "10px 0 0",
  },
  answerBar: {
  position: "sticky",
  bottom: 0,
  maxWidth: 980,
  margin: "0 auto",
  backgroundColor: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: 24,
  padding: 12,
  display: "flex",
  gap: 10,
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
},
  input: {
  flex: 1,
  height: 48,
  border: "1px solid #E2E8F0",
  borderRadius: 18,
  padding: 12,
  color: DARK,
  fontWeight: 700,
  backgroundColor: "#F8FAFC",
  outline: "none",
  resize: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
},
sendButton: {
  width: 50,
  height: 50,
  borderRadius: 18,
  backgroundColor: RED,
  border: "none",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
},
};