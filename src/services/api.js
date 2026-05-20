// src/services/api.js

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000"; // Web Backend Sunucusu

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getDashboardStats = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/dashboard/${userId}`);
    return await response.json();
  } catch (error) { return null; }
};

export const getUsersList = async (role, department) => {
  try {
    const response = await fetch(`${BASE_URL}/api/kullanicilar`);
    const data = await response.json();
    if (role === 'IK_YONETICI') return data; 
    return data.filter(u => u.departman === department); 
  } catch (error) { return []; }
};

export const addPersonnel = async (personelData) => {
  const response = await fetch(`${BASE_URL}/api/admin/personel-ekle`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(personelData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const addTraining = async (trainingData) => {
  const response = await fetch(`${BASE_URL}/api/admin/egitim-ekle`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trainingData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getUserTrainingStatus = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/kullanici-egitim-durumu/${userId}`);
    return await response.json();
  } catch (error) { return []; }
};

export const assignTrainingToUser = async (userId, egitimId, atayanId) => {
  const response = await fetch(`${BASE_URL}/api/admin/egitim-ata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, egitimId, atayanId }),
  });

  return await response.json();
};

export const removeTrainingFromUser = async (userId, egitimId) => {
  const response = await fetch(`${BASE_URL}/api/admin/egitim-kaldir`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, egitimId }),
  });
  return await response.json();
};

export const getRewards = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/oduller`);
    return await response.json();
  } catch (error) { return []; }
};

export const getPendingRewardRequests = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/odul-talepleri`);
    return await response.json();
  } catch (error) { return []; }
};

export const respondToRewardRequest = async (talepId, status) => {
  const response = await fetch(`${BASE_URL}/api/admin/odul-talep-yanit`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ talepId, status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/liderlik`);
    return await response.json();
  } catch (error) { return []; }
};

export const getCertificates = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/sertifikalar/${userId}`);
    return await response.json();
  } catch (error) { return []; }
};

export const getPerformanceDetails = async (userId, egitimId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/egitim-performans/${userId}/${egitimId}`);
    return await response.json();
  } catch (error) { return null; }
};

export const getTrainings = async (roleOrId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/egitimler/${roleOrId}`);
    return await response.json();
  } catch (error) { return []; }
};

export const addQuizQuestion = async (egitimId, questionData) => {
  const response = await fetch(`${BASE_URL}/api/admin/quiz-ekle`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ egitimId, ...questionData }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getQuizQuestions = async (egitimId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/quiz/${egitimId}`);
    return await response.json();
  } catch (error) { return []; }
};

export const sendNotification = async (notificationData) => {
  const response = await fetch(`${BASE_URL}/api/admin/bildirim-gonder`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getWeeklyTrend = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/haftalik-trend`);
    return await response.json();
  } catch (error) { return []; }
};

export const getTrainingAnalytics = async (egitimId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/egitim-analiz/${egitimId}`);
    return await response.json();
  } catch (error) { return null; }
};

export const getAllTrainings = async (userId, role, department) => {
  try {
    const params = new URLSearchParams({
      userId: String(userId || ""),
      role: String(role || ""),
      department: String(department || ""),
    });

    const response = await fetch(`${BASE_URL}/api/egitimler?${params.toString()}`);
    const data = await response.json();

    return data.map(item => ({
      ...item,
      id: item.egitim_id || item.id,
      title: item.baslik || item.title,
      description: item.aciklama || item.description,
      duration: item.sure || item.duration,
      xp: item.xp_degeri || item.xp
    }));
  } catch (error) {
    return [];
  }
};

export const updateTrainingDescription = async (egitimId, aciklama) => {
  const response = await fetch(`${BASE_URL}/api/admin/egitim-guncelle`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ egitimId, aciklama }),
  });
  return await response.json();
};

// FAZ 1: OTOMASYON MOTORU API ÇAĞRILARI
export const getAutoRules = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/atama-kurallari`);
    return await response.json();
  } catch (error) { return []; }
};

export const addAutoRule = async (ruleData) => {
  const response = await fetch(`${BASE_URL}/api/admin/atama-kurali-ekle`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ruleData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getLearningPaths = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/ogrenme-yollari`);
    return await response.json();
  } catch (error) { return []; }
};

