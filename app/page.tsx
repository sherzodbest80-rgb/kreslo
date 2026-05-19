"use client";

import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import LeadForm, { type LeadFormHandle } from "@/components/LeadForm";
import Footer from "@/components/Footer";

export default function Home() {
  const formRef = useRef<LeadFormHandle>(null);

  const handleSelectProduct = (productName: string) => {
    formRef.current?.setProduct(productName);
    formRef.current?.scrollToForm();
  };

  return (
    <main>
      <Navbar />
      <Hero />
      <Products onSelectProduct={handleSelectProduct} />
      <LeadForm ref={formRef} />
      <Footer />
    </main>
  );
}
