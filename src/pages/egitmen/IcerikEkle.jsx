import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Type,
  Check,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import {
  getInstructorTrainings,
  getTrainingModules,
  createTrainingModule,
  createTextContent,
  createVideoContent,
  createPdfContent,
} from "../../services/api";

const RED = "#ED0015";
const DARK = "#081229";
const MUTED = "#94A3B8";
const BG = "#F4F5F7";

const contentTypes = [
  {
    key: "video",
    title: "Video Ders",
    desc: "MP4, MOV formatında yükle",
    icon: Video,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    key: "pdf",
    title: "PDF / Doküman",
    desc: "Kılavuz veya sunum ekle",
    icon: FileText,
    color: "#9333EA",
    bg: "#F3E8FF",
  },
  {
    key: "quiz",
    title: "Yeni Quiz",
    desc: "Bilgi ölçme soruları hazırla",
    icon: HelpCircle,
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    key: "text",
    title: "Metin İçerik",
    desc: "Makale veya vaka çalışması",
    icon: Type,
    color: "#059669",
    bg: "#ECFDF5",
  },
];

export default function IcerikEkle({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const params = location.state || {};

  const draftCourse = params.egitim
    ? {
        id:
          params.egitim.egitim_id ||
          params.egitim.id ||
          params.egitimId,

        title:
          params.egitim.baslik ||
          params.egitim.title ||
          "Yeni Eğitim Taslağı",

        category:
          params.egitim.category ||
          params.egitim.kategori ||
          "Genel",

        modules: 0,
        isDraft: true,
      }
    : null;

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] =
    useState(draftCourse);

  const [search, setSearch] = useState("");

  const [selectedType, setSelectedType] =
    useState(null);

  const [title, setTitle] = useState("");
  const [textContent, setTextContent] =
    useState("");

  const [contentUrl, setContentUrl] =
    useState("");


  const [savingContent, setSavingContent] =
    useState(false);

  const [modules, setModules] = useState([]);

  const [selectedModule, setSelectedModule] =
    useState(null);

  const [moduleListOpen, setModuleListOpen] =
    useState(false);

  const [required, setRequired] =
    useState(true);
    const [aiQuizEnabled, setAiQuizEnabled] =
  useState(true);

const [quizCheckpoint1, setQuizCheckpoint1] =
  useState(40);

const [quizCheckpoint2, setQuizCheckpoint2] =
  useState(80);

const [contentBasedQuiz, setContentBasedQuiz] =
  useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        if (!user?.id) return;

        setCoursesLoading(true);

        const data = await getInstructorTrainings(
          user.id
        );

        const formatted = data.map((item) => ({
          id: item.id || item.egitim_id,

          title:
            item.baslik ||
            item.title ||
            "İsimsiz Eğitim",

          category:
            item.kategori ||
            item.category ||
            "Genel",

          modules:
            item.modul_sayisi ||
            item.modules ||
            0,

          isDraft:
            item.durum === "Taslak" ||
            item.aktif_mi === false,
        }));

        setCourses(formatted);
      } catch (error) {
        console.log(error.message);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, [user?.id]);

  useEffect(() => {
    const loadModules = async () => {
      if (!selectedCourse?.id) return;

      try {
        const data = await getTrainingModules(
          selectedCourse.id
        );

        setModules(
          Array.isArray(data) ? data : []
        );

        if (data?.length > 0) {
          setSelectedModule(data[0]);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    loadModules();
  }, [selectedCourse?.id]);

  const filteredCourses = useMemo(() => {
    const key = search.trim().toLowerCase();

    return courses.filter((item) => {
      return (
        key.length === 0 ||
        item.title.toLowerCase().includes(key) ||
        item.category.toLowerCase().includes(key)
      );
    });
  }, [search, courses]);

  const selectedTypeData = contentTypes.find(
    (item) => item.key === selectedType
  );

  const handleCreateModule = async () => {
    if (!selectedCourse?.id) return;

    try {
      const yeniModul =
        await createTrainingModule(
          selectedCourse.id,
          `Modül ${modules.length + 1}`
        );

      const updatedModules = [
        ...modules,
        yeniModul,
      ];

      setModules(updatedModules);

      setSelectedModule(yeniModul);

      setModuleListOpen(false);
    } catch (error) {
      window.alert(
        error.message || "Modül oluşturulamadı."
      );
    }
  };



  const handlePublishContent = async () => {
    if (!selectedCourse?.id) {
      window.alert("Lütfen eğitim seç.");
      return;
    }

    if (!selectedModule?.bolum_id) {
      window.alert("Lütfen modül seç.");
      return;
    }

    if (!selectedType) {
      window.alert("Lütfen içerik tipi seç.");
      return;
    }

    if (!title.trim()) {
      window.alert("Lütfen içerik başlığı yaz.");
      return;
    }

    try {
      setSavingContent(true);

      if (selectedType === "text") {
        await createTextContent({
          bolum_id:
            selectedModule.bolum_id,

          baslik: title.trim(),

          metin_icerik:
            textContent.trim(),

          sure_bilgisi: "0 dk",
        });
      }

     if (selectedType === "video") {
  await createVideoContent({
    bolum_id:
      selectedModule.bolum_id,

    baslik: title.trim(),

    url: contentUrl.trim(),

    sure_bilgisi: "0 dk",

    ai_quiz_aktif:
      aiQuizEnabled,

    ai_quiz_checkpoint_1:
      quizCheckpoint1,

    ai_quiz_checkpoint_2:
      quizCheckpoint2,

    ai_soru_uret:
      contentBasedQuiz,
  });
}

      if (selectedType === "pdf") {
        await createPdfContent({
          bolum_id:
            selectedModule.bolum_id,

          baslik: title.trim(),

          url: contentUrl.trim(),

          sure_bilgisi: "0 dk",
        });
      }

      window.alert("İçerik modüle eklendi.");

      setTitle("");
      setTextContent("");
      setContentUrl("");
      setSelectedType(null);
    } catch (error) {
      window.alert(
        error.message ||
          "İçerik eklenemedi."
      );
    } finally {
      setSavingContent(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.header}>
          <button
            style={styles.backButton}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={22} color={MUTED} />
          </button>

          <div>
            <h1 style={styles.title}>
              İçerik Ekle
            </h1>

            <div style={styles.titleLine}>
              <div style={styles.titleLineActive} />
              <div style={styles.titleLinePassive} />
              <div style={styles.titleLinePassive} />
            </div>
          </div>

          <button style={styles.infoButton}>
            <AlertCircle
              size={22}
              color={MUTED}
            />
          </button>
        </section>

        {!selectedCourse ? (
          <div style={styles.pageContent}>
            <h2 style={styles.sectionTitle}>
              HANGİ EĞİTİME EKLİYORSUNUZ?
            </h2>

            <div style={styles.searchBox}>
              <Search
                size={22}
                color="#CBD5E1"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Eğitimlerinde ara..."
                style={styles.searchInput}
              />
            </div>

            {coursesLoading && (
              <div style={styles.loadingBox}>
                Eğitimler yükleniyor...
              </div>
            )}

            {!coursesLoading &&
              filteredCourses.map((course) => (
                <button
                  key={course.id}
                  style={styles.courseCard}
                  onClick={() =>
                    setSelectedCourse(course)
                  }
                >
                  <div style={styles.courseIcon}>
                    <BookOpen
                      size={28}
                      color={RED}
                    />
                  </div>

                  <div
                    style={{
                      flex: 1,
                      textAlign: "left",
                    }}
                  >
                    <h3 style={styles.courseTitle}>
                      {course.title}
                    </h3>

                    <p style={styles.courseSub}>
                      {course.category.toUpperCase()} ·{" "}
                      {course.modules} MODÜL
                    </p>
                  </div>

                  <ChevronRight
                    size={24}
                    color="#CBD5E1"
                  />
                </button>
              ))}
          </div>
        ) : (
          <div style={styles.pageContent}>
            <button
              style={styles.selectedCourseBar}
              onClick={() => {
                if (selectedCourse?.isDraft) {
                  navigate(-1);
                  return;
                }

                setSelectedCourse(null);
                setSelectedType(null);
              }}
            >
              <BookOpen
                size={20}
                color={RED}
              />

              <span
                style={
                  styles.selectedCourseText
                }
              >
                {selectedCourse.title.toUpperCase()}
              </span>
            </button>

            {!selectedType ? (
              <div style={styles.typeGrid}>
                {contentTypes.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.key}
                      style={styles.typeCard}
                      onClick={() => {
                        if (
                          item.key === "quiz"
                        ) {
                          navigate(
                            "/egitmen/quiz-olustur",
                            {
                              state: {
                                egitimId:
                                  selectedCourse.id,

                                bolumId:
                                  selectedModule?.bolum_id,

                                egitimTitle:
                                  selectedCourse.title,

                                moduleTitle:
                                  selectedModule?.baslik,
                              },
                            }
                          );

                          return;
                        }

                        setSelectedType(
                          item.key
                        );
                      }}
                    >
                      <div
                        style={{
                          ...styles.typeIcon,
                          backgroundColor:
                            item.bg,
                        }}
                      >
                        <Icon
                          size={32}
                          color={item.color}
                        />
                      </div>

                      <h3 style={styles.typeTitle}>
                        {item.title}
                      </h3>

                      <p style={styles.typeDesc}>
                        {item.desc.toUpperCase()}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                <button
                  style={styles.typeHeader}
                  onClick={() =>
                    setSelectedType(null)
                  }
                >
                  <div
                    style={{
                      ...styles.typeHeaderIcon,
                      backgroundColor:
                        selectedTypeData.bg,
                    }}
                  >
                    <selectedTypeData.icon
                      size={25}
                      color={
                        selectedTypeData.color
                      }
                    />
                  </div>

                  <span
                    style={
                      styles.typeHeaderTitle
                    }
                  >
                    {selectedTypeData.title.toUpperCase()}
                  </span>

                  <span
                    style={styles.changeText}
                  >
                    DEĞİŞTİR
                  </span>
                </button>

                <div style={styles.formCard}>
                  <label
                    style={styles.inputLabel}
                  >
                    İÇERİK BAŞLIĞI
                  </label>

                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                    placeholder="Örn: İlk Temas Kuralları"
                    style={styles.input}
                  />

                  <label
                    style={styles.inputLabel}
                  >
                    MODÜL SEÇİN
                  </label>

                  <button
                    style={styles.input}
                    onClick={() =>
                      setModuleListOpen(
                        !moduleListOpen
                      )
                    }
                  >
                    <span
                      style={
                        styles.inputValue
                      }
                    >
                      {selectedModule?.baslik ||
                        "Modül seçin"}
                    </span>
                  </button>

                  {moduleListOpen && (
                    <div
                      style={
                        styles.moduleList
                      }
                    >
                      {modules.map(
                        (modul) => (
                          <button
                            key={
                              modul.bolum_id
                            }
                            style={{
                              ...styles.moduleItem,
                              ...(selectedModule?.bolum_id ===
                              modul.bolum_id
                                ? styles.moduleItemActive
                                : {}),
                            }}
                            onClick={() => {
                              setSelectedModule(
                                modul
                              );

                              setModuleListOpen(
                                false
                              );
                            }}
                          >
                            {modul.baslik}
                          </button>
                        )
                      )}

                      <button
                        style={
                          styles.addModuleButton
                        }
                        onClick={
                          handleCreateModule
                        }
                      >
                        + YENİ MODÜL EKLE
                      </button>
                    </div>
                  )}

                  {selectedType ===
                  "text" ? (
                    <>
                      <label
                        style={
                          styles.inputLabel
                        }
                      >
                        METİN İÇERİĞİ
                      </label>

                      <textarea
                        value={textContent}
                        onChange={(e) =>
                          setTextContent(
                            e.target.value
                          )
                        }
                        placeholder="İçeriği buraya yaz..."
                        style={{
                          ...styles.input,
                          ...styles.textArea,
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <label
                        style={
                          styles.inputLabel
                        }
                      >
                        {selectedType ===
                        "video"
                          ? "GOOGLE DRIVE VİDEO LİNKİ"
                          : "PDF LİNKİ"}
                      </label>

                      <input
  value={contentUrl}
  onChange={(e) => setContentUrl(e.target.value)}
  placeholder={
    selectedType === "video"
      ? "Google Drive video linki yapıştır..."
      : "PDF linki yapıştır..."
  }
  style={styles.input}
/>{selectedType === "video" && (
  <div
    style={{
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      borderRadius: 28,
      padding: 24,
      marginBottom: 24,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            color: DARK,
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          🧠 AI Mini Öğrenme Kontrolü
        </h3>

        <p
          style={{
            margin: "8px 0 0",
            color: MUTED,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Kullanıcı video sırasında mini quiz popup görsün
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setAiQuizEnabled(!aiQuizEnabled)
        }
        style={{
          width: 70,
          height: 38,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: aiQuizEnabled
            ? RED
            : "#CBD5E1",
          position: "relative",
          transition: "all .25s",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 4,
            left: aiQuizEnabled
              ? 35
              : 4,
            transition: "all .25s",
          }}
        />
      </button>
    </div>

    {aiQuizEnabled && (
      <>
        <label style={styles.inputLabel}>
          QUIZ POPUP NOKTALARI
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <input
            type="number"
            min="10"
            max="90"
            value={quizCheckpoint1}
            onChange={(e) =>
              setQuizCheckpoint1(
                Number(e.target.value)
              )
            }
            style={styles.input}
          />

          <input
            type="number"
            min="10"
            max="95"
            value={quizCheckpoint2}
            onChange={(e) =>
              setQuizCheckpoint2(
                Number(e.target.value)
              )
            }
            style={styles.input}
          />
        </div>

        <button
          type="button"
          onClick={() =>
            setContentBasedQuiz(
              !contentBasedQuiz
            )
          }
          style={{
            width: "100%",
            minHeight: 72,
            borderRadius: 22,
            border: "none",
            background:
              contentBasedQuiz
                ? "#EFF6FF"
                : "#F8FAFC",
            padding: 18,
            display: "flex",
            alignItems: "center",
            gap: 16,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "#fff",
              display: "grid",
              placeItems: "center",
            }}
          >
            {contentBasedQuiz && (
              <Check
                size={18}
                color={RED}
              />
            )}
          </div>

          <div>
            <p
              style={{
                margin: 0,
                color: DARK,
                fontWeight: 900,
                textAlign: "left",
              }}
            >
              İçeriğe göre AI soru üretsin
            </p>

            <p
              style={{
                margin: "5px 0 0",
                color: MUTED,
                fontSize: 12,
                textAlign: "left",
              }}
            >
              Video içeriğini analiz edip soru üretir
            </p>
          </div>
        </button>
      </>
    )}
  </div>
)}
                    </>
                  )}

                  <button
                    style={styles.requiredBox}
                    onClick={() =>
                      setRequired(
                        !required
                      )
                    }
                  >
                    <div
                      style={styles.checkbox}
                    >
                      {required && (
                        <Check
                          size={18}
                          color={RED}
                        />
                      )}
                    </div>

                    <span
                      style={
                        styles.requiredText
                      }
                    >
                      BU DERS ZORUNLUDUR
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {selectedCourse &&
        selectedType && (
          <div style={styles.footer}>
            <button
              style={styles.publishButton}
              onClick={
                handlePublishContent
              }
              disabled={savingContent}
            >
              <Check
                size={21}
                color="#fff"
              />

              {savingContent
                ? "KAYDEDİLİYOR..."
                : "İÇERİĞİ YAYINLA"}
            </button>
          </div>
        )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    padding: 28,
    paddingBottom: 130,
    fontFamily:
      "Inter, Arial, sans-serif",
  },

  container: {
    maxWidth: 1440,
    margin: "0 auto",
  },

  header: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow:
      "0 8px 24px rgba(15,23,42,0.06)",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: "none",
    backgroundColor: "#F8FAFC",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },

  title: {
    color: DARK,
    fontSize: 28,
    fontWeight: 900,
    margin: 0,
  },

  titleLine: {
    display: "flex",
    gap: 5,
    marginTop: 8,
  },

  titleLineActive: {
    width: 42,
    height: 4,
    borderRadius: 99,
    backgroundColor: RED,
  },

  titleLinePassive: {
    width: 10,
    height: 4,
    borderRadius: 99,
    backgroundColor: "#E2E8F0",
  },

  infoButton: {
    width: 50,
    height: 50,
    borderRadius: 17,
    border: "none",
    backgroundColor: "#F8FAFC",
    display: "grid",
    placeItems: "center",
  },

  pageContent: {
    marginTop: 24,
  },

  sectionTitle: {
    color: "#9AA7BD",
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: 2.5,
    marginBottom: 22,
  },

  searchBox: {
    height: 64,
    borderRadius: 22,
    backgroundColor: "#fff",
    border: "1px solid #EEF2F7",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 26,
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 15,
    fontWeight: 800,
  },

  loadingBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    textAlign: "center",
    color: MUTED,
    fontWeight: 900,
  },

  courseCard: {
    width: "100%",
    border: "none",
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 18,
    boxShadow:
      "0 8px 22px rgba(15,23,42,0.05)",
    cursor: "pointer",
  },

  courseIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#FFF1F2",
    display: "grid",
    placeItems: "center",
  },

  courseTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: 900,
    margin: 0,
  },

  courseSub: {
    color: MUTED,
    fontSize: 11,
    fontWeight: 900,
    marginTop: 6,
  },

  selectedCourseBar: {
    width: "100%",
    height: 62,
    borderRadius: 18,
    border: "none",
    backgroundColor: DARK,
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
    cursor: "pointer",
  },

  selectedCourseText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 1,
    flex: 1,
    textAlign: "left",
  },

  typeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
  },

  typeCard: {
    border: "none",
    backgroundColor: "#fff",
    borderRadius: 30,
    minHeight: 220,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    boxShadow:
      "0 8px 22px rgba(15,23,42,0.05)",
    cursor: "pointer",
  },

  typeIcon: {
    width: 68,
    height: 68,
    borderRadius: 24,
    display: "grid",
    placeItems: "center",
    marginBottom: 22,
  },

  typeTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: 900,
    margin: 0,
    textAlign: "center",
  },

  typeDesc: {
    color: MUTED,
    fontSize: 10,
    fontWeight: 900,
    marginTop: 8,
    lineHeight: "15px",
    textAlign: "center",
  },

  typeHeader: {
    width: "100%",
    height: 90,
    borderRadius: 24,
    border: "none",
    backgroundColor: "#fff",
    padding: "0 22px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 30,
    cursor: "pointer",
  },

  typeHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    display: "grid",
    placeItems: "center",
  },

  typeHeaderTitle: {
    flex: 1,
    color: DARK,
    fontSize: 16,
    fontWeight: 900,
    textAlign: "left",
  },

  changeText: {
    color: RED,
    fontSize: 11,
    fontWeight: 900,
    backgroundColor: "#FFF1F2",
    padding: "10px 16px",
    borderRadius: 14,
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 34,
    padding: 26,
  },

  inputLabel: {
    display: "block",
    color: MUTED,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  uploadBox: {
  border: "2px dashed #CBD5E1",
  borderRadius: 24,
  padding: 30,
  cursor: "pointer",
  backgroundColor: "#F8FAFC",
},

uploadInner: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
},

uploadTitle: {
  fontSize: 18,
  fontWeight: 800,
  color: DARK,
},

uploadDesc: {
  fontSize: 13,
  color: MUTED,
},

uploadSuccess: {
  marginTop: 10,
  backgroundColor: "#ECFDF5",
  color: "#059669",
  padding: "10px 16px",
  borderRadius: 18,
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 700,
},
  input: {
    width: "100%",
    minHeight: 64,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    border: "1px solid #EEF2F7",
    padding: "0 18px",
    color: DARK,
    fontSize: 15,
    fontWeight: 800,
    marginBottom: 24,
    outline: "none",
    boxSizing: "border-box",
  },

  inputValue: {
    color: DARK,
    fontSize: 15,
    fontWeight: 900,
  },

  textArea: {
    minHeight: 160,
    paddingTop: 18,
    resize: "vertical",
  },

  requiredBox: {
    width: "100%",
    minHeight: 80,
    borderRadius: 22,
    border: "none",
    backgroundColor: "#F8FAFC",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    cursor: "pointer",
  },

  checkbox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#fff",
    border: "1px solid #EEF2F7",
    display: "grid",
    placeItems: "center",
  },

  requiredText: {
    flex: 1,
    color: DARK,
    fontSize: 13,
    fontWeight: 900,
    textAlign: "left",
  },

  moduleList: {
    backgroundColor: "#fff",
    borderRadius: 20,
    border: "1px solid #EEF2F7",
    marginTop: -14,
    marginBottom: 24,
    overflow: "hidden",
  },

  moduleItem: {
    width: "100%",
    border: "none",
    padding: "15px 18px",
    borderBottom:
      "1px solid #F1F5F9",
    backgroundColor: "#fff",
    textAlign: "left",
    color: "#64748B",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
  },

  moduleItemActive: {
    backgroundColor: "#FFF1F2",
    color: RED,
  },

  addModuleButton: {
    width: "100%",
    border: "none",
    padding: "16px 18px",
    backgroundColor: "#F8FAFC",
    color: RED,
    fontSize: 12,
    fontWeight: 900,
    textAlign: "left",
    cursor: "pointer",
  },

  footer: {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  padding: "14px 28px",
  backgroundColor: "rgba(255,255,255,0.96)",
  borderTop: "1px solid #EEF2F7",
  display: "flex",
  justifyContent: "center",
  backdropFilter: "blur(14px)",
},

publishButton: {
  minWidth: 280,
  maxWidth: 380,
  width: "fit-content",
  height: 56,
  padding: "0 28px",
  borderRadius: 20,
  border: "none",
  backgroundColor: RED,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  fontSize: 13,
  fontWeight: 900,
  letterSpacing: 1.2,
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(237,0,21,0.25)",
  transition: "all .2s ease",
},
};