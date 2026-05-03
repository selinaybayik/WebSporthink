import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Trophy, 
  LogOut, Search, TrendingUp, Award,
  ChevronRight, Download, Plus, X,
  Coffee, Ticket, Map, Gift, CheckCircle, XCircle,
  Building2, Flame, Shield, Activity, ArrowLeft,
  Medal, Star, BarChart2, Video, CheckSquare, HelpCircle,
  Megaphone, Send, Edit3, Save, Workflow, Route, Layers,
  ClipboardList, Target, Bot // YENİ: Bot ikonu eklendi (Faz 3 AI)
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  getDashboardStats, getUsersList, addTraining, addPersonnel,
  getUserTrainingStatus, assignTrainingToUser, removeTrainingFromUser,
  getRewards, getPendingRewardRequests, respondToRewardRequest,
  getLeaderboard, getCertificates, getPerformanceDetails,
  getAllTrainings, getQuizQuestions, addQuizQuestion,
  sendNotification, getTrainingAnalytics, updateTrainingDescription,
  getAutoRules, addAutoRule, getLearningPaths, addLearningPath,
  assignTrainingToDepartment, assignTrainingToMultipleUsers,
  getSurveys, addSurvey, assignSurvey, getSurveyAssignments,
  getAIPersonnelAnalysis,
  restartTrainingForUser,
  sendAdminAnnouncement,
