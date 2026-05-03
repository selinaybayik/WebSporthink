import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Plus,
  X,
  CheckCircle2,
  Award,
  BookOpen,
} from "lucide-react";

import {
  getInstructorCompetencies,
  updateInstructorCompetencies,
} from "../../services/api";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F8F9FA";

const LEVELS = ["Başlangıç", "Orta", "İleri", "Uzman"];

export default function EgitmenYetkinlikleri({ user }) {
  const navigate = useNavigate();

  const [expertise, setExpertise] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Orta");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCompetencies = async () => {
      try {
        if (!user?.id) return;

        const data = await getInstructorCompetencies(user.id);

        setSelectedLevel(data.uzmanlik_seviyesi || "Orta");
        setExpertise(Array.isArray(data.yetkinlikler) ? data.yetkinlikler : []);
      } catch (error) {
        window.alert("Yetkinlikler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    loadCompetencies();
  }, [user?.id]);

  const addSkill = () => {
    const clean = newSkill.trim();

    if (!clean) {
      window.alert("Yetkinlik adı boş olamaz.");
      return;
    }

    if (expertise.includes(clean)) {
      window.alert("Bu yetkinlik zaten eklenmiş.");
      return;
    }

    setExpertise((prev) => [...prev, clean]);
    setNewSkill("");
  };

  const removeSkill = (skill) => {
    setExpertise((prev) => prev.filter((item) => item !== skill));
  };

  const handleSave = async () => {
    try {
      if (!user?.id) return;

      setSaving(true);

      await updateInstructorCompetencies(user.id, selectedLevel, expertise);

      window.alert("Eğitmen yetkinlikleri güncellendi.");
      navigate(-1);
    } catch (error) {
      window.alert(error.message || "Yetkinlikler kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={26} color={MUTED} />
        </button>

        <h1 style={styles.title}>EĞİTMEN YETKİNLİKLERİ</h1>
      </header>

      <main style={styles.content}>
        <section style={styles.heroCard}>
          <div style={styles.heroIcon}>
            <Brain size={30} color={RED} />
          </div>

          <h2 style={styles.heroTitle}>Uzmanlık Profilin</h2>

          <p style={styles.heroText}>
            Eğitmen profilinde görünecek uzmanlık alanlarını ve seviyeni buradan
            yönetebilirsin.
          </p>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <Award size={18} color={RED} />
            <h3 style={styles.sectionTitle}>UZMANLIK SEVİYESİ</h3>
          </div>

          <div style={styles.levelGrid}>
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                style={{
                  ...styles.levelChip,
                  ...(selectedLevel === level ? styles.levelChipActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.levelText,
                    ...(selectedLevel === level ? styles.levelTextActive : {}),
                  }}
                >
                  {level}
                </span>

                {selectedLevel === level && (
                  <CheckCircle2 size={16} color="#fff" />
                )}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <BookOpen size={18} color={RED} />
            <h3 style={styles.sectionTitle}>YETKİNLİK EKLE</h3>
          </div>

          <div style={styles.addCard}>
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Örn: Takım Yönetimi"
              style={styles.skillInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") addSkill();
              }}
            />

            <button style={styles.addButton} onClick={addSkill}>
              <Plus size={20} color="#fff" />
            </button>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <Brain size={18} color={RED} />
            <h3 style={styles.sectionTitle}>MEVCUT YETKİNLİKLER</h3>
          </div>

          <div style={styles.skillsBox}>
            {loading ? (
              <p style={styles.emptyText}>Yetkinlikler yükleniyor...</p>
            ) : expertise.length === 0 ? (
              <p style={styles.emptyText}>
                Henüz yetkinlik eklenmemiş. İlk yetkinliğini ekleyebilirsin.
              </p>
            ) : (
              expertise.map((skill) => (
                <div key={skill} style={styles.skillChip}>
                  <span style={styles.skillText}>{skill}</span>

                  <button
                    onClick={() => removeSkill(skill)}
                    style={styles.removeButton}
                  >
                    <X size={15} color={RED} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <button
          style={{
            ...styles.saveButton,
            ...(saving ? styles.saveButtonDisabled : {}),
          }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "KAYDEDİLİYOR..." : "YETKİNLİKLERİ KAYDET"}
        </button>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    fontFamily: "Inter, Arial, sans-serif",
  },
  header: {
    height: 82,
    backgroundColor: "#fff",
    borderBottom: "1px solid #EEF2F7",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
  },
  backButton: {
    width: 38,
    height: 38,
    marginRight: 10,
    border: "none",
    background: "transparent",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  title: {
    color: DARK,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 0.3,
    margin: 0,
  },
  content: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "20px 20px 90px",
  },
  heroCard: {
    backgroundColor: DARK,
    borderRadius: 32,
    padding: 22,
    textAlign: "center",
    marginBottom: 22,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "rgba(227,6,19,0.14)",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 14px",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 900,
    margin: 0,
  },
  heroText: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: "18px",
    textAlign: "center",
    margin: "8px auto 0",
    maxWidth: 560,
  },
  section: {
    marginBottom: 22,
  },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.5,
    margin: 0,
  },
  levelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
  },
  levelChip: {
    height: 52,
    borderRadius: 22,
    backgroundColor: "#fff",
    border: "1px solid #EEF2F7",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  levelChipActive: {
    backgroundColor: RED,
    borderColor: RED,
  },
  levelText: {
    color: DARK,
    fontSize: 13,
    fontWeight: 900,
  },
  levelTextActive: {
    color: "#fff",
  },
  addCard: {
    backgroundColor: "#fff",
    borderRadius: 26,
    border: "1px solid #EEF2F7",
    padding: 14,
    display: "flex",
    alignItems: "center",
  },
  skillInput: {
    flex: 1,
    color: DARK,
    fontSize: 14,
    fontWeight: 800,
    border: "none",
    outline: "none",
    fontFamily: "inherit",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 18,
    backgroundColor: RED,
    border: "none",
    display: "grid",
    placeItems: "center",
    marginLeft: 12,
    cursor: "pointer",
  },
  skillsBox: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 14,
    border: "1px solid #EEF2F7",
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    minHeight: 80,
  },
  skillChip: {
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    padding: "10px 13px",
    border: "1px solid #EEF2F7",
    display: "flex",
    alignItems: "center",
  },
  skillText: {
    color: DARK,
    fontSize: 12,
    fontWeight: 900,
    marginRight: 8,
  },
  removeButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF1F2",
    border: "none",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  emptyText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: 800,
    lineHeight: "18px",
    margin: 0,
  },
  saveButton: {
    width: "100%",
    height: 62,
    borderRadius: 26,
    backgroundColor: RED,
    color: "#fff",
    border: "none",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 1.5,
    cursor: "pointer",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
};