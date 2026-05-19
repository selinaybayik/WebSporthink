import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  X,
  Bell,
  ChevronRight,
  Video,
  FileText,
  BookOpen,
  Users,
  Trophy,
  Clock3,
  Target,
  Send,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Download,
FileDown,
} from "lucide-react";
import {
  getInstructorTrainings,
  getInstructorTrainingParticipants,
  getInstructorParticipantDetail,
  sendParticipantReminder,
  restartTrainingForUser,
} from "../../services/api";

const RED = "#ED0015";
const DARK = "#081229";
const MUTED = "#64748B";
const BG = "#F4F5F7";

export default function OgrenciIlerlemesi({ user }) {
  const location = useLocation();

  const egitmenId = user?.id || user?.kullanici_id || 1;

  const initialEgitimId =
    location.state?.egitimId ||
    location.state?.course?.id ||
    location.state?.course?.egitim_id ||
    "";

  const [trainings, setTrainings] = useState([]);
  const [selectedEgitimId, setSelectedEgitimId] = useState(initialEgitimId);
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTrainings = async () => {
      try {
        const data = await getInstructorTrainings(egitmenId);
        const list = Array.isArray(data) ? data : [];

        setTrainings(list);

        if (!selectedEgitimId && list.length > 0) {
          setSelectedEgitimId(list[0].id || list[0].egitim_id);
        }
      } catch (error) {
        console.error("Eğitimler alınamadı:", error);
      }
    };

    loadTrainings();
  }, [egitmenId]);

  useEffect(() => {
    const loadParticipants = async () => {
      if (!selectedEgitimId) return;

      try {
        setLoading(true);
        const data = await getInstructorTrainingParticipants(selectedEgitimId);
        setParticipants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Öğrenci ilerlemesi alınamadı:", error);
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, [selectedEgitimId]);

  const selectedTraining = trainings.find(
    (item) => String(item.id || item.egitim_id) === String(selectedEgitimId)
  );

  const filteredParticipants = useMemo(() => {
    const key = search.trim().toLowerCase();

    return participants.filter((p) => {
      return (
        key.length === 0 ||
        String(p.name || "").toLowerCase().includes(key) ||
        String(p.role || "").toLowerCase().includes(key) ||
        String(p.status || "").toLowerCase().includes(key)
      );
    });
  }, [search, participants]);

  const averageProgress =
    participants.length > 0
      ? Math.round(
          participants.reduce((acc, p) => acc + Number(p.progress || 0), 0) /
            participants.length
        )
      : 0;

  const completedCount = participants.filter(
    (p) => Number(p.progress || 0) >= 100
  ).length;

  const riskCount = participants.filter(
    (p) => Number(p.progress || 0) < 50
  ).length;
  const downloadCSV = (filename, rows) => {
  if (!rows || rows.length === 0) {
    window.alert("Dışa aktarılacak veri yok.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.join(";"),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? "";
          return `"${String(value).replaceAll('"', '""')}"`;
        })
        .join(";")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const exportGeneralCSV = () => {
  const rows = filteredParticipants.map((p) => ({
    "Öğrenci": p.name || "-",
    "Rol / Durum": p.role || p.status || "-",
    "İlerleme (%)": p.progress || 0,
    "Durum": Number(p.progress || 0) >= 100 ? "Tamamlandı" : "Devam Ediyor",
  }));

  downloadCSV("ogrenci-ilerlemesi-genel.csv", rows);
};

const exportStudentCSV = (person) => {
  const rows = [
    {
      "Öğrenci": person.name || "-",
      "İlerleme (%)": person.progress || 0,
      "Quiz Skoru": person.quiz || "-",
      "Son Aktif": person.last
        ? new Date(person.last).toLocaleDateString("tr-TR")
        : "-",
    },
    ...(person.history || []).map((item) => ({
      "Öğrenci": person.name || "-",
      "İçerik": item.title || "-",
      "Tip": item.type || "-",
      "Tamamlandı mı": item.completed ? "Evet" : "Hayır",
      "Tarih": item.date
        ? new Date(item.date).toLocaleDateString("tr-TR")
        : "-",
    })),
  ];

  downloadCSV(`${person.name || "ogrenci"}-istatistik.csv`, rows);
};

const exportGeneralPDF = () => {
  window.print();
};

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.pageMini}>EĞİTMEN PANELİ</p>
          <h1 style={styles.title}>Öğrenci İlerlemesi</h1>
          <p style={styles.desc}>
            Seçili eğitime bağlı öğrencilerin ilerleme, quiz ve içerik takip durumlarını buradan izleyebilirsin.
          </p>
        </div>

        <select
          value={selectedEgitimId}
          onChange={(e) => {
            setSelectedEgitimId(e.target.value);
            setParticipants([]);
            setSelectedParticipant(null);
          }}
          style={styles.select}
        >
          {trainings.length === 0 ? (
            <option value="">Eğitim bulunamadı</option>
          ) : (
            trainings.map((item) => (
              <option key={item.id || item.egitim_id} value={item.id || item.egitim_id}>
                {item.title || item.baslik || "İsimsiz Eğitim"}
              </option>
            ))
          )}
        </select>
      </section>

      {selectedTraining && (
        <section style={styles.courseBanner}>
          <div style={styles.courseLeft}>
            <div style={styles.courseIcon}>
              <GraduationCap size={28} color="#fff" />
            </div>

            <div>
              <p style={styles.courseLabel}>SEÇİLİ EĞİTİM</p>
              <h2 style={styles.courseTitle}>
                {selectedTraining.title || selectedTraining.baslik}
              </h2>
              <p style={styles.courseMeta}>
                {selectedTraining.category || selectedTraining.kategori || "Genel"} ·{" "}
                {selectedTraining.aktif_mi ? "Yayında" : "Taslak"}
              </p>
            </div>
          </div>

          <div style={styles.courseStatus}>
            <span>{participants.length}</span>
            <small>Katılımcı</small>
          </div>
        </section>
      )}

      <section style={styles.statsGrid}>
        <StatCard icon={Users} label="Katılımcı" value={participants.length} color="red" />
        <StatCard icon={BarChart3} label="Ortalama İlerleme" value={`%${averageProgress}`} color="blue" />
        <StatCard icon={CheckCircle2} label="Tamamlayan" value={completedCount} color="green" />
        <StatCard icon={AlertCircle} label="Riskli Öğrenci" value={riskCount} color="orange" />
      </section>

      <section style={styles.contentCard}>
        <div style={styles.contentHeader}>
          <div>
            <p style={styles.sectionMini}>ÖĞRENCİ TAKİP LİSTESİ</p>
            <h2 style={styles.sectionTitle}>Katılımcılar</h2>
          </div>
          <div style={styles.exportButtons}>
  <button style={styles.exportBtn} onClick={exportGeneralCSV}>
    <Download size={17} />
    CSV
  </button>

  <button style={styles.exportBtn} onClick={exportGeneralPDF}>
    <FileDown size={17} />
    PDF
  </button>
</div>
          <div style={styles.searchBox}>
            <Search size={20} color="#CBD5E1" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Öğrencilerde ara..."
              style={styles.searchInput}
            />
          </div>
        </div>

        {loading ? (
          <div style={styles.emptyCard}>Öğrenci ilerlemesi yükleniyor...</div>
        ) : filteredParticipants.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Users size={38} color="#CBD5E1" />
            </div>
            <h3>Öğrenci ilerleme verisi yok</h3>
            <p>Bu eğitime bağlı öğrenci ilerleme verisi geldiğinde burada görünecek.</p>
          </div>
        ) : (
          <div style={styles.participantList}>
            {filteredParticipants.map((p) => (
              <button
                key={p.id}
                style={styles.personRow}
                onClick={async () => {
                  try {
                    const detail = await getInstructorParticipantDetail(
                      selectedEgitimId,
                      p.id
                    );
                    setSelectedParticipant(detail);
                  } catch (error) {
                    window.alert(error.message || "Katılımcı detayı alınamadı.");
                  }
                }}
              >
                <div style={styles.avatar}>
                  {String(p.name || "K")
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div style={styles.personInfo}>
                  <h3 style={styles.personName}>{p.name || "İsimsiz Öğrenci"}</h3>
                  <p style={styles.personRole}>
                    {String(p.role || p.status || "-").toUpperCase()}
                  </p>
                </div>

                <div style={styles.progressBox}>
                  <div style={styles.progressTop}>
                    <strong>%{p.progress || 0}</strong>
                    <span>{Number(p.progress || 0) >= 100 ? "Tamamlandı" : "Devam ediyor"}</span>
                  </div>

                  <div style={styles.personBar}>
                    <div
                      style={{
                        ...styles.personFill,
                        width: `${p.progress || 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={styles.detailButton}>
                  Detay
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedParticipant && (
        <ParticipantModal
  person={selectedParticipant}
  egitimId={selectedEgitimId}
  user={user}
  exportStudentCSV={exportStudentCSV}
  onClose={() => setSelectedParticipant(null)}
  onReminder={() => setReminderOpen(true)}
/>
      )}

      {reminderOpen && (
        <ReminderModal
          onClose={() => setReminderOpen(false)}
          person={selectedParticipant}
          egitimId={selectedEgitimId}
          user={user}
        />
      )}
    </div>
  );
}

function ParticipantModal({
  person,
  onClose,
  onReminder,
  egitimId,
  user,
  exportStudentCSV,
}) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBox}>
        <div style={styles.modalHeader}>
          <button style={styles.iconButton} onClick={onClose}>
            <X size={22} />
          </button>

          <div>
            <h2 style={styles.modalName}>{String(person.name || "").toUpperCase()}</h2>
            <p style={styles.modalSub}>KİŞİSEL BAŞARI LOGLARI</p>
          </div>
        </div>

        <div style={styles.personalStats}>
          <div style={{ marginTop: 20 }}>
  <button
    style={{
      width: "100%",
      background: "#DC2626",
      color: "#fff",
      border: "none",
      padding: "14px",
      borderRadius: 14,
      fontWeight: 700,
      cursor: "pointer",
      fontSize: 15,
    }}
    onClick={async () => {
      const ok = window.confirm(
        "Bu kullanıcı eğitimi baştan almak zorunda kalacak. Devam edilsin mi?"
      );

      if (!ok) return;

      try {
        await restartTrainingForUser({
          userId: person.id,
          egitimId,
          baslatanId: user?.id,
          neden: "Eğitmen tarafından eğitim yeniden başlatıldı.",
        });

        window.alert("Eğitim başarıyla yeniden başlatıldı.");

        onClose();
      } catch (err) {
        window.alert(
          err.message || "Eğitim yeniden başlatılamadı."
        );
      }
    }}
  >
    Eğitimi Baştan Aldır
  </button>
</div>
          <PersonalStat value={`%${person.progress || 0}`} label="İLERLEME" />
          <PersonalStat value={person.quiz > 0 ? person.quiz : "-"} label="QUIZ SKORU" />
          <PersonalStat
            value={person.last ? new Date(person.last).toLocaleDateString("tr-TR") : "-"}
            label="SON AKTİF"
          />
        </div>
        <div style={styles.modalExportRow}>
  <button
    style={styles.modalExportBtn}
    onClick={() => exportStudentCSV(person)}
  >
    <Download size={16} />
    Öğrenci CSV
  </button>

  <button
    style={styles.modalExportBtn}
    onClick={() => window.print()}
  >
    <FileDown size={16} />
    Öğrenci PDF
  </button>
</div>
        <h3 style={styles.modalSectionTitle}>İçerik Etkileşim Geçmişi</h3>

        {(person.history || []).length === 0 ? (
          <div style={styles.emptyCard}>Geçmiş bulunamadı.</div>
        ) : (
          person.history.map((item) => {
            const IconComponent =
              item.tip_id === 1 ? Video : item.tip_id === 2 ? FileText : BookOpen;

            return (
              <div key={item.id} style={styles.historyRow}>
                <div style={styles.historyIcon}>
                  <IconComponent size={22} color="#2563EB" />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={styles.historyTitle}>{item.title}</h3>
                  <p style={styles.historyDesc}>
                    {item.completed ? "TAMAMLADI" : "TAMAMLANMADI"}
                  </p>
                </div>

                <span style={styles.historyDate}>
                  {item.date ? new Date(item.date).toLocaleDateString("tr-TR") : "-"}
                </span>
              </div>
            );
          })
        )}

        <div style={styles.interventionCard}>
          <div>
            <h3 style={styles.interventionTitle}>BU ÖĞRENCİYE ÖZEL MÜDAHALE</h3>
            <p style={styles.interventionText}>
              Öğrenciye eğitimi tamamlaması için hatırlatma gönderebilirsin.
            </p>
          </div>

          <button style={styles.whiteBtn} onClick={onReminder}>
            <Send size={17} />
            HATIRLATMA GÖNDER
          </button>
        </div>
      </div>
    </div>
  );
}

function ReminderModal({ onClose, person, egitimId, user }) {
  const templates = [
    "Eğitimi tamamlaman bekleniyor.",
    "Sana yeni bir görev atandı.",
    "Quiz için son gün!",
  ];

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.messageSheet}>
        <div style={styles.messageHead}>
          <Bell size={25} color={RED} />
          <h2 style={styles.messageTitle}>Hatırlatma Gönder</h2>

          <button style={styles.iconButton} onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {templates.map((item) => (
  <button
    key={item}
    style={styles.templateRow}
    onClick={async () => {
      try {
        let baslik = "";
        let mesaj = "";
        let tip = "";

        if (item === "Eğitimi tamamlaman bekleniyor.") {
          baslik = "Eğitim Hatırlatması";
          mesaj = "Eğitimi tamamlaman bekleniyor.";
          tip = "duyuru";
        }

        if (item === "Sana yeni bir görev atandı.") {
          baslik = "Yeni Görev";
          mesaj = "Sana yeni bir görev atandı.";
          tip = "duyuru";
        }

        if (item === "Quiz için son gün!") {
          baslik = "Quiz Hatırlatması";
          mesaj = "Quiz için son gün!";
          tip = "duyuru";
        }

        await sendParticipantReminder({
          userId: person?.id,
          egitimId,
          gonderenId: user?.id || user?.kullanici_id || 1,
          baslik,
          mesaj,
          tip,
        });

        window.alert("Hatırlatma gönderildi.");
        onClose();
      } catch (error) {
        window.alert(error.message || "Hatırlatma gönderilemedi.");
      }
    }}
  >
    {item}
    <ChevronRight size={20} color="#CBD5E1" />
  </button>
))}
      </div>
    </div>
  );
}

function PersonalStat({ value, label }) {
  return (
    <div style={styles.personalStat}>
      <strong style={styles.personalValue}>{value}</strong>
      <span style={styles.personalLabel}>{label}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    red: {
      bg: "#FEF2F2",
      text: RED,
    },
    blue: {
      bg: "#EFF6FF",
      text: "#2563EB",
    },
    green: {
      bg: "#ECFDF5",
      text: "#059669",
    },
    orange: {
      bg: "#FFF7ED",
      text: "#EA580C",
    },
  };

  return (
    <div style={styles.statCard}>
      <div
        style={{
          ...styles.statIcon,
          backgroundColor: colors[color].bg,
          color: colors[color].text,
        }}
      >
        <Icon size={26} />
      </div>

      <div>
        <p style={styles.statLabel}>{label}</p>
        <h3 style={styles.statValue}>{value}</h3>
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

  hero: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 30,
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    marginBottom: 22,
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
    margin: "8px 0 0",
    letterSpacing: "-1px",
  },
  desc: {
    color: MUTED,
    fontWeight: 700,
    margin: "12px 0 0",
    lineHeight: "25px",
    maxWidth: 760,
  },
  select: {
    minWidth: 360,
    height: 56,
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    color: DARK,
    fontWeight: 850,
    padding: "0 16px",
    outline: "none",
  },

  courseBanner: {
    backgroundColor: DARK,
    color: "#fff",
    borderRadius: 30,
    padding: 24,
    marginBottom: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    boxShadow: "0 14px 32px rgba(8,18,41,0.16)",
  },
  courseLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  courseIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
  },
  courseLabel: {
    margin: 0,
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 2,
  },
  courseTitle: {
    margin: "6px 0 0",
    color: "#fff",
    fontSize: 24,
    fontWeight: 950,
  },
  courseMeta: {
    margin: "6px 0 0",
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 800,
  },
  courseStatus: {
    minWidth: 110,
    height: 74,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  courseStatus: {
    minWidth: 120,
    height: 76,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  courseStatus: {
    minWidth: 120,
    height: 76,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  courseStatus: {
    minWidth: 120,
    height: 76,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  "courseStatus span": {},
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 18,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 22,
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 8px 22px rgba(15,23,42,0.055)",
    border: "1px solid #EEF2F7",
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  statLabel: {
    margin: 0,
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  statValue: {
    margin: "5px 0 0",
    color: DARK,
    fontSize: 30,
    fontWeight: 950,
  },

  contentCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 26,
    boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
  },
  contentHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 22,
  },
  sectionMini: {
    margin: 0,
    color: "#A8B3C7",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 2,
  },
  sectionTitle: {
    margin: "6px 0 0",
    color: DARK,
    fontSize: 26,
    fontWeight: 950,
  },
  searchBox: {
    width: 420,
    height: 54,
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
    color: DARK,
    background: "transparent",
    fontSize: 14,
    fontWeight: 800,
  },

  participantList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  personRow: {
    width: "100%",
    border: "1px solid #EEF2F7",
    backgroundColor: "#F8FAFC",
    padding: 18,
    display: "grid",
    gridTemplateColumns: "62px minmax(0,1fr) 260px 90px",
    alignItems: "center",
    gap: 18,
    borderRadius: 24,
    cursor: "pointer",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#fff",
    display: "grid",
    placeItems: "center",
    color: RED,
    fontSize: 16,
    fontWeight: 950,
    border: "1px solid #FEE2E2",
  },
  personInfo: {
    minWidth: 0,
    textAlign: "left",
  },
  personName: {
    color: DARK,
    fontSize: 17,
    fontWeight: 950,
    margin: 0,
  },
  personRole: {
    color: MUTED,
    fontSize: 10,
    fontWeight: 900,
    marginTop: 6,
    letterSpacing: 1.2,
  },
  progressBox: {
    minWidth: 0,
  },
  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 9,
    color: DARK,
    fontSize: 13,
    fontWeight: 900,
  },
  personBar: {
    width: "100%",
    height: 8,
    borderRadius: 99,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  personFill: {
    height: 8,
    borderRadius: 99,
    backgroundColor: RED,
  },
  detailButton: {
    height: 42,
    borderRadius: 15,
    backgroundColor: "#fff",
    color: DARK,
    fontWeight: 900,
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 999,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  modalBox: {
    width: "min(920px, 100%)",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: BG,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    padding: 28,
  },
  modalHeader: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginBottom: 28,
  },
  iconButton: {
    border: "none",
    backgroundColor: "#F1F5F9",
    width: 42,
    height: 42,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  modalName: {
    color: DARK,
    fontSize: 22,
    fontWeight: 900,
    margin: 0,
  },
  modalSub: {
    color: MUTED,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.4,
    marginTop: 3,
  },
  personalStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 28,
  },
  personalStat: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: "18px 10px",
    textAlign: "center",
  },
  personalValue: {
    color: DARK,
    fontSize: 18,
    fontWeight: 900,
    display: "block",
  },
  personalLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: 900,
    marginTop: 6,
    display: "block",
  },
  modalSectionTitle: {
    color: MUTED,
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: 2,
    textTransform: "uppercase",
    margin: "0 0 16px",
  },
  historyRow: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 14,
  },
  historyIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    display: "grid",
    placeItems: "center",
  },
  historyTitle: {
    color: DARK,
    fontSize: 15,
    fontWeight: 900,
    margin: 0,
  },
  historyDesc: {
    color: "#8A97AD",
    fontSize: 12,
    fontWeight: 900,
    marginTop: 5,
  },
  historyDate: {
    color: "#CBD5E1",
    fontSize: 10,
    fontWeight: 900,
  },
  interventionCard: {
    backgroundColor: DARK,
    borderRadius: 28,
    padding: 24,
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  interventionTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: 2,
    margin: 0,
  },
  interventionText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 700,
    margin: "8px 0 0",
  },
  whiteBtn: {
    height: 54,
    borderRadius: 16,
    border: "none",
    backgroundColor: "#fff",
    color: DARK,
    padding: "0 18px",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  },
  messageSheet: {
    width: "min(720px, 100%)",
    backgroundColor: "#fff",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    padding: 28,
  },
  messageHead: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 30,
  },
  messageTitle: {
    color: DARK,
    fontSize: 22,
    fontWeight: 900,
    margin: 0,
    flex: 1,
  },
  templateRow: {
    width: "100%",
    height: 62,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    border: "1px solid #EEF2F7",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    color: "#334155",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    color: MUTED,
    fontWeight: 800,
  },
  emptyState: {
    backgroundColor: "#F8FAFC",
    borderRadius: 28,
    padding: 46,
    textAlign: "center",
    border: "1px dashed #CBD5E1",
  },
  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: "#fff",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 18px",
  },
  exportButtons: {
  display: "flex",
  gap: 10,
},

exportBtn: {
  height: 48,
  borderRadius: 16,
  border: "none",
  backgroundColor: DARK,
  color: "#fff",
  padding: "0 16px",
  fontSize: 12,
  fontWeight: 900,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
},

modalExportRow: {
  display: "flex",
  gap: 10,
  marginBottom: 18,
},

modalExportBtn: {
  height: 44,
  borderRadius: 14,
  border: "none",
  backgroundColor: "#fff",
  color: DARK,
  padding: "0 14px",
  fontSize: 12,
  fontWeight: 900,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
},
};