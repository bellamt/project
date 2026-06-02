"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock } from "lucide-react";

// Data 3 Layanan CargoKu Lite
const services = {
  EXPRESS: {
    id: "EXPRESS",
    title: "CARGOKU EXPRESS",
    desc: "Prioritas pengiriman kilat sampai tujuan di keesokan harinya untuk kota besar.",
    features: [
      "Menjangkau kota-kota besar di Indonesia.",
      "Estimasi durasi waktu pengiriman 1 hari."
    ]
  },
  REGULAR: {
    id: "REGULAR",
    title: "CARGOKU REGULAR",
    desc: "Pengiriman cepat dengan Harga Regular tanpa biaya tambahan ke seluruh pelosok Nusantara.",
    features: [
      "Menjangkau seluruh wilayah di Indonesia.",
      "Estimasi durasi waktu pengiriman 1-3 hari."
    ]
  },
  ECONOMY: {
    id: "ECONOMY",
    title: "CARGOKU ECONOMY",
    desc: "Layanan pengiriman dengan tarif super hemat, bersahabat untuk menekan biaya operasional UMKM.",
    features: [
      "Menjangkau seluruh wilayah di Indonesia.",
      "Estimasi durasi waktu pengiriman 3-5 hari."
    ]
  }
};

export default function LayananPage() {
  // Default tab yang menyala adalah REGULAR
  const [activeTab, setActiveTab] = useState("REGULAR");
  const activeData = services[activeTab];

  return (
    <main className="min-h-screen bg-[#1c3f4c] text-white font-sans flex flex-col items-center justify-center relative p-6 overflow-hidden">
      
      {/* TOMBOL KEMBALI KE BERANDA */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 z-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/40 px-5 py-2.5 rounded-full text-sm font-bold transition-all backdrop-blur-sm border border-white/10 shadow-lg"
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>
      </div>

      {/* TABS (Tinggal 3: EXPRESS, REGULAR, ECONOMY) */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16 mt-24 z-10">
        {Object.keys(services).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-8 py-2.5 rounded-full text-sm font-bold border transition-all active:scale-95 ${
              activeTab === key 
                ? "bg-[#0b212d] border-[#0b212d] shadow-inner text-white" 
                : "border-white/30 hover:border-white/60 bg-transparent text-white/80 hover:text-white"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* KONTEN LAYANAN */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 max-w-5xl w-full z-10 animate-in fade-in zoom-in-95 duration-500" 
        key={activeTab} // Key ini bikin animasinya kerestart pas tab diganti
      >
        
        {/* KOTAK KIRI (Teks Besar) */}
        <div className="w-full md:w-auto flex justify-center">
          <div className="border-[3px] border-white rounded-2xl px-12 py-10 flex items-center justify-center shadow-2xl bg-white/5 backdrop-blur-sm min-w-[280px] md:min-w-[350px]">
            <h2 className="text-4xl md:text-6xl font-black tracking-widest drop-shadow-md">
              {activeData.id}
            </h2>
          </div>
        </div>

        {/* TEKS KANAN (Detail Layanan) */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{activeData.title}</h1>
          <p className="text-white/80 leading-relaxed text-sm md:text-base font-medium">
            {activeData.desc}
          </p>
          
          <div className="space-y-4 pt-4 inline-block text-left">
            <div className="flex items-start gap-4">
              <MapPin size={22} className="shrink-0 text-teal-400 mt-0.5" />
              <span className="font-medium text-white/90">{activeData.features[0]}</span>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={22} className="shrink-0 text-teal-400 mt-0.5" />
              <span className="font-medium text-white/90">{activeData.features[1]}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Background Dekorasi Bias (Opsional biar makin manis) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    </main>
  );
}