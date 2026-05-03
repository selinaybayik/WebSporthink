import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import {
  getInstructorNotifications,
  markInstructorNotificationRead,
} from "../../services/api";

const RED = "#ED0015";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F4F5F7";

export default function EgitmenBildirimler({ user }) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tümü");

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      if (!user?.id) return;

      setLoading(true);

      const data = await getInstructorNotifications(user.id);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Bildirimler alınamadı:", error.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications =
    activeFilter === "Okunmamış"
      ? notifications.filter((item) => item.unread)
      : notifications;

  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={25} color="#94A3B8" />
        </button>

        <div>
          <h1 style={styles.headerTitle}>BİLDİRİMLER</h1>
          <p style={styles.headerSub}>{unreadCount} okunmamış bildirim var</p>
        </div>
      </header>

      <main style={styles.content}>
        <section style={styles.summaryCard}>
          <div style={styles.summaryIcon}>
            <Bell size={28} color="#fff" />
            <div style={styles.summaryDot} />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={styles.summaryTitle}>Eğitmen bildirim merkezi</h2>
            <p style={styles.summaryText}>
              Öğrenci soruları, eğitim taslakları ve performans uyarılarını
              buradan takip edebilirsin.
            </p>
          </div>
        </section>

        <div style={styles.filterRow}>
          {["Tümü", "Okunmamış"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              style={{
                ...styles.filterChip,
                ...(activeFilter === item ? styles.filterChipActive : {}),
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <h3 style={styles.sectionTitle}>SON BİLDİRİMLER</h3>

        <section style={styles.list}>
          {loading ? (
            <p style={styles.loadingText}>Bildirimler yükleniyor...</p>
          ) : null}

          {!loading && filteredNotifications.length === 0 ? (
            <div style={styles.emptyBox}>Bildirim bulunamadı.</div>
          ) : null}

          {filteredNotifications.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              navigate={navigate}
              onRead={async () => {
                try {
                  if (item.unread) {
                    await markInstructorNotificationRead(item.id);

                    setNotifications((prev) =>
                      prev.map((n) =>
                        n.id === item.id
                          ? { ...n, unread: false, read: true }
                          : n
                      )
                    );
                  }
                } catch (err) {
                  console.log("Bildirim okunamadı:", err.message);
                }
              }}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

function NotificationCard({ item, navigate, onRead }) {
  const meta = getNotificationMeta(item.type);
  const Icon = meta.icon;

  const goDetail = () => {
    if (item.type === "question") {
      navigate("/egitmen/sorular");
      return;
    }

    if (item.type === "course") {
      navigate("/egitmen/kaynak-yonetimi");
      return;
    }

    navigate("/egitmen");
  };

  return (
    <button
      style={{
        ...styles.notificationCard,
        ...(item.unread ? styles.unreadCard : {}),
      }}
      onClick={() => {
        onRead?.();
        goDetail();
      }}
    >
      <div
        style={{
          ...styles.notificationIcon,
          backgroundColor: meta.bg,
        }}
      >
        <Icon size={23} color={meta.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={styles.notificationTop}>
          <h4 style={styles.notificationTitle}>{item.title}</h4>
          {item.unread && <div style={styles.unreadDot} />}
        </div>

        <p style={styles.notificationDesc}>{item.desc}</p>
        <p style={styles.notificationTime}>{item.time}</p>
      </div>

      <ChevronRight size={22} color="#CBD5E1" />
    </button>
  );
}

function getNotificationMeta(type) {
  switch (type) {
    case "question":
      return {
        icon: MessageSquare,
        color: "#F59E0B",
        bg: "#FFFBEB",
      };

    case "course":
      return {
        icon: BookOpen,
        color: "#2563EB",
        bg: "#EFF6FF",
      };

    case "certificate":
      return {
        icon: Award,
        color: "#10B981",
        bg: "#ECFDF5",
      };

    case "warning":
      return {
        icon: AlertCircle,
        color: RED,
        bg: "#FFF1F2",
      };

    default:
      return {
        icon: CheckCircle2,
        color: "#10B981",
        bg: "#ECFDF5",
      };
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    fontFamily: "Inter, Arial, sans-serif",
  },
  header: {
    minHeight: 88,
    backgroundColor: "#fff",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    alignItems: "center",
    padding: "18px 24px",
  },
  backButton: {
    marginRight: 18,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },
  headerTitle: {
    color: DARK,
    fontSize: 24,
    fontWeight: 900,
    margin: 0,
  },
  headerSub: {
    color: MUTED,
    fontSize: 12,
    fontWeight: 800,
    margin: "4px 0 0",
  },
  content: {
    padding: "30px 32px 90px",
  maxWidth: 1280,
  margin: "0 auto",
  },
  summaryCard: {
     backgroundColor: DARK,
  borderRadius: 34,
  padding: 32,
  display: "flex",
  alignItems: "center",
  marginBottom: 28,
  },
  summaryIcon: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    marginRight: 18,
    position: "relative",
    flexShrink: 0,
  },
  summaryDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FACC15",
  },
  summaryTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: 900,
    margin: 0,
  },
  summaryText: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: "18px",
    margin: "7px 0 0",
  },
  filterRow: {
    display: "flex",
    gap: 10,
    marginBottom: 24,
  },
  filterChip: {
    height: 44,
    padding: "0 22px",
    borderRadius: 16,
    backgroundColor: "#fff",
    border: "1px solid #E5E7EB",
    color: MUTED,
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
  },
  filterChipActive: {
    backgroundColor: RED,
    borderColor: RED,
    color: "#fff",
  },
  sectionTitle: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 1.4,
    margin: "0 0 16px 4px",
  },
  list: {
    display: "grid",
    gap: 14,
  },
  loadingText: {
    textAlign: "center",
    color: MUTED,
    fontWeight: 900,
    marginTop: 30,
  },
  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    textAlign: "center",
    color: MUTED,
    fontWeight: 900,
  },
  notificationCard: {
     width: "100%",
  textAlign: "left",
  backgroundColor: "#fff",
  borderRadius: 28,
  padding: 24,
  border: "1px solid #EDF0F4",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
  unreadCard: {
    borderColor: "#FFD4D8",
  },
  notificationIcon: {
     width: 62,
  height: 62,
  borderRadius: 20,
  display: "grid",
  placeItems: "center",
  marginRight: 18,
  flexShrink: 0,
  },
  notificationTop: {
    display: "flex",
    alignItems: "center",
    marginBottom: 5,
    gap: 8,
  },
  notificationTitle: {
    flex: 1,
  color: DARK,
  fontSize: 17,
  fontWeight: 900,
  margin: 0,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: RED,
    marginLeft: 8,
  },
  notificationDesc: {
      color: "#64748B",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: "22px",
  margin: 0,
  },
  notificationTime: {
    color: MUTED,
    fontSize: 11,
    fontWeight: 900,
    margin: "7px 0 0",
  },
};