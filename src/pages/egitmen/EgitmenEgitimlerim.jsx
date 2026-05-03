import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Eye,
  Edit3,
  MoreVertical,
  Users,
  Star,
  Wand2,
  Trash2,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getInstructorTrainings,
  deleteInstructorTraining,
} from "../../services/api";

const RED = "#ED0015";
const DARK = "#081229";
const MUTED = "#64748B";
const BG = "#F4F5F7";

const tabs = ["Yayında", "Taslaklar"];

export default function EgitmenEgitimlerim({ user }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Yayında");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrainings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getInstructorTrainings(user.id);
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Eğitimler yüklenemedi:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();
  }, [user?.id]);

  const handleDeleteTraining = async (egitimId) => {
    const ok = window.confirm("Bu taslak eğitimi silmek istediğine emin misin?");
    if (!ok) return;

    try {
      await deleteInstructorTraining(egitimId);
      window.alert("Eğitim silindi.");
      loadTrainings();
    } catch (error) {
      window.alert(error.message || "Eğitim silinemedi.");
    }
  };

  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return courses.filter((item) => {
      const title = String(item.title || item.baslik || "").toLowerCase();
      const category = String(item.category || item.kategori || "Genel").toLowerCase();

      const tabMatch =
        activeTab === "Yayında"
          ? item.aktif_mi === true
          : item.aktif_mi === false;

      const searchMatch =
        keyword.length === 0 ||
        title.includes(keyword) ||
        category.includes(keyword);

      return tabMatch && searchMatch;
    });
  }, [activeTab, search, courses]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.topArea}>
          <div style={styles.headerRow}>
            <div>
              <p style={styles.pageMini}>EĞİTMEN PANELİ</p>
              <h1 style={styles.pageTitle}>Eğitimlerim</h1>
              <p style={styles.pageDesc}>
                Yayındaki eğitimlerini, taslaklarını ve içerik düzenlemelerini buradan yönetebilirsin.
              </p>
            </div>

            <button
              style={styles.addButton}
              onClick={() => navigate("/egitmen/egitim-olustur")}
            >
              <Plus size={20} color="#fff" strokeWidth={3} />
              Yeni Eğitim
            </button>
          </div>

          <div style={styles.filterRow}>
            <div style={styles.searchBox}>
              <Search size={21} color="#CBD5E1" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Eğitim başlığı veya kategori ile ara..."
                style={styles.searchInput}
              />
            </div>

            <div style={styles.tabRow}>
              {tabs.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      ...styles.tabButton,
                      ...(active ? styles.tabActive : {}),
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section style={styles.aiCard} onClick={() => navigate("/egitmen/ai-studyo")}>
          <div style={styles.aiIcon}>
            <Wand2 size={24} color="#fff" />
          </div>

          <div>
            <p style={styles.aiSmall}>AI İÇERİK STÜDYOSU</p>
            <h2 style={styles.aiTitle}>Dokümanlarını yükle, eğitimi AI hazırlasın.</h2>
            <p style={styles.aiLink}>AI Stüdyo’ya git ›</p>
          </div>
        </section>

        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {activeTab === "Yayında" ? "Yayındaki İçerikler" : "Taslak Eğitimler"}
          </h2>
          <span style={styles.courseCount}>{filteredCourses.length} kurs</span>
        </div>

        {loading ? (
          <div style={styles.emptyCard}>
            <BookOpen size={34} color="#CBD5E1" />
            <h3 style={styles.emptyTitle}>Eğitimler yükleniyor...</h3>
          </div>
        ) : filteredCourses.length > 0 ? (
          <section style={styles.courseGrid}>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id || course.egitim_id}
                course={course}
                onDelete={handleDeleteTraining}
                navigate={navigate}
              />
            ))}
          </section>
        ) : (
          <div style={styles.emptyCard}>
            <BookOpen size={38} color="#CBD5E1" />
            <h3 style={styles.emptyTitle}>Eğitim bulunamadı</h3>
            <p style={styles.emptyText}>
              Bu alanda henüz eğitim yok. Yeni eğitim oluşturabilirsin.
            </p>

            <button
              style={styles.emptyButton}
              onClick={() => navigate("/egitmen/egitim-olustur")}
            >
              <Plus size={18} color="#fff" />
              Yeni Eğitim Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, navigate, onDelete }) {
  const id =
  course.id ||
  course.egitim_id ||
  course.egitimId ||
  course.training_id ||
  course.trainingId;
  const title = course.title || course.baslik || "Eğitim başlığı";
  const category = course.category || course.kategori || "Genel";
  const students = course.students || course.ogrenci || 0;
  const rating = Number(course.rating || 0).toFixed(1);
  const updated = course.updated || course.guncelleme_tarihi || "-";
  const isPublished = course.aktif_mi === true;

 return (
  <div
    style={styles.courseCard}
    onClick={() =>
      navigate(`/egitmen/egitim-detay/${id}`, {
        state: {
          id,
          egitimId: id,
          title,
          egitim: course,
        },
      })
    }
  >
      <div style={styles.courseTop}>
        <div style={{ ...styles.bookIcon, backgroundColor: course.color || RED }}>
          <BookOpen size={28} color="#fff" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={styles.courseCategory}>{category}</p>
          <h3 style={styles.courseTitle}>{title}</h3>

          <div style={styles.metaRow}>
            {isPublished ? (
              <>
                <Users size={14} color="#8A97AD" />
                <span style={styles.metaText}>{students} öğrenci</span>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <span style={styles.ratingText}>{rating}</span>
              </>
            ) : (
              <>
                <Clock3 size={14} color="#8A97AD" />
                <span style={styles.metaText}>Taslak olarak kaydedildi</span>
              </>
            )}
          </div>
        </div>

        <button style={styles.moreButton}>
          <MoreVertical size={21} color="#CBD5E1" />
        </button>
      </div>

      <div style={styles.divider} />

      <div style={styles.cardBottom}>
        <div style={styles.updateRow}>
          <Clock3 size={15} color="#CBD5E1" />
          <span style={styles.updateText}>Son güncelleme: {updated}</span>
        </div>

        <div style={styles.actionButtons}>
          {!isPublished && (
            <button style={styles.deleteButton} onClick={(e) => {
  e.stopPropagation();
  onDelete(id);
}}>
              <Trash2 size={17} color="#fff" />
            </button>
          )}

          <button
  style={styles.previewButton}
  onClick={(e) => {
    e.stopPropagation();

    if (!id) {
      window.alert("Bu eğitim için ID bulunamadı.");
      return;
    }

    navigate(`/egitmen/onizleme/${id}`, {
      state: {
        id,
        egitimId: id,
        egitim: {
          ...course,
          id,
          egitim_id: id,
        },
      },
    });
  }}
>
  <Eye size={18} color={DARK} />
</button>
          <button
            style={styles.editButton}
            onClick={(e) => {
  e.stopPropagation();

  navigate("/egitmen/kaynak-yonetimi", {
                state: {
                  mode: "edit",
                  egitimId: id,
                  egitim: course,
                },
              })
            }}
          >
            <Edit3 size={16} color={RED} />
            Düzenle
          </button>
        </div>
      </div>
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
  container: {
    maxWidth: 1440,
    margin: "0 auto",
  },
  topArea: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 28,
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    marginBottom: 26,
  },
  pageMini: {
    margin: 0,
    color: "#A8B3C7",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 2,
  },
  pageTitle: {
    margin: "6px 0 0",
    color: DARK,
    fontSize: "clamp(28px, 3vw, 42px)",
    fontWeight: 900,
  },
  pageDesc: {
    margin: "10px 0 0",
    color: MUTED,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: "24px",
    maxWidth: 720,
  },
  addButton: {
    height: 48,
    border: "none",
    borderRadius: 16,
    backgroundColor: RED,
    color: "#fff",
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(237,0,21,0.22)",
    whiteSpace: "nowrap",
  },
  filterRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 330px",
    gap: 16,
  },
  searchBox: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 18px",
    border: "1px solid #EEF2F7",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: DARK,
    fontSize: 15,
    fontWeight: 700,
  },
  tabRow: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    padding: 5,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
  },
  tabButton: {
    border: "none",
    borderRadius: 14,
    backgroundColor: "transparent",
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
  tabActive: {
    backgroundColor: RED,
    color: "#fff",
  },
  aiCard: {
    marginTop: 24,
    backgroundColor: DARK,
    borderRadius: 30,
    padding: 28,
    minHeight: 170,
    display: "flex",
    alignItems: "center",
    gap: 20,
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 14px 32px rgba(8,18,41,0.16)",
  },
  aiIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  aiSmall: {
    margin: 0,
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 2,
  },
  aiTitle: {
    margin: "8px 0",
    color: "#fff",
    fontSize: 25,
    fontWeight: 900,
  },
  aiLink: {
    margin: 0,
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontWeight: 900,
  },
  sectionHeader: {
    marginTop: 32,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    margin: 0,
    color: "#64748B",
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  courseCount: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 900,
    textTransform: "uppercase",
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 20,
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 22,
    boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
  },
  courseTop: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  bookIcon: {
    width: 66,
    height: 66,
    borderRadius: 22,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  courseCategory: {
    margin: "0 0 6px",
    color: "#A0ABC0",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  courseTitle: {
    margin: 0,
    color: DARK,
    fontSize: 18,
    fontWeight: 900,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    flexWrap: "wrap",
  },
  metaText: {
    color: "#8A97AD",
    fontSize: 12,
    fontWeight: 800,
    marginRight: 8,
  },
  ratingText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: 900,
  },
  moreButton: {
    width: 34,
    height: 42,
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    margin: "18px 0",
  },
  cardBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  updateRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  updateText: {
    color: "#A0ABC0",
    fontSize: 11,
    fontWeight: 900,
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    border: "none",
    backgroundColor: "#EF4444",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  previewButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    border: "none",
    backgroundColor: "#F8FAFC",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  editButton: {
    height: 42,
    borderRadius: 14,
    border: "none",
    backgroundColor: "#FFF1F2",
    color: RED,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 34,
    textAlign: "center",
    boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
  },
  emptyTitle: {
    color: DARK,
    fontSize: 20,
    fontWeight: 900,
    margin: "12px 0 0",
  },
  emptyText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: 600,
    marginTop: 8,
  },
  emptyButton: {
    marginTop: 18,
    border: "none",
    borderRadius: 16,
    backgroundColor: RED,
    color: "#fff",
    padding: "13px 18px",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
};