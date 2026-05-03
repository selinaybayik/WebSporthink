import React, { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Trophy,
  Shirt,
  Footprints,
  Zap,
  Dumbbell,
  Target,
  Medal,
} from "lucide-react";
import { loginUser } from "../services/api";

const LoginScreen = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Lütfen e-posta ve şifrenizi giriniz.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setUser(data.user);
    } catch (err) {
      setError(
        err.message || "Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F8FB] flex overflow-hidden">
      <section className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#E30613]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(0,0,0,0.22),transparent_34%)]" />

        <div className="absolute inset-0 opacity-[0.12]">
          <div className="absolute top-20 left-24 w-28 h-28 border-[10px] border-white rounded-full" />
          <div className="absolute top-36 right-28 w-20 h-20 border-[8px] border-white rounded-full" />
          <div className="absolute bottom-32 left-32 w-28 h-28 border-[10px] border-white rounded-[2rem] rotate-12" />
          <div className="absolute bottom-20 right-24 w-36 h-36 border-[12px] border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 border-[18px] border-white rounded-full" />
        </div>

        <FloatingItem className="top-24 right-28 rotate-12" icon={<Trophy size={42} />} />
        <FloatingItem className="bottom-36 right-32 -rotate-12" icon={<Shirt size={44} />} />
        <FloatingItem className="bottom-32 left-24 rotate-6" icon={<Footprints size={44} />} />
        <FloatingItem className="top-[48%] right-16 rotate-[18deg]" icon={<Target size={40} />} />

        <div className="relative z-10 w-full p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-16">
              <div className="w-13 h-13 bg-white text-red-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl">
                S
              </div>
              <div>
                <h1 className="text-white text-3xl font-black italic tracking-tight">
                  SPORTHINK
                </h1>
                <p className="text-red-100 text-xs font-black tracking-[4px]">
                  LMS AKADEMİ
                </p>
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="w-32 h-32 bg-white rounded-[2.6rem] flex items-center justify-center shadow-2xl shadow-red-950/25 mb-9 rotate-3">
                <Zap size={72} fill="#E30613" className="text-red-600" />
              </div>

              <p className="text-red-100 font-black tracking-[5px] text-sm mb-5">
                SAHAYA ÇIKMAYA HAZIR MISIN?
              </p>

              <h2 className="text-white text-7xl font-black leading-[0.98] tracking-tight mb-8">
                Eğitim
                <br />
                Oyuna
                <br />
                Dönüşüyor.
              </h2>

              <p className="text-red-50 text-xl font-bold leading-9 max-w-xl">
                Eğitimleri yönet, ekibin gelişimini takip et, rozetleri ve XP
                başarısını tek panelden kontrol et.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <SportMini icon={<Dumbbell size={24} />} title="Gelişim" text="Antrenman modu" />
            <SportMini icon={<Medal size={24} />} title="Başarı" text="XP & rozet" />
            <SportMini icon={<Shirt size={24} />} title="Takım" text="Ekip ruhu" />
          </div>
        </div>
      </section>

      <section className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-8 right-8 hidden md:flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
          <div className="w-9 h-9 bg-red-600 text-white rounded-xl flex items-center justify-center font-black">
            S
          </div>
          <span className="font-black text-slate-950">Sporthink LMS</span>
        </div>

        <div className="w-full max-w-[540px]">
          <div className="bg-white rounded-[3.2rem] border border-slate-200 shadow-2xl shadow-slate-200/70 p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-red-50 rounded-full" />
            <div className="absolute -bottom-28 -left-28 w-64 h-64 bg-slate-50 rounded-full" />

            <div className="relative z-10">
              <div className="text-center mb-9">
                <div className="w-24 h-24 mx-auto bg-red-600 text-white rounded-[2.4rem] flex items-center justify-center mb-6 shadow-2xl shadow-red-600/25 rotate-3">
                  <Zap size={52} fill="white" />
                </div>

                <p className="text-red-600 text-xs font-black tracking-[5px] mb-3">
                  SPORTHINK LMS
                </p>

                <h2 className="text-5xl font-black text-slate-950 mb-3">
                  Hoş Geldin!
                </h2>

                <p className="text-slate-400 font-black tracking-[5px] text-sm">
                  SAHAYA GİRİŞ PANELİ 🏁
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-600 shrink-0" />
                  <span className="font-bold text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <InputBox
                  icon={<Mail size={25} />}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta Adresin"
                />

                <div className="relative">
                  <InputBox
                    icon={<Lock size={25} />}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifren"
                    rightSpace
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-600 transition"
                  >
                    {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
                  </button>
                </div>

                <div className="flex items-center justify-between px-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                    />
                    <span className="text-sm font-bold text-slate-500">
                      Beni Hatırla
                    </span>
                  </label>

                  <button
                    type="button"
                    className="text-sm font-black text-red-600 hover:text-red-700"
                  >
                    Şifremi Unuttum
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[76px] bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-[2.2rem] shadow-2xl shadow-red-600/30 transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                    <span className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      SİSTEME GİRİŞ YAP
                      <ArrowRight size={30} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 flex items-center justify-center gap-5 text-slate-300">
                <Shirt size={28} />
                <div className="w-20 h-px bg-slate-200" />
                <Footprints size={30} />
                <div className="w-20 h-px bg-slate-200" />
                <Trophy size={28} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function InputBox({ icon, type, value, onChange, placeholder, rightSpace }) {
  return (
    <div className="relative">
      <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300">
        {icon}
      </div>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-[76px] pl-20 ${
          rightSpace ? "pr-20" : "pr-6"
        } bg-slate-50 border border-slate-200 rounded-[2.2rem] text-slate-950 font-black placeholder:text-slate-300 placeholder:font-black outline-none focus:border-red-500 focus:bg-white transition shadow-sm`}
      />
    </div>
  );
}

function FloatingItem({ icon, className }) {
  return (
    <div className={`absolute ${className} animate-bounce`}>
      <div className="w-24 h-24 bg-white/15 border border-white/15 backdrop-blur rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
        {icon}
      </div>
    </div>
  );
}

function SportMini({ icon, title, text }) {
  return (
    <div className="bg-white/13 border border-white/15 backdrop-blur rounded-3xl p-5">
      <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-4 text-white">
        {icon}
      </div>
      <p className="font-black text-white text-lg">{title}</p>
      <p className="text-red-100 text-sm font-bold mt-1">{text}</p>
    </div>
  );
}

export default LoginScreen;