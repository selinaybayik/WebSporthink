import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Star,
  Users,
  Briefcase,
  Sun,
  Moon,
} from "lucide-react";

import { getInstructorProfile } from "../../services/api";

const RED = "#E30613";

const lightTheme = {
  bg: "#F8F9FA",
  card: "#FFFFFF",
  hero: "#081229",
  text: "#081229",
  muted: "#94A3B8",
  soft: "#64748B",
  border: "#F1F5F9",
  iconBg: "#F8FAFC",
  logoutBg: "#FFF1F2",
  logoutBorder: "#FFD4D8",
  chevron: "#CBD5E1",
  switchBg: "#E2E8F0",
};

const darkTheme = {
  bg: "#020617",
  card: "#0F172A",
  hero: "#020617",
  text: "#F8FAFC",
  muted: "#94A3B8",
  soft: "#CBD5E1",
  border: "#1E293B",
  iconBg: "#1E293B",
  logoutBg: "#2A0B10",
  logoutBorder: "#7F1D1D",
  chevron: "#64748B",
  switchBg: "#334155",
};

export default function EgitmenProfil({ user, setUser }) {
    const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = darkMode ? darkTheme : lightTheme;
  const styles = createStyles(theme);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        if (!user?.id) return;

        const data = await getInstructorProfile(user.id);
        setProfile(data);
      } catch (error) {
        window.alert("Profil bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const instructorData = {
    firstName: profile?.ad || user?.name?.split(" ")?.[0] || "Eğitmen",
    lastName:
      profile?.soyad ||
      user?.name?.split(" ")?.slice(1).join(" ") ||
      "",
    role: profile?.rol || user?.role || "EGITMEN",
    department:
      profile?.departman || user?.department || "Departman bilgisi yok",
    stats: {
      courses: profile?.stats?.egitimSayisi || 0,
      students: profile?.stats?.ogrenciSayisi || 0,
      rating: profile?.stats?.cevaplananSoru || 0,
    },
  };

  const logout = () => {
    const ok = window.confirm("Hesabından çıkış yapmak istediğine emin misin?");
    if (!ok) return;

    if (setUser) {
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.safe}>
        <div style={styles.loadingBox}>Profil yükleniyor...</div>
      </div>
    );
  }

  return (
    <div style={styles.safe}>
      <div style={styles.hero}>
        <div style={styles.redGlow} />

        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>
            <span style={styles.avatarEmoji}>👨‍🏫</span>
          </div>

          <div style={styles.starBadge}>
            <Star size={13} color="#fff" fill="#fff" />
          </div>
        </div>

        <h1 style={styles.name}>
          {instructorData.firstName} {instructorData.lastName}
        </h1>

        <div style={styles.roleRow}>
          <Briefcase size={13} color={RED} />
          <span style={styles.roleText}>
            {String(instructorData.role).toUpperCase()}
          </span>
        </div>

        <p style={styles.department}>
          {String(instructorData.department).toUpperCase()}
        </p>
      </div>

      <div style={styles.statsRow}>
        <StatCard
          icon={BookOpen}
          value={instructorData.stats.courses}
          label="Eğitim"
          color="#3B82F6"
          styles={styles}
        />

        <StatCard
          icon={Users}
          value={instructorData.stats.students}
          label="Öğrenci"
          color="#8B5CF6"
          styles={styles}
        />

        <StatCard
          icon={Star}
          value={instructorData.stats.rating}
          label="Cevap"
          color="#F59E0B"
          styles={styles}
        />
      </div>

      <main style={styles.main}>
        <MenuGroup title="HESAP VE GÜVENLİK" styles={styles}>
  <MenuItem
    icon={User}
    label="Kişisel Bilgiler"
    sub="Profilini ve iletişim detaylarını yönet"
    onPress={() => navigate("/egitmen/kisisel-bilgiler")}
    styles={styles}
    theme={theme}
  />

  <MenuItem
    icon={ShieldCheck}
    label="Şifre ve Güvenlik"
    sub="Hesap güvenliğini kontrol et"
    onPress={() => navigate("/egitmen/sifre-guvenlik")}
    styles={styles}
    theme={theme}
  />
</MenuGroup>

<MenuGroup title="GÖRÜNÜM VE UYGULAMA" styles={styles}>
  <MenuItem
    icon={darkMode ? Moon : Sun}
    label="Karanlık Mod"
    sub={darkMode ? "Karanlık tema aktif" : "Aydınlık tema aktif"}
    toggle
    value={darkMode}
    onToggle={() => setDarkMode(!darkMode)}
    styles={styles}
    theme={theme}
  />

  <MenuItem
    icon={Bell}
    label="Bildirimler"
    sub="Ders ve öğrenci etkileşim uyarılarını görüntüle"
    onPress={() => navigate("/egitmen/bildirimler")}
    styles={styles}
    theme={theme}
  />
</MenuGroup>

<MenuGroup title="DESTEK" styles={styles}>
  <MenuItem
    icon={HelpCircle}
    label="Eğitmen Rehberi"
    sub="İçerik hazırlama ipuçları"
    onPress={() => navigate("/egitmen/yardim")}
    styles={styles}
    theme={theme}
  />

  <MenuItem
    icon={Info}
    label="Uygulama Hakkında"
    sub="Versiyon 2.4.1"
    onPress={() => window.alert("Sporthink Akademi v2.4.1")}
    styles={styles}
    theme={theme}
  />
</MenuGroup>

        <button style={styles.logoutButton} onClick={logout}>
          <LogOut size={19} color={RED} />
          HESAPTAN ÇIKIŞ YAP
        </button>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color, styles }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>
        <Icon size={21} color={color} />
      </div>

      <h3 style={styles.statValue}>{value}</h3>
      <p style={styles.statLabel}>{label.toUpperCase()}</p>
    </div>
  );
}

