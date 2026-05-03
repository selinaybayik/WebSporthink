import React, { useEffect, useState } from "react";
import {
  Bot,
  BrainCircuit,
  FileQuestion,
  BarChart3,
  Wand2,
  Paperclip,
  Send,
  Sparkles,
} from "lucide-react";

import {
  getInstructorAIResponse,
  runAiStudio,
  getInstructorTrainings,
  createQuizDraft,
  createTextContent,
  getTrainingModules,
} from "../../services/api";

const RED = "#ED0015";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F4F5F7";

export default function EgitmenAsistan({ user }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAiResult, setLastAiResult] = useState(null);
  const [lastAiType, setLastAiType] = useState(null);
  const [selectedEgitimId, setSelectedEgitimId] = useState(null);
  const [egitimler, setEgitimler] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Merhaba! Bugün müfredat geliştirme, quiz üretme veya öğrenci analizleri konusunda sana nasıl yardımcı olabilirim?",
    },
  ]);

  useEffect(() => {
    if (user?.id) {
      getInstructorTrainings(user.id)
        .then((data) => setEgitimler(Array.isArray(data) ? data : []))
        .catch(() => setEgitimler([]));
    }
  }, [user?.id]);

  const quickActions = [
    {
      title: "YENİ QUIZ ÜRET",
      icon: FileQuestion,
      color: "#F59E0B",
      type: "quiz",
      prompt: "Genel bir eğitim konusu için quiz üret.",
    },
    {
      title: "ANALİZ RAPORU İSTE",
      icon: BarChart3,
      color: "#2563EB",
      type: "summary",
      prompt: "Eğitim performansı için kısa bir yönetici raporu şablonu hazırla.",
    },
    {
      title: "DERS ÖZETLE",
      icon: Wand2,
      color: "#10B981",
      type: "flow",
      prompt: "Uzun bir eğitimi daha kısa ve anlaşılır modüllere böl.",
    },
  ];

  const parseQuizFromAI = (text) => {
    try {
      const clean = String(text || "").replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    } catch {
      return null;
    }
  };

  const handleSend = async (presetMessage, studioType) => {
    const cleanMessage = (presetMessage || message).trim();
    if (!cleanMessage || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: cleanMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    setLastAiResult(null);
    setLastAiType(null);
    setSelectedEgitimId(null);

    try {
      let reply;

      if (studioType) {
        reply = await runAiStudio({
          type: studioType,
          prompt: cleanMessage,
          userContext: {
            name: user?.name || "Eğitmen",
            role: "EGITMEN",
            department: user?.department || "Eğitim ve Gelişim",
          },
        });
      } else {
        reply = await getInstructorAIResponse(cleanMessage, {
          name: user?.name || "Eğitmen",
          role: "EGITMEN",
          department: user?.department || "Eğitim ve Gelişim",
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: reply,
        },
      ]);

      setLastAiResult(reply);
      setLastAiType(studioType || null);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "ai",
          text: error.message || "AI asistan şu anda cevap veremiyor.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTraining = async () => {
    if (!selectedEgitimId) {
      window.alert("Lütfen önce bir eğitim seçin.");
      return;
    }

    try {
      if (lastAiType === "quiz") {
        const sorular = parseQuizFromAI(lastAiResult);

        if (!sorular || !Array.isArray(sorular)) {
          window.alert(
            "Quiz formatı okunamadı. AI quiz sorusunu JSON formatında üretmemiş olabilir."
          );
          return;
        }

        await createQuizDraft({
          egitim_id: selectedEgitimId,
          baslik: "AI Tarafından Üretildi",
          sorular: sorular.map((s) => ({
            soru_metni: s.soru,
            secenek_a: s.secenekler?.[0],
            secenek_b: s.secenekler?.[1],
            secenek_c: s.secenekler?.[2],
            secenek_d: s.secenekler?.[3],
            dogru_cevap: s.dogruCevap,
          })),
        });

        window.alert("✅ Quiz eğitime başarıyla eklendi!");
      } else if (lastAiType === "summary" || lastAiType === "flow") {
        const moduller = await getTrainingModules(selectedEgitimId);

        if (!moduller || moduller.length === 0) {
          window.alert(
            "Bu eğitimde modül bulunamadı. Önce eğitime en az bir modül ekleyin."
          );
          return;
        }

        await createTextContent({
          bolum_id: moduller[0].bolum_id,
          baslik: lastAiType === "flow" ? "AI Akış Önerisi" : "AI Özeti",
          metin_icerik: lastAiResult,
          sure_bilgisi: "5 dk",
        });

        window.alert("✅ İçerik eğitime başarıyla eklendi!");
      } else {
        window.alert(
          "Bu içerik tipi doğrudan eğitime eklenemez. Sadece quiz, özet ve akış içerikleri eklenebilir."
        );
      }

      setLastAiResult(null);
      setLastAiType(null);
      setSelectedEgitimId(null);
    } catch (err) {
      window.alert(err.message || "Kaydetme sırasında bir hata oluştu.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroIcon}>
          <BrainCircuit size={33} color="#fff" />
        </div>

        <div>
          <h1 style={styles.heroTitle}>
            SPORTHINK <span style={styles.heroRed}>PRO AI</span>
          </h1>

          <div style={styles.statusRow}>
            <div style={styles.statusDot} />
            <span style={styles.statusText}>EĞİTMEN STÜDYO MODU</span>
          </div>
        </div>
      </div>

      <div style={styles.quickRow}>
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              style={styles.quickButton}
              onClick={() => handleSend(item.prompt, item.type)}
              disabled={loading}
            >
              <Icon size={17} color={item.color} />
              {item.title}
            </button>
          );
        })}
      </div>

      <div style={styles.mainGrid}>
        <section style={styles.chatPanel}>
          <div style={styles.chatArea}>
            {messages.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.messageBubble,
                  ...(item.role === "user" ? styles.userBubble : styles.aiBubble),
                }}
              >
                <p
                  style={{
                    ...styles.messageText,
                    ...(item.role === "user" ? styles.userText : styles.aiText),
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}

            {loading && <p style={styles.loadingText}>AI cevap hazırlıyor...</p>}

            {lastAiResult &&
              (lastAiType === "quiz" ||
                lastAiType === "summary" ||
                lastAiType === "flow") && (
                <div style={styles.savePanel}>
                  <h3 style={styles.savePanelTitle}>
                    Bu içeriği bir eğitime ekle:
                  </h3>

                  <div style={styles.egitimChipRow}>
                    {egitimler.map((e) => {
                      const id = e.id || e.egitim_id;
                      const title = e.title || e.baslik || "Eğitim";

                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedEgitimId(id)}
                          style={{
                            ...styles.egitimChip,
                            ...(selectedEgitimId === id
                              ? styles.egitimChipActive
                              : {}),
                          }}
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>

                  <button style={styles.saveButton} onClick={handleSaveToTraining}>
                    ✅ EĞİTİME EKLE
                  </button>
                </div>
              )}
          </div>

          <div style={styles.inputWrap}>
            <div style={styles.inputBox}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bir görev tanımlayın veya soru sorun..."
                style={styles.input}
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <button style={styles.attachButton} type="button">
                <Paperclip size={22} color={MUTED} />
              </button>

              <button
                style={{
                  ...styles.sendButton,
                  ...(message.trim() ? styles.sendButtonActive : {}),
                }}
                onClick={() => handleSend()}
                disabled={loading}
              >
                <Send size={22} color="#fff" />
              </button>
            </div>

            <div style={styles.centerFab}>
              <Sparkles size={28} color="#fff" />
            </div>
          </div>
        </section>

        <aside style={styles.suggestionGrid}>
          <SuggestionCard
            title="Quiz üret"
            text="PDF veya ders notundan soru taslağı çıkar."
            onPress={() =>
              handleSend(
                "Bir ders içeriğinden quiz üretmek için nasıl bir soru yapısı kullanmalıyım?",
                "quiz"
              )
            }
          />

          <SuggestionCard
            title="Riskli öğrencileri bul"
            text="Tamamlama ve quiz skoruna göre analiz öner."
            onPress={() =>
              handleSend(
                "Riskli öğrencileri tamamlama oranı ve quiz skoruna göre nasıl analiz edebilirim?",
                "summary"
              )
            }
          />

          <SuggestionCard
            title="Dersi sadeleştir"
            text="Uzun içerikleri daha kısa öğrenme adımlarına böl."
            onPress={() =>
              handleSend(
                "Uzun bir eğitimi daha kısa ve anlaşılır modüllere nasıl bölebilirim?",
                "flow"
              )
            }
          />

          <SuggestionCard
            title="Rapor hazırla"
            text="Eğitim performansı için yönetici özeti oluştur."
            onPress={() =>
              handleSend(
                "Eğitim performansı için kısa bir yönetici raporu şablonu hazırla.",
                "summary"
              )
            }
          />
        </aside>
      </div>
    </div>
  );
}

function SuggestionCard({ title, text, onPress }) {
  return (
    <button style={styles.suggestionCard} onClick={onPress}>
      <div style={styles.suggestionIcon}>
        <Bot size={18} color={RED} />
      </div>

      <h3 style={styles.suggestionTitle}>{title}</h3>
      <p style={styles.suggestionText}>{text}</p>
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
    backgroundColor: DARK,
    borderRadius: 34,
    padding: "32px 34px",
    display: "flex",
    alignItems: "center",
    gap: 18,
    boxShadow: "0 14px 34px rgba(8,18,41,0.16)",
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: 900,
    margin: 0,
  },
  heroRed: {
    color: RED,
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    marginTop: 7,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  statusText: {
    color: "#A8B3C7",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.4,
  },
  quickRow: {
    display: "flex",
    gap: 10,
    marginTop: 22,
    marginBottom: 22,
    overflowX: "auto",
    paddingBottom: 4,
  },
  quickButton: {
    height: 52,
    padding: "0 18px",
    borderRadius: 17,
    backgroundColor: "#fff",
    border: "1px solid #EEF2F7",
    display: "flex",
    alignItems: "center",
    gap: 9,
    color: DARK,
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 360px",
    gap: 22,
    alignItems: "start",
  },
  chatPanel: {
    backgroundColor: "#fff",
    borderRadius: 30,
    border: "1px solid #EEF2F7",
    minHeight: "calc(100vh - 240px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  chatArea: {
    flex: 1,
    padding: 24,
    overflowY: "auto",
  },
  messageBubble: {
    maxWidth: "78%",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 8,
  },
  userBubble: {
    marginLeft: "auto",
    backgroundColor: RED,
    borderTopRightRadius: 8,
  },
  messageText: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: "21px",
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  aiText: {
    color: DARK,
  },
  userText: {
    color: "#fff",
  },
  loadingText: {
    color: "#8A97AD",
    fontSize: 10,
    fontWeight: 900,
    margin: "2px 0 22px 10px",
  },
  savePanel: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
    marginBottom: 16,
    border: "1px solid #EEF2F7",
    boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
  },
  savePanelTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: 900,
    margin: "0 0 12px",
  },
  egitimChipRow: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    marginBottom: 12,
    paddingBottom: 4,
  },
  egitimChip: {
    padding: "8px 14px",
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    border: "1px solid #E2E8F0",
    color: DARK,
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  egitimChipActive: {
    backgroundColor: RED,
    borderColor: RED,
    color: "#fff",
  },
  saveButton: {
    width: "100%",
    backgroundColor: RED,
    borderRadius: 16,
    padding: "14px 18px",
    color: "#fff",
    fontSize: 13,
    fontWeight: 900,
    border: "none",
    cursor: "pointer",
  },
  inputWrap: {
    position: "relative",
    padding: "20px 24px 22px",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTop: "1px solid #EEF2F7",
  },
  inputBox: {
    minHeight: 64,
    borderRadius: 26,
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    paddingLeft: 18,
    paddingRight: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    color: DARK,
    fontSize: 14,
    fontWeight: 800,
    border: "none",
    outline: "none",
    resize: "none",
    background: "transparent",
    padding: "12px 0",
    fontFamily: "inherit",
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    border: "none",
    backgroundColor: "transparent",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: "#94A3B8",
    border: "none",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  sendButtonActive: {
    backgroundColor: RED,
  },
  centerFab: {
    position: "absolute",
    left: "50%",
    top: -20,
    transform: "translateX(-50%)",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: RED,
    border: "5px solid #fff",
    display: "grid",
    placeItems: "center",
  },
  suggestionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 14,
  },
  suggestionCard: {
    width: "100%",
    textAlign: "left",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    minHeight: 138,
    border: "1px solid #EEF2F7",
    cursor: "pointer",
  },
  suggestionIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    marginBottom: 14,
  },
  suggestionTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: 900,
    margin: "0 0 7px",
  },
  suggestionText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: "17px",
    margin: 0,
  },
};
