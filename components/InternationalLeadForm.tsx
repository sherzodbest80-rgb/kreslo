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

const VIDEO_URL = "https://www.youtube.com/embed/xRFT6drMm3c?rel=0&modestbranding=1";

export default function InternationalLeadForm() {
  const searchParams = useSearchParams();
  const productFromUrl = searchParams.get("product") || "";

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

  const openPopup = () => {
    setStep(1);
    setErrorMsg("");
  };

  const closePopup = () => {
    setStep(0);
    setErrorMsg("");
  };

  const handleYes = () => setStep(2);
  const handleNo = () => setStep(7);

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    setErrorMsg("");
  };

  const handleNext = () => {
    setErrorMsg("");
    if (step === 2 && name.trim().length < 2) {
      setErrorMsg("Iltimos, ismingizni kiriting");
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

  const getProgress = () => {
    if (step >= 1 && step <= 6) {
      return ((step) / 6) * 100;
    }
    return 0;
  };

  return (
    <>
      <section className="min-h-screen bg-white py-6 px-4">
        <div className="max-w-md mx-auto">

          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 bg-damber-light text-damber-blue px-3 py-1.5 rounded-full text-xs font-medium mb-3">
              <span>❤️</span>
              Ota-onangiz uchun sovg&apos;a
            </div>
            <h1 className="font-display text-2xl font-bold leading-tight text-damber-navy mb-1">
              Masofadan turib
              <br />
              <span className="text-damber-blue">OTA-ONANGIZNI</span>
              <br />
              xursand qiling
            </h1>
            <p className="text-xs text-damber-navy/60">3 yil kafolat — bepul yetkazib berish</p>
          </div>

          <div className="mx-auto mb-4" style={{ maxWidth: "360px" }}>
            <div
              className="relative bg-black rounded-2xl overflow-hidden shadow-xl"
              style={{ aspectRatio: "9/16" }}
            >
              <iframe
                src={VIDEO_URL}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title="Damber prezentatsiya"
                style={{ border: 0 }}
              />
            </div>
          </div>

          <div className="bg-damber-light rounded-2xl p-4 mb-5 border border-damber-blue/10">
            <p className="text-xs text-damber-navy/60 mb-2 uppercase tracking-wider text-center font-medium">
              Mahsulot narxlari
            </p>
            <div className="flex justify-between items-center py-2 border-b border-damber-blue/10">
              <span className="text-sm text-damber-navy">3D Zero Gravity</span>
              <span className="text-sm font-bold text-damber-navy">16 900 000 so&apos;m</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-damber-navy">Elegant Comfort</span>
              <span className="text-sm font-bold text-damber-navy">14 500 000 so&apos;m</span>
            </div>
          </div>

          <button
            onClick={openPopup}
            className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-4 rounded-2xl text-base font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Davom etish →
          </button>

          <p className="text-xs text-damber-navy/50 mt-3 text-center">
            Menejerlarimiz siz bilan tez orada bog&apos;lanishadi
          </p>

        </div>
      </section>

      {step > 0 && (
        <div className="fixed inset-0 z-50 bg-white animate-fade-in flex flex-col">

          <div className="flex justify-between items-center px-4 pt-4 pb-3">
            {step > 1 && step <= 6 ? (
              <button onClick={handleBack} className="text-damber-navy/70 hover:text-damber-navy p-2 -ml-2" aria-label="Orqaga">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              <div className="w-10" />
            )}

            {step >= 1 && step <= 6 && (
              <p className="text-sm font-medium text-damber-navy">
                Bosqich {step} / 6
              </p>
            )}

            <button onClick={closePopup} className="text-damber-navy/70 hover:text-damber-navy p-2 -mr-2" aria-label="Yopish">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {step >= 1 && step <= 6 && (
            <div className="px-4 pb-4">
              <div className="bg-damber-light h-1 rounded-full overflow-hidden">
                <div
                  className="bg-damber-blue h-full rounded-full transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center px-6 pb-6 overflow-y-auto">

            {step === 1 && (
              <div className="max-w-md mx-auto w-full text-center">
                <h2 className="text-3xl font-bold text-damber-navy mb-4 leading-tight">
                  Mahsulot narxi
                  <br />
                  sizga maqul keladimi?
                </h2>
                <div className="bg-damber-light rounded-2xl p-5 mb-6">
                  <p className="text-xs text-damber-navy/60 mb-2 uppercase tracking-wider">Eslatma</p>
                  <p className="text-sm text-damber-navy leading-relaxed">
                    3D Zero Gravity — <b>16 900 000 so&apos;m</b>
                    <br />
                    Elegant Comfort — <b>14 500 000 so&apos;m</b>
                  </p>
                </div>
                <button
                  onClick={handleYes}
                  className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-4 rounded-2xl text-base font-bold mb-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  ✓ Ha, davom etish
                </button>
                <button
                  onClick={handleNo}
                  className="w-full bg-white text-damber-navy/60 hover:text-damber-navy border-2 border-gray-200 py-4 rounded-2xl text-base transition-colors"
                >
                  Yo&apos;q, to&apos;g&apos;ri kelmaydi
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold text-damber-navy mb-2 text-center leading-tight">
                  Ismingiz nima?
                </h2>
                <p className="text-sm text-damber-navy/60 mb-8 text-center">
                  Sizga qanday murojaat qilaylik
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Akmal"
                  autoFocus
                  className="w-full bg-damber-light border-2 border-damber-light focus:border-damber-blue rounded-2xl px-5 py-4 text-base text-damber-navy text-center placeholder:text-gray-400 focus:outline-none mb-3 transition-colors"
                />
                {errorMsg && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl mb-3 text-center">{errorMsg}</p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold text-damber-navy mb-2 text-center leading-tight">
                  Qaysi platforma orqali
                  <br />
                  bog&apos;lansak bo&apos;ladi?
                </h2>
                <p className="text-sm text-damber-navy/60 mb-8 text-center">
                  Tanlang
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {platforms.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => {
                        setPlatform(p.value);
                        setTimeout(() => setStep(4), 200);
                      }}
                      className={`py-4 rounded-2xl text-base font-medium transition-all ${
                        platform === p.value
                          ? "bg-damber-blue text-white shadow-lg"
                          : "bg-damber-light text-damber-navy border-2 border-transparent hover:border-damber-blue"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold text-damber-navy mb-2 text-center leading-tight">
                  {platform} ma&apos;lumotingiz?
                </h2>
                <p className="text-sm text-damber-navy/60 mb-8 text-center">
                  Username yoki telefon raqam
                </p>
                <input
                  type="text"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={platform ? platformPlaceholders[platform as Platform] : "@username"}
                  autoFocus
                  className="w-full bg-damber-light border-2 border-damber-light focus:border-damber-blue rounded-2xl px-5 py-4 text-base text-damber-navy text-center placeholder:text-gray-400 focus:outline-none mb-3 transition-colors"
                />
                {errorMsg && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl mb-3 text-center">{errorMsg}</p>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold text-damber-navy mb-2 text-center leading-tight">
                  Qaysi davlatdan
                  <br />
                  murojaat qilyapsiz?
                </h2>
                <p className="text-sm text-damber-navy/60 mb-8 text-center">
                  Davlatingizni yozing
                </p>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="AQSh, Turkiya, Janubiy Koreya..."
                  autoFocus
                  className="w-full bg-damber-light border-2 border-damber-light focus:border-damber-blue rounded-2xl px-5 py-4 text-base text-damber-navy text-center placeholder:text-gray-400 focus:outline-none mb-3 transition-colors"
                />
                {errorMsg && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl mb-3 text-center">{errorMsg}</p>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold text-damber-navy mb-2 text-center leading-tight">
                  Qaysi vaqtda
                  <br />
                  bog&apos;lansak bo&apos;ladi?
                </h2>
                <p className="text-sm text-damber-navy/60 mb-8 text-center">
                  Eng qulay vaqtingizni yozing
                </p>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Ertalab 9:00 - 11:00"
                  autoFocus
                  disabled={status === "loading"}
                  className="w-full bg-damber-light border-2 border-damber-light focus:border-damber-blue rounded-2xl px-5 py-4 text-base text-damber-navy text-center placeholder:text-gray-400 focus:outline-none mb-3 transition-colors disabled:opacity-60"
                />
                {errorMsg && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl mb-3 text-center">{errorMsg}</p>
                )}
              </div>
            )}

            {step === 7 && (
              <div className="max-w-md mx-auto w-full text-center">
                <div className="mx-auto mb-6 w-24 h-24 bg-damber-light rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-damber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-damber-navy mb-3">Rahmat!</h2>
                <p className="text-base text-damber-navy/60 mb-8 leading-relaxed">
                  E&apos;tiboringiz uchun rahmat.
                  <br />
                  Sog&apos;lik va omad tilaymiz!
                </p>
                <button
                  onClick={closePopup}
                  className="text-sm text-damber-navy/50 hover:text-damber-navy underline"
                >
                  Yopish
                </button>
              </div>
            )}

          </div>

          {(step === 2 || step === 4 || step === 5) && (
            <div className="px-6 pb-6">
              <button
                onClick={handleNext}
                className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-4 rounded-2xl text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Keyingisi →
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="px-6 pb-6">
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-4 rounded-2xl text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Yuborilmoqda..." : "✓ So'rov yuborish"}
              </button>
            </div>
          )}

        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
