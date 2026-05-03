import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  ChevronDown,
  Check,
  Camera,
} from "lucide-react";

import {
  getInstructorPersonalInfo,
  updateInstructorPersonalInfo,
  updateInstructorProfilePhoto,
} from "../../services/api";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F8F9FA";

const DEPARTMENTS = [
  "Eğitim ve Gelişim",
  "İnsan Kaynakları",
  "Satış",
  "Pazarlama",
  "Operasyon",
  "Bilgi Teknolojileri",
  "Finans",
  "Müşteri Deneyimi",
];

export default function EgitmenKisiselBilgiler({ user }) {
  const navigate = useNavigate();

  const [departmentModal, setDepartmentModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    profilePhotoUrl: "",
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        if (!user?.id) return;

        const data = await getInstructorPersonalInfo(user.id);

        setForm({
          firstName: data.ad || "",
          lastName: data.soyad || "",
          email: data.email || "",
          phone: data.telefon || "",
          department: data.departman || "",
          profilePhotoUrl: data.profil_foto_url || "",
        });
      } catch (error) {
        window.alert("Kişisel bilgiler yüklenemedi.");
      }
    };

    loadPersonalInfo();
  }, [user?.id]);

  const handleSave = async () => {
    try {
      if (!user?.id) return;

      setSaving(true);

      await updateInstructorPersonalInfo(user.id, {
        ad: form.firstName,
        soyad: form.lastName,
        telefon: form.phone,
        departman: form.department,
      });

      window.alert("Kişisel bilgiler güncellendi.");
      navigate(-1);
    } catch (error) {
      window.alert(error.message || "Güncelleme başarısız.");
    } finally {
      setSaving(false);
    }
  };

  const handlePickProfilePhoto = async (e) => {
    try {
      if (!user?.id) return;

      const file = e.target.files?.[0];
      if (!file) return;

      const localPreviewUrl = URL.createObjectURL(file);

      await updateInstructorProfilePhoto(user.id, localPreviewUrl);

      updateField("profilePhotoUrl", localPreviewUrl);

      window.alert("Profil fotoğrafı güncellendi.");
    } catch (error) {
      window.alert(error.message || "Profil fotoğrafı güncellenemedi.");
    }
  };

  const avatarUrl =
    form.profilePhotoUrl ||
    `https://ui-avatars.com/api/?name=${form.firstName}+${form.lastName}&background=081229&color=fff`;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={28} color={MUTED} />
        </button>

        <h1 style={styles.title}>KİŞİSEL BİLGİLER</h1>
      </header>

      <main style={styles.container}>
        <section style={styles.avatarSection}>
          <div style={styles.avatarWrapper}>
            <img src={avatarUrl} alt="Profil" style={styles.avatar} />

            <label style={styles.cameraButton}>
              <Camera size={18} color="#fff" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePickProfilePhoto}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <h2 style={styles.avatarName}>
            {form.firstName} {form.lastName}
          </h2>

          <p style={styles.avatarRole}>{form.department}</p>
        </section>

        <InputBox
          label="AD"
          icon={User}
          value={form.firstName}
          onChange={(value) => updateField("firstName", value)}
        />

        <InputBox
          label="SOYAD"
          icon={User}
          value={form.lastName}
          onChange={(value) => updateField("lastName", value)}
        />

        <InputBox label="E-POSTA ADRESİ" icon={Mail} value={form.email} disabled />

        <InputBox
          label="TELEFON"
          icon={Phone}
          value={form.phone}
          onChange={(value) => updateField("phone", value)}
        />

        <button
          type="button"
          style={styles.cardButton}
          onClick={() => setDepartmentModal(true)}
        >
          <span style={styles.label}>DEPARTMAN</span>

          <div style={styles.inputRow}>
            <Building2 size={23} color={MUTED} />

            <span style={styles.selectText}>
              {form.department || "Departman Seç"}
            </span>

            <ChevronDown size={22} color={MUTED} />
          </div>
        </button>
      </main>

      <button
        style={{
          ...styles.saveButton,
          ...(saving ? styles.saveButtonDisabled : {}),
        }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "KAYDEDİLİYOR..." : "BİLGİLERİ GÜNCELLE"}
      </button>

      {departmentModal && (
        <div style={styles.modalOverlay} onClick={() => setDepartmentModal(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Departman Seç</h2>

            {DEPARTMENTS.map((item) => (
              <button
                key={item}
                style={styles.departmentItem}
                onClick={() => {
                  updateField("department", item);
                  setDepartmentModal(false);
                }}
              >
                <span style={styles.departmentText}>{item}</span>
                {form.department === item ? <Check size={20} color={RED} /> : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InputBox({ label, icon: Icon, value, onChange, disabled = false }) {
  return (
    <div style={{ ...styles.card, ...(disabled ? styles.disabled : {}) }}>
      <label style={styles.label}>{label}</label>

      <div style={styles.inputRow}>
        <Icon size={23} color={MUTED} />

        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
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
    paddingBottom: 120,
    position: "relative",
  },
  header: {
    height: 86,
    backgroundColor: "#fff",
    borderBottom: "1px solid #EEF2F7",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
  },
  backButton: {
    width: 42,
    height: 42,
    marginRight: 10,
    border: "none",
    background: "transparent",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  title: {
    color: DARK,
    fontSize: 21,
    fontWeight: 900,
    letterSpacing: 0.3,
    margin: 0,
  },
  container: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "26px 24px 120px",
  },
  avatarSection: {
    textAlign: "center",
    marginBottom: 28,
  },
  avatarWrapper: {
    position: "relative",
    width: 110,
    height: 110,
    margin: "0 auto",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    objectFit: "cover",
    backgroundColor: "#E2E8F0",
  },
  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    border: "3px solid #fff",
    cursor: "pointer",
  },
  avatarName: {
    color: DARK,
    fontSize: 20,
    fontWeight: 900,
    marginTop: 14,
    marginBottom: 0,
  },
  avatarRole: {
    color: MUTED,
    fontSize: 12,
    fontWeight: 800,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 28,
    padding: "20px",
    marginBottom: 16,
    border: "1px solid #F1F5F9",
  },
  cardButton: {
    width: "100%",
    textAlign: "left",
    backgroundColor: "#F8FAFC",
    borderRadius: 28,
    padding: "20px",
    marginBottom: 16,
    border: "1px solid #F1F5F9",
    cursor: "pointer",
  },
  disabled: {
    opacity: 0.75,
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
    gap: 16,
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
  selectText: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontWeight: 800,
  },
  saveButton: {
    position: "fixed",
    left: 280,
    right: 24,
    bottom: 28,
    height: 72,
    borderRadius: 32,
    backgroundColor: DARK,
    color: "#fff",
    border: "none",
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 3,
    cursor: "pointer",
  },
  saveButtonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(8,18,41,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 1000,
  },
  modalBox: {
    width: "100%",
    maxWidth: 760,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 22,
    paddingBottom: 34,
  },
  modalTitle: {
    color: DARK,
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 14,
  },
  departmentItem: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    marginBottom: 10,
    border: "none",
    cursor: "pointer",
  },
  departmentText: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontWeight: 900,
    textAlign: "left",
  },
};