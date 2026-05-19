import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Search,
  Filter,
  ChevronRight,
  Send,
  PlusCircle,
  Bot,
  Sparkles,
} from "lucide-react";

import {
  getInstructorQuestions,
  answerInstructorQuestion,
} from "../../services/api";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F8F9FA";

export default function EgitmenSorular({ user }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);

      const data = await getInstructorQuestions();

      const formatted = data.map((item) => ({
        ...item,
        id: item.soru_id || item.id,
        name: item.kullanici_adi || "Kullanıcı",
        initials: (item.kullanici_adi || "K")
          .split(" ")
          .map((x) => x[0])
          .join("")
          .slice(0, 2),
        course: item.egitim_adi || "Eğitim",
        module: item.baslik || "Soru",
        question: item.soru_metni || item.question || "",
        time: item.created_at
          ? new Date(item.created_at).toLocaleDateString("tr-TR")
          : "Yeni",
        status: item.durum === "cevaplandi" ? "Yanıtlandı" : "Yanıt Bekliyor",
      }));

      setQuestionsData(formatted);
    } catch (error) {
      console.log("Sorular yüklenemedi:", error.message);
      setQuestionsData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questionsData.filter((item) => {
      const keyword = search.toLowerCase();

      const searchMatch =
        item.name.toLowerCase().includes(keyword) ||
        item.course.toLowerCase().includes(keyword) ||
        item.question.toLowerCase().includes(keyword);

      const filterMatch =
  activeFilter === "Tümü" ||
  (activeFilter === "Yanıt Bekleyenler" &&
    item.status === "Yanıt Bekliyor") ||
  (activeFilter === "Yanıtlananlar" &&
    item.status === "Yanıtlandı");

      return searchMatch && filterMatch;
    });
  }, [activeFilter, search, questionsData]);

  if (selectedQuestion) {
    return (
      <QuestionDetail
        question={selectedQuestion}
        answer={answer}
        setAnswer={setAnswer}
        user={user}
        onBack={() => {
          setSelectedQuestion(null);
          setAnswer("");
          loadQuestions();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingBox}>Sorular yükleniyor...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Sorular</h1>

        <button style={styles.filterIcon}>
          <Filter size={22} color={MUTED} />
        </button>
      </div>

      <div style={styles.searchBox}>
        <Search size={21} color="#CBD5E1" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Soru veya öğrenci ara..."
          style={styles.searchInput}
        />
      </div>

      <div style={styles.filters}>
        {["Tümü", "Yanıt Bekleyenler", "Yanıtlananlar"].map((filter) => {
          const active = activeFilter === filter;

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                ...styles.filterButton,
                ...(active ? styles.filterButtonActive : {}),
              }}
            >
              {filter.toUpperCase()}
            </button>
          );
        })}
      </div>

      <div style={styles.list}>
        {filteredQuestions.map((item) => (
          <QuestionCard
  key={item.id}
  item={item}
  onPress={() =>
    navigate("/egitmen/soru-detay", {
      state: { question: item },
    })
  }
/>
        ))}

        {filteredQuestions.length === 0 && (
          <div style={styles.emptyBox}>Bu filtreye uygun soru bulunamadı.</div>
        )}
      </div>

      <button
        style={styles.fab}
        onClick={() => window.alert("Manuel soru ekleme sonra bağlanacak.")}
      >
        <PlusCircle size={34} color="#fff" />
      </button>
    </div>
  );
}

function QuestionCard({ item, onPress }) {
  const isWaiting = item.status === "Yanıt Bekliyor";

  return (
    <button
      onClick={onPress}
      style={{
        ...styles.questionCard,
        ...(isWaiting ? styles.questionCardActive : {}),
      }}
    >
      <div style={styles.cardTop}>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>{item.initials}</span>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={styles.studentName}>{item.name}</h3>
          <p style={styles.courseName}>{item.course.toUpperCase()}</p>
        </div>

        <span style={styles.timeText}>{String(item.time).toUpperCase()}</span>
      </div>

      <p style={styles.questionText}>{item.question}</p>

      <div style={styles.cardBottom}>
        <span style={styles.moduleText}>{item.module.toUpperCase()}</span>

        <div style={styles.cardAction}>
          <div
            style={{
              ...styles.statusDot,
              ...(!isWaiting ? styles.statusDotPassive : {}),
            }}
          />
          <ChevronRight size={19} color="#CBD5E1" />
        </div>
      </div>
    </button>
  );
}