export const addLearningPath = async (pathData) => {
  const response = await fetch(`${BASE_URL}/api/admin/ogrenme-yolu-ekle`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pathData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

// YÖNETİCİ: Tüm Departmana Toplu Eğitim Ata
export const assignTrainingToDepartment = async (departman, egitimId, atayanId) => {
  const response = await fetch(`${BASE_URL}/api/admin/toplu-ata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ departman, egitimId, atayanId }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

// YÖNETİCİ: Seçili Kişilere Çoklu Eğitim Ata
export const assignTrainingToMultipleUsers = async (userIds, egitimId, atayanId) => {
  const response = await fetch(`${BASE_URL}/api/admin/coklu-ata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userIds, egitimId, atayanId }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

// FAZ 2: ANKET VE 360 DERECE DEĞERLENDİRME API'LERİ
export const getSurveys = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/anketler`);
    return await response.json();
  } catch (error) { return []; }
};

export const addSurvey = async (surveyData) => {
  const response = await fetch(`${BASE_URL}/api/admin/anket-ekle`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(surveyData),
  });
  return await response.json();
};

export const assignSurvey = async (assignData) => {
  const response = await fetch(`${BASE_URL}/api/admin/anket-ata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Anket atanamadı.");
  }

  return data;
};

export const getSurveyAssignments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/anket-atamalari`);
    return await response.json();
  } catch (error) { return []; }
};

// YÖNETİCİ ASİSTANI: Personel Profilini Yapay Zekaya Analiz Ettir
export const getAIPersonnelAnalysis = async (analysisData) => {
  const response = await fetch(`${BASE_URL}/api/admin/ai-personel-analiz`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(analysisData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
// KULLANICI - Ana sayfa verileri
export const getUserHome = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/home/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ana sayfa verileri alınamadı.");
    }

    return data;
  } catch (error) {
    console.error("User Home API Hatası:", error);
    return null;
  }
};
export const getTrainingCatalog = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/egitim-katalog/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Eğitim katalog API hatası:", error);
    return [];
  }
};

export const startTraining = async (userId, egitimId) => {
  const response = await fetch(`${BASE_URL}/api/egitime-basla`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, egitimId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Eğitime başlanamadı.");
  }

  return data;
};

export const getTrainingAISuggestion = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/egitim-ai-oneri/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("AI öneri API hatası:", error);
    return null;
  }
};
export const getTrainingDetail = async (egitimId, userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/egitim/${egitimId}?userId=${userId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Eğitim detayı alınamadı.");
    }

    return data;
  } catch (error) {
    console.error("Eğitim Detay API Hatası:", error);
    return null;
  }
};

export const completeModule = async (userId, egitimId, icerikId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/modul-tamamla`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        egitimId,
        icerikId,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Modül Tamamlama API Hatası:", error);
    throw error;
  }
};
export const getLessonDetail = async (egitimId, moduleId, userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/ders/${egitimId}/${moduleId}?userId=${userId}`
    );

    return await response.json();
  } catch (error) {
    console.error("Ders Detay API Hatası:", error);
    return null;
  }
};

export const submitLessonQuizResult = async (
  userId,
  egitimId,
  dogruSayisi,
  toplamSoru
) => {
  const response = await fetch(`${BASE_URL}/api/quiz-sonuc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      egitimId,
      dogruSayisi,
      toplamSoru,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Quiz sonucu kaydedilemedi.");
  }

  return data;
};

