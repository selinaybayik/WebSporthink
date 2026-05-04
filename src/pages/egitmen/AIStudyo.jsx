import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  BrainCircuit,
  Wand2,
  Upload,
  ChevronRight,
  FileQuestion,
  BookOpen,
  X,
} from "lucide-react";

import { runAiStudio } from "../../services/api";

const RED = "#ED0015";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F4F5F7";

export default function AiStudyo({ user }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const aiTools = [
    {
      type: "quiz",
      title: "PDF'DEN QUIZ ÜRET",
      desc: "Seçilen doküman bilgilerine göre çoktan seçmeli sorular oluştur.",
      icon: FileQuestion,
      color: "#F59E0B",
    },
    {
      type: "summary",
      title: "DERS ÖZETİ ÇIKAR",
      desc: "Eğitim içeriğini kısa öğrenme notlarına dönüştür.",
      icon: BookOpen,
      color: "#10B981",
    },
    {
      type: "flow",
      title: "AKIŞI İYİLEŞTİR",
      desc: "Eğitim modüllerini daha etkili öğrenme akışına dönüştür.",
      icon: Wand2,
      color: "#2563EB",
    },
  ];

  const buildPrompt = () => {
    if (selectedFile) {
      return `${prompt || "Seçilen eğitim dokümanına göre içerik üret."}

Seçilen doküman bilgileri:
- Dosya adı: ${selectedFile.name}
- Dosya tipi: ${selectedFile.type || "Bilinmiyor"}
- Dosya boyutu: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB

Bu bilgilere göre eğitim içeriği, quiz, özet veya öğrenme akışı oluştur.`;
    }

    return prompt || "Kurumsal eğitim platformu için örnek içerik üret.";
  };

  const handleFeature = async (type) => {
    try {
      setLoading(true);
      setAiResult("");

      const result = await runAiStudio({
        type,
        prompt: buildPrompt(),
        userContext: {
          name: user?.name || "Eğitmen",
          role: "EGITMEN",
          department: user?.department || "Eğitim ve Gelişim",
        },
      });

      setAiResult(result);
    } catch (error) {
      window.alert(error.message || "AI Stüdyo çalıştırılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      window.alert("Lütfen PDF, Word veya TXT formatında dosya seç.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleStartDocumentAi = () => {
    if (!selectedFile) {
      window.alert("Önce bir doküman seçmelisin.");
      return;
    }

    handleFeature("document");
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="#fff" />
        </button>

        <div style={styles.heroIcon}>
          <BrainCircuit size={34} color="#fff" />
        </div>

        <h1 style={styles.heroTitle}>AI İÇERİK STÜDYOSU</h1>

        <p style={styles.heroText}>
          Eğitim içeriklerini AI destekli şekilde hızlandır. Quiz üret, özet
          çıkar ve içerik akışını optimize et.
        </p>
      </section>

      <main style={styles.container}>
        <section style={styles.section}>
          <h2 style={styles.sectionLabel}>AI ARAÇLARI</h2>

          <div style={styles.toolGrid}>
            {aiTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
                  key={tool.title}
                  style={{
                    ...styles.toolCard,
                    ...(loading ? styles.disabledButton : {}),
                  }}
                  onClick={() => handleFeature(tool.type)}
                  disabled={loading}
                >
                  <div
                    style={{
                      ...styles.toolIcon,
                      backgroundColor: `${tool.color}15`,
                    }}
                  >
                    <Icon size={24} color={tool.color} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={styles.toolTitle}>{tool.title}</h3>
                    <p style={styles.toolDesc}>{tool.desc}</p>
                  </div>

                  <ChevronRight size={22} color="#CBD5E1" />
                </button>
              );
            })}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionLabel}>HIZLI AI KOMUTU</h2>

          <div style={styles.promptCard}>
            {aiResult ? (
              <div style={styles.resultCard}>
                <h3 style={styles.resultTitle}>AI ÇIKTISI</h3>
                <p style={styles.resultText}>{aiResult}</p>
              </div>
            ) : null}

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: Liderlik eğitimi için 5 quiz sorusu üret..."
              style={styles.promptInput}
            />

            <button
              style={{
                ...styles.generateButton,
                ...(loading ? styles.disabledButton : {}),
              }}
              onClick={() => handleFeature("custom")}
              disabled={loading}
            >
              <Sparkles size={18} color="#fff" />
              {loading ? "OLUŞTURULUYOR..." : "AI OLUŞTUR"}
            </button>
          </div>
        </section>

        <section style={styles.uploadCard}>
          <div style={styles.uploadIcon}>
            <Upload size={28} color={RED} />
          </div>

          <h2 style={styles.uploadTitle}>
            Döküman Seçerek AI Analizi Başlat
          </h2>

          <p style={styles.uploadDesc}>
            PDF, Word veya eğitim notlarını seçerek AI destekli quiz, özet ve
            öğrenme akışı oluştur.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          <button
            style={{
              ...styles.uploadButton,
              ...(loading ? styles.disabledButton : {}),
            }}
            onClick={handleUploadClick}
            disabled={loading}
          >
            <Upload size={18} color="#fff" />
            DÖKÜMAN SEÇ
          </button>

          {selectedFile ? (
            <div style={styles.selectedFileBox}>
              <FileText size={21} color={RED} />

              <div style={styles.selectedFileInfo}>
                <p style={styles.selectedFileName}>{selectedFile.name}</p>
                <p style={styles.selectedFileMeta}>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                  {selectedFile.type || "Dosya"}
                </p>
              </div>

              <button style={styles.removeFileButton} onClick={handleRemoveFile}>
                <X size={16} color={DARK} />
              </button>

              <button
                style={{
                  ...styles.analyzeButton,
                  ...(loading ? styles.disabledButton : {}),
                }}
                onClick={handleStartDocumentAi}
                disabled={loading}
              >
                {loading ? "ANALİZ..." : "AI ANALİZ ET"}
              </button>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    fontFamily: "Inter, Arial, sans-serif",
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: DARK,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    padding: "34px 24px 38px",
    textAlign: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 24,
    top: 28,
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  heroIcon: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    margin: "24px auto 18px",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: 0.4,
    margin: 0,
  },
  heroText: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: "20px",
    textAlign: "center",
    margin: "12px auto 0",
    fontWeight: 700,
    maxWidth: 620,
  },
  container: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "28px 22px",
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.5,
    margin: "0 0 16px 4px",
  },
  toolGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 14,
  },
  toolCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 18,
    border: "1px solid #EEF2F7",
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    cursor: "pointer",
  },
  toolIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    marginRight: 16,
    flexShrink: 0,
  },
  toolTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: 900,
    margin: 0,
  },
  toolDesc: {
    color: MUTED,
    fontSize: 11,
    lineHeight: "17px",
    marginTop: 5,
    fontWeight: 700,
    marginBottom: 0,
  },
  promptCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 18,
    border: "1px solid #EEF2F7",
  },
  resultCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    border: "1px solid #EEF2F7",
  },
  resultTitle: {
    color: RED,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.3,
    margin: "0 0 10px",
  },
  resultText: {
    color: DARK,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: "20px",
    whiteSpace: "pre-wrap",
    margin: 0,
  },
  promptInput: {
    width: "100%",
    minHeight: 130,
    color: DARK,
    fontSize: 14,
    fontWeight: 700,
    border: "none",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  generateButton: {
    width: "100%",
    height: 54,
    borderRadius: 20,
    backgroundColor: RED,
    marginTop: 18,
    border: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.1,
    cursor: "pointer",
  },
  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
  uploadCard: {
    marginTop: 28,
    backgroundColor: "#fff",
    borderRadius: 34,
    padding: 26,
    textAlign: "center",
    border: "1px solid #EEF2F7",
  },
  uploadIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 18px",
  },
  uploadTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: 900,
    margin: 0,
  },
  uploadDesc: {
    color: MUTED,
    fontSize: 12,
    lineHeight: "19px",
    textAlign: "center",
    marginTop: 10,
    fontWeight: 700,
  },
  uploadButton: {
    marginTop: 22,
    height: 56,
    borderRadius: 22,
    backgroundColor: RED,
    color: "#fff",
    padding: "0 26px",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1,
    cursor: "pointer",
  },
  selectedFileBox: {
    marginTop: 20,
    backgroundColor: "#F8FAFC",
    border: "1px solid #EEF2F7",
    borderRadius: 22,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  selectedFileInfo: {
    flex: 1,
    textAlign: "left",
    minWidth: 0,
  },
  selectedFileName: {
    color: DARK,
    fontSize: 13,
    fontWeight: 900,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  selectedFileMeta: {
    color: MUTED,
    fontSize: 11,
    fontWeight: 700,
    margin: "4px 0 0",
  },
  removeFileButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: "1px solid #E2E8F0",
    backgroundColor: "#fff",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  analyzeButton: {
    height: 40,
    borderRadius: 14,
    border: "none",
    backgroundColor: DARK,
    color: "#fff",
    padding: "0 14px",
    fontSize: 11,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};