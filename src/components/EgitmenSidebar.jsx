import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  MessageSquare,
  BarChart3,
  Megaphone,
  ClipboardList,
  Bell,
  Wand2,
  FolderOpen,
  Bot,
  User,
  Award,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  Settings,
  ShieldCheck,
  Info,
  Palette,
  BookMarked,
  Sun,
  Moon,
  UserRound,
} from "lucide-react";

const RED = "#ED0015";
const DARK = "#020617";

export default function EgitmenSidebar({ user, setUser }) {
  const [open, setOpen] = useState(true);
  
  const [openMenus, setOpenMenus] = useState({
    profil: false,
    ayarlar: false,
    destek: false,
  });

  const navRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const scrollMenu = (direction) => {
    if (!navRef.current) return;

    navRef.current.scrollBy({
      top: direction === "down" ? 260 : -260,
      behavior: "smooth",
    });
  };

  const menuGroups = [
    {
      title: "EĞİTİM YÖNETİMİ",
      items: [
        { label: "Ana Sayfa", path: "/egitmen", icon: LayoutDashboard },
        { label: "Yüklediğim Eğitimler", path: "/egitmen/egitimlerim", icon: BookOpen },
        {
          label: "Eğitim Oluştur",
          path: "/egitmen/egitim-olustur",
          icon: PlusCircle,
        },
        {
  label: "Aldığım Eğitimler",
  path: "/egitmen/ogrenme-alanim",
  icon: BookOpen,
},
    
        
        {
          label: "Sertifikalarım",
          path: "/egitmen/sertifikalar",
          icon: Award,
        },
      ],
    },
    {
      title: "ÖĞRENCİ TAKİBİ",
      items: [
        {
          label: "Öğrenci İlerlemesi",
          path: "/egitmen/ogrenci-ilerlemesi",
          icon: Users,
        },
        {
          label: "Eğitim Analizi",
          path: "/egitmen/egitim-analizi",
          icon: BarChart3,
        },
        { label: "Sorular", path: "/egitmen/sorular", icon: MessageSquare },
      ],
    },
    {
      title: "İLETİŞİM",
      items: [
        { label: "Duyurular", path: "/egitmen/duyurular", icon: Megaphone },
        {
          label: "Anket Yönetimi",
          path: "/egitmen/anket-yonetimi",
          icon: ClipboardList,
        },
        { label: "Bildirimler", path: "/egitmen/bildirimler", icon: Bell },
      ],
    },
    {
      title: "İÇERİK & AI",
      items: [
        { label: "AI Stüdyo", path: "/egitmen/ai-studyo", icon: Wand2 },
        {
  label: "Eğitim Kaynaklarım",
  path: "/egitmen/kaynak-yonetimi",
  icon: FolderOpen,
},
        { label: "Asistan", path: "/egitmen/asistan", icon: Bot },
      ],
    },
  ];

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <aside
      style={{
        width: open ? 292 : 86,
        height: "100vh",
        background: DARK,
        color: "#fff",
        transition: "0.25s ease",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <div style={styles.logoArea}>
  <div style={styles.logoBox}>S</div>

  {open && (
    <div style={{ flex: 1 }}>
      <div style={styles.logoTitle}>Sporthink</div>
      <div style={styles.logoSub}>Eğitmen Paneli</div>
    </div>
  )}

  <div style={styles.logoActions}>
    <button
  onClick={() => {
    const isDark =
      document.documentElement.classList.contains(
        "dark"
      );

    document.documentElement.classList.toggle(
      "dark",
      !isDark
    );

    localStorage.setItem(
      "theme",
      !isDark ? "dark" : "light"
    );
  }}
  style={styles.themeBtn}
>
  {document.documentElement.classList.contains("dark") ? (
    <Sun size={18} />
  ) : (
    <Moon size={18} />
  )}
</button>

    <button style={styles.collapseBtn} onClick={() => setOpen(!open)}>
      {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  </div>
</div>

      {open && (
        <div style={styles.userBox}>
          <div style={styles.avatar}>
            {(user?.name || "E").charAt(0).toUpperCase()}
          </div>

          <div>
            <div style={styles.userName}>{user?.name || "Eğitmen"}</div>
            <div style={styles.userRole}>{user?.role || "EGITMEN"}</div>
          </div>
        </div>
      )}

      <button style={styles.scrollBtn} onClick={() => scrollMenu("up")}>
        <ChevronUp size={18} />
        {open && <span>Yukarı</span>}
      </button>

      <nav ref={navRef} style={styles.nav}>
        {menuGroups.map((group) => (
          <div key={group.title} style={styles.group}>
            {open && <div style={styles.groupTitle}>{group.title}</div>}

            {group.items.map((item) => (
              <MenuLink key={item.path} item={item} open={open} />
            ))}
          </div>
        ))}

        <div style={styles.group}>
          {open && <div style={styles.groupTitle}>HESAP</div>}

          <DropdownMenu
            open={open}
            title="Profilim"
            icon={User}
            menuKey="profil"
            isOpen={openMenus.profil}
            onToggle={toggleMenu}
            items={[
              {
                label: "Kişisel Bilgiler",
                path: "/egitmen/kisisel-bilgiler",
                icon: UserRound,
              },
              {
                label: "Yetkinlikler",
                path: "/egitmen/yetkinlikler",
                icon: Award,
              },
            ]}
          />

          <DropdownMenu
            open={open}
            title="Ayarlar"
            icon={Settings}
            menuKey="ayarlar"
            isOpen={openMenus.ayarlar}
            onToggle={toggleMenu}
            items={[
              {
                label: "Şifre & Güvenlik",
                path: "/egitmen/sifre-guvenlik",
                icon: ShieldCheck,
              },
              {
                label: "Görünüm",
                path: "/egitmen/gorunum",
                icon: Palette,
              },
              {
                label: "Uygulama Hakkında",
                path: "/egitmen/uygulama-hakkinda",
                icon: Info,
              },
            ]}
          />

          <DropdownMenu
            open={open}
            title="Destek & Yardım"
            icon={HelpCircle}
            menuKey="destek"
            isOpen={openMenus.destek}
            onToggle={toggleMenu}
            items={[
              {
                label: "Eğitmen Rehberi",
                path: "/egitmen/yardim",
                icon: BookMarked,
              },
            ]}
          />
        </div>
      </nav>

      <button style={styles.scrollBtn} onClick={() => scrollMenu("down")}>
        <ChevronDown size={18} />
        {open && <span>Aşağı</span>}
      </button>

      <button style={styles.logoutBtn} onClick={logout}>
        <LogOut size={19} />
        {open && <span>Güvenli Çıkış</span>}
      </button>
    </aside>
  );
}

function MenuLink({ item, open }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/egitmen"}
      style={({ isActive }) => ({
        ...styles.link,
        justifyContent: open ? "flex-start" : "center",
        background: isActive
          ? "linear-gradient(135deg, #ED0015, #B80011)"
          : "transparent",
        color: isActive ? "#fff" : "#94A3B8",
        boxShadow: isActive ? "0 14px 30px rgba(237,0,21,0.22)" : "none",
      })}
    >
      <Icon size={20} />
      {open && <span>{item.label}</span>}
    </NavLink>
  );
}

function DropdownMenu({
  open,
  title,
  icon: Icon,
  menuKey,
  isOpen,
  onToggle,
  items,
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(menuKey)}
        style={{
          ...styles.link,
          width: "100%",
          justifyContent: open ? "space-between" : "center",
          background: isOpen ? "rgba(237,0,21,0.13)" : "transparent",
          color: isOpen ? "#fff" : "#94A3B8",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Icon size={20} />
          {open && title}
        </span>

        {open && (
          <ChevronDown
            size={17}
            style={{
              transition: "0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        )}
      </button>

      {open && isOpen && (
        <div style={styles.subMenu}>
          {items.map((item) => {
            const SubIcon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  ...styles.subLink,
                  background: isActive ? "rgba(237,0,21,0.18)" : "transparent",
                  color: isActive ? "#fff" : "#94A3B8",
                })}
              >
                <SubIcon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  logoArea: {
    height: 78,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "relative",
    flexShrink: 0,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    background: RED,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    fontSize: 22,
    flexShrink: 0,
    boxShadow: "0 14px 28px rgba(237,0,21,0.28)",
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 950,
    textTransform: "uppercase",
  },
  logoSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: 700,
  },
  collapseBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },
  userBox: {
    margin: 16,
    padding: 14,
    borderRadius: 18,
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    background: "#fff",
    color: RED,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
  },
  userName: {
    fontSize: 14,
    fontWeight: 900,
    color: "#fff",
  },
  userRole: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: 800,
  },
  scrollBtn: {
    margin: "0 14px 8px",
    height: 34,
    borderRadius: 13,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.045)",
    color: "#94A3B8",
    fontWeight: 900,
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    flexShrink: 0,
  },
  nav: {
    flex: 1,
    padding: "4px 10px 18px",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(237,0,21,0.75) rgba(255,255,255,0.06)",
  },
  group: {
    marginBottom: 15,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: 950,
    color: "#475569",
    letterSpacing: 2.5,
    padding: "9px 12px",
  },
  link: {
    minHeight: 43,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "0 12px",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 5,
    transition: "0.2s ease",
  },
  logoActions: {
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: 8,
},

themeBtn: {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
},
  subMenu: {
    marginLeft: 14,
    marginBottom: 8,
    paddingLeft: 12,
    borderLeft: "1px solid rgba(255,255,255,0.08)",
  },
  subLink: {
    minHeight: 38,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 12px",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 4,
    transition: "0.2s ease",
  },
  logoutBtn: {
    margin: 14,
    height: 46,
    borderRadius: 16,
    border: "1px solid rgba(237,0,21,0.35)",
    background: "rgba(237,0,21,0.12)",
    color: "#fff",
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    cursor: "pointer",
    flexShrink: 0,
  },
};