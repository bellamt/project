"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Menu, X, Globe2, Scale, LayoutDashboard } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("resi");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="pb-10 bg-slate-50 min-h-screen flex flex-col font-sans">
      
      {/* NAVBAR */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center py-4 px-6 md:px-16">
          <div className="flex items-center gap-8 md:gap-12">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
                <Image src="/logo.png" alt="Logo CargoKu" fill className="object-contain" />
              </div>
              <h1 className="text-xl md:text-2xl font-black italic text-slate-800 tracking-tight hidden sm:block">
                CargoKu <span className="text-teal-600">Lite</span>
              </h1>
            </Link>

            {/* NAVIGASI DESKTOP */}
            <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
              <Link href="/layanan" className="hover:text-teal-600 transition-colors">Layanan</Link>
              <Link href="/perusahaan" className="hover:text-teal-600 transition-colors cursor-pointer">Perusahaan</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            {/* TOMBOL LOGIN (SUDAH DIGANTI) */}
            <Link href="/login" className="bg-[#bd3232] hover:bg-red-800 text-white text-xs md:text-sm font-bold py-2 md:py-2.5 px-4 md:px-6 rounded-full transition-all active:scale-95 shadow-md">
              Login
            </Link>
            
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600 bg-slate-100 rounded-full">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-xl py-4 px-6 flex flex-col gap-4 z-50 animate-in slide-in-from-top-2 duration-200">
            <Link href="/layanan" onClick={() => setIsMenuOpen(false)} className="text-slate-700 font-bold hover:text-teal-600">Layanan</Link>
            <Link href="/perusahaan" onClick={() => setIsMenuOpen(false)} className="text-slate-700 font-bold hover:text-teal-600">Perusahaan</Link>
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[#bd3232] font-bold border-t border-slate-100 pt-4">Login</Link>
          </div>
        )}
      </header>

      {/* HERO BANNER */}
      <section className="relative w-full h-[300px] md:h-[450px] bg-teal-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 z-10 pb-16 md:pb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 italic drop-shadow-lg leading-tight tracking-tight">
            KIRIM MAKIN MUDAH LEWAT
            <br className="hidden md:block"/> CARGOKU DASHBOARD!
          </h2>
          <p className="text-teal-50 text-sm md:text-lg font-medium opacity-90">
            Solusi Logistik Ramah, Cepat, dan Transparan untuk UMKM Indonesia
          </p>
        </div>
      </section>

      {/* FLOATING WIDGET (CEK RESI & ONGKIR) */}
      <section className="relative -mt-20 md:-mt-24 px-4 md:px-16 z-20 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8 border border-slate-200">
          
          {/* TAB YANG SUDAH DISERET KE TENGAH (mx-auto) */}
          <div className="flex border-b border-slate-200 mb-8 max-w-sm mx-auto">
            <button onClick={() => setActiveTab("resi")} className={`flex-1 py-3.5 text-center font-bold text-sm transition-all ${activeTab === "resi" ? "text-[#bd3232] border-b-2 border-[#bd3232]" : "text-slate-500 hover:text-slate-800"}`}>
              Cek Resi
            </button>
            <button onClick={() => setActiveTab("ongkir")} className={`flex-1 py-3.5 text-center font-bold text-sm transition-all ${activeTab === "ongkir" ? "text-[#bd3232] border-b-2 border-[#bd3232]" : "text-slate-500 hover:text-slate-800"}`}>
              Cek Ongkir
            </button>
          </div>

          <div className="min-h-[70px]">
            {activeTab === "resi" ? (
              <div className="flex flex-col md:flex-row gap-4 animate-in fade-in duration-300">
                <div className="flex-1 border border-slate-300 rounded-xl px-5 py-4 flex items-center gap-3 focus-within:border-[#bd3232] focus-within:ring-1 focus-within:ring-[#bd3232]/30 transition-all bg-white">
                  <Search className="text-slate-400" size={20} />
                  <input type="text" placeholder="Masukkan nomor resi Anda untuk melacak paket..." className="bg-transparent border-none outline-none w-full text-slate-900 font-medium text-sm placeholder-slate-400" />
                </div>
                <button className="bg-[#bd3232] hover:bg-red-800 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-md active:scale-95 text-sm">Lacak</button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col md:flex-row gap-4">
                  <input type="text" placeholder="Asal" className="flex-1 border border-slate-300 rounded-xl px-5 py-4 outline-none focus:border-[#bd3232] focus:ring-1 focus:ring-[#bd3232]/30 transition-all text-sm text-slate-900 font-medium placeholder-slate-400 bg-white" />
                  <input type="text" placeholder="Tujuan" className="flex-1 border border-slate-300 rounded-xl px-5 py-4 outline-none focus:border-[#bd3232] focus:ring-1 focus:ring-[#bd3232]/30 transition-all text-sm text-slate-900 font-medium placeholder-slate-400 bg-white" />
                  <input type="text" placeholder="Berat" className="flex-1 border border-slate-300 rounded-xl px-5 py-4 outline-none focus:border-[#bd3232] focus:ring-1 focus:ring-[#bd3232]/30 transition-all text-sm text-slate-900 font-medium placeholder-slate-400 bg-white" />
                  <button className="bg-[#bd3232] hover:bg-red-800 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-md active:scale-95 text-sm whitespace-nowrap">
                    Cek
                  </button>
                </div>
                <p className="text-slate-500 text-sm mt-4 ml-1">Masukkan asal, tujuan & berat barang Anda</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* KEUNGGULAN KAMI */}
      <section className="mt-20 md:mt-32 px-6 md:px-16 max-w-6xl mx-auto text-center w-full">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-12 tracking-tight">
          Pilihan tepat, pilih <span className="text-teal-600">CargoKu Lite!</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
            <Scale className="text-orange-500 mb-4" size={32} />
            <h3 className="font-bold text-slate-800 text-lg">Biaya Kompetitif</h3>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
            <Globe2 className="text-teal-600 mb-4" size={32} />
            <h3 className="font-bold text-slate-800 text-lg">Jangkauan Luas</h3>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform px-4">
            <LayoutDashboard className="text-rose-600 mb-4" size={32} />
            <h3 className="font-bold text-slate-800 text-lg leading-snug">Kelola Bisnis melalui All-In-One Dashboard</h3>
          </div>
        </div>
      </section>

      {/* PILIHAN LAYANAN */}
      <section className="mt-20 px-6 md:px-16 max-w-5xl mx-auto pt-16 border-t border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Layanan Pengiriman</h2>
          <p className="text-slate-500 text-sm">Solusi lengkap untuk kebutuhan logistik bisnis Anda.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          {[
            { id: "EXPRESS", name: "express" },
            { id: "REGULAR", name: "regular" },
            { id: "ECONOMY", name: "economy" }
          ].map((item, idx) => (
            <div key={idx} className="flex-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-500 transition-all group cursor-pointer">
              <div className="bg-[#008f7a] text-white w-max px-4 py-1.5 rounded-lg font-black italic text-[11px] tracking-widest mb-6">
                {item.id}
              </div>
              <h3 className="font-bold text-slate-800 text-xl mb-3">CargoKu {item.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Pengiriman handal dan terpercaya sampai ke tangan pelanggan Anda.
              </p>
              <span className="text-[#008f7a] font-bold text-sm group-hover:text-teal-800 transition-colors">
                Klik untuk detail →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-6 py-12 text-center mt-20 border-t border-slate-200 bg-white">
        <p className="text-slate-400 text-sm font-bold">
          &copy; {new Date().getFullYear()} CargoKu Lite Indonesia. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}