export const saveVideoLog = async ({
  kayitId,
  icerikId,
  izlenenSaniye,
  sonKaldigiSaniye,
  geriSarmaSayisi,
  ileriSarmaSayisi,
}) => {
  const response = await fetch(`${BASE_URL}/api/video-log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kayitId,
      icerikId,
      izlenenSaniye,
      sonKaldigiSaniye,
      geriSarmaSayisi,
      ileriSarmaSayisi,
    }),
  });

  return await response.json();
};
// KULLANICI - Yol Haritası
export const getRoadmap = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/yol-haritasi/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Yol haritası alınamadı.");
    }

    return data;
  } catch (error) {
    console.error("Yol Haritası API Hatası:", error);
    return {
      assignments: [],
      roadmap: [],
      aiText: "Kariyer hedefine uygun yeni bir adım eklememi ister misin?",
    };
  }
};
export const getLiderlik = async () => {
  const response = await fetch(`${BASE_URL}/api/mobile/liderlik`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Liderlik alınamadı.");
  }

  return data;
};

export const getPublicUserProfile = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/user/public/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Kullanıcı profili alınamadı.");
  }

  return data;
};
export const getOduller = async () => {
  const response = await fetch(`${BASE_URL}/api/oduller`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Ödüller alınamadı.");
  }

  return data;
};

export const createOdulTalep = async ({ userId, odulId, fiyat }) => {
  const response = await fetch(`${BASE_URL}/api/odul-talep`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, odulId, fiyat }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Ödül talebi oluşturulamadı.");
  }

  return data;
};
export const getQuestions = async (egitimId, userId) => {
  const response = await fetch(`${BASE_URL}/api/sorular/${egitimId}/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Sorular alınamadı.");
  }

  return data.map((item) => ({
    id: String(item.id || item.soru_id),
    title: item.title || item.baslik || "Soru başlığı",
    message: item.message || item.soru_metni || "Soru içeriği bulunamadı.",
    date: item.date || "-",
    status: item.status === "answered" ? "answered" : "pending",
    // Backend zaten map edip gönderiyor, direkt kullan:
    answer: item.answer || null,
  }));
};
export const createQuestion = async ({ egitimId, userId, baslik, soruMetni }) => {
  const response = await fetch(`${BASE_URL}/api/soru-ekle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      egitimId,
      userId,
      baslik,
      soruMetni,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Soru gönderilemedi.");
  }

  return data;
};
export const getAIResponse = async (message, userInfo) => {
  const response = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      userInfo,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "AI yanıtı alınamadı.");
  }

  return data.reply;
};
export const getNotifications = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/bildirimler/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Bildirimler alınamadı.");
  }

  return data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await fetch(`${BASE_URL}/api/bildirim-oku`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notificationId }),
  });

  return await response.json();
};
export const getProfile = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/profil/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Profil alınamadı.");
  }

  return data;
};
export const updateProfile = async (userId, profileData) => {
  const response = await fetch(`${BASE_URL}/api/profil/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Profil güncellenemedi.");
  }

  return data;
};
export const updatePassword = async (userId, currentPassword, newPassword) => {
  const response = await fetch(`${BASE_URL}/api/sifre-guncelle`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      currentPassword,
      newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Şifre güncellenemedi.");
  }

  return data;
};
export const getPersonalAnalysis = async (userId) => {
  const response = await fetch(
    `${BASE_URL}/api/kisisel-analiz/${userId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Analiz alınamadı.");
  }

  return data;
};
export const getSupportTickets = async (userId) => {
  const response = await fetch(
    `${BASE_URL}/api/destek-talepleri/${userId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Destek talepleri alınamadı.");
  }

  return data;
};export const createSupportTicket = async (
  userId,
  subject,
  issueType,
  description
) => {
  const response = await fetch(
    `${BASE_URL}/api/destek-talebi`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        subject,
        issueType,
        description,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Destek talebi oluşturulamadı."
    );
  }

  return data;
};
export const getUserAnnouncements = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/user/duyurular/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Duyurular alınamadı.");
  }

  return data;
};
export const getUserSurveys = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/user/anketler/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Anketler alınamadı.");
  }

  return data;
};
export const getSurveyDetail = async (anketId) => {
  const response = await fetch(`${BASE_URL}/api/user/anket/${anketId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Anket detayı alınamadı.");
  }

  return data;
};

export const submitSurvey = async (userId, anketId, answers) => {
  const response = await fetch(`${BASE_URL}/api/user/anket-cevapla`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, anketId, answers }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Anket gönderilemedi.");
  }

  return data;
};
export const getInstructorHome = async (egitmenId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/egitmen/home/${egitmenId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Eğitmen ana sayfa verisi alınamadı.");
    }

    return data;
  } catch (error) {
    console.error("Eğitmen Ana Sayfa API Hatası:", error);
    return null;
  }
};
export const getInstructorTrainings = async (egitmenId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/egitmen/egitimler/${egitmenId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Eğitmen eğitimleri alınamadı.");
    }

    return data;
  } catch (error) {
    console.error("Eğitmen Eğitimleri API Hatası:", error);
    return [];
  }
};

// deleteInstructorTraining — /api/egitmen/egitim-sil değil, DELETE /api/egitmen/egitim/:id
export const deleteInstructorTraining = async (egitimId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/egitim/${egitimId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Eğitim silinemedi.");
  return data;
};

// updateTrainingPublishStatus — body değil URL parametresi
export const updateTrainingPublishStatus = async (egitimId, aktifMi) => {
  const response = await fetch(
    `${BASE_URL}/api/egitmen/egitim/${egitimId}/yayin-durumu`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aktif_mi: aktifMi }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Yayın durumu güncellenemedi.");
  return data;
};

export const getInstructorTrainingAnalysis = async (egitimId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/egitmen/egitim/${egitimId}/analiz`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Analiz verisi alınamadı.");
    return data;
  } catch (error) {
    console.error("Eğitim Analiz API Hatası:", error);
    return null;
  }
};