function QuestionDetail({ question, answer, setAnswer, onBack, user }) {
  const createDraftAnswer = () => {
    setAnswer(
      "Harika bir soru! “Evet ama” yerine “Anlıyorum, bununla birlikte…” veya “Haklısınız, bu noktada şöyle bir çözüm önerebiliriz…” kalıpları daha profesyonel olur."
    );
  };

  const sendAnswer = async () => {
    if (!answer.trim()) {
      window.alert("Göndermek için önce yanıt yazmalısın.");
      return;
    }

    try {
      await answerInstructorQuestion({
        soruId: question.id,
        cevapMetni: answer.trim(),
        cevaplayanAdi: user?.name || question?.instructorName || "Eğitmen",
        cevaplayanRol: question?.instructorRole || "Eğitim Uzmanı",
      });

      window.alert("Yanıt öğrenciye iletildi.");
      onBack();
    } catch (error) {
      window.alert(error.message || "Yanıt gönderilemedi.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.detailHeader}>
        <button onClick={onBack} style={styles.backButton}>
          <ArrowLeft size={26} color={MUTED} />
        </button>

        <div style={{ flex: 1, textAlign: "center" }}>
          <h2 style={styles.detailName}>{question.name}</h2>
          <p style={styles.detailCourse}>{question.course.toUpperCase()}</p>
        </div>

        <button style={styles.moreButton}>
          <MoreVertical size={23} color={MUTED} />
        </button>
      </div>

      <div style={styles.detailScroll}>
        <div style={styles.detailQuestionCard}>
          <p style={styles.detailQuestion}>{question.question}</p>

          <div style={styles.detailModuleRow}>
            <span style={styles.warningIcon}>!</span>
            <span style={styles.detailModule}>{question.module.toUpperCase()}</span>
          </div>
        </div>

        <p style={styles.sentTime}>{String(question.time).toUpperCase()} GÖNDERİLDİ</p>

        <div style={styles.aiAnswerCard}>
          <Sparkles size={95} color="rgba(16,185,129,0.12)" style={styles.aiBgIcon} />

          <div style={styles.aiHeader}>
            <Bot size={21} color="#047857" />
            <span style={styles.aiTitle}>SPORTHINK AI YANIT ÖNERİSİ</span>
          </div>

          <p style={styles.aiDesc}>
            İçerik analizi yapıldı. Öğrencinin sorusuna uygun profesyonel yanıt
            taslağı oluşturabilirsin.
          </p>

          <button style={styles.aiButton} onClick={createDraftAnswer}>
            <Sparkles size={18} color="#059669" />
            TASLAK YANIT OLUŞTUR
          </button>
        </div>
      </div>

      <div style={styles.answerBar}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Yanıtını yaz..."
          style={styles.answerInput}
        />

        <button style={styles.sendButton} onClick={sendAnswer}>
          <Send size={26} color="#fff" />
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    fontFamily: "Inter, Arial, sans-serif",
    paddingBottom: 120,
    position: "relative",
  },
  loadingBox: {
    minHeight: "70vh",
    display: "grid",
    placeItems: "center",
    color: MUTED,
    fontWeight: 900,
  },
  header: {
    padding: "26px 32px 18px",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    color: DARK,
    fontSize: 30,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: -1,
    margin: 0,
  },
  filterIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    border: "none",
    display: "grid",
    placeItems: "center",
  },
  searchBox: {
    margin: "10px 32px 0",
    height: 58,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: DARK,
    fontSize: 14,
    fontWeight: 800,
  },
  filters: {
    display: "flex",
    gap: 10,
    padding: "0 32px",
    marginTop: 30,
    marginBottom: 30,
  },
  filterButton: {
    flex: 1,
    height: 44,
    borderRadius: 20,
    backgroundColor: "#EEF2F7",
    border: "none",
    color: MUTED,
    fontSize: 11,
    fontWeight: 900,
    cursor: "pointer",
  },
  filterButtonActive: {
    backgroundColor: RED,
    color: "#fff",
  },
  list: {
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 18,
  },
  questionCard: {
    textAlign: "left",
    backgroundColor: "#fff",
    borderRadius: 34,
    padding: 24,
    border: "1px solid #F1F5F9",
    cursor: "pointer",
  },
  questionCardActive: {
    borderColor: "#FFD4D8",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  avatarText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: 900,
  },
  studentName: {
    color: DARK,
    fontSize: 16,
    fontWeight: 900,
    margin: 0,
  },
  courseName: {
    color: MUTED,
    fontSize: 10,
    fontWeight: 900,
    marginTop: 4,
    marginBottom: 0,
  },
  timeText: {
    color: "#CBD5E1",
    fontSize: 10,
    fontWeight: 900,
  },
  questionText: {
    color: DARK,
    fontSize: 15,
    fontWeight: 800,
    fontStyle: "italic",
    lineHeight: "24px",
    marginBottom: 20,
  },
  cardBottom: {
    borderTop: "1px solid #F1F5F9",
    paddingTop: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moduleText: {
    color: "#CBD5E1",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 1,
  },
  cardAction: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: RED,
  },
  statusDotPassive: {
    backgroundColor: "#CBD5E1",
  },
  emptyBox: {
    minHeight: 200,
    display: "grid",
    placeItems: "center",
    color: MUTED,
    fontSize: 13,
    fontWeight: 900,
  },
  fab: {
    position: "fixed",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: RED,
    border: "7px solid #fff",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(227,6,19,0.35)",
  },
  detailHeader: {
    height: 92,
    backgroundColor: "#fff",
    borderBottom: "1px solid #F1F5F9",
    padding: "0 22px",
    display: "flex",
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  moreButton: {
    width: 44,
    height: 44,
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  detailName: {
    color: DARK,
    fontSize: 17,
    fontWeight: 900,
    letterSpacing: 1.3,
    textTransform: "uppercase",
    margin: 0,
  },
  detailCourse: {
    color: MUTED,
    fontSize: 10,
    fontWeight: 900,
    marginTop: 3,
    marginBottom: 0,
  },
  detailScroll: {
    padding: 32,
    paddingBottom: 180,
  },
  detailQuestionCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 26,
    border: "1px solid #F1F5F9",
  },
  detailQuestion: {
    color: DARK,
    fontSize: 17,
    fontWeight: 900,
    fontStyle: "italic",
    lineHeight: "27px",
    marginBottom: 24,
  },
  detailModuleRow: {
    borderTop: "1px solid #F1F5F9",
    paddingTop: 16,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  warningIcon: {
    color: RED,
    border: `1px solid ${RED}`,
    width: 15,
    height: 15,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 10,
    fontWeight: 900,
  },
  detailModule: {
    color: MUTED,
    fontSize: 10,
    fontWeight: 900,
  },
  sentTime: {
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: 900,
    marginTop: 24,
    marginBottom: 24,
  },
  aiAnswerCard: {
    backgroundColor: "#ECFDF5",
    border: "1px solid #A7F3D0",
    borderRadius: 34,
    padding: 26,
    overflow: "hidden",
    position: "relative",
  },
  aiBgIcon: {
    position: "absolute",
    right: -8,
    top: -10,
  },
  aiHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
    position: "relative",
    zIndex: 1,
  },
  aiTitle: {
    color: "#064E3B",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 1.5,
  },
  aiDesc: {
    color: "#047857",
    fontSize: 13,
    fontWeight: 800,
    lineHeight: "20px",
    marginBottom: 22,
    position: "relative",
    zIndex: 1,
  },
  aiButton: {
    height: 54,
    borderRadius: 19,
    backgroundColor: "#fff",
    border: "1px solid #A7F3D0",
    color: "#059669",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1,
    cursor: "pointer",
    position: "relative",
    zIndex: 1,
  },
  answerBar: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTop: "1px solid #EEF2F7",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  answerInput: {
    flex: 1,
    minHeight: 58,
    maxHeight: 110,
    borderRadius: 26,
    backgroundColor: "#F8FAFC",
    border: "none",
    outline: "none",
    padding: "14px 20px",
    color: DARK,
    fontSize: 14,
    fontWeight: 800,
    resize: "vertical",
    fontFamily: "inherit",
  },
  sendButton: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: RED,
    border: "none",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
};