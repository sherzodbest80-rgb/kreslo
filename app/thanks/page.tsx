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
      console.log("Pixel Lead yuborildi:", eventId);
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
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "400px", width: "100%", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "60px", marginBottom: "20px" }}>✓</div>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px", color: "#111" }}>Rahmat!</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Arizangiz muvaffaqiyatli qabul qilindi. Operatorlarimiz tez orada siz bilan bog&apos;lanishadi.
        </p>
        <p style={{ fontSize: "14px", color: "#999", marginBottom: "20px" }}>
          Bosh sahifaga qaytmoqdasiz... {seconds}
        </p>
        <a href="/" style={{ display: "inline-block", backgroundColor: "#1A8FFF", color: "white", padding: "12px 24px", borderRadius: "999px", fontWeight: "bold", textDecoration: "none" }}>
          Bosh sahifaga qaytish
        </a>
      </div>
    </main>
  );
}