import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginScreen from "./pages/LoginScreen";
import AdminDashboard from "./pages/AdminDashboard";
import DeptManagerDashboard from "./pages/DeptManagerDashboard";

import KullaniciAnaSayfa from "./pages/kullanici/KullaniciAnaSayfa";
import Egitimlerim from "./pages/kullanici/Egitimlerim";
import EgitimDetay from "./pages/kullanici/EgitimDetay";
import DersDetay from "./pages/kullanici/DersDetay";
import YolHaritam from "./pages/kullanici/YolHaritam";
import LiderlikTablosu from "./pages/kullanici/LiderlikTablosu";
import Rozetlerim from "./pages/kullanici/Rozetlerim";
import Sorularim from "./pages/kullanici/Sorularim";
import SoruDetay from "./pages/kullanici/SoruDetay";
import SoruEkle from "./pages/kullanici/SoruEkle";
import Asistan from "./pages/kullanici/Asistan";
import Bildirimler from "./pages/kullanici/Bildirimler";
import Profilim from "./pages/kullanici/Profilim";
import Ayarlar from "./pages/kullanici/Ayarlar";
import KisiselBilgiler from "./pages/kullanici/KisiselBilgiler";
import SifreGuvenlik from "./pages/kullanici/SifreGuvenlik";
import Gorunum from "./pages/kullanici/Gorunum";
import KisiselAnaliz from "./pages/kullanici/KisiselAnaliz";
import SSS from "./pages/kullanici/SSS";
import TeknikDestek from "./pages/kullanici/TeknikDestek";
import YeniTalep from "./pages/kullanici/YeniTalep";
import Duyurularim from "./pages/kullanici/Duyurularim";
import Anketlerim from "./pages/kullanici/Anketlerim";
import AnketCevapla from "./pages/kullanici/AnketCevapla";
import AnketDetay from "./pages/kullanici/AnketDetay";
import QuizScreen from "./pages/kullanici/QuizScreen";
import Sertifikalarim from "./pages/kullanici/Sertifikalarim";

import EgitmenSidebar from "./components/EgitmenSidebar";
import EgitmenAnaSayfa from "./pages/egitmen/EgitmenAnaSayfa";
import EgitmenEgitimlerim from "./pages/egitmen/EgitmenEgitimlerim";
import EgitmenEgitimDetay from "./pages/egitmen/EgitmenEgitimDetay";
import EgitimOlustur from "./pages/egitmen/EgitimOlustur";
import IcerikEkle from "./pages/egitmen/IcerikEkle";
import EgitimOnizleme from "./pages/egitmen/EgitimOnizleme";
import EgitmenAsistan from "./pages/egitmen/EgitmenAsistan";
import EgitmenSorular from "./pages/egitmen/EgitmenSorular";
import EgitmenSoruDetay from "./pages/egitmen/EgitmenSoruDetay";
import AiStudyo from "./pages/egitmen/AiStudyo";
import EgitmenBildirimler from "./pages/egitmen/EgitmenBildirimler";
import EgitmenProfil from "./pages/egitmen/EgitmenProfil";
import EgitmenYetkinlikleri from "./pages/egitmen/EgitmenYetkinlikleri";
import EgitmenKisiselBilgiler from "./pages/egitmen/KisiselBilgiler";
import EgitmenSifreGuvenlik from "./pages/egitmen/SifreGuvenlik";
import MetinIcerik from "./pages/egitmen/MetinIcerik";
import PdfViewer from "./pages/egitmen/PdfGoruntule";
import QuizOlustur from "./pages/egitmen/QuizOlustur";
import VideoIcerik from "./pages/egitmen/VideoIcerik";
import Yardim from "./pages/egitmen/Yardim";
import EgitmenDuyuruMerkezi from "./pages/egitmen/EgitmenDuyuruMerkezi";
import EgitmenAnketYonetimi from "./pages/egitmen/EgitmenAnketYonetimi";
import OgrenciIlerlemesi from "./pages/egitmen/OgrenciIlerlemesi";
import EgitmenAnaliz from "./pages/egitmen/EgitmenAnaliz";


