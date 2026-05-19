import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Trophy, 
  LogOut, Search, TrendingUp, Award,
  ChevronRight, Plus, X, Medal, Star, BarChart2, Video, Download, 
  ArrowLeft, Flame, Shield, Activity, Megaphone, Send, Layers, CheckSquare, Edit3, Save, HelpCircle, Bot,ClipboardList,MessageCircle,Target,Sun,
Moon,
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  getDashboardStats, getUsersList, getUserTrainingStatus,
  assignTrainingToUser, removeTrainingFromUser, getLeaderboard,
  getCertificates, getPerformanceDetails, getAllTrainings,
  sendAdminAnnouncement, assignTrainingToDepartment, assignTrainingToMultipleUsers,
  getQuizQuestions, getTrainingAnalytics, updateTrainingDescription, addTraining, addQuizQuestion,
  getAIPersonnelAnalysis,
  getAdminProfile,
  updateAdminProfile,
  getSurveys,
  addSurvey,
  assignSurvey,
  getSurveyAssignments,
  updateAdminPassword,
  restartTrainingForUser,
  assignDepartmentSurvey,
  assignDepartment360Survey,
getDepartmentFeedbacks,getDepartmentAnnouncements,
get360Analysis,
addDepartmentSurvey,
getDepartmentSurveyAssignments,
getDepartmentSurveyAnalysis,
} from '../services/api';
import { useNavigate } from 'react-router-dom';

const DeptManagerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

useEffect(() => {
  document.documentElement.classList.toggle("dark", darkMode);
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [selectedPersonnel, setSelectedPersonnel] = useState(null); 
  const [personnelSearch, setPersonnelSearch] = useState('');
  const [departmentSurveyAssignments, setDepartmentSurveyAssignments] = useState([]);
  
  // Çoklu Atama ve Toplu Atama State'leri
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isMultiAssignModalOpen, setIsMultiAssignModalOpen] = useState(false);
  const [selectedMultiTraining, setSelectedMultiTraining] = useState('');
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [selectedBulkTraining, setSelectedBulkTraining] = useState('');
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
const [recommendedTrainingId, setRecommendedTrainingId] = useState("");
const [surveyView, setSurveyView] = useState("surveys");
const [feedbacks, setFeedbacks] = useState([]);
const [selectedSurveyAnalysis, setSelectedSurveyAnalysis] = useState(null);
const [selectedPerson360, setSelectedPerson360] = useState(null);
const [analysis360, setAnalysis360] = useState(null);
const [analysis360Loading, setAnalysis360Loading] = useState(false);
const [surveyAnswerAnalysis, setSurveyAnswerAnalysis] = useState(null);
const [surveyAnswerLoading, setSurveyAnswerLoading] = useState(false);
const [previousAnnouncements, setPreviousAnnouncements] = useState([]);

  // Akademi State'leri
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDescText, setEditDescText] = useState('');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [trainingQuestions, setTrainingQuestions] = useState([]); 
  const [trainingAnalytics, setTrainingAnalytics] = useState(null);
  const [surveys, setSurveys] = useState([]);
const [surveyAssignments, setSurveyAssignments] = useState([]);
const [surveyForm, setSurveyForm] = useState({
  baslik: "",
  sorular: ["", "", ""],
});
const [selectedSurveyId, setSelectedSurveyId] = useState("");

  // Bildirim State'leri
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  
  // Yapay Zeka State'leri
  const [aiAnalysisResult, setAiAnalysisResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]); 
  const [leaderboard, setLeaderboard] = useState([]); 
  const [allTrainings, setAllTrainings] = useState([]); 
  const [academyFilter, setAcademyFilter] = useState("published");
  const [personnelTrainings, setPersonnelTrainings] = useState([]); 
  const [personnelCerts, setPersonnelCerts] = useState([]);
  const [expandedPerformance, setExpandedPerformance] = useState({}); 
  const [loading, setLoading] = useState(true);

  // Departman yöneticisi profil / güvenlik state'leri
  const [managerProfile, setManagerProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    ad: '',
    soyad: '',
    email: '',
    departman: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    yeniSifre: '',
    yeniSifreTekrar: '',
  });

  const refreshData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const [statsData, usersData, boardData, trainingsData] = await Promise.all([
          getDashboardStats(user.id), getUsersList(user.role, user.department),
          getLeaderboard(), getAllTrainings(user.id, user.role, user.department)
        ]);
        setStats(statsData); setUsers(usersData || []); 
        setLeaderboard(boardData || []); setAllTrainings(trainingsData || []);
      }
    } catch (error) { console.error("Veri çekme hatası:", error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { refreshData(); }, [user]);

  // Eğitime tıklandığında detayları çek
  useEffect(() => {
    const fetchTrainingDetails = async () => {
      if (selectedTraining) {
        setEditDescText(selectedTraining.description || selectedTraining.aciklama || '');
        const [questions, analytics] = await Promise.all([
          getQuizQuestions(selectedTraining.id), getTrainingAnalytics(selectedTraining.id)
        ]);
        setTrainingQuestions(questions || []);
        setTrainingAnalytics(analytics || { atanan_personel: 0, basari_orani: 0 });
      }
    };
    fetchTrainingDetails();
  }, [selectedTraining]);

  const handleLogout = () => window.location.reload();

  const loadDepartmentAnnouncements = async () => {
  try {
    const data = await getDepartmentAnnouncements(user?.department, user?.id);
    setPreviousAnnouncements(data || []);
  } catch (err) {
    console.error("Önceki duyurular alınamadı:", err);
  }
};

  const loadManagerProfile = async () => {
    if (!user?.id) return;

    try {
      const data = await getAdminProfile(user.id);
      setManagerProfile(data);
      setProfileForm({
        ad: data?.ad || '',
        soyad: data?.soyad || '',
        email: data?.email || '',
        departman: data?.departman || user.department || '',
      });
    } catch (err) {
      alert(err.message || 'Profil bilgisi alınamadı.');
    }
  };

  const handleUpdateManagerProfile = async (e) => {
    e.preventDefault();

    try {
      const data = await updateAdminProfile(user.id, profileForm);
      alert(data.message || 'Profil güncellendi.');
      loadManagerProfile();
    } catch (err) {
      alert(err.message || 'Profil güncellenemedi.');
    }
  };

  const handleUpdateManagerPassword = async (e) => {
    e.preventDefault();

    if (!passwordForm.yeniSifre || !passwordForm.yeniSifreTekrar) {
      return alert('Lütfen yeni şifre alanlarını doldurun.');
    }

    if (passwordForm.yeniSifre !== passwordForm.yeniSifreTekrar) {
      return alert('Yeni şifreler eşleşmiyor.');
    }

    try {
      const data = await updateAdminPassword(user.id, passwordForm);
      alert(data.message || 'Şifre güncellendi.');
      setPasswordForm({ yeniSifre: '', yeniSifreTekrar: '' });
    } catch (err) {
      alert(err.message || 'Şifre güncellenemedi.');
    }
  };

  const getBadgeInfo = (xp) => {
    const safeXp = Number(xp) || 0;
    if (safeXp >= 10000) return { name: "Efsane", color: "text-purple-600", bg: "bg-purple-100", icon: <Award size={24} className="text-purple-600" /> };
    if (safeXp >= 5000) return { name: "Elmas", color: "text-cyan-600", bg: "bg-cyan-100", icon: <Shield size={24} className="text-cyan-600" /> };
    if (safeXp >= 2500) return { name: "Altın", color: "text-yellow-600", bg: "bg-yellow-100", icon: <Trophy size={24} className="text-yellow-600" /> };
    if (safeXp >= 1000) return { name: "Gümüş", color: "text-slate-600", bg: "bg-slate-200", icon: <Medal size={24} className="text-slate-600" /> };
    return { name: "Bronz", color: "text-orange-700", bg: "bg-orange-100", icon: <Star size={24} className="text-orange-600" /> };
  };

  const openPersonnelProfile = async (person) => {
    setSelectedPersonnel(person);
    setExpandedPerformance({}); 
    setAiAnalysisResult(''); // Yeni kişiye tıklandığında eski AI metnini sıfırla
    
    if (person.departman === user.department) {
      const egitimler = await getUserTrainingStatus(person.id);
      const sertifikalar = await getCertificates(person.id);
      setPersonnelTrainings(egitimler || []);
      setPersonnelCerts(sertifikalar || []);
    } else {
      setPersonnelTrainings([]); setPersonnelCerts([]);
    }
  };

  const togglePerformanceDetails = async (userId, egitimId) => {
    if (expandedPerformance[egitimId]) {
      const newState = { ...expandedPerformance };
      delete newState[egitimId];
      setExpandedPerformance(newState);
    } else {
      const perfData = await getPerformanceDetails(userId, egitimId);
      setExpandedPerformance(prev => ({ ...prev, [egitimId]: perfData || { noData: true } }));
    }
  };

 const handleSendNotificationClick = async () => {
  if (!notifTitle.trim() || !notifMessage.trim()) {
    return alert("Lütfen başlık ve mesaj alanlarını doldurun!");
  }

  try {
    const result = await sendAdminAnnouncement({
      adminId: user?.id,
      hedefKitle: "department",
      departman: user?.department,
      baslik: notifTitle.trim(),
      mesaj: notifMessage.trim(),
    });
    

    alert(
      `Duyuru gönderildi. ${result.gonderilen_kisi_sayisi || 0} kişiye ulaştı. 🚀`
    );

    setNotifTitle("");
    setNotifMessage("");
    loadDepartmentAnnouncements();
  } catch (err) {
    console.error("Departman duyuru gönderme hatası:", err);
    alert(err.message || "Duyuru gönderilemedi.");
  }
};

  const handleUpdateDescription = async () => {
    try {
      await updateTrainingDescription(selectedTraining.id, editDescText);
      alert("Açıklama başarıyla güncellendi! ✅");
      setIsEditingDesc(false);
      setSelectedTraining({...selectedTraining, aciklama: editDescText, description: editDescText});
      refreshData();
    } catch (error) { alert("Açıklama güncellenemedi."); }
  };

  const handleBulkAssign = async (e) => {
    e.preventDefault();
    if (!selectedBulkTraining) return alert("Lütfen atanacak eğitimi seçin!");
    try {
      const result = await assignTrainingToDepartment(user.department, selectedBulkTraining, user.id);
      alert(result.message);
      setIsBulkAssignModalOpen(false); setSelectedBulkTraining(''); refreshData(); 
    } catch (err) { alert("Hata: " + err.message); }
  };

  const handleMultiAssign = async (e) => {
    e.preventDefault();
    if (!selectedMultiTraining) return alert("Lütfen atanacak eğitimi seçin!");
    try {
      const result = await assignTrainingToMultipleUsers(selectedUserIds, selectedMultiTraining, user.id);
      alert(result.message);
      setIsMultiAssignModalOpen(false); setSelectedMultiTraining(''); setSelectedUserIds([]); refreshData();
    } catch (err) { alert("Hata: " + err.message); }
  };
  const handleRecommendTraining = async (e) => {
  e.preventDefault();

  if (!selectedPersonnel) {
    return alert("Çalışan seçilmedi.");
  }

  if (!recommendedTrainingId) {
    return alert("Lütfen önerilecek eğitimi seç.");
  }

  try {
    const result = await assignTrainingToUser(
      selectedPersonnel.id,
      recommendedTrainingId
    );

    alert(result.message || "Eğitim önerildi.");
    setRecommendedTrainingId("");
    setIsRecommendModalOpen(false);

    const egitimler = await getUserTrainingStatus(selectedPersonnel.id);
    setPersonnelTrainings(egitimler || []);

    refreshData();
  } catch (err) {
    alert(err.message || "Eğitim önerilemedi.");
  }
};
const deptUsers = users.filter((u) => u.departman === user?.department);
const myDepartmentSurveys = surveys.filter((survey) => {
  const creatorId =
    survey.olusturan_id ||
    survey.olusturanId ||
    survey.created_by ||
    survey.createdBy ||
    survey.admin_id;

  return String(creatorId) === String(user?.id);
});

const loadSurveyData = async () => {
  try {
    const [surveyData, assignmentData, deptAssignmentData, feedbackData] =
  await Promise.all([
    getSurveys(),
    getSurveyAssignments(),
    getDepartmentSurveyAssignments(user?.department),
    getDepartmentFeedbacks(user?.department),
  ]);

    setSurveys(surveyData || []);
    setSurveyAssignments(
      (assignmentData || []).filter(
        (a) =>
          a.departman === user?.department ||
          a.hedef_departman === user?.department ||
          deptUsers.some((u) => String(u.id) === String(a.hedef_kullanici_id))
      )
    );
    setDepartmentSurveyAssignments(deptAssignmentData || []);
    setFeedbacks(feedbackData || []);
  } catch (err) {
    console.error("Departman anket verileri alınamadı:", err);
  }
};

useEffect(() => {
  if (activeTab === "surveys") {
    loadSurveyData();
  }
}, [activeTab]);
useEffect(() => {
  if (activeTab === "announcements") {
    loadDepartmentAnnouncements();
  }
}, [activeTab]);

const handleAssignSurvey = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  if (data.hedef_id === data.degerlendiren_id) {
    return alert("Bir personel kendini değerlendiremez!");
  }

  try {
    await assignDepartment360Survey({
      hedef_kullanici_id: data.hedef_id,
      degerlendiren_id: data.degerlendiren_id,
      anket_id: data.anket_id,
      atayanId: user?.id,
    });

    alert("Departman 360 değerlendirme ataması yapıldı!");
    loadSurveyData();
  } catch (err) {
    alert(err.message || "Atama yapılamadı.");
  }
};

