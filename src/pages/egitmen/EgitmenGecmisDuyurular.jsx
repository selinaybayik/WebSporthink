import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Megaphone,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getInstructorPastAnnouncements } from "../../services/api";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#64748B";
const BG = "#F4F5F7";

export default function EgitmenGecmisDuyurular({ user }) {
  const navigate = useNavigate();

  const [duyurular, setDuyurular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDuyurular();
  }, [user?.id]);

  const loadDuyurular = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getInstructorPastAnnouncements(user.id);
      setDuyurular(Array.isArray(data.duyurular) ? data.duyurular : []);
    } catch (error) {
      console.log("Geçmiş duyurular hatası:", error.message);
      setDuyurular([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const key = search.trim().toLowerCase();

    return duyurular.filter((item) => {
      return (
        key.length === 0 ||
        String(item.baslik || "").toLowerCase().includes(key) ||
        String(item.icerik || "").toLowerCase().includes(key)
      );
    });
  }, [duyurular, search]);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={21} color={DARK} />
        </button>

        <div>
          <p style={styles.pageMini}>EĞİTMEN PANELİ</p>
          <h1 style={styles.title}>Geçmiş Duyurular</h1>
          <p style={styles.subtitle}>
            Daha önce öğrencilerine gönderdiğin duyuruları buradan görüntüle.
          </p>
        </div>

        <div style={styles.heroIcon}>
          <Megaphone size={32} color="#fff" />
        </div>
      </section>

      <section style={styles.searchCard}>
        <Search size={19} color={MUTED} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Duyuru başlığı veya mesajında ara..."
          style={styles.searchInput}
        />
      </section>

      {loading ? (
        <div style={styles.emptyCard}>
          <h2>Duyurular yükleniyor...</h2>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyCard}>
          <h2>Geçmiş duyuru bulunamadı</h2>
          <p>Yeni duyuru gönderdiğinde burada listelenecek.</p>
        </div>
      ) : (
        <section style={styles.list}>
          {filtered.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardIcon}>
                <Megaphone size={24} color={RED} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.cardMini}>DUYURU</p>
                    <h2 style={styles.cardTitle}>{item.baslik}</h2>
                  </div>

                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: item.aktif_mi ? "#ECFDF5" : "#F1F5F9",
                      color: item.aktif_mi ? "#059669" : "#64748B",
                    }}
                  >
                    {item.aktif_mi ? "Aktif" : "Pasif"}
                  </span>
                </div>

                <p style={styles.message}>{item.icerik}</p>

                <div style={styles.metaRow}>
                  <div style={styles.metaItem}>
                    <Users size={16} color={MUTED} />
                    <span>{item.gonderilen_kisi_sayisi || 0} öğrenciye gönderildi</span>
                  </div>

                  <div style={styles.metaItem}>
                    <Calendar size={16} color={MUTED} />
                    <span>
                      {item.olusturma_tarihi
                        ? new Date(item.olusturma_tarihi).toLocaleDateString("tr-TR")
                        : "Tarih yok"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    padding: 28,
    fontFamily: "Inter, Arial, sans-serif",
  },
  hero: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 30,
    border: "1px solid #EEF2F7",
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 22,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
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
    fontSize: 40,
    fontWeight: 950,
    margin: "6px 0 0",
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    fontWeight: 700,
    margin: "8px 0 0",
  },
  heroIcon: {
    marginLeft: "auto",
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 14px 28px rgba(227,6,19,0.25)",
  },
  searchCard: {
    height: 58,
    backgroundColor: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 22,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 18px",
    marginBottom: 22,
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: DARK,
    fontWeight: 800,
    fontSize: 14,
  },
  list: {
    display: "grid",
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #EEF2F7",
    borderRadius: 30,
    padding: 24,
    display: "flex",
    gap: 18,
    boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
  },
  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "flex-start",
  },
  cardMini: {
    margin: 0,
    color: "#A8B3C7",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 2,
  },
  cardTitle: {
    margin: "5px 0 0",
    color: DARK,
    fontSize: 24,
    fontWeight: 950,
  },
  statusBadge: {
    padding: "8px 13px",
    borderRadius: 14,
    fontSize: 12,
    fontWeight: 900,
  },
  message: {
    color: MUTED,
    fontWeight: 700,
    lineHeight: "24px",
    marginTop: 12,
  },
  metaRow: {
    display: "flex",
    gap: 18,
    flexWrap: "wrap",
    marginTop: 18,
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: MUTED,
    fontSize: 13,
    fontWeight: 800,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 40,
    textAlign: "center",
    color: DARK,
    border: "1px solid #EEF2F7",
  },
};