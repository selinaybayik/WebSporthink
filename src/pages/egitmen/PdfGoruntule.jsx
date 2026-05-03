import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RED = "#E30613";
const DARK = "#081229";
const MUTED = "#94A3B8";

const API_URL = "http://localhost:4000";

export default function PdfViewer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const url = searchParams.get("url")
    ? decodeURIComponent(searchParams.get("url"))
    : "";

  const title = searchParams.get("title")
    ? decodeURIComponent(searchParams.get("title"))
    : "PDF İçerik";

  const icerikId = searchParams.get("icerikId")
    ? Number(searchParams.get("icerikId"))
    : null;

  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    url
  )}`;

  useEffect(() => {
    const logIcerik = async () => {
      if (!icerikId) return;

      try {
        await fetch(`${API_URL}/api/icerik/log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kullaniciId: 1,
            icerikId,
          }),
        });
      } catch (e) {
        console.log("PDF log hatası:", e);
      }
    };

    logIcerik();
  }, [icerikId]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={24} color={DARK} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>PDF DOKÜMAN</p>
        </div>
      </header>

      {url ? (
        <main style={styles.viewerWrap}>
          {loading && (
            <div style={styles.loading}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>PDF yükleniyor...</p>
            </div>
          )}

          <iframe
            src={viewerUrl}
            title={title}
            style={styles.iframe}
            onLoad={() => setLoading(false)}
          />
        </main>
      ) : (
        <div style={styles.empty}>
          <p style={styles.emptyText}>PDF bağlantısı bulunamadı.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    fontFamily: "Inter, Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    height: 72,
    padding: "0 18px",
    borderBottom: "1px solid #F1F5F9",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    border: "none",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },

  title: {
    color: DARK,
    fontSize: 16,
    fontWeight: 900,
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  subtitle: {
    color: MUTED,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 1.2,
    margin: "3px 0 0",
  },

  viewerWrap: {
    flex: 1,
    position: "relative",
    minHeight: "calc(100vh - 72px)",
  },

  iframe: {
    width: "100%",
    height: "calc(100vh - 72px)",
    border: "none",
  },

  loading: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    display: "grid",
    placeItems: "center",
    backgroundColor: "#fff",
  },

  spinner: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "4px solid #F1F5F9",
    borderTop: `4px solid ${RED}`,
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: 10,
    color: MUTED,
    fontSize: 12,
    fontWeight: 800,
  },

  empty: {
    flex: 1,
    minHeight: "calc(100vh - 72px)",
    display: "grid",
    placeItems: "center",
  },

  emptyText: {
    color: MUTED,
    fontWeight: 800,
  },
};