const handleCreateSurvey = async (e) => {
  e.preventDefault();

  const sorular = surveyForm.sorular
    .map((s) => s.trim())
    .filter(Boolean);

  if (!surveyForm.baslik.trim() || sorular.length === 0) {
    return alert("Anket başlığı ve en az 1 soru zorunlu.");
  }

  try {
    const result = await addDepartmentSurvey({
  baslik: surveyForm.baslik.trim(),
  sorular,
  olusturanId: user?.id,
});

    alert(result.message || "Anket oluşturuldu.");
    setSurveyForm({ baslik: "", sorular: ["", "", ""] });
    loadSurveyData();
  } catch (err) {
    alert(err.message || "Anket oluşturulamadı.");
  }
};

const handleAssignSurveyToDepartment = async () => {
  if (!selectedSurveyId) return alert("Lütfen anket seç.");

  try {
    const result = await assignDepartmentSurvey({
  anketId: selectedSurveyId,
  departman: user?.department,
  atayanId: user?.id,
});

    alert(result.message || "Anket departmana atandı.");
    setSelectedSurveyId("");
    loadSurveyData();
  } catch (err) {
    alert(err.message || "Anket atanamadı.");
  }
};
  // YENİ: Yapay Zeka Analizi Başlatma
  const handleAiAnalysis = async () => {
    if (!selectedPersonnel) return;
    setIsAiLoading(true);
    try {
      const data = {
        personelAd: `${selectedPersonnel.ad} ${selectedPersonnel.soyad}`,
        departman: selectedPersonnel.departman,
        xp: selectedPersonnel.xp || 0,
        tamamlanmaOrani: selectedPersonnel.tamamlanma_orani || 0,
        egitimKarnesi: personnelTrainings.map(t => ({ 
          egitim: t.title, 
          durum: t.is_completed ? 'Tamamlandı' : 'Bekliyor' 
        }))
      };
      const result = await getAIPersonnelAnalysis(data);
      setAiAnalysisResult(result.analiz);
    } catch (err) {
      setAiAnalysisResult("Yapay zeka analizi şu an kullanılamıyor, lütfen daha sonra tekrar deneyiniz.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Checkbox İşlemleri
  const filteredUsers = Array.isArray(users) ? users.filter(person => 
    `${person.ad} ${person.soyad}`.toLowerCase().includes(personnelSearch.toLowerCase())
  ) : [];

  const getTrainingStatus = (training) => {
  const rawStatus = String(
    training.yayin_durumu ||
    training.durum ||
    training.status ||
    training.yayinDurumu ||
    ""
  ).toLowerCase();

  const isDraft =
    rawStatus.includes("taslak") ||
    rawStatus.includes("draft") ||
    rawStatus.includes("pasif") ||
    rawStatus.includes("inactive") ||
    training.aktif_mi === false ||
    training.aktifMi === false ||
    training.is_active === false;

  return isDraft ? "draft" : "published";
};

const filteredAcademyTrainings = allTrainings.filter((training) => {
  const status = getTrainingStatus(training);

  const creatorId =
    training.olusturan_id ||
    training.olusturanId ||
    training.created_by ||
    training.createdBy ||
    training.egitmen_id ||
    training.egitmenId;

  // TASLAK → sadece kendi oluşturdukları
  if (academyFilter === "draft") {
    return status === "draft" && String(creatorId) === String(user?.id);
  }

  // YAYIN → herkes görebilir
  return status === "published";
});
  const handleSelectUser = (id, e) => {
    e.stopPropagation();
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedUserIds(filteredUsers.map(u => u.id));
    else setSelectedUserIds([]);
  };

  const exportDeptTeamReport = () => {
  let csv = "data:text/csv;charset=utf-8,\uFEFF";
  csv += "Ad Soyad,Departman,Rol,Tamamlanma Orani (%),XP,Streak\n";

  filteredUsers.forEach((p) => {
    csv += `${p.ad} ${p.soyad},${p.departman},${p.rol},${p.tamamlanma_orani || 0},${p.xp || 0},${p.streak || 0}\n`;
  });

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = `${user.department}_Ekip_Analiz_Raporu.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportSelectedPersonnelReport = () => {
  if (!selectedPersonnel) return;

  const fullName = `${selectedPersonnel.ad} ${selectedPersonnel.soyad}`;

  let csv = "data:text/csv;charset=utf-8,\uFEFF";
  csv += "Personel,Departman,Rol,Tamamlanma Orani (%),XP,Streak\n";
  csv += `${fullName},${selectedPersonnel.departman},${selectedPersonnel.rol},${selectedPersonnel.tamamlanma_orani || 0},${selectedPersonnel.xp || 0},${selectedPersonnel.streak || 0}\n\n`;

  csv += "Egitim Adi,Atandi Mi,Tamamlandi Mi,Durum\n";
  personnelTrainings.forEach((e) => {
    csv += `${e.title},${e.is_assigned ? "Evet" : "Hayir"},${e.is_completed ? "Evet" : "Hayir"},${e.is_completed ? "Tamamlandi" : e.is_assigned ? "Bekliyor" : "Atanmadi"}\n`;
  });

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = `${fullName.replace(/\s+/g, "_")}_Egitim_Analiz_Raporu.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const buildTrainingAnalysisRow = (egitim, perf = {}) => {
  const videoSure = Number(perf.video_izleme_suresi || 0);
  const atlama = Number(perf.video_atlama_sayisi || 0);
  const quizDeneme = Number(perf.quiz_deneme_sayisi || 0);
  const quizSkor = Number(perf.en_yuksek_quiz_puani || 0);
  const sonIzleme = perf.son_izleme_tarihi || "-";

  let yorum = "Performans verisi sınırlı.";
  if (quizSkor >= 85) yorum = "Çok güçlü performans. Bilgi kalıcılığı yüksek.";
  else if (quizSkor >= 70) yorum = "Başarılı performans. Kısa tekrar önerilir.";
  else if (quizSkor > 0) yorum = "Gelişim alanı var. Quiz tekrarları önerilir.";
  else if (videoSure > 0) yorum = "Video izlenmiş fakat quiz skoru oluşmamış.";
  else yorum = "Tamamlanan eğitim için detaylı performans verisi bulunamadı.";

  return {
    egitimAdi: egitim.title || egitim.baslik || "-",
    durum: egitim.is_completed ? "Tamamlandı" : "Devam Ediyor",
    videoSure,
    atlama,
    quizDeneme,
    quizSkor,
    sonIzleme,
    yorum,
  };
};const exportTrainingAnalysisCsv = async (egitim) => {
  const perf =
    expandedPerformance[egitim.id] && !expandedPerformance[egitim.id].noData
      ? expandedPerformance[egitim.id]
      : await getPerformanceDetails(selectedPersonnel.id, egitim.id);

  const row = buildTrainingAnalysisRow(egitim, perf || {});
  const fullName = `${selectedPersonnel.ad} ${selectedPersonnel.soyad}`;

  let csv = "\uFEFF";
  csv += "Personel,Eğitim,Durum,Video İzleme Süresi,Video Atlama Sayısı,Quiz Deneme Sayısı,En Yüksek Quiz Puanı,Son İzleme Tarihi,Yorum\n";
  csv += `"${fullName}","${row.egitimAdi}","${row.durum}","${row.videoSure} dk","${row.atlama}","${row.quizDeneme}","%${row.quizSkor}","${row.sonIzleme}","${row.yorum}"\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${fullName.replace(/\s+/g, "_")}_${row.egitimAdi.replace(/\s+/g, "_")}_analiz.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};const exportTrainingAnalysisPdf = async (egitim) => {
  const perf =
    expandedPerformance[egitim.id] && !expandedPerformance[egitim.id].noData
      ? expandedPerformance[egitim.id]
      : await getPerformanceDetails(selectedPersonnel.id, egitim.id);

  const row = buildTrainingAnalysisRow(egitim, perf || {});
  const fullName = `${selectedPersonnel.ad} ${selectedPersonnel.soyad}`;

  const html = `
    <html>
      <head>
        <title>Eğitim Analiz Raporu</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1 { font-size: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
          th { background: #f8fafc; }
          .box { margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 12px; }
        </style>
      </head>
      <body>
        <h1>${fullName} - Eğitim Analizi</h1>
        <p>${selectedPersonnel.departman || "-"} Departmanı</p>

        <table>
          <tr><th>Eğitim</th><td>${row.egitimAdi}</td></tr>
          <tr><th>Durum</th><td>${row.durum}</td></tr>
          <tr><th>Video İzleme Süresi</th><td>${row.videoSure} dk</td></tr>
          <tr><th>Video Atlama Sayısı</th><td>${row.atlama}</td></tr>
          <tr><th>Quiz Deneme Sayısı</th><td>${row.quizDeneme}</td></tr>
          <tr><th>En Yüksek Quiz Puanı</th><td>%${row.quizSkor}</td></tr>
          <tr><th>Son İzleme Tarihi</th><td>${row.sonIzleme}</td></tr>
        </table>

        <div class="box">
          <strong>Yönetici Yorumu:</strong>
          <p>${row.yorum}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

  const teamChartData = users.slice(0, 8).map(u => ({
    name: `${u.ad} ${u.soyad.charAt(0)}.`,
    basari: Number(u.tamamlanma_orani) || 0
  }));
  const teamSuccessRate = Number(String(stats?.tamamlanma || 0).replace("%", "")) || 0;

const avgXp =
  users.length > 0
    ? Math.round(users.reduce((sum, u) => sum + Number(u.xp || 0), 0) / users.length)
    : 0;

const avgStreak =
  users.length > 0
    ? Math.round(users.reduce((sum, u) => sum + Number(u.streak || 0), 0) / users.length)
    : 0;

const riskliPersoneller = users.filter(
  (u) => Number(u.tamamlanma_orani || 0) < 40
);

const aiTeamScore = Math.min(
  100,
  Math.round(
    teamSuccessRate * 0.45 +
    Math.min(avgXp / 30, 25) +
    Math.min(avgStreak * 4, 20) +
    Math.max(0, 10 - riskliPersoneller.length * 3)
  )
);

const aiRadarData = [
  { metric: "Başarı", value: teamSuccessRate },
  { metric: "XP", value: Math.min(100, Math.round(avgXp / 20)) },
  { metric: "Streak", value: Math.min(100, avgStreak * 15) },
  { metric: "Risk", value: Math.max(0, 100 - riskliPersoneller.length * 25) },
  { metric: "Aktivite", value: Math.min(100, users.length * 20) },
];

const aiInsight =
  aiTeamScore >= 80
    ? "Ekibin güçlü ilerliyor. İleri seviye eğitimlerle uzmanlık artırılabilir."
    : aiTeamScore >= 55
    ? "Ekip genel olarak iyi durumda. Riskli personeller için hedefli eğitim önerilir."
    : "Ekipte gelişim riski yüksek. Düşük tamamlanma oranına sahip personellere hızlı aksiyon alınmalı.";
  
const selectedAnalysisSurveyId =
  selectedSurveyAnalysis?.anket_id || selectedSurveyAnalysis?.id || null;

const selectedSurveyAssignments = selectedSurveyAnalysis
  ? departmentSurveyAssignments.filter((a) => {
      const selectedId =
        selectedSurveyAnalysis.anket_id || selectedSurveyAnalysis.id;

      return String(a.anket_id) === String(selectedId);
    })
  : [];

const selectedSurveyCompleted = selectedSurveyAssignments.filter(
  (a) =>
    a.durum === "tamamlandi" ||
    a.durum === "Tamamlandı" ||
    a.durum === "completed"
).length;

const selectedSurveyRate =
  selectedSurveyAssignments.length > 0
    ? Math.round(
        (selectedSurveyCompleted / selectedSurveyAssignments.length) * 100
      )
    : 0;
  const isMyTeam = selectedPersonnel?.departman === user?.department;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-800 justify-between">
  <div className="flex items-center">
    <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl mr-3 shadow-sm">
      S
    </div>

    <span className="text-xl font-black uppercase italic tracking-tighter">
      Sporthink
    </span>
  </div>

  <button
    type="button"
    onClick={() => setDarkMode(!darkMode)}
    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
    title={darkMode ? "Açık moda geç" : "Koyu moda geç"}
  >
    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
  </button>
</div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => {setActiveTab('overview'); setSelectedTraining(null);}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> Ekip Özeti
          </button>
          
          <div className="pt-4 pb-2 px-4"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Yönetim</p></div>
          <button onClick={() => {setActiveTab('personnel'); setSelectedTraining(null);}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'personnel' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users size={20} /> Ekip Yönetimi
          </button>
          <button onClick={() => {setActiveTab('academy'); setSelectedTraining(null);}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'academy' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <BookOpen size={20} /> Eğitim Kataloğu
          </button><button
  onClick={() => {setActiveTab('surveys'); setSelectedTraining(null);}}
  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
    activeTab === 'surveys'
      ? 'bg-red-600 text-white shadow-lg'
      : 'text-slate-400 hover:bg-slate-800'
  }`}
>
  <ClipboardList size={20} /> Anket Yönetimi
</button>

          <button
            type="button"
            onClick={() => navigate('/user/egitimler')}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-slate-400 hover:bg-slate-800"
          >
            <BookOpen size={20} /> Eğitimlerim
          </button>

          <div className="pt-4 pb-2 px-4"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">İletişim & Oyunlaştırma</p></div>
          <button onClick={() => {setActiveTab('announcements'); setSelectedTraining(null);}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'announcements' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Megaphone size={20} /> Ekip Duyuruları
          </button>
          <button onClick={() => {setActiveTab('leaderboard'); setSelectedTraining(null);}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'leaderboard' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Medal size={20} /> Şirket Sıralaması
          </button>

          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Hesap & Yardım</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setSelectedTraining(null);
              loadManagerProfile();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Users size={20} /> Kişisel Bilgiler
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('security');
              setSelectedTraining(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'security' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Shield size={20} /> Şifre Güvenlik
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('faq');
              setSelectedTraining(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'faq' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <HelpCircle size={20} /> SSS
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="mb-4">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{user.department} Yöneticisi</p>
            <p className="text-sm font-bold text-slate-300 mt-1">{user.name}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-red-400 hover:bg-red-400/10 rounded-xl font-bold border border-red-400/20">
            <LogOut size={18} /> Güvenli Çıkış
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-10 shadow-sm">
           <p className="font-black text-slate-400 uppercase tracking-widest text-xs">{user.department} Departman Yönetim Paneli</p>
           <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-black">{user.name?.charAt(0)}</div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {loading ? (
             <div className="h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-t-red-600 rounded-full animate-spin"></div></div>
          ) : (
            <>
              {/* EKİP ÖZETİ */}
              {activeTab === 'overview' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="mb-10">
      <h1 className="text-3xl font-black text-slate-900 mb-2">
        Merhaba, {user.name.split(' ')[0]} 👋
      </h1>
      <p className="text-slate-500 font-medium">
        {user.department} ekibinin eğitim ve gelişim özetini aşağıdan görebilirsin.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <StatCard icon={<Users size={24}/>} label="Ekip Mevcudu" value={users.length} color="red" />
      <StatCard icon={<TrendingUp size={24}/>} label="Ekip Başarı Ort." value={`%${stats?.tamamlanma || 0}`} color="emerald" />
      <StatCard icon={<Activity size={24}/>} label="Bekleyen Atamalar" value={stats?.devamEden || 0} color="amber" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-2">
        <h2 className="text-xl font-black text-slate-900 mb-8">
          Ekip Üyeleri Başarı Dağılımı
        </h2>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="basari" radius={[8, 8, 0, 0]} barSize={40}>
                {teamChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.basari > 60 ? '#059669' : '#e3342f'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl">
        <div>
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-600/40">
            <Activity size={28} />
          </div>
          <h2 className="text-2xl font-black mb-4">Aksiyon Önerisi</h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
            Şu an ekibinin genel başarı ortalaması <span className="text-white font-bold">%{(stats?.tamamlanma || "0").replace('%','')}</span>. Başarı grafiğinde geride kalan personellere Ekip Yönetimi sekmesinden yeni eğitim modülleri atayarak gelişimlerini destekleyebilirsin.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('personnel')}
          className="w-full bg-white text-slate-900 font-black py-4 rounded-xl shadow-lg hover:bg-red-50 transition-colors"
        >
          Ekibini İncele
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center">
            <Bot size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-red-300 uppercase tracking-widest">
              AI Ekip Analizi
            </p>
            <h2 className="text-2xl font-black">Sağlık Skoru</h2>
          </div>
        </div>

        <div className="text-6xl font-black mb-4">
          %{aiTeamScore}
        </div>

        <p className="text-slate-300 text-sm font-semibold leading-7 mb-6">
          {aiInsight}
        </p>

        <button
          onClick={() => setActiveTab("personnel")}
          className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black hover:bg-red-50"
        >
          Riskleri İncele
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              AI Performans Radarı
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1">
              Başarı, XP, streak, risk ve aktiviteye göre ekip profili
            </p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={aiRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Ekip Skoru"
                dataKey="value"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.25}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
)}

              {/* EKİP YÖNETİMİ & ÇOKLU SEÇİM */}
              {activeTab === 'personnel' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h1 className="text-3xl font-black text-slate-900 mb-2">Ekip Yönetimi</h1>
                      <p className="text-slate-500 font-medium">Ekibinin karnelerini analiz et, kişiye, gruba veya tüm ekibe eğitim ata.</p>
                    </div>
                    <div className="flex gap-3">
                      {selectedUserIds.length > 0 && (
                        <button 
                          onClick={() => setIsMultiAssignModalOpen(true)} 
                          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black shadow-lg hover:bg-emerald-700 transition-all animate-in zoom-in"
                        >
                          <CheckSquare size={18} /> Seçili {selectedUserIds.length} Kişiye Ata
                        </button>
                      )}
                      
                      <button 
                        onClick={() => setIsBulkAssignModalOpen(true)} 
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl text-sm font-black shadow-lg hover:bg-red-700 transition-all"
                      >
                        <Layers size={18} /> Tüm Ekibe Ata
                      </button>
                      <button
  type="button"
  onClick={exportDeptTeamReport}
  className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-black border border-emerald-200 hover:bg-emerald-100"
>
  <Download size={18} />
  CSV Rapor
</button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                      <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" placeholder="Ekipte ara..." value={personnelSearch}
                          onChange={(e) => setPersonnelSearch(e.target.value)}
                          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-200" 
                        />
                      </div>
                      <span className="text-xs font-black text-slate-400 bg-slate-200 px-3 py-1.5 rounded-full uppercase tracking-widest">{filteredUsers.length} Personel</span>
                    </div>

                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-6 py-5 w-10 text-center">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                              onChange={handleSelectAll}
                              checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                            />
                          </th>
                          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personel</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</th>
                          <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Analiz</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length === 0 ? (
                          <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-bold">Aramanızla eşleşen kimse yok.</td></tr>
                        ) : (
                          filteredUsers.map((person) => (
                            <tr key={person.id} className={`group cursor-pointer transition-all ${selectedUserIds.includes(person.id) ? 'bg-red-50/50' : 'hover:bg-slate-50/80'}`} onClick={() => openPersonnelProfile(person)}>
                              <td className="px-6 py-6 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                  checked={selectedUserIds.includes(person.id)}
                                  onChange={(e) => handleSelectUser(person.id, e)}
                                />
                              </td>
                              <td className="px-4 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md">{person.ad[0]}{person.soyad[0]}</div>
                                  <span className="font-black text-slate-900 group-hover:text-red-600 transition-colors">{person.ad} {person.soyad}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 font-bold text-slate-500 text-sm">{person.rol}</td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4 w-40">
                                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${person.tamamlanma_orani > 50 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${person.tamamlanma_orani}%` }} />
                                  </div>
                                  <span className="text-xs font-black text-slate-900">%{person.tamamlanma_orani}</span>
                                </div>
                              </td>
                              <td className="px-10 py-6 text-right"><ChevronRight size={20} className="text-slate-300 ml-auto group-hover:text-red-600" /></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ŞİRKET LİDERLİK TABLOSU */}
{activeTab === "leaderboard" && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-8">
      <h1 className="text-3xl font-black text-slate-900 mb-2">
        Şirket Sıralaması 🏆
      </h1>

      <p className="text-slate-500 font-medium">
        Tüm şirket sıralamasını görebilirsin. KVKK gereği farklı departmanların eğitim karnesi gizlidir.
      </p>
    </div>

    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 max-w-4xl">
      {leaderboard.map((item, index) => {
        const rank = index + 1;
        const isMyTeamItem = item.departman === user.department;

        return (
          <div
            key={item.id}
            onClick={() => openPersonnelProfile(item)}
            className={`flex items-center justify-between p-4 mb-3 rounded-2xl border transition-all cursor-pointer ${
              isMyTeamItem
                ? "bg-red-50 border-red-100 hover:border-red-300"
                : "bg-slate-50 border-slate-100 hover:border-slate-300 opacity-90"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 flex justify-center items-center">
                {rank === 1 ? (
                  <Medal size={28} className="text-yellow-500" />
                ) : rank === 2 ? (
                  <Medal size={28} className="text-slate-400" />
                ) : rank === 3 ? (
                  <Medal size={28} className="text-amber-700" />
                ) : (
                  <span className="font-black text-slate-400 text-xl">
                    {rank}
                  </span>
                )}
              </div>

              <div>
                <p
                  className={`font-black text-lg ${
                    isMyTeamItem ? "text-red-900" : "text-slate-900"
                  }`}
                >
                  {item.ad} {item.soyad} {isMyTeamItem && "👤"}
                </p>

                <p className="text-xs font-bold text-slate-500">
                  {item.departman}
                </p>
              </div>
            </div>

            <div className="bg-orange-100 px-4 py-2 rounded-xl">
              <span className="font-black text-orange-600">
                {item.xp} XP
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

              {/* DUYURULAR */}
              {activeTab === 'announcements' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Ekip Duyuruları 📢</h1>
                    <p className="text-slate-500 font-medium">Sadece <span className="font-bold text-red-600">{user.department}</span> departmanındaki personellere anında Push Bildirim gönderin.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3"><Send size={24} className="text-red-600" /> Yeni Mesaj Oluştur</h2>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Hedef Kitle (Kilitli)</label>
                          <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed flex items-center justify-between">
                            <span>Sadece {user.department} Ekibi</span><Shield size={16} className="text-slate-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Bildirim Başlığı</label>
                          <input type="text" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="Örn: Hafta Sonu Mesaisi Hakkında" />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Mesaj İçeriği</label>
                          <textarea rows="4" value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold resize-none outline-none focus:ring-2 focus:ring-red-500" placeholder="Bildirim metni..." />
                        </div>
                        <button onClick={handleSendNotificationClick} className="w-full mt-2 bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"><Megaphone size={18} /> Cihazlara Gönder</button>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-red-600/10 mix-blend-screen filter blur-3xl"></div>
                      <h3 className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-6 relative z-10">Mobil Cihaz Önizlemesi</h3>
                      <div className="w-[280px] h-[550px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-700 shadow-2xl relative overflow-hidden flex flex-col z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-700 rounded-b-2xl z-20"></div>
                        
                        <div className="flex-1 bg-slate-50 pt-16 px-4">
                          <p className="text-3xl font-black text-slate-900 mb-6 px-1 tracking-tight">Bildirimler</p>
                          <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-sm shadow-sky-100 flex-row items-start relative animate-in zoom-in-95 duration-300">
                            <div className="w-3 h-3 bg-red-500 rounded-full absolute top-4 right-4"></div>
                            <div className="flex gap-3">
                              <div className="bg-sky-100 p-2 rounded-full h-fit"><Megaphone size={20} className="text-sky-600" /></div>
                              <div>
                                <p className="text-sm font-black text-slate-900 mb-1 max-w-[170px] leading-snug">{notifTitle || "Başlık"}</p>
                                <p className="text-xs font-medium text-slate-500 max-w-[170px] leading-relaxed">{notifMessage || "Duyuru metni bu alanda personelin karşısına çıkacak."}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
  <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
    <Megaphone size={24} className="text-indigo-600" />
    Önceki Duyurular
  </h2>

  {previousAnnouncements.length === 0 ? (
    <p className="text-slate-400 font-bold">
      Henüz bu departmana gönderilmiş duyuru yok.
    </p>
  ) : (
    <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
      {previousAnnouncements.map((item) => (
        <div
          key={item.duyuru_id}
          className="p-5 rounded-2xl bg-slate-50 border border-slate-100"
        >
          <p className="font-black text-slate-900">
            {item.baslik}
          </p>

          <p className="text-sm text-slate-500 font-semibold mt-2 leading-6">
            {item.icerik}
          </p>

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
            {item.olusturma_tarihi
              ? new Date(item.olusturma_tarihi).toLocaleDateString("tr-TR")
              : ""}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
                  </div>
                </div>
              )}


              {/* PROFİL */}
              {activeTab === 'profile' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <p className="text-red-600 text-xs font-black tracking-[3px] mb-2">DEPARTMAN YÖNETİCİSİ</p>
                    <h1 className="text-4xl font-black text-slate-950">Kişisel Bilgiler</h1>
                    <p className="text-slate-500 font-semibold mt-2">Profil bilgilerini buradan görüntüleyip güncelleyebilirsin.</p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl xl:col-span-1 h-fit">
                      <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-6 shadow-lg shadow-red-600/30">
                        {(profileForm.ad?.[0] || user?.name?.[0] || 'Y').toUpperCase()}
                      </div>
                      <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">Aktif Yönetici</p>
                      <h2 className="text-2xl font-black mb-2">
                        {profileForm.ad || managerProfile?.ad || user?.name || 'Departman Yöneticisi'} {profileForm.soyad || managerProfile?.soyad || ''}
                      </h2>
                      <p className="text-slate-400 text-sm font-bold">{profileForm.email || managerProfile?.email || 'E-posta bilgisi yok'}</p>
                      <div className="mt-6 bg-white/10 rounded-2xl p-4 border border-white/10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Departman</p>
                        <p className="text-lg font-black text-white">{profileForm.departman || user?.department}</p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateManagerProfile} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 xl:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Ad</label>
                          <input value={profileForm.ad} onChange={(e) => setProfileForm({ ...profileForm, ad: e.target.value })} placeholder="Ad" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-red-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Soyad</label>
                          <input value={profileForm.soyad} onChange={(e) => setProfileForm({ ...profileForm, soyad: e.target.value })} placeholder="Soyad" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-red-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">E-posta</label>
                          <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="E-posta" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-red-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Departman</label>
                          <input value={profileForm.departman} disabled placeholder="Departman" className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold outline-none text-slate-500 cursor-not-allowed" />
                        </div>
                      </div>
                      <button type="submit" className="mt-8 px-8 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Bilgileri Güncelle</button>
                    </form>
                  </div>
                </div>
              )}

              {/* ŞİFRE GÜVENLİK */}
              {activeTab === 'security' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <p className="text-red-600 text-xs font-black tracking-[3px] mb-2">HESAP GÜVENLİĞİ</p>
                    <h1 className="text-4xl font-black text-slate-950">Şifre Güvenlik</h1>
                    <p className="text-slate-500 font-semibold mt-2">Hesap şifreni güvenli şekilde güncelle.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <form onSubmit={handleUpdateManagerPassword} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 lg:col-span-2 max-w-2xl">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Yeni Şifre</label>
                          <input type="password" value={passwordForm.yeniSifre} onChange={(e) => setPasswordForm({ ...passwordForm, yeniSifre: e.target.value })} placeholder="Yeni şifre" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-red-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Yeni Şifre Tekrar</label>
                          <input type="password" value={passwordForm.yeniSifreTekrar} onChange={(e) => setPasswordForm({ ...passwordForm, yeniSifreTekrar: e.target.value })} placeholder="Yeni şifre tekrar" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-red-500" />
                        </div>
                      </div>
                      <button type="submit" className="mt-8 px-8 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Şifreyi Güncelle</button>
                    </form>

                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-fit shadow-xl">
                      <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-6"><Shield size={28} /></div>
                      <h2 className="text-xl font-black mb-3">Güvenlik Notu</h2>
                      <p className="text-slate-400 text-sm font-semibold leading-7">Şifre güncellerken güçlü ve tahmin edilmesi zor bir parola kullan. Yeni şifre ve tekrar alanı eşleşmeden güncelleme yapılmaz.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SSS */}
              {activeTab === 'faq' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <p className="text-red-600 text-xs font-black tracking-[3px] mb-2">YARDIM MERKEZİ</p>
                    <h1 className="text-4xl font-black text-slate-950">Sıkça Sorulan Sorular</h1>
                    <p className="text-slate-500 font-semibold mt-2">Departman yöneticisi paneli için temel yardım alanı.</p>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 max-w-4xl space-y-4">
                    {[
                      { q: 'Ekibime nasıl eğitim atarım?', a: 'Ekip Yönetimi sayfasından personel seçebilir, seçili kişilere veya tüm ekibe eğitim atayabilirsin.' },
                      { q: 'Sadece kendi departmanımı mı yönetebilirim?', a: 'Evet. Departman yöneticisi yalnızca kendi departmanındaki personellerin eğitim karnesini detaylı yönetebilir.' },
                      { q: 'Duyurular kimlere gider?', a: 'Ekip Duyuruları ekranından gönderilen bildirimler sadece kendi departmanındaki personele gider.' },
                      { q: 'Şirket sıralamasındaki herkesi görebilir miyim?', a: 'Evet, şirket sıralamasını görebilirsin. Ancak detaylı eğitim karnesi sadece kendi ekibin için açılır.' },
                    ].map((item, index) => (
                      <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-red-200 transition-all">
                        <h3 className="font-black text-slate-900 mb-2 flex items-center gap-2"><HelpCircle size={18} className="text-red-600" />{item.q}</h3>
                        <p className="text-slate-500 font-semibold leading-7">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EĞİTİM KATALOĞU VE DETAYI (TAMAMEN DÜZELTİLDİ) */}
              {activeTab === 'academy' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {!selectedTraining ? (
                    <>
                      <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Eğitim Kataloğu 📚</h1>
                        <p className="text-slate-500 font-medium">Sistemdeki eğitimleri yönetin, yeni içerikler tanımlayın.</p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
                          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6">
                            <BookOpen size={30} />
                          </div>

                          <p className="text-red-600 text-xs font-black tracking-[3px] mb-3">
                            SPORTHINK AKADEMİ
                          </p>

                          <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                            Yeni Eğitim Oluştur
                          </h2>

                          <p className="text-slate-500 font-semibold leading-7 mb-8">
                            Eğitmen tarafındaki gelişmiş eğitim oluşturma panelini kullanarak içerik,
                            modül, quiz ve kaynak yönetimini tek yerden yap.
                          </p>

                          <button
                            type="button"
                            onClick={() => navigate('/admin/egitim-olustur')}
                            className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20"
                          >
                            Eğitime Git
                          </button>
                        </div>
                        <div className="lg:col-span-2">
                          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                              <div>
  <h2 className="text-lg font-black text-slate-900">
    {academyFilter === "published" ? "Yayındaki Eğitimler" : "Taslak Eğitimler"}
  </h2>

  <div className="flex gap-2 mt-3">
    <button
      type="button"
      onClick={() => setAcademyFilter("published")}
      className={`px-4 py-2 rounded-xl text-xs font-black ${
        academyFilter === "published"
          ? "bg-red-600 text-white"
          : "bg-white text-slate-500 border"
      }`}
    >
      Yayındakiler
    </button>

    <button
      type="button"
      onClick={() => setAcademyFilter("draft")}
      className={`px-4 py-2 rounded-xl text-xs font-black ${
        academyFilter === "draft"
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-500 border"
      }`}
    >
      Taslaklar
    </button>
  </div>
</div>

<span className="font-black text-xs px-3 py-1 rounded-full bg-slate-200 text-slate-600">
  {filteredAcademyTrainings.length} Eğitim
</span>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto max-h-[600px]">
                              {filteredAcademyTrainings.map((training) => {
                                const egitimId = training.id || training.egitim_id;

                                return (
                                  <div
                                    key={egitimId}
                                    className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-red-300 hover:shadow-md transition-all mb-3 group"
                                  >
                                    <div
                                      onClick={() =>
                                        navigate(`/admin/egitim-detay/${egitimId}`, {
                                          state: {
                                            egitimId,
                                            id: egitimId,
                                            title: training.title || training.baslik,
                                            egitim: training,
                                          },
                                        })
                                      }
                                      className="flex items-center justify-between cursor-pointer"
                                    >
                                      <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                          <Video size={20} />
                                        </div>

                                        <div className="flex-1 pr-4">
                                          <p className="font-bold text-slate-900 line-clamp-1">
                                            {training.title || training.baslik}
                                          </p>

                                          <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                              {training.duration || training.sure || 'Süre yok'}
                                            </span>
                                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                                              {training.xp || training.xp_degeri || 0} XP
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <ChevronRight size={20} className="text-slate-300 group-hover:text-red-500" />
                                    </div>

                                    <div className="flex gap-3 mt-4 pl-16">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(`/admin/icerik-ekle/${egitimId}`, {
                                            state: {
                                              egitimId,
                                              id: egitimId,
                                              egitim: training,
                                            },
                                          });
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 transition"
                                      >
                                        İçerik Ekle
                                      </button>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(`/admin/onizleme/${egitimId}`, {
                                            state: {
                                              egitimId,
                                              id: egitimId,
                                              egitim: training,
                                            },
                                          });
                                        }}
                                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition"
                                      >
                                        Önizle
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="animate-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => { setSelectedTraining(null); setIsEditingDesc(false); }} className="w-12 h-12 bg-white border rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors"><ArrowLeft size={20} /></button>
                        <h1 className="text-3xl font-black text-slate-900">{selectedTraining.title || selectedTraining.baslik}</h1>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6 relative z-10">
                              <h2 className="text-xl font-black">Eğitim Künyesi</h2>
                              {!isEditingDesc ? <button onClick={() => setIsEditingDesc(true)} className="p-2 bg-white/10 rounded-xl"><Edit3 size={16}/></button> : <button onClick={handleUpdateDescription} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 rounded-xl text-xs font-bold"><Save size={14}/>Kaydet</button>}
                            </div>
                            <div className="space-y-4 relative z-10">
                              {!isEditingDesc ? <p className="text-sm font-medium text-slate-200 leading-relaxed">{selectedTraining.description || selectedTraining.aciklama || "Açıklama yok"}</p> : <textarea className="w-full bg-slate-800 text-white text-sm p-3 rounded-xl outline-none resize-none" rows="4" value={editDescText} onChange={(e) => setEditDescText(e.target.value)} />}
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-2">
                          <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><BarChart2 size={28} className="text-emerald-600" /><h2 className="text-2xl font-black text-slate-800">Eğitim Başarı Analizi</h2></div></div>
                            <div className="grid grid-cols-2 gap-4 mb-8 border-b border-slate-100 pb-8">
                              <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl"><p className="text-xs font-bold text-slate-400">Atanan Personel</p><p className="text-3xl font-black text-slate-800">{trainingAnalytics?.atanan_personel || 0}</p></div>
                              <div className="bg-emerald-50 border border-emerald-100 px-6 py-4 rounded-2xl"><p className="text-xs font-bold text-emerald-600">Başarı Oranı</p><p className="text-3xl font-black text-emerald-700">%{trainingAnalytics?.basari_orani || 0}</p></div>
                            </div>
                            <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><CheckSquare size={28} className="text-sky-600" /><h2 className="text-2xl font-black text-slate-800">Sınav Soruları</h2></div><button onClick={() => setIsQuizModalOpen(true)} className="flex items-center gap-2 bg-sky-50 text-sky-700 px-4 py-2 rounded-xl font-bold"><Plus size={18} /> Soru Ekle</button></div>
                            <div className="space-y-4">
                              {trainingQuestions.map((q, idx) => (
                                <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200"><p className="font-bold text-slate-800"><span className="text-sky-600 mr-2">Soru {idx + 1}:</span>{q.soru_metni}</p></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}{activeTab === 'surveys' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-8">
      <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
        <ClipboardList className="text-indigo-600" />
        Anket & Geribildirim Merkezi
      </h1>
      <p className="text-slate-500 font-semibold mt-2">
        Sadece {user?.department} departmanındaki personel anketlerini, 360 değerlendirmelerini ve eğitim geribildirimlerini takip et.
      </p>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => setSurveyView("surveys")}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${
            surveyView === "surveys"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Anketler
        </button>

        <button
          type="button"
          onClick={() => setSurveyView("feedbacks")}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${
            surveyView === "feedbacks"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Geribildirimler ({feedbacks.length})
        </button>
      </div>
    </div>

    {surveyView === "surveys" && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5">
              <ClipboardList size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
              Toplam Anket
            </p>
            <p className="text-3xl font-black text-slate-950 mt-2">
              {surveys.length}
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-5">
              <Target size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
              Atanan Görev
            </p>
            <p className="text-3xl font-black text-slate-950 mt-2">
              {surveyAssignments.length}
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5">
              <CheckSquare size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
              Tamamlanma
            </p>
            <p className="text-3xl font-black text-slate-950 mt-2">
              %
              {surveyAssignments.length > 0
                ? Math.round(
                    (surveyAssignments.filter(
                      (a) =>
                        a.durum === "tamamlandi" ||
                        a.durum === "Tamamlandı" ||
                        a.durum === "completed"
                    ).length /
                      surveyAssignments.length) *
                      100
                  )
                : 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <form
            onSubmit={handleCreateSurvey}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <ClipboardList size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-950">
                Yeni Anket Şablonu
              </h2>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <input
                value={surveyForm.baslik}
                onChange={(e) =>
                  setSurveyForm({ ...surveyForm, baslik: e.target.value })
                }
                placeholder="Anket Başlığı"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold outline-none focus:border-indigo-500"
              />

              <div className="space-y-3">
  {surveyForm.sorular.map((soru, index) => (
    <div key={index} className="flex gap-3">
      <input
        value={soru}
        onChange={(e) => {
          const yeniSorular = [...surveyForm.sorular];
          yeniSorular[index] = e.target.value;
          setSurveyForm({ ...surveyForm, sorular: yeniSorular });
        }}
        placeholder={`Soru ${index + 1}`}
        className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold outline-none focus:border-indigo-500"
      />

      {surveyForm.sorular.length > 1 && (
        <button
          type="button"
          onClick={() =>
            setSurveyForm({
              ...surveyForm,
              sorular: surveyForm.sorular.filter((_, i) => i !== index),
            })
          }
          className="px-4 rounded-2xl bg-red-50 text-red-600 font-black"
        >
          <X size={18} />
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setSurveyForm({
        ...surveyForm,
        sorular: [...surveyForm.sorular, ""],
      })
    }
    className="w-full py-3 rounded-2xl bg-slate-100 text-slate-700 font-black hover:bg-slate-200"
  >
    + Soru Ekle
  </button>
</div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                Anketi Kaydet
              </button>
            </div>
          </form>

          <form
            onSubmit={handleAssignSurvey}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center">
                <Target size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-950">
                360 Derece Atama
              </h2>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Değerlendirilecek Personel
                </label>
                <select
                  name="hedef_id"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold outline-none"
                >
                  <option value="">Seçiniz...</option>
                  {deptUsers.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.ad} {person.soyad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Değerlendirecek Personel
                </label>
                <select
                  name="degerlendiren_id"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold outline-none"
                >
                  <option value="">Seçiniz...</option>
                  {deptUsers.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.ad} {person.soyad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Kullanılacak Anket
                </label>
                <select
                  name="anket_id"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold outline-none"
                >
                  <option value="">Seçiniz...</option>
                  {myDepartmentSurveys.map((survey) => (
                    <option
                      key={survey.id || survey.anket_id}
                      value={survey.id || survey.anket_id}
                    >
                      {survey.baslik || survey.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-pink-600 text-white font-black hover:bg-pink-700 transition-all shadow-lg shadow-pink-600/20"
              >
                Atamayı Tamamla
              </button>
            </div>
          </form>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <BarChart2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Anket Analizi
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Departman bazlı tamamlanma analizi.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 xl:col-span-3">
  <div className="flex items-center gap-4 mb-6">
    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
      <ClipboardList size={24} />
    </div>

    <div>
      <h2 className="text-xl font-black text-slate-950">
        Oluşturulan Anketi Departmana Ata
      </h2>
      <p className="text-xs font-bold text-slate-400 mt-1">
        Sadece {user?.department} ekibindeki kullanıcılara gider.
      </p>
    </div>
  </div>

  <div className="flex gap-3 border-t border-slate-100 pt-6">
    <select
      value={selectedSurveyId}
      onChange={(e) => setSelectedSurveyId(e.target.value)}
      className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold outline-none"
    >
      <option value="">Anket seçiniz...</option>

      {myDepartmentSurveys.map((survey) => (
        <option
          key={survey.id || survey.anket_id}
          value={survey.id || survey.anket_id}
        >
          {survey.baslik || survey.title}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={handleAssignSurveyToDepartment}
      className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-indigo-600 transition-all"
    >
      Departmana Ata
    </button>
  </div>
</div>

            <div className="border-t border-slate-100 pt-6">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Analiz Edilecek Anket
              </label>

              <select
                value={selectedSurveyAnalysis?.anket_id || selectedSurveyAnalysis?.id || ""}
                onChange={(e) => {
                  const found = myDepartmentSurveys.find(
  (s) =>
    String(s.id || s.anket_id) === String(e.target.value)
);
                  setSelectedSurveyAnalysis(found || null);
                }}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold outline-none"
              >
                <option value="">Anket seçiniz...</option>
                {myDepartmentSurveys.map((survey) => (
                  <option
                    key={survey.id || survey.anket_id}
                    value={survey.id || survey.anket_id}
                  >
                    {survey.baslik || survey.title}
                  </option>
                ))}
              </select>

              {selectedSurveyAnalysis && (
  <div className="mt-8 space-y-5">
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
      <p className="text-emerald-600 text-xs font-black tracking-[2px] mb-2">
        SEÇİLİ ANKET
      </p>
      <h3 className="text-lg font-black text-slate-900">
        {selectedSurveyAnalysis.baslik || selectedSurveyAnalysis.title}
      </h3>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
        <p className="text-indigo-600 text-[10px] font-black uppercase">
          Atama
        </p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          {selectedSurveyAssignments.length}
        </h3>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
        <p className="text-emerald-600 text-[10px] font-black uppercase">
          Tamamlandı
        </p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          {selectedSurveyCompleted}
        </h3>
      </div>
    </div>

    <div>
      <div className="flex justify-between text-xs font-black mb-2">
        <span className="text-slate-400">Tamamlanma Oranı</span>
        <span className="text-emerald-600">%{selectedSurveyRate}</span>
      </div>

      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${selectedSurveyRate}%` }}
        />
      </div>
    </div>

    <p className="text-xs font-black uppercase text-slate-400">
      Anket Cevaplayanlar
    </p>

    {selectedSurveyAssignments.length === 0 ? (
      <p className="text-slate-400 text-sm font-semibold text-center py-6">
        Bu ankete ait tamamlanan 360 değerlendirme yok.
      </p>
    ) : (
      <div className="space-y-3">
        {selectedSurveyAssignments.map((ata) => (
          <button
            key={ata.atama_id}
            type="button"
            onClick={async () => {
  setSelectedPerson360(ata);
  setSurveyAnswerAnalysis(null);

  if (
    ata.durum !== "tamamlandi" &&
    ata.durum !== "Tamamlandı" &&
    ata.durum !== "completed"
  ) {
    return;
  }

  try {
    setSurveyAnswerLoading(true);
    const data = await getDepartmentSurveyAnalysis(ata.atama_id);
    setSurveyAnswerAnalysis(data);
  } catch (err) {
    alert(err.message || "Anket analizi alınamadı.");
  } finally {
    setSurveyAnswerLoading(false);
  }
}}
            className="w-full text-left p-5 rounded-3xl border border-emerald-200 bg-emerald-50 hover:border-emerald-500 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-black text-slate-900">
                  {ata.kullanici_adi || ata.hedef_kullanici || "Personel"}
                </p>

                <p className="text-slate-500 text-sm font-semibold mt-1">
                  Departman: {ata.departman || user?.department}
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-700">
                {ata.durum}
              </span>
            </div>
          </button>
        ))}
      </div>
    )}

    {analysis360Loading && (
      <p className="text-slate-400 font-bold">Analiz yükleniyor...</p>
    )}

    {selectedPerson360 && (
      <div className="bg-slate-950 rounded-[2rem] p-6 text-white">
        <p className="text-emerald-400 text-xs font-black tracking-[3px] mb-3">
          360 ANALİZİ
        </p>

        <h3 className="text-2xl font-black mb-2">
          {selectedPerson360.hedef_kullanici}
        </h3>

        <p className="text-white/60 font-semibold mb-6">
          Bu kişinin değerlendirme özeti
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-white/50 text-xs font-black uppercase">
              Durum
            </p>
            <h4 className="text-xl font-black mt-2">
              {selectedPerson360.durum}
            </h4>
          </div>

          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-white/50 text-xs font-black uppercase">
              Değerlendiren
            </p>
            <h4 className="text-xl font-black mt-2">
              {selectedPerson360.degerlendiren}
            </h4>
          </div>
        </div>

        {surveyAnswerLoading && (
  <p className="text-slate-400 font-bold">Anket analizi yükleniyor...</p>
)}

{surveyAnswerAnalysis && (
  <div className="bg-slate-950 rounded-[2rem] p-6 text-white">
    <p className="text-emerald-400 text-xs font-black tracking-[3px] mb-3">
      ANKET ANALİZİ
    </p>

    <h3 className="text-2xl font-black mb-2">
      {surveyAnswerAnalysis.kullanici_adi}
    </h3>

    <p className="text-white/60 font-semibold mb-6">
      {surveyAnswerAnalysis.anket_adi} değerlendirme özeti
    </p>

    <div className="grid grid-cols-2 gap-4 mb-5">
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
        <p className="text-emerald-300 text-xs font-black uppercase">
          Ortalama Puan
        </p>
        <h4 className="text-3xl font-black text-emerald-300 mt-2">
          {surveyAnswerAnalysis.ortalama_puan || 0} / 5
        </h4>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
        <p className="text-emerald-300 text-xs font-black uppercase">
          Cevap Sayısı
        </p>
        <h4 className="text-3xl font-black text-emerald-300 mt-2">
          {surveyAnswerAnalysis.cevap_sayisi || 0}
        </h4>
      </div>
    </div>

    <div className="bg-white/10 rounded-2xl p-4 mb-5">
      <p className="text-white/50 text-xs font-black uppercase mb-2">
        AI Yorumu
      </p>
      <p className="text-white/80 text-sm font-semibold leading-6">
        {surveyAnswerAnalysis.ai_yorum}
      </p>
    </div>

    <div className="space-y-3">
      {(surveyAnswerAnalysis.cevaplar || []).map((row, index) => (
        <div
          key={index}
          className="bg-white/5 border border-white/10 rounded-2xl p-4"
        >
          <p className="text-white font-black text-sm">
            {index + 1}. {row.soru_metni}
          </p>
          <p className="text-white/60 text-sm mt-2">
            Cevap: {row.cevap || "-"}
          </p>
          <p className="text-emerald-300 text-sm font-black mt-1">
            Puan: {row.puan || "-"}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    )}
  </div>
)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 mt-8">
          <h2 className="text-xl font-black text-slate-950 mb-5">
            Atanan Anketler
          </h2>

          {departmentSurveyAssignments.length === 0 ? (
            <p className="text-slate-400 font-bold">
              Henüz departmana atanmış anket yok.
            </p>
          ) : (
            <div className="space-y-3">
              {departmentSurveyAssignments.map((item, index) => (
                <div
                  key={item.id || item.atama_id || index}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <p className="font-black text-slate-900">
                      {item.baslik ||
                        item.anket_baslik ||
                        item.anket_adi ||
                        item.title ||
                        "Anket"}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      Durum: {item.durum || "bekliyor"}
                    </p>
                  </div>

                  <span className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-black">
                    {user?.department}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )}

    {surveyView === "feedbacks" && (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <MessageCircle size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Departman Geribildirimleri
            </h2>
            <p className="text-slate-500 font-semibold text-sm">
              Sadece {user?.department} ekibinden gelen eğitim geribildirimleri.
            </p>
          </div>
        </div>

        {feedbacks.length === 0 ? (
          <div className="bg-slate-50 rounded-[2rem] p-10 text-center border border-slate-100">
            <p className="text-slate-400 font-black">
              Henüz bu departmandan geribildirim yok.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb, index) => (
              <div
                key={fb.id || index}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-black text-slate-950">
                      Anonim Personel
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {fb.egitim_adi || fb.egitim_baslik || "Eğitim"} • Anonim geribildirim
                    </p>
                  </div>

                  <span className="px-4 py-2 rounded-xl bg-amber-50 text-amber-600 text-xs font-black">
                    {fb.puan || 0}/5
                  </span>
                </div>

                <p className="mt-4 text-slate-600 font-semibold leading-7">
                  {fb.yorum || fb.aciklama || fb.geribildirim || "Yorum yok."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
)}
            </>
          )}
        </div>
      </main>

      {/* MODALLAR */}
      {isMultiAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsMultiAssignModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black mb-2">Seçili {selectedUserIds.length} Kişiye Ata</h2>
            <form className="space-y-6 mt-6" onSubmit={handleMultiAssign}>
              <select required value={selectedMultiTraining} onChange={(e) => setSelectedMultiTraining(e.target.value)} className="w-full p-4 border rounded-xl font-bold outline-none focus:border-emerald-500">
                <option value="" disabled>Eğitim seçin...</option>
                {allTrainings.map(t => <option key={t.id} value={t.id}>{t.title || t.baslik}</option>)}
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsMultiAssignModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl">İptal</button>
                <button type="submit" className="flex-[2] bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-emerald-700">Atamayı Başlat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBulkAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsBulkAssignModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black mb-2">Departmana Toplu Ata</h2>
            <p className="text-sm font-bold text-red-500 mb-6">Hedef: {user.department}</p>
            <form className="space-y-6 mt-6" onSubmit={handleBulkAssign}>
              <select required value={selectedBulkTraining} onChange={(e) => setSelectedBulkTraining(e.target.value)} className="w-full p-4 border rounded-xl font-bold outline-none focus:border-red-500">
                <option value="" disabled>Eğitim seçin...</option>
                {allTrainings.map(t => <option key={t.id} value={t.id}>{t.title || t.baslik}</option>)}
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsBulkAssignModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl">İptal</button>
                <button type="submit" className="flex-[2] bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-slate-800">Atamayı Başlat</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isRecommendModalOpen && selectedPersonnel && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
      onClick={() => setIsRecommendModalOpen(false)}
    />

    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-black text-slate-900 mb-2">
        Eğitim Öner
      </h2>

      <p className="text-slate-500 font-bold mb-6">
        {selectedPersonnel.ad} {selectedPersonnel.soyad} için önerilecek eğitimi seç.
      </p>

      <form onSubmit={handleRecommendTraining} className="space-y-5">
        <select
          required
          value={recommendedTrainingId}
          onChange={(e) => setRecommendedTrainingId(e.target.value)}
          className="w-full p-4 border border-slate-200 rounded-2xl font-bold outline-none focus:border-red-500"
        >
          <option value="">Eğitim seçin...</option>

          {allTrainings.map((t) => (
            <option key={t.id || t.egitim_id} value={t.id || t.egitim_id}>
              {t.title || t.baslik}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsRecommendModalOpen(false)}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl"
          >
            İptal
          </button>

          <button
            type="submit"
            className="flex-[2] bg-red-600 text-white font-black py-4 rounded-2xl hover:bg-red-700"
          >
            Eğitimi Öner
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {isQuizModalOpen && selectedTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsQuizModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black mb-6">Yeni Soru Ekle</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try { await addQuizQuestion(selectedTraining.id, Object.fromEntries(new FormData(e.target))); alert("Eklendi!"); setIsQuizModalOpen(false); } catch (err) { alert("Hata"); }
            }}>
              <textarea name="soru_metni" required rows="3" className="w-full p-4 border rounded-xl mb-4"></textarea>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input name="secenek_a" required className="p-3 border rounded-xl" placeholder="A Şıkkı" />
                <input name="secenek_b" required className="p-3 border rounded-xl" placeholder="B Şıkkı" />
                <input name="secenek_c" required className="p-3 border rounded-xl" placeholder="C Şıkkı" />
                <input name="secenek_d" required className="p-3 border rounded-xl" placeholder="D Şıkkı" />
              </div>
              <select name="dogru_cevap" className="w-full p-3 border rounded-xl mb-4 bg-emerald-50"><option value="A">A Doğru</option><option value="B">B Doğru</option><option value="C">C Doğru</option><option value="D">D Doğru</option></select>
              <div className="flex gap-3">
                 <button type="button" onClick={() => setIsQuizModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl">İptal</button>
                 <button type="submit" className="flex-[2] bg-sky-600 text-white font-black py-3 rounded-xl hover:bg-sky-700">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YENİ VE EKSİKSİZ: PROFİL SLIDE-OVER (YAPAY ZEKA EKLENDİ) */}
      {selectedPersonnel && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
    <div
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      onClick={() => setSelectedPersonnel(null)}
    ></div>

    <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-8 pt-12 relative overflow-hidden">
               <button onClick={() => setSelectedPersonnel(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X size={24}/></button>
               <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">{selectedPersonnel.ad[0]}{selectedPersonnel.soyad[0]}</div>
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedPersonnel.ad} {selectedPersonnel.soyad}</h2>
                  <p className="text-red-400 font-bold text-sm uppercase tracking-widest mt-1">
                     {isMyTeam ? `${selectedPersonnel.departman} • Ekip Üyesi` : `${selectedPersonnel.departman} Personeli`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
               {/* HERKESE AÇIK ROZET VE STREAK ALANI */}
               <div className="flex gap-4 mb-6">
                  <div className={`flex-[2] ${getBadgeInfo(selectedPersonnel.xp).bg} p-4 rounded-2xl border flex-row items-center`}>
                    <div className="mr-3">{getBadgeInfo(selectedPersonnel.xp).icon}</div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mevcut Rozet</p>
                      <p className={`text-lg font-black ${getBadgeInfo(selectedPersonnel.xp).color}`}>{getBadgeInfo(selectedPersonnel.xp).name}</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center justify-center">
                     <Flame className="text-orange-500 mb-1" size={24} />
                     <p className="text-base font-black text-orange-600">{selectedPersonnel.streak || 0} Gün</p>
                  </div>
               </div>
 

               {isMyTeam ? (
  <>
    <button
      type="button"
      onClick={exportSelectedPersonnelReport}
      className="w-full mb-6 flex items-center justify-center gap-2 px-5 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 shadow-lg"
    >
      <Download size={18} />
      CSV Kişi Analiz Raporu İndir
    </button>

    <button
      type="button"
      onClick={() => setIsRecommendModalOpen(true)}
      className="w-full mb-6 flex items-center justify-center gap-2 px-5 py-4 bg-red-600 text-white rounded-2xl text-sm font-black hover:bg-red-700 shadow-lg"
    >
      <BookOpen size={18} />
      Bu Çalışana Eğitim Öner
    </button>

    <div className="bg-sky-900 rounded-3xl p-6 mb-8 shadow-lg shadow-sky-900/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center">
            <Bot size={24} className="text-white" />
          </div>
          <h3 className="text-white font-black text-lg">
            Yapay Zeka Analizi
          </h3>
        </div>

        <button
          type="button"
          onClick={handleAiAnalysis}
          disabled={isAiLoading}
          className="bg-sky-400 text-sky-950 px-4 py-2 rounded-xl text-xs font-black"
        >
          {isAiLoading ? "Analiz..." : "✨ Analiz Et"}
        </button>
      </div>

      <p className="text-sky-100/70 text-sm font-bold leading-6">
        {aiAnalysisResult ||
          'Personelin eğitim karnesini ve performansını yapay zekaya yorumlatmak için "Analiz Et" butonuna tıklayın.'}
      </p>
    </div>
  </>
) : (
  <div className="bg-slate-900 text-white rounded-3xl p-6 mb-8">
    <Shield size={28} className="text-red-400 mb-4" />

    <h3 className="text-xl font-black mb-2">
      KVKK Kapsamında Detaylar Gizli
    </h3>

    <p className="text-slate-400 font-semibold leading-7">
      Bu çalışan farklı bir departmana ait olduğu için eğitim karnesi,
      sertifikaları, analiz raporu, eğitim önerme ve yapay zeka analizi
      görüntülenemez.
    </p>
  </div>
)}

               {/* EĞER PERSONEL KENDİ EKİBİNDEYSE EĞİTİM YÖNETİMİNİ GÖSTER */}
               {isMyTeam ? (
                 <>
                   {personnelCerts.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-widest">Kazanılan Sertifikalar</h3>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {personnelCerts.map((cert, idx) => (
                          <div key={idx} className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl min-w-[160px] flex-shrink-0">
                            <Award size={20} className="text-yellow-600 mb-2" />
                            <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{cert.title}</p>
                            <p className="text-[10px] text-slate-500 mt-2 font-mono">{cert.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                   
                   <div className="flex justify-between items-center mb-6 border-t border-slate-200 pt-6">
                     <h3 className="text-lg font-black text-slate-900">Eğitim Karnesi</h3>
                     <span className="bg-emerald-100 text-emerald-700 font-black text-xs px-3 py-1 rounded-full">%{selectedPersonnel.tamamlanma_orani} Başarı</span>
                   </div>

                   <div className="space-y-3">
                      {personnelTrainings.length === 0 ? (
                        <p className="text-slate-500 text-sm font-medium text-center py-10">Henüz bir eğitim ataması yok.</p>
                      ) : (
                        personnelTrainings.map(egitim => (
                          <div key={egitim.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                             <div className="flex items-center justify-between">
                                <div className="flex-1 pr-2">
                                  <p className={`text-sm font-bold ${egitim.is_completed ? 'text-emerald-700' : 'text-slate-800'}`}>{egitim.title}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {egitim.is_completed ? '✅ Tamamlandı' : egitim.is_assigned ? '⏳ Bekliyor' : 'Kuyrukta Değil'}
                                  </p>
                                </div>
                                
                                {!egitim.is_completed ? (
                                  <button 
                                    onClick={async () => {
                                      try {
                                        if (egitim.is_assigned) await removeTrainingFromUser(selectedPersonnel.id, egitim.id);
                                        else await assignTrainingToUser(selectedPersonnel.id, egitim.id);
                                        const updated = await getUserTrainingStatus(selectedPersonnel.id);
                                        setPersonnelTrainings(updated);
                                        refreshData();
                                      } catch (err) { alert("Hata: " + err.message); }
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${egitim.is_assigned ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-900 text-white shadow-md hover:bg-slate-800'}`}
                                  >
                                    {egitim.is_assigned ? 'Geri Çek' : 'Ata'}
                                  </button>
                                ) : (
  <div className="flex flex-col gap-2">
    
    <button 
      onClick={() =>
        togglePerformanceDetails(
          selectedPersonnel.id,
          egitim.id
        )
      }
      className="flex items-center justify-center gap-1 px-3 py-2 bg-sky-50 text-sky-600 rounded-xl text-xs font-bold hover:bg-sky-100"
    >
      <BarChart2 size={14} />
      Analiz
    </button>

    <button
      onClick={async () => {
        const ok = window.confirm(
          "Bu kullanıcı eğitimi baştan almak zorunda kalacak. Devam edilsin mi?"
        );

        if (!ok) return;

        try {
          await restartTrainingForUser({
            userId: selectedPersonnel.id,

            egitimId:
              egitim.id ||
              egitim.egitim_id,

            baslatanId: user.id,

            neden:
              "Departman yöneticisi tarafından eğitim yeniden başlatıldı.",
          });

          alert(
            "Eğitim başarıyla yeniden başlatıldı."
          );

          const updated =
            await getUserTrainingStatus(
              selectedPersonnel.id
            );

          setPersonnelTrainings(updated);

          refreshData();
        } catch (err) {
          alert(
            err.message ||
              "Eğitim yeniden başlatılamadı."
          );
        }
      }}
      className="px-3 py-2 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-700 transition-all"
    >
      Baştan Aldır
    </button>

  </div>
)}
                             </div>

                             {expandedPerformance[egitim.id] && (
                               <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                 {expandedPerformance[egitim.id].noData ? (
                                    <p className="text-orange-600 text-xs font-bold bg-orange-50 p-3 rounded-xl">⚠️ Detaylı performans verisi bulunamadı.</p>
                                 ) : (
                                   <div className="space-y-4">
  <div className="grid grid-cols-2 gap-3">
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Video Süresi</p>
      <p className="text-sm font-black text-slate-800">
        {expandedPerformance[egitim.id].video_izleme_suresi || expandedPerformance[egitim.id].toplam_izleme_suresi || 0} Dk
      </p>
    </div>

    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Quiz Skoru</p>
      <p className="text-sm font-black text-sky-600">
        %{expandedPerformance[egitim.id].en_yuksek_quiz_puani || 0}
      </p>
    </div>

    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Quiz Deneme</p>
      <p className="text-sm font-black text-slate-800">
        {expandedPerformance[egitim.id].quiz_deneme_sayisi || 0}
      </p>
    </div>

    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Son İzleme</p>
      <p className="text-xs font-black text-slate-800">
        {expandedPerformance[egitim.id].son_izleme_tarihi || expandedPerformance[egitim.id].son_erisim || "-"}
      </p>
    </div>
  </div>

  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
    <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">
      Yönetici Analizi
    </p>
    <p className="text-xs font-bold text-slate-700 leading-relaxed">
      {Number(expandedPerformance[egitim.id].en_yuksek_quiz_puani || 0) >= 85
        ? "Çok güçlü performans. Bilgi kalıcılığı yüksek görünüyor."
        : Number(expandedPerformance[egitim.id].en_yuksek_quiz_puani || 0) >= 70
        ? "Başarılı performans. Kısa tekrarlarla seviye korunabilir."
        : Number(expandedPerformance[egitim.id].en_yuksek_quiz_puani || 0) > 0
        ? "Gelişim alanı var. Quiz tekrarları ve ek kaynak önerilir."
        : "Detaylı quiz verisi sınırlı. Eğitim tekrar kontrol edilebilir."}
    </p>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => exportTrainingAnalysisCsv(egitim)}
      className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700"
    >
      <Download size={14} />
      CSV İndir
    </button>

    <button
      type="button"
      onClick={() => exportTrainingAnalysisPdf(egitim)}
      className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800"
    >
      <Download size={14} />
      PDF İndir
    </button>
  </div>
</div>
                                 )}
                               </div>
                             )}
                          </div>
                        ))
                      )}
                   </div>
                 </>
               ) : (
                 /* EKİBİNDEN DEĞİLSE GİZLİ EKRAN */
                 <div className="mt-6 bg-slate-100 p-8 rounded-3xl items-center border border-slate-200 border-dashed">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                      <Activity size={32} color="#94a3b8" />
                    </div>
                    <p className="text-slate-700 font-extrabold text-lg text-center mb-2">Gizli Profil Verisi</p>
                    <p className="text-slate-500 text-xs text-center leading-5 px-4 font-medium">
                      Gizlilik politikaları gereği, sadece kendi departmanınızdaki personellerin eğitim karnelerini görüntüleyebilir ve yönetebilirsiniz.
                    </p>
                 </div>
               )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = { red: "bg-red-50 text-red-600", emerald: "bg-emerald-50 text-emerald-600", sky: "bg-sky-50 text-sky-600", amber: "bg-amber-50 text-amber-600" };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-44 hover:shadow-xl transition-all">
      <div className={`w-14 h-14 ${colorMap[color]} rounded-2xl flex items-center justify-center shadow-sm`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{value || 0}</p>
      </div>
    </div>
  );
};

export default DeptManagerDashboard;