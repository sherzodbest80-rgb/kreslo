"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Platform = "Telegram" | "WhatsApp" | "KakaoTalk" | "IMO" | "Boshqa";

const platforms: { value: Platform; label: string; icon: string }[] = [
  { value: "Telegram", label: "Telegram", icon: "✈️" },
  { value: "WhatsApp", label: "WhatsApp", icon: "💬" },
  { value: "KakaoTalk", label: "KakaoTalk", icon: "💛" },
  { value: "IMO", label: "Imo", icon: "📱" },
  { value: "Boshqa", label: "Boshqa", icon: "•••" },
];

const platformPlaceholders: Record<Platform, string> = {
  Telegram: "@username yoki +1 234 567 8900",
  WhatsApp: "+1 234 567 8900",
  KakaoTalk: "Telefon raqam yoki ID",
  IMO: "+998 90 123 45 67",
  Boshqa: "Username yoki raqam",
};

const platformLabels: Record<Platform, string> = {
  Telegram: "Telefon raqam yoki username",
  WhatsApp: "WhatsApp raqamingiz",
  KakaoTalk: "Telefon raqam yoki ID",
  IMO: "IMO raqamingiz",
  Boshqa: "Username yoki raqamingiz",
};

export default function InternationalLeadForm() {
  const searchParams = useSearchParams();
  const productFromUrl = searchParams.get("product") || "";

  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Platform>("Telegram");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (name.trim().length < 2) {
      setStatus("error");
      setErrorMsg("Iltimos, ismingizni kiriting");
      return;
    }

    if (contactValue.trim().length < 3) {
      setStatus("error");
      setErrorMsg("Iltimos, username yoki telefon raqamingizni kiriting");
      return;
    }

    if (country.trim().length < 2) {
      setStatus("error");
      setErrorMsg("Iltimos, qaysi davlatdan ekanligingizni yozing");
      return;
    }

    if (time.trim().length < 2) {
      setStatus("error");
      setErrorMsg("Iltimos, qulay vaqtni kiriting");
      return;
    }

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

  return (
    <section className="min-h-screen bg-gradient-to-b from-damber-navy to-damber-navy-deep text-white relative overflow-hidden py-12 px-5">
      <div className="absolute top-0 left-0 w-72 h-72 bg-damber-blue opacity-15 blur-3xl rounded-full -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-damber-blue opacity-10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-md mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 bg-damber-blue/15 text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium mb-4 border border-damber-blue/30">
          <span>❤️</span>
          Ota-onangiz uchun sovg'a
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight mb-6">
          Masofadan turib
          <br />
          <span className="text-damber-blue">OTA-ONANGIZNI</span>
          <br />
          xursand qiling
        </h1>

        <div className="bg-white rounded-2xl p-5 sm:p-6 text-left shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="bg-gradient-to-r from-damber-accent to-damber-light border-l-2 border-damber-blue rounded-md p-3 mb-5 flex gap-2 items-start">
              <span className="text-damber-blue text-base flex-shrink-0">ℹ️</span>
              <p className="text-xs text-damber-navy leading-snug m-0">
                Ushbu formani diqqat bilan to&apos;ldiring va menejerlarimiz siz bilan bog&apos;lanib ma&apos;lumot berishadi
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-damber-navy mb-2">
                Ismingiz
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Akmal"
                disabled={status === "loading"}
                required
                className="w-full bg-damber-light border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-damber-navy placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 disabled:opacity-60"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-damber-navy mb-2">
                Siz bilan qaysi platformada bog&apos;lansak bo&apos;ladi?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {platforms.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlatform(p.value)}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                      platform === p.value
                        ? "bg-damber-blue text-white"
                        : "bg-damber-light text-damber-navy border border-gray-200 hover:border-damber-blue"
                    }`}
                  >
                    <span className="text-sm">{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-damber-navy mb-2">
                {platformLabels[platform]}
              </label>
              <input
                type="text"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={platformPlaceholders[platform]}
                disabled={status === "loading"}
                required
                className="w-full bg-damber-light border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-damber-navy placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 disabled:opacity-60"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-damber-navy mb-2">
                Qaysi davlatdan murojaat qilyapsiz?
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Masalan: AQSh, Turkiya, Janubiy Koreya"
                disabled={status === "loading"}
                required
                className="w-full bg-damber-light border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-damber-navy placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 disabled:opacity-60"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-bold text-damber-navy mb-2">
                Siz bilan qaysi vaqtda bog&apos;lansak bo&apos;ladi?
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Masalan: ertalab 9:00–11:00"
                disabled={status === "loading"}
                required
                className="w-full bg-damber-light border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-damber-navy placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 disabled:opacity-60"
              />
            </div>

            {status === "error" && errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md mb-3">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Yuborilmoqda..." : "So'rov yuborish →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}