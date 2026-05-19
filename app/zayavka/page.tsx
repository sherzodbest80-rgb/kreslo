import { Suspense } from "react";
import type { Metadata } from "next";
import InternalLeadForm from "@/components/InternalLeadForm";

export const metadata: Metadata = {
  title: "Bepul konsultatsiya | Damber",
  description:
    "Telefoningizni qoldiring, biz siz bilan tez orada bog'lanamiz. Damber massaj kreslolari. Bepul yetkazib berish.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ZayavkaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-damber-light flex items-center justify-center text-damber-navy">
          Yuklanmoqda...
        </div>
      }
    >
      <InternalLeadForm />
    </Suspense>
  );
}