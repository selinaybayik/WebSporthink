import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getVideoContent } from "../../services/api";

export default function VideoIcerik() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [icerik, setIcerik] = useState(null);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getVideoContent(id);
      setIcerik(data);
    } catch (err) {
      console.log("Video detay hatası:", err.message);
      setIcerik(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.center}>Video yükleniyor...</div>;

  if (!icerik) return <div style={styles.center}>Video bulunamadı.</div>;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={26} color="#081229" />
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>{icerik.baslik}</h1>
          <p style={styles.subtitle}>{icerik.sure_bilgisi || "Video içerik"}</p>
        </div>
      </header>

      <main style={styles.content}>
        <div style={styles.playerBox}>
          <iframe
            src={icerik.url}
            title={icerik.baslik}
            style={styles.iframe}
            allowFullScreen
          />
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F8F9FA",
    fontFamily: "Inter, Arial, sans-serif",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 14,
    borderBottom: "1px solid #EEF2F7",
  },
  backButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  title: {
    color: "#081229",
    fontSize: 18,
    fontWeight: 900,
    margin: 0,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: 800,
    marginTop: 3,
    marginBottom: 0,
  },
  content: {
    padding: 20,
  },
  playerBox: {
    width: "100%",
    maxWidth: 980,
    height: 520,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
    margin: "0 auto",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    backgroundColor: "#000",
  },
  center: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#F8F9FA",
    color: "#94A3B8",
    fontWeight: 900,
  },
};