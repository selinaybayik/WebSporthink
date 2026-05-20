import React, { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  HelpCircle,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Save,
  Award,
  Settings,
} from "lucide-react";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F8F9FA";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function QuizOlustur() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const state = location.state || {};

  const egitimId = state.egitimId || searchParams.get("egitimId") || "";
  const bolumId  = state.bolumId  || searchParams.get("bolumId")  || "";

  const [quizTitle, setQuizTitle] = useState("Modül Sonu Mini Test");
  const [description, setDescription] = useState(
    "Bu quiz, modül sonunda katılımcının temel kavramları öğrenip öğrenmediğini ölçer."
  );
  const [passingScore, setPassingScore] = useState("70");
  const [certificateEffect, setCertificateEffect] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "Müşteri ile ilk temas anında hangi davranış tercih edilmelidir?",
      a: "Göz teması kurarak nazik bir karşılama yapmak",
      b: "Müşteriyi bekletmek",
      c: "Sadece ürün fiyatını söylemek",
      d: "Müşteriyi yönlendirmeden bırakmak",
      correct: "A",
    },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), text: "", a: "", b: "", c: "", d: "", correct: "A" },
    ]);
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, key, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const saveQuiz = async () => {
    if (!quizTitle.trim()) {
      window.alert("Quiz başlığı girmen gerekiyor.");
      return;
    }
    if (!egitimId) {
      window.alert("Eğitim bilgisi eksik. Lütfen eğitim üzerinden tekrar gir.");
      return;
    }
    if (questions.length === 0) {
      window.alert("En az 1 soru eklemelisin.");
      return;
    }
    const bosSoruVar = questions.some(
      (q) => !q.text.trim() || !q.a.trim() || !q.b.trim() || !q.c.trim() || !q.d.trim()
    );
    if (bosSoruVar) {
      window.alert("Tüm soru ve seçenekleri doldurmalısın.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        egitim_id:        Number(egitimId),
        baslik:           quizTitle.trim(),
        aciklama:         description.trim(),
        gecme_notu:       Number(passingScore) || 70,
        sertifika_etkili: certificateEffect,
        sorular: questions.map((q) => ({
          soru_metni: q.text.trim(),
          secenek_a:  q.a.trim(),
          secenek_b:  q.b.trim(),
          secenek_c:  q.c.trim(),
          secenek_d:  q.d.trim(),
          dogru_cevap: q.correct,
        })),
      };

      const response = await fetch(`${API_URL}/api/quiz/taslak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Quiz kaydedilemedi.");
      }

      window.alert("Quiz taslağı oluşturuldu 🚀");
      navigate(-1);
    } catch (err) {
      window.alert(err.message || "Quiz kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.scroll}>
        <header style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={25} color={MUTED} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={styles.title}>Quiz Oluştur</h1>
            <p style={styles.subtitle}>SORU VE DEĞERLENDİRME YÖNETİMİ</p>
          </div>
          <button style={styles.settingsButton}>
            <Settings size={21} color={MUTED} />
          </button>
        </header>

        <section style={styles.heroCard}>
          <div style={styles.heroIcon}>
            <HelpCircle size={30} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={styles.heroTitle}>Eğitim Sonu Quiz Taslağı</h2>
            <p style={styles.heroDesc}>
              Videolar tamamlandıktan sonra açılacak değerlendirme quizini oluştur.
            </p>
          </div>
        </section>

        <section style={styles.card}>
          <label style={styles.label}>QUIZ BAŞLIĞI</label>
          <input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            style={styles.input}
            placeholder="Örn: Eğitim Sonu Değerlendirme"
          />

          <label style={styles.label}>AÇIKLAMA</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.input, ...styles.textArea }}
            placeholder="Quiz açıklaması yaz..."
          />

          <div style={styles.row}>
            <div style={styles.half}>
              <label style={styles.label}>GEÇME PUANI</label>
              <input
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                style={styles.input}
                placeholder="70"
              />
            </div>
            <div style={styles.half}>
              <label style={styles.label}>SERTİFİKA</label>
              <button
                style={{
                  ...styles.certificateButton,
                  ...(certificateEffect ? styles.certificateButtonActive : {}),
                }}
                onClick={() => setCertificateEffect(!certificateEffect)}
              >
                <Award size={18} color={certificateEffect ? "#fff" : MUTED} />
                <span
                  style={{
                    ...styles.certificateText,
                    ...(certificateEffect ? styles.certificateTextActive : {}),
                  }}
                >
                  {certificateEffect ? "ETKİLİ" : "PASİF"}
                </span>
              </button>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.questionHeader}>
            <div>
              <label style={styles.label}>SORULAR</label>
              <p style={styles.questionCount}>{questions.length} soru eklendi</p>
            </div>
            <button style={styles.addQuestionButton} onClick={addQuestion}>
              <PlusCircle size={18} color="#fff" />
              <span style={styles.addQuestionText}>SORU EKLE</span>
            </button>
          </div>

          {questions.map((q, index) => (
            <div key={q.id} style={styles.questionCard}>
              <div style={styles.questionTop}>
                <h3 style={styles.questionTitle}>{index + 1}. Soru</h3>
                {questions.length > 1 && (
                  <button onClick={() => deleteQuestion(q.id)} style={styles.deleteButton}>
                    <Trash2 size={18} color={RED} />
                  </button>
                )}
              </div>

              <textarea
                value={q.text}
                onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                style={{ ...styles.input, ...styles.questionInput }}
                placeholder="Soru metnini yaz..."
              />

              {["a", "b", "c", "d"].map((opt) => (
                <OptionInput
                  key={opt}
                  label={opt.toUpperCase()}
                  value={q[opt]}
                  correct={q.correct === opt.toUpperCase()}
                  onCorrect={() => updateQuestion(q.id, "correct", opt.toUpperCase())}
                  onTextChange={(value) => updateQuestion(q.id, opt, value)}
                />
              ))}
            </div>
          ))}
        </section>
      </main>

      <footer style={styles.footer}>
        <button
          style={{ ...styles.footerDraft, ...(saving ? { opacity: 0.65 } : {}) }}
          onClick={saveQuiz}
          disabled={saving}
        >
          <Save size={19} color="#fff" />
          <span style={styles.footerDraftText}>
            {saving ? "KAYDEDİLİYOR..." : "QUIZİ TASLAĞA EKLE"}
          </span>
        </button>
      </footer>
    </div>
  );
}

function OptionInput({ label, value, correct, onTextChange, onCorrect }) {
  return (
    <div style={{ ...styles.optionBox, ...(correct ? styles.optionBoxCorrect : {}) }}>
      <button
        onClick={onCorrect}
        style={{ ...styles.optionLabelBox, ...(correct ? styles.optionLabelBoxCorrect : {}) }}
      >
        {correct ? (
          <CheckCircle2 size={20} color="#fff" />
        ) : (
          <span style={styles.optionLabel}>{label}</span>
        )}
      </button>
      <input
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        style={styles.optionInput}
        placeholder={`${label} seçeneği`}
      />
    </div>
  );
}

const styles = {
  page:       { minHeight: "100vh", backgroundColor: BG, fontFamily: "Inter, Arial, sans-serif" },
  scroll:     { paddingBottom: 140 },
  header:     { backgroundColor: "#fff", padding: "20px 24px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 12 },
  backButton: { width: 42, height: 42, border: "none", background: "transparent", cursor: "pointer" },
  title:      { color: DARK, fontSize: 28, fontWeight: 900, letterSpacing: -0.7, margin: 0 },
  subtitle:   { color: MUTED, fontSize: 11, fontWeight: 900, letterSpacing: 1.8, marginTop: 4, marginBottom: 0 },
  settingsButton: { width: 52, height: 52, borderRadius: 18, backgroundColor: "#F8FAFC", border: "none", display: "grid", placeItems: "center" },
  heroCard:   { margin: 24, marginBottom: 0, backgroundColor: DARK, borderRadius: 34, padding: 24, display: "flex", alignItems: "center" },
  heroIcon:   { width: 74, height: 74, borderRadius: 24, backgroundColor: "#F59E0B", display: "grid", placeItems: "center", marginRight: 18, flexShrink: 0 },
  heroTitle:  { color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 },
  heroDesc:   { color: "rgba(255,255,255,0.62)", fontSize: 14, fontWeight: 700, lineHeight: "21px", marginTop: 7, marginBottom: 0 },
  card:       { margin: 24, marginBottom: 0, backgroundColor: "#fff", borderRadius: 32, padding: 24, border: "1px solid #F1F5F9" },
  label:      { color: MUTED, fontSize: 12, fontWeight: 900, letterSpacing: 1.3, marginBottom: 10, display: "block" },
  input:      { width: "100%", minHeight: 62, borderRadius: 20, backgroundColor: "#F8FAFC", border: "1px solid #EAF0F6", padding: "0 17px", color: DARK, fontSize: 15, fontWeight: 800, marginBottom: 18, boxSizing: "border-box", outline: "none" },
  textArea:   { minHeight: 120, paddingTop: 16, resize: "vertical", fontFamily: "inherit" },
  row:        { display: "flex", gap: 12 },
  half:       { flex: 1 },
  certificateButton:       { width: "100%", height: 62, borderRadius: 20, backgroundColor: "#F8FAFC", border: "1px solid #EAF0F6", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" },
  certificateButtonActive: { backgroundColor: RED, borderColor: RED },
  certificateText:         { color: MUTED, fontSize: 12, fontWeight: 900 },
  certificateTextActive:   { color: "#fff" },
  questionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  questionCount:  { color: DARK, fontSize: 14, fontWeight: 900, margin: 0 },
  addQuestionButton: { backgroundColor: RED, borderRadius: 16, padding: "11px 14px", display: "flex", alignItems: "center", gap: 7, border: "none", cursor: "pointer" },
  addQuestionText:   { color: "#fff", fontSize: 11, fontWeight: 900 },
  questionCard:  { backgroundColor: "#F8FAFC", borderRadius: 24, padding: 16, marginBottom: 18, border: "1px solid #EAF0F6" },
  questionTop:   { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  questionTitle: { color: DARK, fontSize: 17, fontWeight: 900, margin: 0 },
  deleteButton:  { width: 38, height: 38, borderRadius: 14, backgroundColor: "#FFF1F2", border: "none", display: "grid", placeItems: "center", cursor: "pointer" },
  questionInput: { minHeight: 90, paddingTop: 16, resize: "vertical", fontFamily: "inherit" },
  optionBox:            { minHeight: 58, borderRadius: 18, backgroundColor: "#fff", border: "1px solid #EAF0F6", display: "flex", alignItems: "center", marginBottom: 10, overflow: "hidden" },
  optionBoxCorrect:     { borderColor: RED, backgroundColor: "#FFF1F2" },
  optionLabelBox:       { width: 54, minHeight: 58, backgroundColor: "#EEF2F7", border: "none", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 },
  optionLabelBoxCorrect: { backgroundColor: RED },
  optionLabel:  { color: DARK, fontSize: 15, fontWeight: 900 },
  optionInput:  { flex: 1, height: 58, padding: "0 14px", color: DARK, fontSize: 14, fontWeight: 800, border: "none", outline: "none", background: "transparent" },
  footer:       { position: "fixed", left: 0, right: 0, bottom: 0, padding: "14px 24px", backgroundColor: "rgba(255,255,255,0.96)", borderTop: "1px solid #EEF2F7" },
  footerDraft:  { width: "100%", height: 66, borderRadius: 26, backgroundColor: RED, border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" },
  footerDraftText: { color: "#fff", fontSize: 13, fontWeight: 900, letterSpacing: 1.5 },
};