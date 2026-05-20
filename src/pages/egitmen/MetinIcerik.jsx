import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getTextContent } from "../../services/api";


export default function MetinIcerik() {
  const navigate = useNavigate();
  const { id } = useParams();

 
  const [loading, setLoading] = useState(true);
  const [icerik, setIcerik] = useState(null);

  useEffect(() => {
    fetchIcerik();
  }, [id]);

  const fetchIcerik = async () => {
  if (!id) {
    setLoading(false);
    return;
  }

  try {
    setLoading(true);

    const data = await getTextContent(id);

    setIcerik(data);
  } catch (err) {
    console.log("Metin içerik hatası:", err.message);
    setIcerik(null);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loader} />
      </div>
    );
  }

  if (!icerik) {
    return (
      <div style={styles.center}>
        <p>İçerik bulunamadı</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={26} color="#0F172A" />
        </button>

        <h1 style={styles.title}>{icerik.baslik}</h1>
      </header>

      <main style={styles.content}>
        {icerik.sure_bilgisi ? (
          <p style={styles.meta}>{icerik.sure_bilgisi}</p>
        ) : null}

        <div style={styles.textBox}>
          <p style={styles.text}>{icerik.metin_icerik}</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    fontFamily: "Inter, Arial, sans-serif",
  },

  header: {
    height: 84,
    backgroundColor: "#fff",
    borderBottom: "1px solid #EEF2F7",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    gap: 16,
  },

  backButton: {
    width: 42,
    height: 42,
    border: "none",
    background: "transparent",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    flexShrink: 0,
  },

  title: {
    flex: 1,
    color: "#0F172A",
    fontSize: 20,
    fontWeight: 900,
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  content: {
    maxWidth: 980,
    margin: "0 auto",
    padding: "32px 24px 80px",
  },

  meta: {
    color: "#64748B",
    marginBottom: 16,
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 0.3,
  },

  textBox: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 30,
    border: "1px solid #EEF2F7",
    boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
  },

  text: {
    fontSize: 16,
    lineHeight: "30px",
    color: "#0F172A",
    fontWeight: 500,
    whiteSpace: "pre-wrap",
    margin: 0,
  },

  center: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#fff",
  },

  loader: {
    width: 48,
    height: 48,
    border: "4px solid #F1F5F9",
    borderTop: "4px solid #E30613",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};