export const getInstructorTrainingParticipants = async (egitimId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/egitmen/egitim/${egitimId}/katilimcilar`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Katılımcılar alınamadı.");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Katılımcılar API Hatası:", error);
    return [];
  }
};

export const getInstructorParticipantDetail = async (egitimId, userId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/egitim/${egitimId}/katilimci/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Katılımcı detayı alınamadı.");
  }

  return data;
};

// sendParticipantReminder — /api/egitmen/hatirlatma-gonder değil, /api/egitmen/katilimci/hatirlatma
export const sendParticipantReminder = async ({
  userId,
  egitimId,
  gonderenId,
  baslik,
  mesaj,
  tip,
}) => {
  const response = await fetch(
    `${BASE_URL}/api/egitmen/katilimci/hatirlatma`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        egitimId,
        gonderenId,
        baslik,
        mesaj,
        tip,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Hatırlatma gönderilemedi."
    );
  }

  return data;
};
// createInstructorTraining — /api/egitmen/egitim-ekle değil, /api/egitmen/egitim
export const createInstructorTraining = async (trainingData) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/egitim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trainingData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Eğitim oluşturulamadı.");
  return data;
};
// getTrainingModules — /moduller değil /bolumler
export const getTrainingModules = async (egitimId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/egitmen/egitim/${egitimId}/bolumler`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Bölümler alınamadı.");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Bölümler API Hatası:", error);
    return [];
  }
};

// createTrainingModule — /api/egitmen/modul-olustur değil, POST /api/egitmen/egitim/:id/bolum
export const createTrainingModule = async (egitimId, baslik) => {
  const response = await fetch(
    `${BASE_URL}/api/egitmen/egitim/${egitimId}/bolum`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ baslik }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Modül oluşturulamadı.");
  return data;
};

export const createTextContent = async (payload) => {
  const response = await fetch(
    `${BASE_URL}/api/egitmen/icerik/metin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Metin içeriği eklenemedi.");
  }

  return data;
};

export const createVideoContent = async (payload) => {
  const response = await fetch(
    `${BASE_URL}/api/egitmen/icerik/video`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Video içeriği eklenemedi.");
  }

  return data;
};

export const createPdfContent = async (payload) => {
  const response = await fetch(`${BASE_URL}/api/icerik/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "PDF içerik eklenemedi.");
  }

  return data;
};