function App() {
  const [user, setUser] = useState(null);

  const getRole = () => String(user?.role || "").toUpperCase();

  const renderDashboard = () => {
    if (!user) return <Navigate to="/" />;

    const role = getRole();

    if (role === "IK_YONETICI") {
      return <AdminDashboard user={user} />;
    }

    if (role === "DEPT_YONETICI") {
      return <DeptManagerDashboard user={user} />;
    }

    if (role === "EGITMEN" || role === "EĞİTMEN") {
      return <Navigate to="/egitmen" />;
    }

    if (role === "CALISAN" || role === "KULLANICI") {
      return <Navigate to="/user/dashboard" />;
    }

    return <Navigate to="/" />;
  };

  const renderUserPage = (PageComponent) => {
    if (!user) return <Navigate to="/" />;

    const role = getRole();

    if (role === "CALISAN" || role === "KULLANICI") {
      return <PageComponent user={user} setUser={setUser} />;
    }

    return <Navigate to="/dashboard" />;
  };

  const renderInstructorPage = (PageComponent) => {
    if (!user) return <Navigate to="/" />;

    const role = getRole();

    if (role !== "EGITMEN" && role !== "EĞİTMEN") {
      return <Navigate to="/dashboard" />;
    }

    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#F4F5F7",
        }}
      >
        <EgitmenSidebar user={user} setUser={setUser} />

        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowX: "hidden",
          }}
        >
          <PageComponent user={user} setUser={setUser} />
        </main>
      </div>
    );
  };

  const renderAdminSharedPage = (PageComponent) => {
  if (!user) return <Navigate to="/" />;

  const role = getRole();

  if (role === "IK_YONETICI" || role === "DEPT_YONETICI") {
    return <PageComponent user={user} setUser={setUser} />;
  }

  return <Navigate to="/dashboard" />;
};

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <LoginScreen setUser={setUser} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route path="/dashboard" element={renderDashboard()} />

        <Route path="/user/dashboard" element={renderUserPage(KullaniciAnaSayfa)} />
        <Route path="/user/egitimler" element={renderUserPage(Egitimlerim)} />
        <Route path="/user/egitim-detay/:id" element={renderUserPage(EgitimDetay)} />
        <Route path="/user/quiz/:id" element={renderUserPage(QuizScreen)} />
        <Route path="/user/ders-detay/:id/:moduleId" element={renderUserPage(DersDetay)} />
        <Route path="/user/yol-haritam" element={renderUserPage(YolHaritam)} />
        <Route path="/user/liderlik" element={renderUserPage(LiderlikTablosu)} />
        <Route path="/user/rozetler" element={renderUserPage(Rozetlerim)} />
        <Route path="/user/sorular" element={renderUserPage(Sorularim)} />
        <Route path="/user/soru-detay" element={renderUserPage(SoruDetay)} />
        <Route path="/user/soru-ekle" element={renderUserPage(SoruEkle)} />
        <Route path="/user/asistan" element={renderUserPage(Asistan)} />
        <Route path="/user/bildirimler" element={renderUserPage(Bildirimler)} />
        <Route path="/user/profil" element={renderUserPage(Profilim)} />
        <Route path="/user/ayarlar" element={renderUserPage(Ayarlar)} />
        <Route path="/user/kisisel-bilgiler" element={renderUserPage(KisiselBilgiler)} />
        <Route path="/user/sifre-guvenlik" element={renderUserPage(SifreGuvenlik)} />
        <Route path="/user/gorunum" element={renderUserPage(Gorunum)} />
        <Route path="/user/kisisel-analiz" element={renderUserPage(KisiselAnaliz)} />
        <Route path="/user/sss" element={renderUserPage(SSS)} />
        <Route path="/user/teknik-destek" element={renderUserPage(TeknikDestek)} />
        <Route path="/user/yeni-talep" element={renderUserPage(YeniTalep)} />
        <Route path="/user/duyurular" element={renderUserPage(Duyurularim)} />
        <Route path="/user/anketler" element={renderUserPage(Anketlerim)} />
        <Route path="/user/anket-cevapla/:id" element={renderUserPage(AnketCevapla)} />
        <Route path="/user/anket-detay/:id" element={renderUserPage(AnketDetay)} />
        <Route
  path="/user/sertifikalar"
  element={
    <Sertifikalarim
      user={user}
      setUser={setUser}
    />
  }
