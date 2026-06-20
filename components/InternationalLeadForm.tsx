"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Platform = "Telegram" | "WhatsApp" | "KakaoTalk" | "IMO" | "Boshqa";

const platforms: { value: Platform; label: string }[] = [
  { value: "Telegram", label: "Telegram" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "IMO", label: "IMO" },
  { value: "KakaoTalk", label: "KakaoTalk" },
  { value: "Boshqa", label: "Boshqa" },
];

const platformPlaceholders: Record<Platform, string> = {
  Telegram: "@username yoki +1 234 567 8900",
  WhatsApp: "+1 234 567 8900",
  KakaoTalk: "Telefon raqam yoki ID",
  IMO: "+998 90 123 45 67",
  Boshqa: "Username yoki raqam",
};

// YouTube video URL (Damber prezentatsiya)
const VIDEO_URL = "https://www.youtube.com/embed/xRFT6drMm3c";

export default function InternationalLeadForm() {
  const searchParams = useSearchParams();
  const productFromUrl = searchParams.get("product") || "";

  // Bosqich: 0 = boshlang'ich sahifa, 1-6 = popup bosqichlari, 7 = "Yo'q" tanlangan
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Platform | "">("");
  const [contactValue, setContactValue] = useState("");
  const [country, setCountry] = useState("");
  const [time, setTime] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [fbp, setFbp] = useState<string>("");
  const [fbc, setFbc] = useState<string>("");

  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      setFbp(cookies._fbp || "");
      setFbc(cookies._fbc || "");
    }
  }, []);

  // Popup ochish (filter bosqichidan boshlash)
  const openPopup = () => {
    setStep(1);
    setErrorMsg("");
  };

  // Popup yopish (X tugmasi)
  const closePopup = () => {
    setStep(0);
    setErrorMsg("");
  };

  // Filter "Ha" tanlandi
  const handleYes = () => {
    setStep(2);
  };

  // Filter "Yo'q" tanlandi
  const handleNo = () => {
    setStep(7);
  };

  // Orqaga qaytish
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    setErrorMsg("");
  };

  // Keyingi bosqichga o'tish (validatsiya bilan)
  const handleNext = () => {
    setErrorMsg("");

    if (step === 2 && name.trim().length < 2) {
      setErrorMsg("Iltimos, ismingizni kiriting");
      return;
    }
    if (step === 3 && !platform) {
      setErrorMsg("Iltimos, platformani tanlang");
      return;
    }
    if (step === 4 && contactValue.trim().length < 3) {
      setErrorMsg("Iltimos, username yoki raqamingizni kiriting");
      return;
    }
    if (step === 5 && country.trim().length < 2) {
      setErrorMsg("Iltimos, davlatni kiriting");
      return;
    }

    setStep(step + 1);
  };

  // Forma yuborish (oxirgi bosqich)
  const handleSubmit = async () => {
    setErrorMsg("");

    if (time.trim().length < 2) {
      setErrorMsg("Iltimos, qulay vaqtni kiriting");
      return;
    }

    setStatus("loading");

    try {
      const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("fb_lead_event_id", eventId);
      }

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: contactValue.trim(),
          platforma: platform,
          davlat: country.trim(),
          bog_lanish_vaqti: time.trim(),
          contact_value: contactValue.trim(),
          product: productFromUrl,
          source: "forma",
          fbp,
          fbc,
          userAgent: navigator.userAgent,
          pageUrl: window.location.href,
          event_id: eventId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Server xatosi");
      }

      window.location.href = "/thanks";
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMsg(error.message || "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    }
  };

  // Progress bar foizi
  const getProgress = () => {
    if (step >= 1 && step <= 6) {
      return ((step) / 6) * 100;
    }
    return 0;
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-damber-navy to-damber-navy-deep text-white relative overflow-hidden py-12 px-5">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-damber-blue opacity-15 blur-3xl rounded-full -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-damber-blue opacity-10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

      {/* ASOSIY SAHIFA */}
      <div className="relative max-w-md mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 bg-damber-blue/15 text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium mb-4 border border-damber-blue/30">
          <span>❤️</span>
          Ota-onangiz uchun sovg'a
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight mb-2">
          Masofadan turib
          <br />
          <span className="text-damber-blue">OTA-ONANGIZNI</span>
          <br />
          xursand qiling
        </h1>

        <p className="text-sm text-white/70 mb-6">3 yil kafolat — bepul yetkazib berish</p>

        {/* VIDEO (Reels format - 9:16) */}
        <div className="mx-auto mb-5" style={{ maxWidth: "240px" }}>
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "9/16" }}>
            {VIDEO_URL ? (
              <iframe
                src={VIDEO_URL}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Damber prezentatsiya"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-white/70 text-xs">11 daqiqalik<br />prezentatsiya</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NARXLAR */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-5 text-left border border-white/20">
          <p className="text-xs text-white/60 mb-2 uppercase tracking-wider text-center">Mahsulot narxlari</p>
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-sm">3D Zero Gravity</span>
            <span className="text-sm font-bold">16 900 000 so'm</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm">Elegant Comfort</span>
            <span className="text-sm font-bold">14 500 000 so'm</span>
          </div>
        </div>

        {/* DAVOM ETISH TUGMASI */}
        <button
          onClick={openPopup}
          className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-4 rounded-xl text-base font-bold shadow-xl transition-all hover:scale-[1.02]"
        >
          Davom etish →
        </button>

        <p className="text-xs text-white/50 mt-3">
          Bizning menejerlarimiz siz bilan tez orada bog'lanishadi
        </p>
      </div>

      {/* POPUP MODAL */}
      {step > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: "rgba(4, 44, 83, 0.85)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative animate-slide-up">

            {/* HEADER (X va Orqaga tugmalari) */}
            <div className="flex justify-between items-center p-4 pb-2">
              {step > 1 && step <= 6 ? (
                <button onClick={handleBack} className="text-damber-navy/60 hover:text-damber-navy p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : (
                <div className="w-7" />
              )}
              <button onClick={closePopup} className="text-damber-navy/60 hover:text-damber-navy p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* PROGRESS BAR (bosqich 1-6) */}
            {step >= 1 && step <= 6 && (
              <div className="px-5 pb-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-damber-navy/50">Bosqich {step} / 6</p>
                </div>
                <div className="bg-damber-light h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-damber-blue h-full rounded-full transition-all duration-300"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
              </div>
            )}

            {/* CONTENT */}
            <div className="p-5 pt-2">

              {/* BOSQICH 1 — FILTER */}
              {step === 1 && (
                <div className="text-center">
                  <h3 className="text-lg font-bold text-damber-navy mb-3 leading-tight">
                    Mahsulot narxi sizga
                    <br />
                    maqul keladimi?
                  </h3>
                  <div className="bg-damber-light rounded-lg p-3 mb-5">
                    <p className="text-xs text-damber-navy/70 mb-1">Eslatma</p>
                    <p className="text-sm text-damber-navy">
                      3D Zero Gravity — <b>16 900 000 so'm</b><br />
                      Elegant Comfort — <b>14 500 000 so'm</b>
                    </p>
                  </div>
                  <button
                    onClick={handleYes}
                    className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-3 rounded-lg text-sm font-semibold mb-2 transition-colors"
                  >
                    ✓ Ha, davom etish
                  </button>
                  <button
                    onClick={handleNo}
                    className="w-full bg-transparent text-damber-navy/60 hover:text-damber-navy border border-gray-200 py-3 rounded-lg text-sm transition-colors"
                  >
                    Yo'q, to'g'ri kelmaydi
                  </button>
                </div>
              )}

              {/* BOSQICH 2 — ISM */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-bold text-damber-navy mb-4 text-center leading-tight">
                    Ismingiz nima?
                  </h3>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Akmal"
                    autoFocus
                    className="w-full bg-damber-light border border-gray-200 rounded-lg px-3 py-3 text-sm text-damber-navy placeholder:text-gray-400 focus:outline-none focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 mb-3"
                  />
                  {errorMsg && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded mb-3">{errorMsg}</p>
                  )}
                  <button
                    onClick={handleNext}
                    className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Keyingisi →
                  </button>
                </div>
              )}

              {/* BOSQICH 3 — PLATFORMA */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-bold text-damber-navy mb-4 text-center leading-tight">
                    Qaysi platforma orqali
                    <br />
                    bog'lansak bo'ladi?
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {platforms.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => {
                          setPlatform(p.value);
                          setTimeout(() => setStep(4), 200);
                        }}
                        className={`px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                          platform === p.value
                            ? "bg-damber-blue text-white"
                            : "bg-damber-light text-damber-navy border border-gray-200 hover:border-damber-blue"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">{errorMsg}</p>
                  )}
                </div>
              )}

              {/* BOSQICH 4 — USERNAME/RAQAM */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg font-bold text-damber-navy mb-4 text-center leading-tight">
                    {platform} username
                    <br />
                    yoki raqamingiz?
                  </h3>
                  <input
                    type="text"
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder={platform ? platformPlaceholders[platform as Platform] : "@username"}
                    autoFocus
                    className="w-full bg-damber-light border border-gray-200 rounded-lg px-3 py-3 text-sm text-damber-navy placeholder:text-gray-400 focus:outline-none focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 mb-3"
                  />
                  {errorMsg && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded mb-3">{errorMsg}</p>
                  )}
                  <button
                    onClick={handleNext}
                    className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Keyingisi →
                  </button>
                </div>
              )}

              {/* BOSQICH 5 — DAVLAT */}
              {step === 5 && (
                <div>
                  <h3 className="text-lg font-bold text-damber-navy mb-4 text-center leading-tight">
                    Qaysi davlatdan
                    <br />
                    murojaat qilyapsiz?
                  </h3>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="AQSh, Turkiya, Janubiy Koreya..."
                    autoFocus
                    className="w-full bg-damber-light border border-gray-200 rounded-lg px-3 py-3 text-sm text-damber-navy placeholder:text-gray-400 focus:outline-none focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 mb-3"
                  />
                  {errorMsg && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded mb-3">{errorMsg}</p>
                  )}
                  <button
                    onClick={handleNext}
                    className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Keyingisi →
                  </button>
                </div>
              )}

              {/* BOSQICH 6 — VAQT (yakuniy) */}
              {step === 6 && (
                <div>
                  <h3 className="text-lg font-bold text-damber-navy mb-4 text-center leading-tight">
                    Qaysi vaqtda
                    <br />
                    bog'lansak bo'ladi?
                  </h3>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Ertalab 9:00 - 11:00"
                    autoFocus
                    disabled={status === "loading"}
                    className="w-full bg-damber-light border border-gray-200 rounded-lg px-3 py-3 text-sm text-damber-navy placeholder:text-gray-400 focus:outline-none focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 mb-3 disabled:opacity-60"
                  />
                  {errorMsg && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded mb-3">{errorMsg}</p>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Yuborilmoqda..." : "✓ So'rov yuborish"}
                  </button>
                </div>
              )}

              {/* BOSQICH 7 — "Yo'q" tanlangan */}
              {step === 7 && (
                <div className="text-center py-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-damber-navy mb-2">Rahmat!</h3>
                  <p className="text-sm text-damber-navy/60 mb-4 leading-relaxed">
                    E'tiboringiz uchun rahmat.
                    <br />
                    Sog'lik va omad tilaymiz!
                  </p>
                  <button
                    onClick={closePopup}
                    className="text-xs text-damber-navy/40 hover:text-damber-navy underline"
                  >
                    Yopish
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ANIMATSIYALAR */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
