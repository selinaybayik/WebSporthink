import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Trophy, 
  LogOut, Search, TrendingUp, Award,
  ChevronRight, Plus, X, Medal, Star, BarChart2, Video, 
  ArrowLeft, Flame, Shield, Activity, Megaphone, Send, Layers, CheckSquare, Edit3, Save, HelpCircle, Bot
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  getDashboardStats, getUsersList, getUserTrainingStatus,
  assignTrainingToUser, removeTrainingFromUser, getLeaderboard,
  getCertificates, getPerformanceDetails, getAllTrainings,
  sendNotification, assignTrainingToDepartment, assignTrainingToMultipleUsers,
  getQuizQuestions, getTrainingAnalytics, updateTrainingDescription, addTraining, addQuizQuestion,
  getAIPersonnelAnalysis // YENİ: Yapay Zeka API'si
} from '../services/api';

const DeptManagerDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [selectedPersonnel, setSelectedPersonnel] = useState(null); 
  const [personnelSearch, setPersonnelSearch] = useState('');
  
  // Çoklu Atama ve Toplu Atama State'leri
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isMultiAssignModalOpen, setIsMultiAssignModalOpen] = useState(false);
  const [selectedMultiTraining, setSelectedMultiTraining] = useState('');
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [selectedBulkTraining, setSelectedBulkTraining] = useState('');

  // Akademi State'leri
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDescText, setEditDescText] = useState('');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [trainingQuestions, setTrainingQuestions] = useState([]); 
  const [trainingAnalytics, setTrainingAnalytics] = useState(null);

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
  const [personnelTrainings, setPersonnelTrainings] = useState([]); 
  const [personnelCerts, setPersonnelCerts] = useState([]);
  const [expandedPerformance, setExpandedPerformance] = useState({}); 
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const [statsData, usersData, boardData, trainingsData] = await Promise.all([
          getDashboardStats(user.id), getUsersList(user.role, user.department),
          getLeaderboard(), getAllTrainings()
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
    if(!notifTitle || !notifMessage) return alert("Lütfen başlık ve mesaj alanlarını doldurun!");
    try {
      await sendNotification({ target: user.department, title: notifTitle, message: notifMessage, type: 'duyuru' });
      alert(`${user.department} ekibine bildirim başarıyla iletildi! 🚀`);
      setNotifTitle(''); setNotifMessage('');
    } catch(err) { alert("Hata: Bildirim gönderilemedi."); }
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
      const result = await assignTrainingToDepartment(user.department, selectedBulkTraining);
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

  const handleSelectUser = (id, e) => {
    e.stopPropagation();
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedUserIds(filteredUsers.map(u => u.id));
    else setSelectedUserIds([]);
  };

  const teamChartData = users.slice(0, 8).map(u => ({
    name: `${u.ad} ${u.soyad.charAt(0)}.`,
    basari: Number(u.tamamlanma_orani) || 0
  }));

  const isMyTeam = selectedPersonnel?.departman === user?.department;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl mr-3 shadow-sm">S</div>
          <span className="text-xl font-black uppercase italic tracking-tighter">Sporthink</span>
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
          </button>

          <div className="pt-4 pb-2 px-4"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">İletişim & Oyunlaştırma</p></div>
          <button onClick={() => {setActiveTab('announcements'); setSelectedTraining(null);}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'announcements' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Megaphone size={20} /> Ekip Duyuruları
          </button>
          <button onClick={() => {setActiveTab('leaderboard'); setSelectedTraining(null);}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'leaderboard' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Medal size={20} /> Şirket Sıralaması
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
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Merhaba, {user.name.split(' ')[0]} 👋</h1>
                    <p className="text-slate-500 font-medium">{user.department} ekibinin eğitim ve gelişim özetini aşağıdan görebilirsin.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <StatCard icon={<Users size={24}/>} label="Ekip Mevcudu" value={users.length} color="red" />
                    <StatCard icon={<TrendingUp size={24}/>} label="Ekip Başarı Ort." value={`%${stats?.tamamlanma || 0}`} color="emerald" />
                    <StatCard icon={<Activity size={24}/>} label="Bekleyen Atamalar" value={stats?.devamEden || 0} color="amber" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-2">
                      <h2 className="text-xl font-black text-slate-900 mb-8">Ekip Üyeleri Başarı Dağılımı</h2>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={teamChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="basari" radius={[8, 8, 0, 0]} barSize={40}>
                              {teamChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.basari > 60 ? '#059669' : '#e3342f'} />)}
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
                      <button onClick={() => setActiveTab('personnel')} className="w-full bg-white text-slate-900 font-black py-4 rounded-xl shadow-lg hover:bg-red-50 transition-colors">
                        Ekibini İncele
                      </button>
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
              {activeTab === 'leaderboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Şirket Sıralaması 🏆</h1>
                    <p className="text-slate-500 font-medium">Tüm şirketi görebilirsiniz. Personellere tıklayarak profil durumlarını inceleyebilirsiniz.</p>
                  </div>
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 max-w-4xl">
                    {leaderboard.map((item, index) => {
                      const rank = index + 1;
                      const isMyTeamItem = item.departman === user.department;
                      return (
                        <div key={item.id} onClick={() => openPersonnelProfile(item)} className={`flex items-center justify-between p-4 mb-3 rounded-2xl border ${isMyTeamItem ? 'bg-red-50 border-red-100 hover:border-red-300' : 'bg-slate-50 border-slate-100 hover:border-slate-200 opacity-80'} transition-all cursor-pointer`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 flex justify-center items-center">
                              {rank === 1 ? <Medal size={28} className="text-yellow-500" /> : rank === 2 ? <Medal size={28} className="text-slate-400" /> : rank === 3 ? <Medal size={28} className="text-amber-700" /> : <span className="font-black text-slate-400 text-xl">{rank}</span>}
                            </div>
                            <div>
                              <p className={`font-black ${isMyTeamItem ? 'text-red-900' : 'text-slate-900'} text-lg`}>{item.ad} {item.soyad} {isMyTeamItem && '👤'}</p>
                              <p className="text-xs font-bold text-slate-500">{item.departman}</p>
                            </div>
                          </div>
                          <div className="bg-orange-100 px-4 py-2 rounded-xl"><span className="font-black text-orange-600">{item.xp} XP</span></div>
                        </div>
                      )
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6"><BookOpen size={28} /></div>
                          <h2 className="text-xl font-black text-slate-900 mb-6">Yeni Modül</h2>
                          <form className="space-y-4" onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                               await addTraining({ ...Object.fromEntries(new FormData(e.target)), xp: parseInt(new FormData(e.target).get('xp')) || 50 });
                               alert("Eğitim eklendi!"); e.target.reset(); refreshData(); 
                            } catch(err) { alert("Hata"); }
                          }}>
                            <input name="baslik" required type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" placeholder="Eğitim Adı" />
                            <textarea name="aciklama" rows="3" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold resize-none outline-none" placeholder="Eğitim Açıklaması"></textarea>
                            <div className="grid grid-cols-2 gap-3">
                              <input name="sure" type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" placeholder="Süre" />
                              <input name="xp" type="number" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" placeholder="XP" />
                            </div>
                            <input name="videoUrl" required type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" placeholder="Video URL" />
                            <button type="submit" className="w-full mt-4 bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-red-600 transition-all">Yayınla</button>
                          </form>
                        </div>
                        <div className="lg:col-span-2">
                          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                              <h2 className="text-lg font-black text-slate-900">Mevcut Eğitimler</h2>
                              <span className="font-black text-xs px-3 py-1 rounded-full bg-slate-200 text-slate-600">{allTrainings.length} Eğitim</span>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto max-h-[600px]">
                              {allTrainings.map((training) => (
                                <div key={training.id} onClick={() => setSelectedTraining(training)} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-red-300 hover:shadow-md transition-all cursor-pointer mb-3 group">
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors"><Video size={20} /></div>
                                    <div className="flex-1 pr-4">
                                      <p className="font-bold text-slate-900 line-clamp-1">{training.title || training.baslik}</p>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{training.duration || training.sure}</span>
                                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{training.xp || training.xp_degeri} XP</span>
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight size={20} className="text-slate-300 group-hover:text-red-500" />
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
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPersonnel(null)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
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
                                  <button 
                                    onClick={() => togglePerformanceDetails(selectedPersonnel.id, egitim.id)}
                                    className="flex items-center gap-1 px-3 py-2 bg-sky-50 text-sky-600 rounded-xl text-xs font-bold hover:bg-sky-100"
                                  >
                                    <BarChart2 size={14} /> Analiz
                                  </button>
                                )}
                             </div>

                             {expandedPerformance[egitim.id] && (
                               <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                 {expandedPerformance[egitim.id].noData ? (
                                    <p className="text-orange-600 text-xs font-bold bg-orange-50 p-3 rounded-xl">⚠️ Detaylı performans verisi bulunamadı.</p>
                                 ) : (
                                   <div className="grid grid-cols-2 gap-3">
                                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                       <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Süre</p>
                                       <p className="text-sm font-black text-slate-800">{expandedPerformance[egitim.id].video_izleme_suresi || 0} Dk</p>
                                     </div>
                                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                       <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Quiz Skoru</p>
                                       <p className="text-sm font-black text-sky-600">%{expandedPerformance[egitim.id].en_yuksek_quiz_puani || 0}</p>
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