export const getInstructorTrainingDetail = async (egitimId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/egitim/${egitimId}`);

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Backend JSON değil HTML döndürdü:", text.slice(0, 300));
    throw new Error(
      "Backend route bulunamadı. /api/egitmen/egitim/" + egitimId + " endpointini kontrol et."
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Eğitim detayı alınamadı.");
  }

  return data;
};

export const publishTraining = async (egitimId) => {
  const response = await fetch(
    `${BASE_URL}/api/egitmen/egitim/${egitimId}/yayinla`,
    {
      method: "PUT",
    }
  );

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Yayınlama endpointi JSON değil HTML döndürdü:", text.slice(0, 300));
    throw new Error(
      "Backend route bulunamadı. /api/egitmen/egitim/" + egitimId + "/yayinla endpointini kontrol et."
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Eğitim yayınlanamadı.");
  }

  return data;
};
export const getInstructorPreview = async (egitimId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/onizleme/${egitimId}`);

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Önizleme JSON değil HTML döndürdü:", text.slice(0, 300));
    throw new Error("Önizleme endpointi bulunamadı. Backend çalışıyor mu kontrol et.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Önizleme alınamadı.");
  }

  return data;
};
// EĞİTMEN AI MESAJ
export const getInstructorAIResponse = async (
  message,
  userContext
) => {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      userContext,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.reply || "AI cevap veremedi.");
  }

  return data.reply;
};

// AI STÜDYO
export const runAiStudio = async ({ type, prompt, userContext }) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/ai-studyo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, prompt, userContext }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "AI Studio çalıştırılamadı.");
  return data.result;
};



// QUIZ TASLAĞI OLUŞTUR
export const createQuizDraft = async (quizData) => {
  const response = await fetch(`${BASE_URL}/api/quiz/taslak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizData),
  });
  const data = await response.json();
  if (!response.ok || !data.success)
    throw new Error(data.message || "Quiz oluşturulamadı.");
  return data;
};
export const getInstructorQuestions = async () => {
  const response = await fetch(`${BASE_URL}/api/egitmen/sorular`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Sorular alınamadı.");
  }

  return data;
};

export const answerInstructorQuestion = async ({
  soruId,
  cevapMetni,
  cevaplayanAdi,
  cevaplayanRol,
}) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/soru-cevapla`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      soruId,
      cevapMetni,
      cevaplayanAdi,
      cevaplayanRol,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Yanıt gönderilemedi.");
  }

  return data;
};
export const getInstructorNotifications = async (egitmenId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/bildirimler/${egitmenId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Bildirimler alınamadı.");
  }

  return data;
};

export const markInstructorNotificationRead = async (notificationId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/bildirim-oku`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notificationId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Bildirim okunamadı.");
  }

  return data;
};
export const getInstructorProfile = async (egitmenId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/profil/${egitmenId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Eğitmen profili alınamadı.");
  }

  return data;
};
export const getInstructorCompetencies = async (egitmenId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/yetkinlikler/${egitmenId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Yetkinlikler alınamadı.");
  }

  return data;
};

export const updateInstructorCompetencies = async (
  egitmenId,
  uzmanlikSeviyesi,
  yetkinlikler
) => {
  const response = await fetch(
    `${BASE_URL}/api/egitmen/yetkinlikler/${egitmenId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uzmanlikSeviyesi,
        yetkinlikler,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Yetkinlikler kaydedilemedi.");
  }

  return data;
};
export const getInstructorPersonalInfo = async (egitmenId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/kisisel-bilgiler/${egitmenId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Kişisel bilgiler alınamadı.");
  }

  return data;
};

export const updateInstructorPersonalInfo = async (egitmenId, payload) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/kisisel-bilgiler/${egitmenId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Kişisel bilgiler güncellenemedi.");
  }

  return data;
};

export const updateInstructorProfilePhoto = async (egitmenId, profilePhotoUrl) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/profil-foto/${egitmenId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profilePhotoUrl }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Profil fotoğrafı güncellenemedi.");
  }

  return data;
};
export const getTextContent = async (id) => {
  const response = await fetch(`${BASE_URL}/api/icerik/metin/${id}`);
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Metin içerik alınamadı.");
  }

  return data.icerik;
};

