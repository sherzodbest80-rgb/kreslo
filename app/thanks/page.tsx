"use client";

import { useEffect, useState } from "react";

const COUNTDOWN_SECONDS = 10;

export default function ThanksPage() {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const eventId = window.localStorage.getItem("fb_lead_event_id");

    const fireLeadEvent = () => {
      const fbq = (window as any).fbq;
      if (typeof fbq !== "function") return false;

      if (eventId) {
        fbq(
          "track",
          "Lead",
          { currency: "UZS", value: 0 },
          { eventID: eventId }
        );
        console.log("[Pixel] Lead event yuborildi, eventID:", eventId);
      } else {
        console.warn("[Pixel] event_id yo'q, Lead event yuborilmadi");
      }

      window.localStorage.removeItem("fb_lead_event_id");
      return true;
    };

    if (!fireLeadEvent()) {
      const intervalId = setInterval(() => {
        if (fireLeadEvent()) clearInterval(intervalId);
      }, 200);
      setTimeout(() => clearInterval(intervalId), 5000);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (seconds <= 0) {
      window.location.href = "/";
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const progress = ((COUNTDOWN_SECONDS - seconds) / COUNTDOWN_SECONDS) * 100;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <main className="min-h-screen bg-damber-light flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 lg:p-16 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 animate-bounce-slow">
            <svg
              className="h-14 w-14 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-damber-navy mb-4">
            Rahmat! 🎉
          </h1>

          <p className="text-lg sm:text-xl text-damber-navy/70 mb-2">
            Arizangiz muvaffaqiyatli qabul qilindi
          </p>

          <p className="text-base text-damber-navy/60 mb-8 leading-7">
            Damber operatorlarimiz tez orada siz bilan bog&apos;lanishadi.
          </p>

          <div className="relative mx-auto mb-6 h-44 w-44">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#1A8FFF"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: "stroke-dashoffset 1s linear",
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                key={seconds}
                className="text-6xl font-black text-damber-navy animate-pulse-once"
              >
                {seconds}
              </span>
              <span className="text-xs uppercase tracking-wider text-damber-navy/50 mt-1">
                soniya
              </span>
            </div>
          </div>

          <p className="text-sm text-damber-navy/60 mb-6">
            Bosh sahifaga qaytmoqdasiz...
          </p>

          
            href="/"
            className="inline-flex items-center gap-3 rounded-full bg-damber-blue hover:bg-damber-blue-dark px-8 py-4 font-bold text-white shadow-lg hover:scale-105 transition-all"
          >
            ← Bosh sahifaga qaytish
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-once {
          0% {
            transform: scale(1.3);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-pulse-once {
          animation: pulse-once 0.4s ease-out;
        }
      `}</style>
    </main>
  );
}