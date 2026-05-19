import { Suspense } from "react";
import type { Metadata } from "next";
import InternationalLeadForm from "@/components/InternationalLeadForm";

export const metadata: Metadata = {
  title: "Ota-onangizni xursand qiling | Damber",
  description:
    "Masofadan turib ota-onangizni xursand qiling. Damber massaj kreslolari. O'zbekiston bo'ylab bepul yetkazib berish.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FormaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-damber-navy flex items-center justify-center text-white">
          Yuklanmoqda...
        </div>
      }
    >
      <InternationalLeadForm />
    </Suspense>
  );
}