/>

        <Route path="/egitmen" element={renderInstructorPage(EgitmenAnaSayfa)} />
        <Route path="/egitmen/egitimlerim" element={renderInstructorPage(EgitmenEgitimlerim)} />
        <Route
  path="/egitmen/egitim-detay/:id"
  element={renderInstructorPage(EgitmenEgitimDetay)}
/>
<Route
  path="/egitmen/egitim-olustur"
  element={renderInstructorPage(EgitimOlustur)}
/>
<Route
  path="/egitmen/kaynak-yonetimi"
  element={renderInstructorPage(IcerikEkle)}
/><Route
  path="/egitmen/onizleme/:id"
  element={renderInstructorPage(EgitimOnizleme)}
/><Route
  path="/egitmen/asistan"
  element={renderInstructorPage(EgitmenAsistan)}
/><Route
  path="/egitmen/sorular"
  element={renderInstructorPage(EgitmenSorular)}
/><Route
  path="/egitmen/soru-detay"
  element={renderInstructorPage(EgitmenSoruDetay)}
/><Route
  path="/egitmen/ai-studyo"
  element={renderInstructorPage(AiStudyo)}
/><Route
  path="/egitmen/bildirimler"
  element={renderInstructorPage(EgitmenBildirimler)}
/><Route
  path="/egitmen/profil"
  element={renderInstructorPage(EgitmenProfil)}
/><Route
  path="/egitmen/yetkinlikler"
  element={renderInstructorPage(EgitmenYetkinlikleri)}
/><Route
  path="/egitmen/kisisel-bilgiler"
  element={renderInstructorPage(KisiselBilgiler)}
/><Route
  path="/egitmen/sifre-guvenlik"
  element={renderInstructorPage(SifreGuvenlik)}
/><Route
  path="/icerik/pdf"
  element={renderInstructorPage(PdfViewer)}
/><Route path="/egitmen/quiz-olustur" element={renderInstructorPage(QuizOlustur)}/>

<Route
  path="/icerik/metin/:id"
  element={renderInstructorPage(MetinIcerik)}
/>

<Route
  path="/icerik/video/:id"
  element={renderInstructorPage(VideoIcerik)}
/>
<Route
  path="/egitmen/yardim"
  element={renderInstructorPage(Yardim)}
/><Route
  path="/egitmen/ogrenci-ilerlemesi"
  element={renderInstructorPage(OgrenciIlerlemesi)}
/>
<Route
  path="/admin/egitim-olustur"
  element={renderAdminSharedPage(EgitimOlustur)}
/>

<Route
  path="/admin/egitim-detay/:id"
  element={renderAdminSharedPage(EgitmenEgitimDetay)}
/>

<Route
  path="/admin/kaynak-yonetimi"
  element={renderAdminSharedPage(IcerikEkle)}
/>

<Route
  path="/admin/onizleme/:id"
  element={renderAdminSharedPage(EgitimOnizleme)}
/>
<Route
  path="/egitmen/egitim-analizi"
  element={renderInstructorPage(EgitmenAnaliz)}
/><Route
  path="/egitmen/duyurular"
  element={renderInstructorPage(EgitmenDuyuruMerkezi)}
/><Route
  path="/egitmen/anket-yonetimi"
  element={renderInstructorPage(EgitmenAnketYonetimi)}
/><Route
  path="/egitmen/quiz-olustur"
  element={<QuizOlustur user={user} setUser={setUser} />}
/>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;