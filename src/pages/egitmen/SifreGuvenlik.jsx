import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

import { updatePassword } from "../../services/api";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F8F9FA";

export default function EgitmenSifreGuvenlik({ user }) {
  const navigate = useNavigate();

  const [mevcutSifre, setMevcutSifre] = useState("");
  const [yeniSifre, setYeniSifre] = useState("");
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    try {
      if (!user?.id) {
        window.alert("Kullanıcı bilgisi bulunamadı.");
        return;
      }

      if (!mevcutSifre || !yeniSifre || !yeniSifreTekrar) {
        window.alert("Lütfen tüm alanları doldur.");
        return;
      }

      if (yeniSifre.length < 6) {
        window.alert("Yeni şifre en az 6 karakter olmalı.");
        return;
      }

      if (yeniSifre !== yeniSifreTekrar) {
        window.alert("Yeni şifreler eşleşmiyor.");
        return;
      }

      setLoading(true);

      await updatePassword(user.id, mevcutSifre, yeniSifre);

      window.alert("Şifre başarıyla güncellendi.");

      setMevcutSifre("");
      setYeniSifre("");
      setYeniSifreTekrar("");

      navigate(-1);
    } catch (error) {
      window.alert(error.message || "Şifre güncellenemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={26} color={MUTED} />
        </button>

        <h1 style={styles.title}>ŞİFRE VE GÜVENLİK</h1>
      </header>

      <main style={styles.content}>
        <section style={styles.infoCard}>
          <div style={styles.infoIcon}>
            <ShieldCheck size={26} color={RED} />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={styles.infoTitle}>Şifreni Güncelle</h2>

            <p style={styles.infoText}>
              Hesap güvenliğin için mevcut şifreni doğrulayarak yeni şifreni
              belirle.
            </p>
          </div>
        </section>

        <PasswordInput
          label="MEVCUT ŞİFRE"
          value={mevcutSifre}
          onChange={setMevcutSifre}
        />

        <PasswordInput
          label="YENİ ŞİFRE"
          value={yeniSifre}
          onChange={setYeniSifre}
        />

        <PasswordInput
          label="YENİ ŞİFRE TEKRAR"
          value={yeniSifreTekrar}
          onChange={setYeniSifreTekrar}
        />

        <button
          style={{
            ...styles.saveButton,
            ...(loading ? styles.saveButtonDisabled : {}),
          }}
          onClick={handleUpdatePassword}
          disabled={loading}
        >
          {loading ? "GÜNCELLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
        </button>
      </main>
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  return (
    <div style={styles.inputCard}>
      <label style={styles.label}>{label}</label>

      <div style={styles.inputRow}>
        <Lock size={21} color={MUTED} />

        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          style={styles.input}
        />
      </div>
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
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: 0.3,
    margin: 0,
  },
  content: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "20px 20px 90px",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 18,
    border: "1px solid #EEF2F7",
    display: "flex",
    alignItems: "center",
    marginBottom: 18,
  },
  infoIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    marginRight: 14,
    flexShrink: 0,
  },
  infoTitle: {
    color: DARK,
    fontSize: 15,
    fontWeight: 900,
    margin: 0,
  },
  infoText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: 700,
    lineHeight: "17px",
    marginTop: 4,
    marginBottom: 0,
  },
  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 17,
    border: "1px solid #EEF2F7",
    marginBottom: 14,
  },
  label: {
    display: "block",
    color: MUTED,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontWeight: 800,
    border: "none",
    outline: "none",
    background: "transparent",
    fontFamily: "inherit",
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
    marginTop: 12,
  },
  saveButtonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
};