function MenuGroup({ title, children, styles }) {
  return (
    <section style={styles.menuGroup}>
      <h2 style={styles.menuGroupTitle}>{title}</h2>
      {children}
    </section>
  );
}

function MenuItem({
  icon: Icon,
  label,
  sub,
  onPress,
  toggle,
  value,
  onToggle,
  styles,
  theme,
}) {
  return (
    <button
      onClick={toggle ? onToggle : onPress}
      style={styles.menuItem}
      type="button"
    >
      <div style={styles.menuIcon}>
        <Icon size={21} color={theme.muted} />
      </div>

      <div style={{ flex: 1, textAlign: "left" }}>
        <h3 style={styles.menuLabel}>{label}</h3>
        <p style={styles.menuSub}>{sub}</p>
      </div>

      {toggle ? (
        <div
          style={{
            ...styles.switch,
            ...(value ? styles.switchActive : {}),
          }}
        >
          <div
            style={{
              ...styles.switchDot,
              ...(value ? styles.switchDotActive : {}),
            }}
          />
        </div>
      ) : (
        <ChevronRight size={20} color={theme.chevron} />
      )}
    </button>
  );
}

const createStyles = (theme) => ({
  safe: {
    minHeight: "100vh",
    backgroundColor: theme.bg,
    fontFamily: "Inter, Arial, sans-serif",
    paddingBottom: 80,
  },
  loadingBox: {
    minHeight: "70vh",
    display: "grid",
    placeItems: "center",
    color: theme.muted,
    fontWeight: 900,
  },
  hero: {
    backgroundColor: theme.hero,
    padding: "48px 24px 66px",
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    textAlign: "center",
    overflow: "hidden",
    position: "relative",
  },
  redGlow: {
    position: "absolute",
    right: -80,
    top: -80,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(227,6,19,0.20)",
  },
  avatarWrap: {
    position: "relative",
    margin: "0 auto 16px",
    width: 96,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fff",
    border: "5px solid #fff",
    display: "grid",
    placeItems: "center",
  },
  avatarEmoji: {
    fontSize: 43,
  },
  starBadge: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: RED,
    border: `4px solid ${theme.hero}`,
    display: "grid",
    placeItems: "center",
  },
  name: {
    color: "#fff",
    fontSize: 25,
    fontWeight: 900,
    margin: 0,
  },
  roleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  roleText: {
    color: "#CBD5E1",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 1.4,
  },
  department: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: 900,
    marginTop: 5,
    fontStyle: "italic",
  },
  statsRow: {
    maxWidth: 860,
    margin: "-40px auto 0",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  statCard: {
    backgroundColor: theme.card,
    borderRadius: 26,
    padding: "16px 10px",
    textAlign: "center",
    border: `1px solid ${theme.border}`,
    boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: theme.iconBg,
    display: "grid",
    placeItems: "center",
    margin: "0 auto 8px",
  },
  statValue: {
    color: theme.text,
    fontSize: 18,
    fontWeight: 900,
    margin: 0,
  },
  statLabel: {
    color: theme.muted,
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: 1,
    marginTop: 3,
  },
  main: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "34px 24px 0",
    display: "grid",
    gap: 28,
  },
  menuGroup: {
    display: "grid",
    gap: 10,
  },
  menuGroupTitle: {
    color: theme.muted,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 2,
    margin: "0 0 2px 4px",
  },
  menuItem: {
    backgroundColor: theme.card,
    borderRadius: 28,
    padding: 16,
    border: `1px solid ${theme.border}`,
    display: "flex",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
  },
  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: theme.iconBg,
    display: "grid",
    placeItems: "center",
    marginRight: 14,
    flexShrink: 0,
  },
  menuLabel: {
    color: theme.text,
    fontSize: 14,
    fontWeight: 900,
    margin: 0,
  },
  menuSub: {
    color: theme.muted,
    fontSize: 10,
    fontWeight: 700,
    margin: "4px 0 0",
  },
  switch: {
    width: 43,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.switchBg,
    padding: 4,
    display: "flex",
    justifyContent: "center",
  },
  switchActive: {
    backgroundColor: RED,
  },
  switchDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  switchDotActive: {
    marginLeft: "auto",
  },
  logoutButton: {
    height: 62,
    borderRadius: 28,
    backgroundColor: theme.logoutBg,
    border: `1px solid ${theme.logoutBorder}`,
    color: RED,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.4,
    cursor: "pointer",
    marginBottom: 20,
  },
});