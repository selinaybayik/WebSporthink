import React, { useState } from "react";
import {
  Megaphone,
  Send,
  GraduationCap,
  BellRing,
  Sparkles,
  CheckCircle2,
  MessageSquareText,
} from "lucide-react";
import { sendInstructorAnnouncement } from "../../services/api";
import { useNavigate } from "react-router-dom";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#64748B";
const BG = "#F4F5F7";

export default function EgitmenDuyuruMerkezi({ user }) {
  const [hedefKitle, setHedefKitle] = useState("my_students");
  const navigate = useNavigate();
  const [baslik, setBaslik] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!baslik.trim() || !mesaj.trim()) {
      window.alert("Başlık ve mesaj alanı boş olamaz.");
      return;
    }

    try {
      setLoading(true);

      const result = await sendInstructorAnnouncement({
        egitmenId: user?.id,
        hedefKitle,
        baslik: baslik.trim(),
        mesaj: mesaj.trim(),
      });

      window.alert(
        `Duyuru gönderildi. ${result.gonderilen_kisi_sayisi || 0} kişiye bildirim oluşturuldu.`
      );

      setBaslik("");
      setMesaj("");
      setHedefKitle("my_students");
    } catch (error) {
      window.alert(error.message || "Duyuru gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.iconBox}>
            <Megaphone size={28} color="#fff" />
          </div>

          <div>
            <p style={styles.pageMini}>EĞİTMEN PANELİ</p>
            <h1 style={styles.title}>Duyuru Merkezi</h1>
            <p style={styles.subtitle}>
             Öğrencilerine hızlı duyuru ve bilgilendirme mesajları gönder.
            </p>
          </div>
        </div>

        <div style={styles.heroBadge}>
         <button
  type="button"
  style={styles.heroBadge}
  onClick={() => navigate("/egitmen/gecmis-duyurular")}
>
  <BellRing size={22} color={RED} />
  <div>
    <strong>Geçmiş Duyurular</strong>
    <span>Gönderdiğin duyuruları görüntüle</span>
  </div>
</button>
        </div>
      </section>

      <main style={styles.contentGrid}>
        <section style={styles.card}>
          <div style={styles.cardHead}>
            <div>
              <p style={styles.sectionMini}>DUYURU FORMU</p>
              <h2 style={styles.cardTitle}>Yeni Duyuru Oluştur</h2>
            </div>

            <div style={styles.formIcon}>
              <MessageSquareText size={24} color={RED} />
            </div>
          </div>

          <label style={styles.label}>HEDEF KİTLE</label>

          <div style={styles.targetGrid}>
            <TargetButton
              active={hedefKitle === "my_students"}
              icon={GraduationCap}
              title="Benim Öğrencilerim"
              text="Eğitimlerine kayıtlı kişiler"
              onClick={() => setHedefKitle("my_students")}
            />

          
          </div>

          <div style={styles.formGrid}>
            <div style={styles.fieldFull}>
              <label style={styles.label}>BAŞLIK</label>
              <input
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                style={styles.input}
                placeholder="Örn: Yeni eğitim materyali yayında"
              />
            </div>

            <div style={styles.fieldFull}>
              <label style={styles.label}>MESAJ</label>
              <textarea
                value={mesaj}
                onChange={(e) => setMesaj(e.target.value)}
                style={styles.textarea}
                placeholder="Duyuru mesajını yaz..."
              />
            </div>
          </div>

          <button
            style={{
              ...styles.sendButton,
              ...(loading ? styles.disabledButton : {}),
            }}
            onClick={handleSend}
            disabled={loading}
          >
            <Send size={18} color="#fff" />
            {loading ? "GÖNDERİLİYOR..." : "DUYURU GÖNDER"}
          </button>
        </section>

        <aside style={styles.previewCard}>
          <div style={styles.previewTop}>
            <div style={styles.previewIcon}>
              <Sparkles size={23} color="#fff" />
            </div>

            <div>
              <p style={styles.previewMini}>CANLI ÖNİZLEME</p>
              <h3 style={styles.previewTitle}>Duyuru Kartı</h3>
            </div>
          </div>

          <div style={styles.phoneBox}>
            <div style={styles.notificationCard}>
              <div style={styles.notificationIcon}>
                <Megaphone size={20} color={RED} />
              </div>

              <div>
                <h4 style={styles.notificationTitle}>
                  {baslik.trim() || "Duyuru başlığı burada görünecek"}
                </h4>

                <p style={styles.notificationText}>
                  {mesaj.trim() ||
                    "Mesajını yazdıkça duyurunun kullanıcı tarafındaki görünümü burada oluşur."}
                </p>

                <div style={styles.notificationFooter}>
                  <CheckCircle2 size={14} color="#10B981" />
                  <span>
                    Benim Öğrencilerim
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.tipsBox}>
            <p style={styles.tipsTitle}>Kısa ipucu</p>
            <p style={styles.tipsText}>
              Başlığı net, mesajı kısa tutarsan duyurular daha hızlı okunur.
            </p>
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
    minWidth: 260,
    cursor: "pointer",
border: "1px solid #FFE4E6",
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
    gridTemplateColumns: "1fr",
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
  formGrid: {
    display: "grid",
    gap: 4,
  },
  fieldFull: {
    width: "100%",
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
  textarea: {
    width: "100%",
    minHeight: 180,
    borderRadius: 24,
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    padding: 18,
    color: DARK,
    fontSize: 15,
    fontWeight: 700,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  sendButton: {
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
  phoneBox: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 28,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    color: DARK,
    display: "flex",
    gap: 13,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  notificationTitle: {
    margin: 0,
    color: DARK,
    fontSize: 15,
    fontWeight: 950,
  },
  notificationText: {
    margin: "7px 0 0",
    color: "#64748B",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: "20px",
  },
  notificationFooter: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#10B981",
    fontSize: 12,
    fontWeight: 900,
  },
  tipsBox: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 18,
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