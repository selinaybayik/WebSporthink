import React, { useState } from "react";
import {
  Bot,
  MoreVertical,
  Search,
  Send,
  Mic,
  Sparkles,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { getAIResponse } from "../../services/api";
import KullaniciLayout from "../../components/KullaniciLayout";

export default function Asistan({ user, setUser }) {
  const location = useLocation();

  const egitimId = location.state?.egitimId;
  const egitimTitle = location.state?.egitimTitle;
  const isCourseAssistant = !!egitimId;

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: isCourseAssistant
        ? `Merhaba ${user?.name || "Selinay"} 👋\nBen "${egitimTitle || "bu eğitim"}" için AI Eğitim Koçun.`
        : `Merhaba ${user?.name || "Selinay"}! Ben Sporthink AI Asistan.\nBugün sana nasıl yardımcı olabilirim?`,
      sender: "ai",
      time: getCurrentTime(),
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || sending) return;

    const userMessage = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: "user",
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const reply = await getAIResponse(trimmedInput, {
        name: user?.name || "Kullanıcı",
        department: user?.department || "Departman bilgisi yok",
        role: user?.role || "CALISAN",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-ai",
          text: reply || "Şu an yanıt oluşturamadım.",
          sender: "ai",
          time: getCurrentTime(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          text: "Bağlantı sırasında bir sorun oluştu. Lütfen tekrar dene.",
          sender: "ai",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <KullaniciLayout
      user={user}
      setUser={setUser}
      activePath="/user/asistan"
      searchPlaceholder="AI asistana soru sor..."
    >
      <main className="flex-1 h-[calc(100vh-80px)] flex flex-col bg-slate-50">
        <header className="h-24 bg-slate-950 text-white px-8 flex items-center justify-between shadow-xl shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center">
              <Bot size={28} />
            </div>

            <div>
              <h1 className="font-black text-xl">
                {isCourseAssistant ? "AI Eğitim Koçu" : "Sporthink AI Asistan"}
              </h1>

              <p className="text-emerald-400 text-sm font-bold mt-1">
                ●{" "}
                {isCourseAssistant
                  ? egitimTitle || "EĞİTİM ASİSTANI"
                  : "ÇEVRİMİÇİ YARDIMCI"}
              </p>
            </div>
          </div>

          <button className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
            <MoreVertical size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-8 bg-gradient-to-b from-slate-100 to-slate-50">
          <div className="max-w-5xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-6 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[75%]">
                  <div
                    className={`rounded-[2rem] px-6 py-5 shadow-sm ${
                      msg.sender === "user"
                        ? "bg-red-600 text-white rounded-br-md"
                        : "bg-white text-slate-900 rounded-bl-md border border-slate-200"
                    }`}
                  >
                    <p className="font-semibold leading-8 whitespace-pre-line">
                      {msg.text}
                    </p>
                  </div>

                  <p
                    className={`text-xs font-bold text-slate-400 mt-2 ${
                      msg.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-[2rem] px-5 py-4 flex items-center gap-3 shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-slate-500 font-bold text-sm">
                    Sporthink AI yazıyor...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="bg-white border-t border-slate-200 p-6 shrink-0">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <div className="flex-1 bg-slate-100 rounded-[2rem] px-6 py-4 flex items-center gap-4">
              <Search size={18} className="text-slate-400" />

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isCourseAssistant
                    ? "Bu eğitim hakkında soru sor..."
                    : "Bir şeyler sor..."
                }
                disabled={sending}
                className="flex-1 bg-transparent outline-none text-slate-900 font-semibold"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />

              <button className="text-slate-400">
                <Mic size={20} />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={sending}
              className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/20 disabled:bg-slate-300"
            >
              <Send size={20} />
            </button>
          </div>

          <div className="max-w-5xl mx-auto mt-4 flex gap-3 flex-wrap">
            <QuickPrompt
              text="Bana uygun eğitim öner"
              onClick={() => setInput("Bana uygun eğitim öner")}
            />

            <QuickPrompt
              text="Bu eğitimi özetle"
              onClick={() => setInput("Bu eğitimi özetle")}
            />

            <QuickPrompt
              text="Quiz için yardım et"
              onClick={() => setInput("Quiz için yardım et")}
            />

            <QuickPrompt
              text="Kariyer yol haritamı oluştur"
              onClick={() =>
                setInput("Kariyer gelişimime uygun yol haritası oluştur")
              }
            />
          </div>
        </footer>
      </main>
    </KullaniciLayout>
  );
}

function QuickPrompt({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-black hover:bg-red-100 flex items-center gap-2"
    >
      <Sparkles size={14} />
      {text}
    </button>
  );
}