export const logContentView = async ({ kullaniciId, icerikId }) => {
  const response = await fetch(`${BASE_URL}/api/icerik/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kullaniciId, icerikId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "İçerik log kaydedilemedi.");
  }

  return data;
};

export const createQuizDraftManual = async (payload) => {
  const response = await fetch(`${BASE_URL}/api/quiz/taslak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Quiz kaydedilemedi.");
  }

  return data;
};
export const getVideoContent = async (id) => {
  const response = await fetch(`${BASE_URL}/api/icerik/video/${id}`);
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Video içerik alınamadı.");
  }

  return data.icerik;
};
export const sendInstructorAnnouncement = async ({
  egitmenId,
  hedefKitle,
  baslik,
  mesaj,
}) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/duyuru-gonder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      egitmenId,
      hedefKitle,
      baslik,
      mesaj,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Duyuru gönderilemedi.");
  }

  return data;
};

export const assignInstructorSurvey = async ({
  egitmenId,
  hedefKitle,
  baslik,
  sorular,
}) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/anket-ata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      egitmenId,
      hedefKitle,
      baslik,
      sorular,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Anket atanamadı.");
  }

  return data;
};
export const restartTrainingForUser = async ({
  userId,
  egitimId,
  baslatanId,
  neden,
}) => {
  const response = await fetch(`${BASE_URL}/api/egitim-yeniden-baslat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      egitimId,
      baslatanId,
      neden,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Eğitim yeniden başlatılamadı.");
  }

  return data;
};
export const sendAdminAnnouncement = async ({
  adminId,
  hedefKitle,
  departman,
  baslik,
  mesaj,
}) => {
  const response = await fetch(`${BASE_URL}/api/admin/duyuru-gonder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      adminId,
      hedefKitle,
      departman,
      baslik,
      mesaj,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Duyuru gönderilemedi.");
  }

  return data;
};

