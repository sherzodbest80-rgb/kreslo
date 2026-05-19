"use client";

import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { siteConfig } from "@/lib/data";

export type LeadFormHandle = {
  setProduct: (productName: string) => void;
  scrollToForm: () => void;
};

const LeadForm = forwardRef<LeadFormHandle>((_, ref) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    setProduct: (productName: string) => {
      setProduct(productName);
    },
    scrollToForm: () => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  }));

  // Telefon raqamini formatlash: +998 __ ___ __ __
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    let formatted = "+998 ";
    if (digits.length > 3) formatted += digits.slice(3, 5);
    if (digits.length > 5) formatted += " " + digits.slice(5, 8);
    if (digits.length > 8) formatted += " " + digits.slice(8, 10);
    if (digits.length > 10) formatted += " " + digits.slice(10, 12);
    return formatted.trim();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    // Validatsiya
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 12) {
      setStatus("error");
      setErrorMsg("Iltimos, to'liq telefon raqamini kiriting");
      return;
    }
    if (name.trim().length < 2) {
      setStatus("error");
      setErrorMsg("Iltimos, ismingizni kiriting");
      return;
    }

    try {
      // FB cookies o'qish (EMQ uchun)
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      // Pixel bilan dedup uchun event_id
      const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("fb_lead_event_id", eventId);
      }

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: "+" + phoneDigits,
          product: product || "Ko'rsatilmagan",
          source: "homepage",
          fbp: cookies._fbp || "",
          fbc: cookies._fbc || "",
          userAgent: navigator.userAgent,
          pageUrl: window.location.href,
          event_id: eventId,
        }),
      });

      if (!response.ok) throw new Error("Server xatosi");

      // /thanks sahifaga o'tkazamiz
      window.location.href = "/thanks";
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMsg("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki qo'ng'iroq qiling.");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-damber-navy text-white py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-damber-blue rounded-full filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-damber-blue rounded-full filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3">
          Bepul konsultatsiya oling
        </h2>
        <p className="text-sm sm:text-base text-blue-200 mb-8 max-w-md mx-auto leading-relaxed">
          Telefoningizni qoldiring — 5 daqiqa ichida bog&apos;lanamiz va
          savollaringizga javob beramiz
        </p>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-2xl">
          {status === "success" ? (
            <SuccessState
              onReset={() => setStatus("idle")}
              phone={siteConfig.phone}
            />
          ) : (
            <form onSubmit={handleSubmit} className="text-left space-y-4">
              {/* Selected product (hidden but visible if selected) */}
              {product && (
                <div className="bg-damber-accent text-damber-blue text-xs px-3 py-2 rounded-lg flex items-center justify-between">
                  <span>
                    Tanlangan model: <strong>{product}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setProduct("")}
                    className="text-damber-blue/60 hover:text-damber-blue"
                    aria-label="Olib tashlash"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Name input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs text-gray-600 mb-1.5 font-medium"
                >
                  Ismingiz
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Akmal"
                  required
                  disabled={status === "loading"}
                  className="w-full bg-damber-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-damber-navy placeholder:text-gray-400 focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 transition-all disabled:opacity-60"
                />
              </div>

              {/* Phone input */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs text-gray-600 mb-1.5 font-medium"
                >
                  Telefon raqamingiz
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={() => !phone && setPhone("+998 ")}
                  placeholder="+998 __ ___ __ __"
                  required
                  disabled={status === "loading"}
                  className="w-full bg-damber-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-damber-navy placeholder:text-gray-400 focus:border-damber-blue focus:ring-2 focus:ring-damber-blue/20 transition-all disabled:opacity-60"
                />
              </div>

              {/* Error message */}
              {status === "error" && errorMsg && (
                <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-damber-blue hover:bg-damber-blue-dark text-white py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Yuborilmoqda..." : "Qo'ng'iroqni so'rash"}
              </button>

              {/* Privacy note */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Ma&apos;lumotlaringiz xavfsiz
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
});

LeadForm.displayName = "LeadForm";

function SuccessState({
  onReset,
  phone,
}: {
  onReset: () => void;
  phone: string;
}) {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1D9E75"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-damber-navy mb-2">
        Rahmat! So&apos;rovingiz qabul qilindi
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Tez orada bog&apos;lanamiz. Iltimos, telefoningizni yoqilgan holda
        qoldiring.
      </p>
      <p className="text-xs text-gray-500 mb-4">
        Tezroq aloqaga chiqish uchun:{" "}
        <a
          href={`tel:${phone}`}
          className="text-damber-blue font-medium hover:underline"
        >
          {phone}
        </a>
      </p>
      <button
        onClick={onReset}
        className="text-xs text-damber-blue hover:underline"
      >
        Yana so&apos;rov yuborish
      </button>
    </div>
  );
}

export default LeadForm;
