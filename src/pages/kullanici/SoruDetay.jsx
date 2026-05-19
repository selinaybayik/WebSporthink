import React, { useEffect, useState } from "react";
import { ArrowLeft, Clock, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import KullaniciLayout from "../../components/KullaniciLayout";
import { getQuestionMessages, sendQuestionMessage } from "../../services/api";

export default function SoruDetay({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    id,
    title = "Soru başlığı",
    message = "Soru içeriği bulunamadı.",
    date = "Bugün",
  } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    if (!id) return;
    const data = await getQuestionMessages(id);
    setMessages(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadMessages();
  }, [id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);

      await sendQuestionMessage({
        soruId: id,
        gonderenId: user?.id,
        gonderenRol: "kullanici",
        mesaj: newMessage.trim(),
      });

      setNewMessage("");
      await loadMessages();
    } catch (err) {
      alert(err.message || "Mesaj gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <KullaniciLayout
      user={user}
      setUser={setUser}
      activePath="/user/sorular"
      searchPlaceholder="Soru detayında ara..."
    >
      <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center mr-4 hover:bg-slate-200"
        >
          <ArrowLeft size={22} className="text-slate-500" />
        </button>

        <div>
          <h1 className="text-xl font-black text-slate-950">Soru Detayı</h1>
          <p className="text-slate-400 font-bold text-sm">
            Eğitmen ile sohbet
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-10 pb-36">
        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-400 font-black text-xs tracking-[3px]">
            SENİN SORUN
          </p>

          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
            <Clock size={16} />
            {date}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-black text-slate-950 mb-5">
            {title}
          </h2>

          <p className="text-slate-600 font-semibold leading-8 text-lg whitespace-pre-line">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-8 text-center">
              <p className="text-orange-700 font-black">
                Henüz ek mesaj yok. Eğitmen yanıtladığında burada görünecek.
              </p>
            </div>
          ) : (
            messages.map((item) => {
              const isUser = item.gonderen_rol === "kullanici";

              return (
                <div
                  key={item.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-[2rem] p-5 ${
                      isUser
                        ? "bg-red-600 text-white"
                        : "bg-slate-950 text-white"
                    }`}
                  >
                    <p className="text-xs font-black opacity-60 mb-2">
                      {isUser ? "SEN" : "EĞİTMEN"}
                    </p>

                    <p className="font-semibold leading-7 whitespace-pre-line">
                      {item.mesaj}
                    </p>

                    <p className="text-[10px] font-black opacity-40 mt-3">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("tr-TR")
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
  <div className="max-w-5xl mx-auto flex gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesaj yaz..."
          className="flex-1 bg-slate-100 rounded-2xl px-5 py-4 font-bold outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={sending || !newMessage.trim()}
          className="bg-red-600 disabled:bg-slate-300 text-white w-16 rounded-2xl flex items-center justify-center"
        >
          <Send size={22} />
        </button>
      </div>
      </div>
    </KullaniciLayout>
  );
}