getAdminAnnouncements,
} from '../services/api';
import { useNavigate } from "react-router-dom";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false); 
  
  const [selectedPersonnel, setSelectedPersonnel] = useState(null); 
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [personnelSearch, setPersonnelSearch] = useState('');
  
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isMultiAssignModalOpen, setIsMultiAssignModalOpen] = useState(false);
  const [selectedMultiTraining, setSelectedMultiTraining] = useState('');
  
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [selectedBulkTraining, setSelectedBulkTraining] = useState('');
  const [bulkTargetDept, setBulkTargetDept] = useState('Satış'); 

  const [notifTarget, setNotifTarget] = useState('all');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDescText, setEditDescText] = useState('');
  
  const [autoRules, setAutoRules] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [pathName, setPathName] = useState('');
  const [selectedTrainingsForPath, setSelectedTrainingsForPath] = useState([]); 

  const [surveys, setSurveys] = useState([]);
  const [surveyAssignments, setSurveyAssignments] = useState([]);
  const [newSurveyTitle, setNewSurveyTitle] = useState('');
  const [newSurveyQuestions, setNewSurveyQuestions] = useState(['', '', '']); 

  // YENİ: Yapay Zeka State'leri
  const [aiAnalysisResult, setAiAnalysisResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [rewards, setRewards] = useState([]); 
  const [rewardRequests, setRewardRequests] = useState([]); 
  const [leaderboard, setLeaderboard] = useState([]);
  const [allTrainings, setAllTrainings] = useState([]); 
  const [personnelTrainings, setPersonnelTrainings] = useState([]); 
  const [personnelCerts, setPersonnelCerts] = useState([]);
  const [expandedPerformance, setExpandedPerformance] = useState({}); 
  const [trainingQuestions, setTrainingQuestions] = useState([]); 
  const [trainingAnalytics, setTrainingAnalytics] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [adminAnnouncementTarget, setAdminAnnouncementTarget] = useState("all");
const [adminAnnouncementDept, setAdminAnnouncementDept] = useState("IT");
const [adminAnnouncements, setAdminAnnouncements] = useState([]);

  const refreshData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const [
          statsData, usersData, rewardsData, requestsData, boardData, trainingsData,
          rulesData, pathsData, surveysData, surveyAssignmentsData
        ] = await Promise.all([
          getDashboardStats(user.id), getUsersList(user.role, user.department),
          getRewards(), getPendingRewardRequests(), getLeaderboard(), getAllTrainings(),
          getAutoRules(), getLearningPaths(), getSurveys(), getSurveyAssignments()
        ]);
        setStats(statsData); setUsers(usersData || []); setRewards(rewardsData || []);
        setRewardRequests(requestsData || []); setLeaderboard(boardData || []); 
        setAllTrainings(trainingsData || []);
        setAutoRules(rulesData || []); setLearningPaths(pathsData || []);
        setSurveys(surveysData || []); setSurveyAssignments(surveyAssignmentsData || []);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshData(); }, [user]);

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

  const getRewardIcon = (iconName) => {
    switch (iconName) {
      case 'beach': return <Map size={24} />;
      case 'ticket-confirmation': return <Ticket size={24} />;
      case 'tshirt-crew': return <Gift size={24} />;
      default: return <Coffee size={24} />;
    }
  };
  const loadAdminAnnouncements = async () => {
  if (!user?.id) return;

  try {
    const data = await getAdminAnnouncements(user.id);
    setAdminAnnouncements(Array.isArray(data) ? data : []);
  } catch (err) {
    console.log("Yönetici duyuruları alınamadı:", err.message);
    setAdminAnnouncements([]);
  }
};
useEffect(() => {
  if (user?.id) {
    loadAdminAnnouncements();
  }
}, [user]);

  const getBadgeInfo = (xp) => {
    const safeXp = Number(xp) || 0;
    if (safeXp >= 10000) return { name: "Efsane", color: "text-purple-600", bg: "bg-purple-100", icon: <Award size={24} className="text-purple-600" /> };
    if (safeXp >= 5000) return { name: "Elmas", color: "text-cyan-600", bg: "bg-cyan-100", icon: <Shield size={24} className="text-cyan-600" /> };
    if (safeXp >= 2500) return { name: "Altın", color: "text-yellow-600", bg: "bg-yellow-100", icon: <Trophy size={24} className="text-yellow-600" /> };
    if (safeXp >= 1000) return { name: "Gümüş", color: "text-slate-600", bg: "bg-slate-200", icon: <Medal size={24} className="text-slate-600" /> };
    return { name: "Bronz", color: "text-orange-700", bg: "bg-orange-100", icon: <Star size={24} className="text-orange-600" /> };
  };

  const handleRequestResponse = async (talepId, status) => {
    try { await respondToRewardRequest(talepId, status); refreshData(); } 
    catch (error) { alert("İşlem başarısız: " + error.message); }
  };

  const openPersonnelProfile = async (person) => {
    setSelectedPersonnel(person);
    setExpandedPerformance({}); 
    setAiAnalysisResult(''); // YENİ: Profil değiştiğinde eski AI analizini temizle
    
    const egitimler = await getUserTrainingStatus(person.id);
    const sertifikalar = await getCertificates(person.id);
    setPersonnelTrainings(egitimler || []);
    setPersonnelCerts(sertifikalar || []);
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

  // YENİ: Yapay Zeka Analizini Tetikleme Fonksiyonu
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

  const handleUpdateDescription = async () => {
    try {
      await updateTrainingDescription(selectedTraining.id, editDescText);
      alert("Açıklama başarıyla güncellendi! ✅");
      setIsEditingDesc(false);
      setSelectedTraining({...selectedTraining, aciklama: editDescText, description: editDescText});
      refreshData();
    } catch (error) { alert("Açıklama güncellenemedi."); }
  };

  const handleSendNotificationClick = async () => {
  if (!notifTitle.trim() || !notifMessage.trim()) {
    return alert("Lütfen başlık ve mesaj alanlarını doldurun!");
  }

  try {
    const result = await sendAdminAnnouncement({
      adminId: user?.id,
      hedefKitle: adminAnnouncementTarget,
      departman:
        adminAnnouncementTarget === "department"
          ? adminAnnouncementDept
          : null,
      baslik: notifTitle.trim(),
      mesaj: notifMessage.trim(),
    });

    alert(
      `Duyuru gönderildi. ${result.gonderilen_kisi_sayisi || 0} kişiye ulaştı. 🚀`
    );

    setNotifTitle("");
    setNotifMessage("");

    await loadAdminAnnouncements();
  } catch (err) {
    console.error("Duyuru gönderme hatası:", err);
    alert(err.message || "Duyuru gönderilemedi.");
  }
};

  const handleSaveAutoRule = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      await addAutoRule({ egitimId: data.egitimId, tetikleyiciTur: 'DEPARTMAN', tetikleyiciDeger: data.departman });
      alert("Otomasyon Kuralı Aktif Edildi! 🤖");
      e.target.reset(); refreshData();
    } catch(err) { alert("Hata: " + err.message); }
  };

  const handleSaveLearningPath = async (e) => {
    e.preventDefault();
    if(selectedTrainingsForPath.length === 0) return alert("Lütfen rotaya en az 1 eğitim ekleyin!");
    try {
      await addLearningPath({ yolAdi: pathName, secilenEgitimler: selectedTrainingsForPath });
      alert("Öğrenme rotası başarıyla oluşturuldu! 🗺️");
      setPathName(''); setSelectedTrainingsForPath([]); refreshData();
    } catch(err) { alert("Hata: Rota oluşturulamadı."); }
  };

  const toggleTrainingForPath = (id) => {
    if(selectedTrainingsForPath.includes(id)) setSelectedTrainingsForPath(prev => prev.filter(tid => tid !== id));
    else setSelectedTrainingsForPath(prev => [...prev, id]);
  };

  const handleBulkAssign = async (e) => {
    e.preventDefault();
    if (!selectedBulkTraining) return alert("Lütfen atanacak eğitimi seçin!");
    try {
      const result = await assignTrainingToDepartment(bulkTargetDept, selectedBulkTraining);
      alert(result.message);
      setIsBulkAssignModalOpen(false); setSelectedBulkTraining(''); refreshData(); 
    } catch (err) { alert("Hata: " + err.message); }
  };

  const handleMultiAssign = async (e) => {
    e.preventDefault();
    if (!selectedMultiTraining) return alert("Lütfen atanacak eğitimi seçin!");
    try {
      const result = await assignTrainingToMultipleUsers(selectedUserIds, selectedMultiTraining);
      alert(result.message);
      setIsMultiAssignModalOpen(false); setSelectedMultiTraining(''); setSelectedUserIds([]); refreshData();
    } catch (err) { alert("Hata: " + err.message); }
  };

  const handleSaveSurvey = async (e) => {
    e.preventDefault();
    if (!newSurveyTitle) return alert("Anket başlığı girmelisiniz.");
    try {
      await addSurvey({ baslik: newSurveyTitle, sorular: newSurveyQuestions });
      alert("Anket başarıyla oluşturuldu! 📋");
      setNewSurveyTitle(''); setNewSurveyQuestions(['', '', '']);
      refreshData();
    } catch (err) { alert("Anket oluşturulamadı."); }
  };

  const handleAssignSurvey = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if(data.hedef_id === data.degerlendiren_id) return alert("Bir personel kendini değerlendiremez!");
    
    try {
      await assignSurvey({
        hedef_kullanici_id: data.hedef_id,
        degerlendiren_id: data.degerlendiren_id,
        anket_id: data.anket_id
      });
      alert("Değerlendirme ataması yapıldı! 🎯");
      refreshData();
    } catch(err) { alert("Atama yapılamadı."); }
  };

  const departmentStats = ['Satış', 'IT', 'Pazarlama', 'İnsan Kaynakları', 'Depo Lojistik'].map(dept => {
    const deptUsers = users.filter(u => u.departman === dept);
    if (deptUsers.length === 0) return null;
    const avgCompletion = Math.round(deptUsers.reduce((acc, curr) => acc + (Number(curr.tamamlanma_orani) || 0), 0) / deptUsers.length);
    const totalXP = deptUsers.reduce((acc, curr) => acc + (Number(curr.xp) || 0), 0);
    return { name: dept, count: deptUsers.length, avgCompletion, totalXP };
  }).filter(Boolean).sort((a, b) => b.avgCompletion - a.avgCompletion);

  const filteredUsers = Array.isArray(users) ? users.filter(person => 
    `${person.ad} ${person.soyad}`.toLowerCase().includes(personnelSearch.toLowerCase()) ||
    person.departman.toLowerCase().includes(personnelSearch.toLowerCase())
  ) : [];

  const handleSelectUser = (id, e) => {
    e.stopPropagation();
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedUserIds(filteredUsers.map(u => u.id));
    else setSelectedUserIds([]);
  };

  const handleExportExcel = (deptName) => {
    const deptUsers = users.filter(u => u.departman === deptName);
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Ad Soyad,Departman,Rol,Tamamlanma Orani (%),Toplam XP\r\n";
    deptUsers.forEach(u => {
      const row = `${u.ad} ${u.soyad},${u.departman},${u.rol},${u.tamamlanma_orani},${u.xp || 0}`;
      csvContent += row + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${deptName.replace(/\s+/g, '_')}_Egitim_Raporu.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleExportTrainingReport = (trainingTitle) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Rapor,Egitim Adi,Durum\r\n";
    csvContent += `Genel Analiz,${trainingTitle},Gelistiriliyor\r\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Egitim_Raporu.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl mr-3 shadow-lg">S</div>
          <span className="text-xl font-black tracking-tighter uppercase italic">Sporthink</span>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => {setActiveTab('overview'); setSelectedDepartment(null); setSelectedTraining(null);}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> Sistem Özeti
          </button>
          
          <div className="pt-4 pb-2 px-4"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Organizasyon</p></div>
          <button onClick={() => setActiveTab('personnel')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'personnel' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users size={20} /> Personel Yönetimi
          </button>
          <button onClick={() => setActiveTab('departments')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'departments' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Building2 size={20} /> Departman Analizi
          </button>

          <div className="pt-4 pb-2 px-4"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Akademi & Otopilot</p></div>
          <button onClick={() => setActiveTab('academy')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'academy' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <BookOpen size={20} /> Eğitim Kataloğu
          </button>
          <button onClick={() => setActiveTab('automation')} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'automation' ? 'bg-sky-600 text-white shadow-lg' : 'text-sky-300 hover:bg-slate-800'}`}>
            <div className="flex items-center gap-3"><Workflow size={20} /> Otomasyon Motoru</div>
          </button>

          <div className="pt-4 pb-2 px-4"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Oyunlaştırma & İletişim</p></div>
          <button onClick={() => setActiveTab('surveys')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'surveys' ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-300 hover:bg-slate-800'}`}>
            <ClipboardList size={20} /> Anket Merkezi
          </button>
          <button onClick={() => setActiveTab('leaderboard')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'leaderboard' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Medal size={20} /> Liderlik Tablosu
          </button>
          <button onClick={() => setActiveTab('rewards')} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'rewards' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <div className="flex items-center gap-3"><Trophy size={20} /> Ödül Talepleri</div>
          </button>
          <button onClick={() => setActiveTab('announcements')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'announcements' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Megaphone size={20} /> Duyuru Merkezi
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="mb-4">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">İnsan Kaynakları</p>
            <p className="text-sm font-bold text-slate-300 mt-1">{user.name}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-red-400 hover:bg-red-400/10 rounded-xl font-bold border border-red-400/20">
            <LogOut size={18} /> Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-10 shadow-sm">
          <div className="relative w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Sistem içinde ara..." className="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-red-500 outline-none" />
          </div>
          <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">{user?.name?.charAt(0)}</div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold animate-pulse">Veriler Senkronize Ediliyor...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 mb-8 text-white shadow-xl">
      <div className="absolute right-0 top-0 w-72 h-72 bg-red-600/20 rounded-bl-full" />

      <div className="relative z-10 flex items-start justify-between gap-8">
        <div>
          <p className="text-red-300 font-black tracking-[3px] text-xs mb-3">
            GENEL PERFORMANS PANELİ
          </p>

          <h1 className="text-4xl font-black mb-3">
            Sistem Özeti 📊
          </h1>

          <p className="text-slate-300 font-semibold max-w-2xl leading-7">
            Personel, eğitim tamamlama, XP ve departman performanslarını tek ekrandan takip et.
          </p>
        </div>

        <div className="hidden xl:flex items-center gap-3 bg-white/10 border border-white/10 rounded-3xl px-5 py-4">
          <Activity size={24} className="text-red-300" />
          <div>
            <p className="text-xs font-black text-slate-400 tracking-widest">
              AKTİVİTE
            </p>
            <p className="font-black text-white">Yüksek</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <OverviewCard
        icon={<Users size={24} />}
        label="Aktif Personel"
        value={stats?.aktifPersonel || 0}
        desc="Sisteme kayıtlı aktif çalışan"
        color="red"
      />

      <OverviewCard
        icon={<TrendingUp size={24} />}
        label="Genel Tamamlanma"
        value={`%${stats?.tamamlanma || 0}`}
        desc="Ortalama eğitim tamamlama"
        color="emerald"
      />

      <OverviewCard
        icon={<Award size={24} />}
        label="Toplam XP"
        value={stats?.xp || 0}
        desc="Sistemde kazanılan XP"
        color="sky"
      />

      <OverviewCard
        icon={<Flame size={24} />}
        label="Aktivite"
        value="Yüksek"
        desc="Genel sistem hareketliliği"
        color="amber"
      />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm xl:col-span-2">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-red-600 text-xs font-black tracking-[3px] mb-2">
              DEPARTMAN ANALİZİ
            </p>
            <h2 className="text-2xl font-black text-slate-900">
              Departman Başarı Oranları
            </h2>
          </div>

          <span className="bg-slate-100 text-slate-500 px-4 py-2 rounded-full text-xs font-black">
            {departmentStats.length} Departman
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
                  fontWeight: 700,
                }}
              />
              <Bar dataKey="avgCompletion" radius={[10, 10, 0, 0]} barSize={42}>
                {departmentStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.avgCompletion > 60 ? "#10B981" : "#E30613"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-red-600 text-xs font-black tracking-[3px] mb-3">
            BUGÜNÜN ÖZETİ
          </p>

          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Sistem Durumu
          </h2>

          <div className="space-y-4">
            <SummaryLine
              label="Toplam Personel"
              value={stats?.aktifPersonel || 0}
            />

            <SummaryLine
              label="Ortalama Tamamlanma"
              value={`%${stats?.tamamlanma || 0}`}
            />

            <SummaryLine
              label="Toplam XP"
              value={stats?.xp || 0}
            />
          </div>
        </div>

        <div className="bg-slate-900 p-7 rounded-[2.5rem] text-white shadow-xl">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-5">
            <Trophy size={28} />
          </div>

          <p className="text-slate-400 text-xs font-black tracking-[3px] mb-2">
            EN BAŞARILI DEPARTMAN
          </p>

          <h3 className="text-2xl font-black">
            {departmentStats[0]?.name || "Veri Yok"}
          </h3>

          <p className="text-slate-400 font-semibold mt-2">
            Ortalama başarı oranı{" "}
            <span className="text-red-300 font-black">
              %{departmentStats[0]?.avgCompletion || 0}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
      {departmentStats.map((dept) => (
        <div
          key={dept.name}
          className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <Building2 size={23} />
            </div>

            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-black">
              {dept.count} Personel
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-4">
            {dept.name}
          </h3>

          <div className="flex justify-between text-xs font-black mb-2">
            <span className="text-slate-400">Başarı Oranı</span>
            <span className={dept.avgCompletion > 60 ? "text-emerald-600" : "text-red-600"}>
              %{dept.avgCompletion}
            </span>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={dept.avgCompletion > 60 ? "h-full bg-emerald-500 rounded-full" : "h-full bg-red-500 rounded-full"}
              style={{ width: `${dept.avgCompletion}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)}

              {/* === PERSONEL YÖNETİMİ === */}
              {activeTab === 'personnel' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h1 className="text-3xl font-black text-slate-900 mb-2">Personel Yönetimi</h1>
                      <p className="text-slate-500 font-medium">Tüm ekibin durumunu görün, eğitim atayın ve profillerini inceleyin.</p>
                    </div>
                    <div className="flex gap-3">
                      {selectedUserIds.length > 0 && (
                        <button onClick={() => setIsMultiAssignModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black shadow-lg">
                          <CheckSquare size={18} /> Seçili {selectedUserIds.length} Kişiye Ata
                        </button>
                      )}
                      <button onClick={() => setIsBulkAssignModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-lg">
                        <Layers size={18} /> Departmana Toplu Ata
                      </button>
                      <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl text-sm font-black shadow-lg">
                        <Plus size={18} /> Personel Ekle
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                      <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="İsim veya departman ara..." value={personnelSearch} onChange={(e) => setPersonnelSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" />
                      </div>
                      <span className="text-xs font-black text-slate-400 bg-slate-200 px-3 py-1.5 rounded-full uppercase tracking-widest">{filteredUsers.length} Sonuç</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                          <tr>
                            <th className="px-6 py-5 w-10 text-center">
                              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer" onChange={handleSelectAll} checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length} />
                            </th>
                            <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personel</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Departman</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</th>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Detay</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredUsers.map((person) => (
                            <tr key={person.id} className={`group cursor-pointer transition-all ${selectedUserIds.includes(person.id) ? 'bg-red-50/50' : 'hover:bg-slate-50/80'}`} onClick={() => openPersonnelProfile(person)}>
                              <td className="px-6 py-6 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer" checked={selectedUserIds.includes(person.id)} onChange={(e) => handleSelectUser(person.id, e)} />
                              </td>
                              <td className="px-4 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md">{person.ad[0]}{person.soyad[0]}</div>
                                  <span className="font-black text-slate-900">{person.ad} {person.soyad}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 font-bold text-slate-500 text-sm">{person.departman}</td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4 w-40">
                                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${person.tamamlanma_orani > 50 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${person.tamamlanma_orani}%` }} /></div>
                                  <span className="text-xs font-black text-slate-900">%{person.tamamlanma_orani}</span>
                                </div>
                              </td>
                              <td className="px-10 py-6 text-right"><ChevronRight size={20} className="text-slate-300 ml-auto group-hover:text-red-600" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* === DEPARTMAN ANALİZİ === */}
              {activeTab === 'departments' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  {!selectedDepartment ? (
                    <>
                      <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Departman Analizi 🏢</h1>
                        <p className="text-slate-500 font-medium">Hangi departman önde? Detaylı rapor için kartlara tıklayın.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departmentStats.map((dept, idx) => (
                          <div key={idx} onClick={() => setSelectedDepartment(dept.name)} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:border-red-200 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Building2 size={24} /></div>
                              <span className="bg-slate-100 text-slate-600 font-black text-xs px-3 py-1 rounded-full">{dept.count} Personel</span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-1">{dept.name}</h2>
                            <div className="space-y-4 mt-6">
                              <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                  <span className="text-slate-500">Ortalama Başarı</span>
                                  <span className={dept.avgCompletion > 60 ? 'text-emerald-600' : 'text-red-600'}>%{dept.avgCompletion}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${dept.avgCompletion > 60 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${dept.avgCompletion}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="animate-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => setSelectedDepartment(null)} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-100"><ArrowLeft size={20} /></button>
                        <div>
                          <h1 className="text-3xl font-black text-slate-900">{selectedDepartment} Departmanı</h1>
                        </div>
                        <div className="ml-auto">
                          <button onClick={() => handleExportExcel(selectedDepartment)} className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-black hover:bg-emerald-100 border border-emerald-200">
                            <Download size={18} /> Raporu İndir
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                              <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Personel</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Rol</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Durum</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">XP</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {users.filter(u => u.departman === selectedDepartment).map((person) => (
                                <tr key={person.id} className="hover:bg-slate-50/80 cursor-pointer transition-all" onClick={() => openPersonnelProfile(person)}>
                                  <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md">{person.ad[0]}{person.soyad[0]}</div>
                                      <span className="font-black text-slate-900">{person.ad} {person.soyad}</span>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6 font-bold text-slate-500 text-sm">{person.rol}</td>
                                  <td className="px-8 py-6">
                                    <div className="flex items-center gap-3 w-40">
                                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${person.tamamlanma_orani > 50 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${person.tamamlanma_orani}%` }} />
                                      </div>
                                      <span className="text-xs font-black text-slate-900">%{person.tamamlanma_orani}</span>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6 font-black text-sky-600">{person.xp || 0} XP</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === EĞİTİM KATALOĞU === */}
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
    onClick={() => navigate("/admin/egitim-olustur")}
    className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20"
  >
    Eğitime Git
  </button>
</div>
                        <div className="lg:col-span-2">
                          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                              <h2 className="text-lg font-black text-slate-900">Mevcut Eğitimler</h2>
                              <span className="font-black text-xs px-3 py-1 rounded-full bg-slate-200 text-slate-600">{allTrainings.length} Eğitim</span>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto max-h-[600px]">
                              {allTrainings.map((training) => (
                                <div key={training.id} onClick={() =>
  navigate(`/admin/egitim-detay/${training.id}`, {
    state: {
      egitimId: training.id,
      id: training.id,
      title: training.title || training.baslik,
      egitim: training,
    },
  })
} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-red-300 transition-all cursor-pointer mb-3">
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Video size={20} /></div>
                                    <div className="flex-1 pr-4">
                                      <p className="font-bold text-slate-900">{training.title || training.baslik}</p>
                                      <div className="flex gap-3 mt-1">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{training.duration || training.sure}</span>
                                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{training.xp || training.xp_degeri} XP</span>
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight size={20} className="text-slate-300" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="animate-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => { setSelectedTraining(null); setIsEditingDesc(false); }} className="w-12 h-12 bg-white border rounded-2xl flex items-center justify-center hover:bg-slate-100"><ArrowLeft size={20} /></button>
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
                              {!isEditingDesc ? <p className="text-sm font-medium text-slate-200">{selectedTraining.description || selectedTraining.aciklama}</p> : <textarea className="w-full bg-slate-800 text-white text-sm p-3 rounded-xl outline-none resize-none" rows="4" value={editDescText} onChange={(e) => setEditDescText(e.target.value)} />}
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-2">
                          <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><BarChart2 size={28} className="text-emerald-600" /><h2 className="text-2xl font-black text-slate-800">Eğitim Başarı Analizi</h2></div></div>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                              <div className="bg-slate-50 border px-6 py-4 rounded-2xl"><p className="text-xs font-bold text-slate-400">Atanan Personel</p><p className="text-3xl font-black text-slate-800">{trainingAnalytics?.atanan_personel || 0}</p></div>
                              <div className="bg-emerald-50 border px-6 py-4 rounded-2xl"><p className="text-xs font-bold text-emerald-600">Başarı Oranı</p><p className="text-3xl font-black text-emerald-700">%{trainingAnalytics?.basari_orani || 0}</p></div>
                            </div>
                            <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><CheckSquare size={28} className="text-sky-600" /><h2 className="text-2xl font-black text-slate-800">Sınav Soruları</h2></div><button onClick={() => setIsQuizModalOpen(true)} className="flex items-center gap-2 bg-sky-50 text-sky-700 px-4 py-2 rounded-xl font-bold"><Plus size={18} /> Soru Ekle</button></div>
                            <div className="space-y-4">
                              {trainingQuestions.map((q, idx) => (
                                <div key={idx} className="bg-slate-50 p-5 rounded-2xl border mb-3"><p className="font-bold text-slate-800"><span className="text-sky-600 mr-2">Soru {idx + 1}:</span>{q.soru_metni}</p></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === OTOMASYON MOTORU === */}
              {activeTab === 'automation' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3"><Workflow className="text-sky-600" size={32} /> Otomasyon Motoru</h1>
                    <p className="text-slate-500 font-medium">Sistemdeki manuel yükü sıfırlayın. Otomatik atama kuralları ve birbirine bağlı öğrenme rotaları oluşturun.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col h-[700px]">
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6"><div className="bg-emerald-100 p-3 rounded-xl"><Activity className="text-emerald-600" size={24} /></div><div><h2 className="text-xl font-black text-slate-900">Tetikleyici Kurallar</h2></div></div>
                      <form className="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-200" onSubmit={handleSaveAutoRule}>
                        <div className="space-y-4">
                          <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Eğer Personelin Departmanı Şuyken:</label><select name="departman" required className="w-full px-4 py-3 bg-white border rounded-xl font-bold"><option value="IT">IT</option><option value="Satış">Satış</option><option value="İnsan Kaynakları">İnsan Kaynakları</option></select></div>
                          <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Şu Eğitimi Otomatik Ata:</label><select name="egitimId" required className="w-full px-4 py-3 bg-white border rounded-xl font-bold"><option value="">Eğitim Seçin...</option>{allTrainings.map(t => <option key={t.id} value={t.id}>{t.title || t.baslik}</option>)}</select></div>
                          <button type="submit" className="w-full bg-emerald-600 text-white font-black py-3 rounded-xl hover:bg-emerald-700">Kuralı Aktif Et</button>
                        </div>
                      </form>
                      <div className="flex-1 overflow-y-auto">
                        <p className="text-xs font-black uppercase text-slate-400 mb-3">Çalışan Kurallar</p>
                        {autoRules.map(rule => (
                          <div key={rule.kkural_id} className="flex items-center justify-between p-4 bg-white border border-emerald-200 rounded-xl mb-2"><div><p className="text-xs font-bold text-slate-500 mb-1">Eğer <span className="text-emerald-700 font-black">{rule.tetikleyici_deger}</span> ise:</p><p className="text-sm font-black text-slate-900">{rule.egitim_adi} ata.</p></div></div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col h-[700px]">
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6"><div className="bg-purple-100 p-3 rounded-xl"><Route className="text-purple-600" size={24} /></div><div><h2 className="text-xl font-black text-slate-900">Öğrenme Rotaları</h2></div></div>
                      <form className="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-200" onSubmit={handleSaveLearningPath}>
                        <div className="space-y-4">
                          <input type="text" required value={pathName} onChange={e => setPathName(e.target.value)} placeholder="Rota Adı" className="w-full px-4 py-3 bg-white border rounded-xl font-bold" />
                          <div className="h-32 overflow-y-auto border border-slate-200 rounded-xl bg-white p-2">
                             {allTrainings.map(t => (
                               <div key={t.id} onClick={() => toggleTrainingForPath(t.id)} className={`p-2 rounded-lg text-xs font-bold cursor-pointer ${selectedTrainingsForPath.includes(t.id) ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-50 text-slate-600'}`}>{selectedTrainingsForPath.includes(t.id) && "✅"} {t.title || t.baslik}</div>
                             ))}
                          </div>
                          <button type="submit" className="w-full bg-purple-600 text-white font-black py-3 rounded-xl hover:bg-purple-700">Rotayı Kaydet</button>
                        </div>
                      </form>
                      <div className="flex-1 overflow-y-auto">
                        <p className="text-xs font-black uppercase text-slate-400 mb-3">Kariyer Rotaları</p>
                        {learningPaths.map(path => (
                          <div key={path.yol_id} className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-xl mb-2"><div><p className="text-sm font-black text-slate-900">{path.yol_adi}</p></div></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === YENİ FAZ 2: ANKET MERKEZİ === */}
              {activeTab === 'surveys' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3"><ClipboardList className="text-indigo-600" size={32} /> Anket & 360 Değerlendirme</h1>
                    <p className="text-slate-500 font-medium">Personel anketleri oluşturun ve 360 derece değerlendirme atamaları yapın.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col h-[700px]">
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6">
                        <div className="bg-indigo-100 p-3 rounded-xl"><ClipboardList className="text-indigo-600" size={24} /></div>
                        <div><h2 className="text-xl font-black text-slate-900">Yeni Anket Şablonu</h2></div>
                      </div>
                      <form className="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-200" onSubmit={handleSaveSurvey}>
                        <div className="space-y-4">
                          <input type="text" required value={newSurveyTitle} onChange={e => setNewSurveyTitle(e.target.value)} placeholder="Anket Başlığı (Örn: Yönetici Performans Anketi)" className="w-full px-4 py-3 bg-white border rounded-xl font-bold outline-none focus:border-indigo-500" />
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Anket Soruları</label>
                            {newSurveyQuestions.map((q, index) => (
                              <input 
                                key={index} type="text" placeholder={`Soru ${index + 1}`} value={q}
                                onChange={(e) => {
                                  const updated = [...newSurveyQuestions];
                                  updated[index] = e.target.value;
                                  setNewSurveyQuestions(updated);
                                }}
                                className="w-full px-4 py-3 bg-white border rounded-xl font-medium text-sm outline-none focus:border-indigo-500 mb-2" 
                              />
                            ))}
                            <button type="button" onClick={() => setNewSurveyQuestions([...newSurveyQuestions, ''])} className="text-indigo-600 text-xs font-bold flex items-center gap-1 mt-1">
                              <Plus size={14}/> Soru Ekle
                            </button>
                          </div>
                          <button type="submit" className="w-full bg-indigo-600 text-white font-black py-3 rounded-xl shadow-lg hover:bg-indigo-700">Anketi Kaydet</button>
                        </div>
                      </form>
                      <div className="flex-1 overflow-y-auto">
                        <p className="text-xs font-black uppercase text-slate-400 mb-3">Sistemdeki Aktif Anketler</p>
                        {surveys.map(survey => (
                          <div key={survey.anket_id} className="flex items-center justify-between p-4 bg-white border border-indigo-100 rounded-xl mb-2">
                            <p className="text-sm font-bold text-slate-900">{survey.baslik}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col h-[700px]">
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6">
                        <div className="bg-pink-100 p-3 rounded-xl"><Target className="text-pink-600" size={24} /></div>
                        <div><h2 className="text-xl font-black text-slate-900">360 Derece Atama (Kim Kimi Değerlendirecek?)</h2></div>
                      </div>
                      <form className="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-200" onSubmit={handleAssignSurvey}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Değerlendirilecek Personel (Hedef):</label>
                            <select name="hedef_id" required className="w-full px-4 py-3 bg-white border rounded-xl font-bold text-slate-700 outline-none">
                              <option value="">Seçiniz...</option>
                              {users.map(u => <option key={u.id} value={u.id}>{u.ad} {u.soyad} ({u.departman})</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Değerlendirecek Personel (Hakem):</label>
                            <select name="degerlendiren_id" required className="w-full px-4 py-3 bg-white border rounded-xl font-bold text-slate-700 outline-none">
                              <option value="">Seçiniz...</option>
                              {users.map(u => <option key={u.id} value={u.id}>{u.ad} {u.soyad} ({u.departman})</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kullanılacak Anket:</label>
                            <select name="anket_id" required className="w-full px-4 py-3 bg-white border rounded-xl font-bold text-slate-700 outline-none">
                              <option value="">Seçiniz...</option>
                              {surveys.map(s => <option key={s.anket_id} value={s.anket_id}>{s.baslik}</option>)}
                            </select>
                          </div>
                          <button type="submit" className="w-full bg-pink-600 text-white font-black py-3 rounded-xl hover:bg-pink-700">Atamayı Tamamla</button>
                        </div>
                      </form>
                      <div className="flex-1 overflow-y-auto">
                        <p className="text-xs font-black uppercase text-slate-400 mb-3">Güncel Değerlendirme Görevleri</p>
                        {surveyAssignments.length === 0 ? (
                           <p className="text-slate-400 text-sm font-medium text-center py-5">Henüz anket ataması yapılmamış.</p>
                        ) : (
                          surveyAssignments.map(ata => (
                            <div key={ata.atama_id} className="flex items-center justify-between p-4 bg-white border border-pink-100 rounded-xl mb-2 text-sm">
                              <div>
                                <p className="font-bold text-slate-900">{ata.degerlendiren} <span className="font-normal text-slate-500">değerlendiriyor:</span></p>
                                <p className="font-black text-pink-700">{ata.hedef_kullanici}</p>
                              </div>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{ata.durum}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === LİDERLİK TABLOSU === */}
              {activeTab === 'leaderboard' && (
                <div className="min-h-screen bg-[#F8FAFC] p-10">
  <div className="flex items-center justify-between mb-8">
    <div>
      <p className="text-red-600 text-xs font-black tracking-[3px] mb-2">
        OYUNLAŞTIRMA
      </p>
      <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
        Liderlik Tablosu 🏆
      </h1>
      <p className="text-slate-500 font-semibold mt-2">
        En yüksek XP’ye sahip kullanıcıları görüntüle.
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-6">
      <div className="space-y-4">
        {leaderboard.map((item, index) => {
          const rank = index + 1;

          const rankStyle =
            rank === 1
              ? "bg-yellow-100 text-yellow-600"
              : rank === 2
              ? "bg-slate-200 text-slate-600"
              : rank === 3
              ? "bg-orange-100 text-orange-600"
              : "bg-slate-100 text-slate-400";

          return (
            <div
              key={item.id}
              className={`flex items-center gap-5 p-5 rounded-[1.7rem] border transition hover:-translate-y-1 hover:shadow-md ${
                rank === 1
                  ? "bg-gradient-to-r from-yellow-50 to-white border-yellow-200"
                  : rank === 2
                  ? "bg-gradient-to-r from-slate-50 to-white border-slate-200"
                  : rank === 3
                  ? "bg-gradient-to-r from-orange-50 to-white border-orange-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${rankStyle}`}
              >
                {rank <= 3 ? "🏆" : rank}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-950">
                  {item.ad} {item.soyad}
                </h3>
                <p className="text-slate-400 font-black text-xs tracking-widest mt-1">
                  {item.departman || "Departman Yok"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-red-600">
                  {item.xp || 0}
                </p>
                <p className="text-slate-400 text-xs font-black">XP</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="space-y-5">
      <div className="bg-slate-950 text-white rounded-[2.5rem] p-7 shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-red-600 flex items-center justify-center text-3xl mb-5">
          🏆
        </div>

        <p className="text-red-300 text-xs font-black tracking-[3px] mb-2">
          ZİRVEDEKİ KİŞİ
        </p>

        <h2 className="text-2xl font-black">
          {leaderboard[0]?.ad} {leaderboard[0]?.soyad}
        </h2>

        <p className="text-slate-400 font-semibold mt-2">
          {leaderboard[0]?.departman}
        </p>

        <div className="mt-6 bg-white/10 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-black tracking-widest">
            TOPLAM XP
          </p>
          <p className="text-3xl font-black text-red-300 mt-1">
            {leaderboard[0]?.xp || 0}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <p className="text-slate-400 text-xs font-black tracking-[3px] mb-2">
          SIRALAMA ÖZETİ
        </p>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between bg-slate-50 rounded-2xl px-4 py-3">
            <span className="font-bold text-slate-500">Toplam kişi</span>
            <span className="font-black text-slate-900">{leaderboard.length}</span>
          </div>

          <div className="flex justify-between bg-slate-50 rounded-2xl px-4 py-3">
            <span className="font-bold text-slate-500">En yüksek XP</span>
            <span className="font-black text-red-600">
              {leaderboard[0]?.xp || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
              )}

              {/* === ÖDÜLLER === */}
              {activeTab === 'rewards' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h1 className="text-3xl font-black text-slate-900 mb-8">Ödül Pazarı & Talepler 🎁</h1>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl mb-6">
                        <h2 className="text-xl font-black mb-6">Pazar Kataloğu</h2>
                        <div className="space-y-3">
                          {rewards.map((reward) => (
                            <div key={reward.id} className="bg-slate-800 p-4 rounded-2xl flex items-center justify-between">
                              <span className="font-bold text-sm">{reward.title}</span>
                              <span className="text-yellow-500 font-black text-xs">{reward.price} Coin</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border shadow-sm p-8">
                      <h2 className="text-lg font-black text-slate-900 mb-6">Bekleyen Talepler</h2>
                      <div className="space-y-4">
                        {rewardRequests.map((talep) => (
                          <div key={talep.id} className="flex items-center justify-between p-5 bg-white border rounded-2xl">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black">{talep.kullanici_ad?.[0] || '?'}</div>
                              <div>
                                <p className="font-bold text-slate-900">{talep.kullanici_ad} {talep.kullanici_soyad}</p>
                                <p className="text-sm font-black text-sky-600 mt-0.5">{talep.odul_adi}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleRequestResponse(talep.id, 'approved')} className="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-xl">Onayla</button>
                              <button onClick={() => handleRequestResponse(talep.id, 'rejected')} className="px-4 py-2 bg-slate-50 text-slate-500 font-bold text-xs rounded-xl">Reddet</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === DUYURULAR === */}
              {activeTab === 'announcements' && (
                <div className="min-h-screen bg-[#F8FAFC] p-10">
  <div className="max-w-7xl mx-auto">
    <div className="flex items-start justify-between mb-8">
      <div>
        <p className="text-red-600 text-xs font-black tracking-[3px] mb-2">
          İLETİŞİM MERKEZİ
        </p>

        <h1 className="text-5xl font-black text-slate-950 flex items-center gap-3">
          Duyuru Merkezi 📢
        </h1>

        <p className="text-slate-500 font-semibold mt-3 leading-7 max-w-2xl">
          Kurum içi duyuruları hızlıca oluştur, belirli departmanlara gönder ve çalışan etkileşimini yönet.
        </p>
      </div>

      <div className="hidden xl:flex bg-white border border-slate-200 rounded-[2rem] px-6 py-5 shadow-sm items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl">
          🔔
        </div>

        <div>
          <p className="text-slate-400 text-xs font-black tracking-widest">
            AKTİF DUYURU
          </p>

          <h3 className="text-3xl font-black text-slate-950">
            12
          </h3>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-black tracking-[3px] text-slate-400 mb-3">
              HEDEF KİTLE
            </label>

            <select
  value={adminAnnouncementTarget}
  onChange={(e) => setAdminAnnouncementTarget(e.target.value)}
  className="w-full h-16 rounded-2xl border border-slate-200 bg-slate-50 px-5 font-black text-slate-900 outline-none focus:border-red-500 transition"
>
  <option value="all">Tüm Şirket</option>
  <option value="department">Departman</option>
</select>

{adminAnnouncementTarget === "department" && (
  <select
    value={adminAnnouncementDept}
    onChange={(e) => setAdminAnnouncementDept(e.target.value)}
    className="mt-4 w-full h-16 rounded-2xl border border-slate-200 bg-slate-50 px-5 font-black text-slate-900 outline-none focus:border-red-500 transition"
  >
    <option value="IT">IT</option>
    <option value="İnsan Kaynakları">İnsan Kaynakları</option>
    <option value="Satış">Satış</option>
    <option value="Pazarlama">Pazarlama</option>
    <option value="Depo Lojistik">Depo Lojistik</option>
  </select>
)}
          </div>

          <div>
            <label className="block text-xs font-black tracking-[3px] text-slate-400 mb-3">
              DUYURU TÜRÜ
            </label>

            <select className="w-full h-16 rounded-2xl border border-slate-200 bg-slate-50 px-5 font-black text-slate-900 outline-none focus:border-red-500 transition">
              <option>Genel Duyuru</option>
              <option>Acil Bildirim</option>
              <option>Eğitim Duyurusu</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-black tracking-[3px] text-slate-400 mb-3">
            BAŞLIK
          </label>

         <input
  type="text"
  value={notifTitle}
  onChange={(e) => setNotifTitle(e.target.value)}
  placeholder="Duyuru başlığını gir."
  className="w-full h-16 rounded-2xl border border-slate-200 bg-slate-50 px-5 font-bold text-slate-900 outline-none focus:border-red-500 transition"
/>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-black tracking-[3px] text-slate-400 mb-3">
            MESAJ
          </label>

         <textarea
  rows={7}
  value={notifMessage}
  onChange={(e) => setNotifMessage(e.target.value)}
  placeholder="Duyuru mesajını yaz."
  className="w-full rounded-[2rem] border border-slate-200 bg-slate-50 p-5 font-semibold text-slate-700 outline-none resize-none focus:border-red-500 transition"
/>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              ✉️
            </div>

            <div>
              <p className="text-xs font-black text-slate-400 tracking-widest">
                GÖNDERİM
              </p>

              <p className="font-black text-slate-900">
                Mobil + Web Bildirimi
              </p>
            </div>
          </div>

          <button
  type="button"
  onClick={handleSendNotificationClick}
  className="flex-1 md:flex-none md:w-[280px] h-16 rounded-2xl bg-red-600 hover:bg-red-700 transition-all text-white font-black text-lg shadow-xl shadow-red-600/20"
>
  Duyuruyu Gönder
</button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-slate-950 text-white rounded-[2.5rem] p-7 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-red-600 flex items-center justify-center text-3xl mb-5">
            📢
          </div>

          <p className="text-red-300 text-xs font-black tracking-[3px] mb-2">
            DUYURU İPUCU
          </p>

          <h2 className="text-2xl font-black mb-4">
            Kısa ve net başlıklar kullan
          </h2>

          <p className="text-slate-400 leading-7 font-semibold">
            Çalışan etkileşimini artırmak için duyuru başlığını kısa, mesajı ise net tut.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <p className="text-slate-400 text-xs font-black tracking-[3px] mb-5">
            SON GÖNDERİMLER
          </p>

          <div className="space-y-4">
  {adminAnnouncements.length === 0 ? (
    <p className="text-sm font-bold text-slate-400">
      Henüz gönderilmiş duyuru yok.
    </p>
  ) : (
    adminAnnouncements.slice(0, 5).map((item) => (
      <div
        key={item.id || item.duyuru_id}
        className="bg-slate-50 rounded-2xl p-4"
      >
        <p className="font-black text-slate-900">
          {item.baslik || item.title}
        </p>

        <p className="text-sm text-slate-400 mt-1">
          {item.hedef_kitle || item.hedefKitle || "Duyuru"} · Gönderildi
        </p>
      </div>
    ))
  )}
</div>
        </div>
      </div>
    </div>
  </div>
</div>
              )}
            </>
          )}
        </div>
      </main>

      {/* === MODALLAR === */}
      {isMultiAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70" onClick={() => setIsMultiAssignModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8">
            <h2 className="text-xl font-black mb-2">Seçili {selectedUserIds.length} Kişiye Ata</h2>
            <form className="space-y-6 mt-6" onSubmit={handleMultiAssign}>
              <select required value={selectedMultiTraining} onChange={(e) => setSelectedMultiTraining(e.target.value)} className="w-full p-4 border rounded-xl font-bold">
                <option value="" disabled>Eğitim seçin...</option>
                {allTrainings.map(t => <option key={t.id} value={t.id}>{t.title || t.baslik}</option>)}
              </select>
              <button type="submit" className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg">Atamayı Başlat</button>
            </form>
          </div>
        </div>
      )}

      {isBulkAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70" onClick={() => setIsBulkAssignModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8">
            <h2 className="text-xl font-black mb-2">Departmana Toplu Ata</h2>
            <form className="space-y-6 mt-6" onSubmit={handleBulkAssign}>
              <select required value={bulkTargetDept} onChange={(e) => setBulkTargetDept(e.target.value)} className="w-full p-4 border rounded-xl font-bold mb-4">
                <option value="Satış">Satış</option>
                <option value="IT">IT</option>
                <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                <option value="Depo Lojistik">Depo Lojistik</option>
                <option value="Pazarlama">Pazarlama</option>
              </select>
              <select required value={selectedBulkTraining} onChange={(e) => setSelectedBulkTraining(e.target.value)} className="w-full p-4 border rounded-xl font-bold">
                <option value="" disabled>Eğitim seçin...</option>
                {allTrainings.map(t => <option key={t.id} value={t.id}>{t.title || t.baslik}</option>)}
              </select>
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg">Atamayı Başlat</button>
            </form>
          </div>
        </div>
      )}

      {isQuizModalOpen && selectedTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70" onClick={() => setIsQuizModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8">
            <h2 className="text-xl font-black mb-6">Yeni Soru Ekle</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try { await addQuizQuestion(selectedTraining.id, Object.fromEntries(new FormData(e.target))); alert("Eklendi!"); setIsQuizModalOpen(false); } catch (err) { alert("Hata"); }
            }}>
              <textarea name="soru_metni" required rows="3" className="w-full p-4 border rounded-xl mb-4"></textarea>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input name="secenek_a" required className="p-3 border rounded-xl" placeholder="A" />
                <input name="secenek_b" required className="p-3 border rounded-xl" placeholder="B" />
                <input name="secenek_c" required className="p-3 border rounded-xl" placeholder="C" />
                <input name="secenek_d" required className="p-3 border rounded-xl" placeholder="D" />
              </div>
              <select name="dogru_cevap" className="w-full p-3 border rounded-xl mb-4 bg-emerald-50"><option value="A">A Doğru</option><option value="B">B Doğru</option></select>
              <button type="submit" className="w-full bg-sky-600 text-white font-black py-3 rounded-xl">Kaydet</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] p-8">
            <h2 className="text-xl font-black mb-6">Yeni Personel Tanımla</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try { await addPersonnel({ ...Object.fromEntries(new FormData(e.target)), sifre: '123456' }); alert("Eklendi!"); setIsModalOpen(false); refreshData(); } catch (err) { alert("Hata"); }
            }}>
              <div className="grid grid-cols-2 gap-5 mb-4">
                <input name="ad" required className="p-3 border rounded-xl" placeholder="Ad" />
                <input name="soyad" required className="p-3 border rounded-xl" placeholder="Soyad" />
              </div>
              <input name="email" required type="email" className="w-full p-3 border rounded-xl mb-4" placeholder="E-posta" />
              <div className="grid grid-cols-2 gap-5 mb-4">
                <select name="departman" className="p-3 border rounded-xl"><option value="Satış">Satış</option><option value="IT">IT</option></select>
                <select name="rol" className="p-3 border rounded-xl"><option value="Çalışan">Çalışan</option></select>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white font-black py-4 rounded-xl">Kaydet</button>
            </form>
          </div>
        </div>
      )}

      {/* === PROFİL DETAYI SLIDE-OVER (YAPAY ZEKA EKLENDİ) === */}
      {selectedPersonnel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSelectedPersonnel(null)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="bg-slate-900 p-8 pt-12 relative overflow-hidden">
               <button onClick={() => setSelectedPersonnel(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X size={24}/></button>
               <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl">{selectedPersonnel.ad[0]}{selectedPersonnel.soyad[0]}</div>
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedPersonnel.ad} {selectedPersonnel.soyad}</h2>
                  <p className="text-red-400 font-bold text-sm tracking-widest uppercase mt-1">{selectedPersonnel.departman}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              <div className="flex gap-4 mb-6">
                <div className={`flex-[2] ${getBadgeInfo(selectedPersonnel.xp || 0).bg} p-4 rounded-2xl border flex-row items-center`}>
                  <div className="mr-3">{getBadgeInfo(selectedPersonnel.xp || 0).icon}</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Mevcut Rozet</p>
                    <p className={`text-lg font-black ${getBadgeInfo(selectedPersonnel.xp || 0).color}`}>{getBadgeInfo(selectedPersonnel.xp || 0).name}</p>
                  </div>
                </div>
                <div className="flex-1 bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center justify-center">
                   <Flame className="text-orange-500 mb-1" size={24} />
                   <p className="text-base font-black text-orange-600">{selectedPersonnel.streak || 0} Gün</p>
                </div>
              </div>

              {/* YENİ: YAPAY ZEKA ASİSTANI KUTUSU */}
              <div className="bg-sky-900 rounded-3xl p-6 mb-8 shadow-lg shadow-sky-900/20 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
                 <div className="flex justify-between items-center relative z-10 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-sky-500 p-2 rounded-xl text-white"><Bot size={20} /></div>
                      <h3 className="font-black text-white text-lg">Yapay Zeka Analizi</h3>
                    </div>
                    {!aiAnalysisResult && !isAiLoading && (
                      <button onClick={handleAiAnalysis} className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-black rounded-xl transition-all shadow-md">
                        ✨ Analiz Et
                      </button>
                    )}
                 </div>
                 
                 <div className="relative z-10">
                   {isAiLoading && (
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 border-2 border-sky-200 border-t-white rounded-full animate-spin"></div>
                       <p className="text-sky-200 text-sm font-medium animate-pulse">Gemini AI {selectedPersonnel.ad} adlı personeli inceliyor...</p>
                     </div>
                   )}
                   {aiAnalysisResult && (
                     <div className="bg-slate-900/50 p-4 rounded-2xl border border-sky-800">
                       <p className="text-sky-50 text-sm leading-relaxed font-medium whitespace-pre-wrap">{aiAnalysisResult}</p>
                     </div>
                   )}
                   {!isAiLoading && !aiAnalysisResult && (
                     <p className="text-sky-200/60 text-xs font-medium">Personelin eğitim karnesini ve performansını yapay zekaya yorumlatmak için "Analiz Et" butonuna tıklayın.</p>
                   )}
                 </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-lg">Eğitim Atamaları</h3>
                {personnelTrainings.map((egitim) => (
                  <div key={egitim.id} className="bg-white p-5 rounded-2xl border shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm">{egitim.title}</p>
                      {!egitim.is_completed ? (
  <button
    onClick={async () => {
      if (egitim.is_assigned) {
        await removeTrainingFromUser(selectedPersonnel.id, egitim.id);
      } else {
        await assignTrainingToUser(selectedPersonnel.id, egitim.id);
      }

      setPersonnelTrainings(
        await getUserTrainingStatus(selectedPersonnel.id)
      );
    }}
    className={`px-3 py-1.5 rounded-xl text-xs font-black ${
      egitim.is_assigned
        ? "bg-red-50 text-red-600"
        : "bg-slate-900 text-white"
    }`}
  >
    {egitim.is_assigned ? "Geri Çek" : "Ata"}
  </button>
) : (
  <div className="flex flex-col items-end gap-2">
    <span className="text-xs font-black text-emerald-600">
      Tamamlandı
    </span>

    <button
      onClick={async () => {
        const ok = window.confirm(
          "Bu kullanıcı eğitimi baştan almak zorunda kalacak. Devam edilsin mi?"
        );

        if (!ok) return;

        try {
          await restartTrainingForUser({
            userId: selectedPersonnel.id,
            egitimId: egitim.id || egitim.egitim_id,
            baslatanId: user.id,
            neden: "IK/Yönetici tarafından eğitim yeniden başlatıldı.",
          });

          alert("Eğitim başarıyla yeniden başlatıldı.");

          setPersonnelTrainings(
            await getUserTrainingStatus(selectedPersonnel.id)
          );
        } catch (err) {
          alert(err.message || "Eğitim yeniden başlatılamadı.");
        }
      }}
      className="px-3 py-1.5 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-700 transition"
    >
      Baştan Aldır
    </button>
  </div>
)}
                    </div>
                  </div>
                ))}
              </div>
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
    <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col justify-between h-44 hover:shadow-xl transition-all">
      <div className={`w-14 h-14 ${colorMap[color]} rounded-2xl flex items-center justify-center shadow-sm`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{value || 0}</p>
      </div>
    </div>
  );
};

function OverviewCard({ icon, label, value, desc, color }) {
  const colors = {
    red: "bg-red-50 text-red-600",
    emerald: "bg-emerald-50 text-emerald-600",
    sky: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-500",
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${colors[color]}`}>
        {icon}
      </div>

      <p className="text-slate-400 text-xs font-black tracking-[3px] uppercase">
        {label}
      </p>

      <h2 className="text-3xl font-black text-slate-900 mt-2">
        {value}
      </h2>

      <p className="text-slate-400 text-sm font-semibold mt-2">
        {desc}
      </p>
    </div>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-4">
      <span className="text-slate-500 font-bold text-sm">
        {label}
      </span>

      <span className="text-slate-900 font-black">
        {value}
      </span>
    </div>
  );
}

export default AdminDashboard;