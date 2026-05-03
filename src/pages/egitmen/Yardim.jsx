import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  PlusCircle,
  Video,
  CircleHelp,
  Award,
  MessageSquare,
  ExternalLink,
  Globe2,
} from "lucide-react";

const RED = "#E30613";
const DARK = "#081229";
const BG = "#F6F7F9";

const SPORT_LINK = "https://www.sporthink.com.tr";

const guideItems = [
  {
    id: 1,
    title: "Nasıl Yeni Eğitim Oluştururum?",
    icon: PlusCircle,
    color: "#EF4444",
    desc:
      "Eğitmen panelindeki + İçerik sekmesine girerek eğitim başlığı, kategori, açıklama ve içerik dosyalarını ekleyebilirsin.",
  },
  {
    id: 2,
    title: "Video ve PDF İçerik Yükleme",
    icon: Video,
    color: "#3B82F6",
    desc:
      "Video, PDF ve metin kaynaklarını içerik oluşturma ekranından ekleyebilirsin. Yüklenen kaynaklar eğitim detayında öğrencilere gösterilir.",
  },
  {
    id: 3,
    title: "Quiz ve Sınav Hazırlama",
    icon: CircleHelp,
    color: "#F59E0B",
    desc:
      "Sorular sekmesinden çoktan seçmeli sorular oluşturabilir, doğru cevabı belirleyebilir ve ilgili eğitime bağlayabilirsin.",
  },
  {
    id: 4,
    title: "Sertifika Ayarları",
    icon: Award,
    color: "#10B981",
    desc:
      "Profil sayfasındaki Sertifika Taslakları alanından eğitim sonunda verilecek sertifika görünümünü düzenleyebilirsin.",
  },
  {
    id: 5,
    title: "Öğrenci Sorularını Yanıtlama",
    icon: MessageSquare,
    color: "#8B5CF6",
    desc:
      "Öğrencilerden gelen sorular bildirim olarak düşer. Soru detayına girerek yanıt verebilirsin.",
  },
];

export default function Yardim() {
  const navigate = useNavigate();

  const [openId, setOpenId] = useState(1);

  const openSporthink = () => {
    window.open(SPORT_LINK, "_blank");
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          <ArrowLeft size={26} color="#94A3B8" />
        </button>

        <h1 style={styles.headerTitle}>YARDIM MERKEZİ</h1>
      </header>

      <main style={styles.scroll}>
        <h2 style={styles.sectionTitle}>
          TEMEL REHBER VE SORULAR
        </h2>

        <section style={styles.guideList}>
          {guideItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openId === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setOpenId(isOpen ? null : item.id)
                }
                style={styles.guideCard}
              >
                <div style={styles.guideTop}>
                  <div style={styles.iconBox}>
                    <Icon size={24} color={item.color} />
                  </div>

                  <h3 style={styles.guideTitle}>
                    {item.title}
                  </h3>

                  <ChevronDown
                    size={22}
                    color="#CBD5E1"
                    style={{
                      transform: isOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "0.2s",
                    }}
                  />
                </div>

                {isOpen && (
                  <p style={styles.guideDesc}>
                    {item.desc}
                  </p>
                )}
              </button>
            );
          })}
        </section>

        <section style={styles.sporthinkCard}>
          <div style={styles.sporthinkIcon}>
            <Globe2 size={30} color="#fff" />
          </div>

          <h2 style={styles.sporthinkTitle}>
            Sporthink’i Ziyaret Et
          </h2>

          <p style={styles.sporthinkText}>
            Kurumsal bilgiler, eğitim çözümleri ve
            Sporthink hakkında daha fazla detay için web
            sayfasına gidebilirsin.
          </p>

          <button
            style={styles.sporthinkButton}
            onClick={openSporthink}
          >
            <ExternalLink size={20} color="#fff" />

            <span style={styles.sporthinkButtonText}>
              SPORTHINK SAYFASINA GİT
            </span>
          </button>
        </section>

        <div style={{ height: 80 }} />
      </main>
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
    height: 86,
    backgroundColor: "#fff",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    alignItems: "center",
    padding: "0 28px",
  },

  backButton: {
    marginRight: 20,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },

  headerTitle: {
    color: DARK,
    fontSize: 22,
    fontWeight: 900,
    margin: 0,
  },

  scroll: {
    padding: "36px 18px 40px",
    maxWidth: 1100,
    margin: "0 auto",
  },

  sectionTitle: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 1.5,
    marginLeft: 20,
    marginBottom: 22,
  },

  guideList: {
    display: "grid",
    gap: 16,
  },

  guideCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 22,
    border: "1px solid #EDF0F4",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
    cursor: "pointer",
    textAlign: "left",
  },

  guideTop: {
    display: "flex",
    alignItems: "center",
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    display: "grid",
    placeItems: "center",
    marginRight: 18,
    flexShrink: 0,
  },

  guideTitle: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontWeight: 900,
    margin: 0,
  },

  guideDesc: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: 600,
    lineHeight: "21px",
    marginTop: 18,
    marginLeft: 70,
    marginBottom: 0,
  },

  sporthinkCard: {
    backgroundColor: DARK,
    borderRadius: 36,
    padding: "32px 28px 28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 34,
    overflow: "hidden",
  },

  sporthinkIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: RED,
    display: "grid",
    placeItems: "center",
    marginBottom: 18,
  },

  sporthinkTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 900,
    textAlign: "center",
    margin: 0,
  },

  sporthinkText: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: "18px",
    marginTop: 10,
    marginBottom: 24,
    textAlign: "center",
    maxWidth: 560,
  },

  sporthinkButton: {
    height: 56,
    width: "100%",
    maxWidth: 420,
    borderRadius: 24,
    backgroundColor: RED,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    border: "none",
    cursor: "pointer",
  },

  sporthinkButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.1,
  },
};