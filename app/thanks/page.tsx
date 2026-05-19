"use client";

import { useEffect, useState } from "react";

export default function ThanksPage() {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const eventId = window.localStorage.getItem("fb_lead_event_id");
    const fbq = (window as any).fbq;
    if (typeof fbq === "function" && eventId) {
      fbq("track", "Lead", { currency: "UZS", value: 0 }, { eventID: eventId });
      console.log("[Pixel] Lead event yuborildi, eventID:", eventId);
      window.localStorage.removeItem("fb_lead_event_id");
    }
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      window.location.href = "/";
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-5xl">✓</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Rahmat!</h1>
        <p className="text-gray-600 mb-6">
          Arizangiz muvaffaqiyatli qabul qilindi. Operatorlarimiz tez orada siz bilan bog&apos;lanishadi.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Bosh sahifaga qaytmoqdasiz... {seconds}
        </p>
        
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700"
        >
          Bosh sahifaga qaytish
        </a>
      </div>
    </main>
  );
}