export const getAdminAnnouncements = async (adminId) => {
  const response = await fetch(`${BASE_URL}/api/admin/duyurular/${adminId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Yönetici duyuruları alınamadı.");
  }

  return data;
};
export const getInstructorSurveyAnalysis = async (egitmenId) => {
  const response = await fetch(
    `${BASE_URL}/api/egitmen/anket-analiz/${egitmenId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Anket analizi alınamadı.");
  }

  return data;
};
export const deleteInstructorSurvey = async (anketId) => {
  const response = await fetch(`${BASE_URL}/api/egitmen/anket/${anketId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Anket silinemedi.");
  }

  return data;
};
export const getInstructorPastAnnouncements = async (egitmenId) => {
  const response = await fetch(
    `${BASE_URL}/api/egitmen/gecmis-duyurular/${egitmenId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Geçmiş duyurular alınamadı.");
  }

  return data;
};
export const uploadCoverImage = async (file) => {
  const formData = new FormData();
  formData.append("kapak", file);

  const response = await fetch(`${BASE_URL}/api/upload-kapak`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Kapak görseli yüklenemedi.");
  }

  return data;
};
export const getAdminProfile = async (adminId) => {
  const res = await fetch(`${BASE_URL}/api/admin/profil/${adminId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Profil bilgisi alınamadı.");
  }

  return data;
};

export const updateAdminProfile = async (adminId, profileData) => {
  const res = await fetch(`${BASE_URL}/api/admin/profil/${adminId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Profil güncellenemedi.");
  }

  return data;
};

export const updateAdminPassword = async (adminId, passwordData) => {
  const res = await fetch(`${BASE_URL}/api/admin/sifre-guncelle/${adminId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(passwordData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Şifre güncellenemedi.");
  }

  return data;
};
export const createEducationQuestion = async ({
  egitimId,
  kullaniciId,
  baslik,
  soruMetni,
}) => {
  const response = await fetch(`${BASE_URL}/api/egitim-sorulari`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      egitim_id: egitimId,
      kullanici_id: kullaniciId,
      baslik,
      soru_metni: soruMetni,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Soru gönderilemedi.");
  }

  return data;
};
export const sendTrainingFeedback = async (data) => {
  const response = await fetch(`${BASE_URL}/api/egitim-feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await response.json();
};

export const getAllFeedbacks = async () => {
  const response = await fetch(`${BASE_URL}/api/admin/feedbackler`);
  return await response.json();
};
export const getMyTrainingFeedback = async (egitimId, kullaniciId) => {
  const response = await fetch(
    `${BASE_URL}/api/egitim-feedback/${egitimId}/${kullaniciId}`
  );
  return await response.json();
};
export const getQuestionMessages = async (soruId) => {
  const response = await fetch(`${BASE_URL}/api/soru-mesajlari/${soruId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Mesajlar alınamadı.");
  }

  return data;
};

export const sendQuestionMessage = async ({
  soruId,
  gonderenId,
  gonderenRol,
  mesaj,
}) => {
  const response = await fetch(`${BASE_URL}/api/soru-mesajlari`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      soruId,
      gonderenId,
      gonderenRol,
      mesaj,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Mesaj gönderilemedi.");
  }

  return data;
};
export const assignLearningPathToDepartment = async ({
  yolId,
  departman,
  atayanId,
}) => {
  const response = await fetch(
    `${BASE_URL}/api/admin/ogrenme-yolu-departmana-ata`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yolId, departman, atayanId }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Öğrenme paketi atanamadı.");
  }

  return data;
};
export const getUserLearningPackages = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/kullanici/ogrenme-paketleri/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Öğrenme paketleri alınamadı.");
  }

  return data;
};
export const getUser360Tasks = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/user/360-gorevler/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "360 görevleri alınamadı.");
  }

  return data;
};

export const submit360Survey = async ({
  userId,
  atamaId,
  anketId,
  answers,
}) => {
  const response = await fetch(`${BASE_URL}/api/user/360-cevapla`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      atamaId,
      anketId,
      answers,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "360 değerlendirme gönderilemedi.");
  }

  return data;
};
export const get360Analysis = async (atamaId) => {
  const response = await fetch(`${BASE_URL}/api/admin/360-analiz/${atamaId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "360 analiz alınamadı.");
  }

  return data;
};
export const assignDepartmentSurvey = async (assignData) => {
  const response = await fetch(`${BASE_URL}/api/dept/anket-ata`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Anket atanamadı.");
  return data;
};
export const assignDepartment360Survey = async (assignData) => {
  const response = await fetch(`${BASE_URL}/api/dept/360-ata`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "360 atama yapılamadı.");
  return data;
};

export const getDepartmentFeedbacks = async (departman) => {
  const response = await fetch(
    `${BASE_URL}/api/dept/geribildirimler/${encodeURIComponent(departman)}`
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Geribildirim alınamadı.");
  return data;
};
export const addDepartmentSurvey = async (surveyData) => {
  const response = await fetch(`${BASE_URL}/api/dept/anket-ekle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(surveyData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Departman anketi oluşturulamadı.");
  }

  return data;
};
export const getDepartmentSurveyAssignments = async (departman) => {
  const response = await fetch(
    `${BASE_URL}/api/dept/anket-atamalari/${encodeURIComponent(departman)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Departman anket atamaları alınamadı.");
  }

  return data;
};
export const getDepartmentSurveyAnalysis = async (atamaId) => {
  const response = await fetch(`${BASE_URL}/api/dept/anket-analiz/${atamaId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Anket analizi alınamadı.");
  }

  return data;
};
export const getDepartmentAnnouncements = async (departman, adminId) => {
  const response = await fetch(
    `${BASE_URL}/api/dept/duyurular/${encodeURIComponent(departman)}/${adminId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Duyurular alınamadı.");
  }

  return data;
};
export const askNavigationAssistant = async ({ userId, message }) => {
  const response = await fetch(`${BASE_URL}/api/user/navigation-assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, message }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Asistan yanıt veremedi.");
  }

  return data;
};
export const getAiMiniQuiz = async ({
  trainingTitle,
  moduleTitle,
  moduleContent,
  progress,
}) => {
  const response = await fetch(`${BASE_URL}/api/ai-mini-quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trainingTitle,
      moduleTitle,
      moduleContent,
      progress,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "AI mini quiz alınamadı.");
  }

  return data;
};