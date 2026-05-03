import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const FAQ_SECTIONS = [
  {
    title: "EĞİTİMLER VE XP",
    items: [
      {
        id: "xp-1",
        question: "Nasıl XP kazanabilirim?",
        answer:
          "Eğitim modüllerini tamamlayarak, quizleri çözerek ve görevleri bitirerek XP kazanabilirsin.",
      },
      {
        id: "xp-2",
        question: "Eğitimi yarıda bırakırsam ne olur?",
        answer:
          "İlerlemen kaydedilir. Daha sonra kaldığın modülden devam edebilirsin.",
      },
    ],
  },
  {
    title: "SERTİFİKALAR",
    items: [
      {
        id: "cert-1",
        question: "Sertifikamı ne zaman alabilirim?",
        answer:
          "Eğitimi ve gerekli mini değerlendirme quizini başarıyla tamamladıktan sonra sertifikan açılır.",
      },
      {
        id: "cert-2",
        question: "Sertifikayı nasıl indirebilirim?",
        answer:
          "Sertifika ekranına girdikten sonra görüntüle veya indir aksiyonu ile cihazına kaydedebilirsin.",
      },
    ],
  },
  {
    title: "HESAP VE GÜVENLİK",
    items: [
      {
        id: "security-1",
        question: "Şifremi unuttum, ne yapmalıyım?",
        answer:
          "Giriş ekranındaki şifremi unuttum adımını kullanarak e-posta doğrulaması ile yeni şifre oluşturabilirsin.",
      },
      {
        id: "security-2",
        question: "Biyometrik girişi nasıl aktif ederim?",
        answer:
          "Profil > Şifre ve Güvenlik ekranından biyometrik giriş seçeneğini aktif hale getirebilirsin.",
      },
    ],
  },
];

export default function SSS() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [openIds, setOpenIds] = useState([]);

  const toggleFAQ = (id) => {
    setOpenIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const filteredSections = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return FAQ_SECTIONS;

    return FAQ_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      ),
    })).filter((section) => section.items.length > 0);
  }, [searchText]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="h-24 bg-white border-b border-slate-200 px-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-5"
        >
          <ArrowLeft size={22} className="text-slate-500" />
        </button>

        <div>
          <h1 className="text-3xl font-black text-slate-950">
            S.S.S
          </h1>

          <p className="text-slate-400 font-bold mt-2">
            Yardım merkezi ve kullanım rehberleri
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-10 py-10">
        {/* SEARCH */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm mb-10">
          <Search size={22} className="text-slate-400" />

          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Yardım dökümanlarında ara..."
            className="flex-1 bg-transparent outline-none font-semibold text-slate-900 text-lg"
          />
        </div>

        {/* FAQ */}
        {filteredSections.map((section) => (
          <div key={section.title} className="mb-10">
            <p className="text-xs font-black tracking-[4px] text-slate-400 mb-5">
              {section.title}
            </p>

            <div className="space-y-4">
              {section.items.map((item) => {
                const isOpen = openIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full bg-white border border-slate-200 rounded-[2rem] p-7 text-left shadow-sm hover:border-red-200 transition"
                  >
                    <div className="flex items-center">
                      <div className="flex-1 pr-6">
                        <h3 className="text-xl font-black text-slate-950 leading-8">
                          {item.question}
                        </h3>
                      </div>

                      <div className="text-slate-400">
                        {isOpen ? (
                          <ChevronUp size={22} />
                        ) : (
                          <ChevronDown size={22} />
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <p className="mt-6 text-slate-500 leading-8 font-semibold text-lg">
                        {item.answer}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* SUPPORT */}
        <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-10 text-center mt-12">
          <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto mb-6">
            <HelpCircle size={36} />
          </div>

          <h2 className="text-3xl font-black text-red-600 mb-4">
            Başka Bir Sorun mu Var?
          </h2>

          <p className="text-red-500 font-semibold text-lg leading-8 max-w-3xl mx-auto mb-8">
            Destek ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
            Teknik destek ekranından talep oluşturabilirsiniz.
          </p>

          <button
            onClick={() => navigate("/user/teknik-destek")}
            className="bg-red-600 hover:bg-red-700 transition text-white px-10 py-5 rounded-2xl font-black text-lg shadow-lg shadow-red-600/20"
          >
            DESTEK TALEBİ OLUŞTUR
          </button>
        </div>
      </main>
    </div>
  );
}