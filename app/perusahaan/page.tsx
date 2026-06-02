// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";

export default function PerusahaanPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">
      
      {/* NAVBAR (Sama dengan Home) */}
      <header className="h-20 bg-white flex items-center justify-between px-6 md:px-12 sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 shrink-0">
              <Image src="/logo.png" alt="CargoKu Logo" fill className="object-contain" />
            </div>
            <span className="font-black text-xl italic tracking-tight text-slate-800">
              CargoKu <span className="text-[#008f7a]">Lite</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500">
            <Link href="/" className="hover:text-slate-800">Layanan</Link>
            <Link href="/perusahaan" className="text-slate-800 border-b-2 border-slate-800 pb-1">Perusahaan</Link>
          </nav>
        </div>
        <div>
          <button className="bg-[#bd3232] hover:bg-red-800 text-white font-bold py-2 px-5 rounded-full text-xs shadow-md transition-all active:scale-95">
            Diskon UMKM s/d 55%
          </button>
        </div>
      </header>

      {/* HERO JUDUL */}
      <section className="pt-20 pb-12 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          Berawal dari Mendengar, Berakhir dengan <span className="text-amber-500">Solusi Logistik Nyata</span> untuk Pertumbuhan Bisnis Anda.
        </h1>
      </section>

      {/* CERITA CARGOKU */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center gap-12">
           {/* Kiri: Lingkaran Logo */}
           <div className="w-48 h-48 rounded-full bg-[#008f7a] shrink-0 flex flex-col items-center justify-center text-white shadow-lg">
             <Truck size={40} className="mb-2" />
             <span className="font-black text-xl italic tracking-tight leading-none text-center">CARGOKU<br/>LITE</span>
           </div>
           
           {/* Kanan: Teks Sejarah */}
           <div className="flex-1 space-y-4 text-sm font-medium text-slate-700 leading-relaxed text-justify md:text-left">
             <p>
               CargoKu Lite lahir di tahun 2026 bukan sekadar dari ide di atas kertas. Kami mengawali langkah dengan turun langsung ke lapangan, melakukan wawancara mendalam dengan para kurir freelance dan pelaku UMKM.
             </p>
             <p>
               Dari keluh kesah dan kebutuhan nyata yang kami kumpulkan, CargoKu Lite dikembangkan secara khusus untuk menutup celah pada sistem logistik konvensional—menghadirkan layanan yang lebih fleksibel, transparan, dan tanpa syarat yang memberatkan.
             </p>
           </div>
        </div>
      </section>

      {/* 2 KOTAK KOSONG ABU-ABU */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="h-48 bg-slate-200/60 rounded-2xl"></div>
           <div className="h-48 bg-slate-200/60 rounded-2xl"></div>
        </div>
      </section>

      {/* LATAR BELAKANG */}
      <section className="py-16 px-6 max-w-4xl mx-auto w-full text-center">
        <h2 className="text-2xl md:text-3xl font-black italic text-slate-800 mb-2">Latar Belakang Pengembangan CargoKu Lite</h2>
        <p className="text-sm font-medium text-slate-500 mb-16">Dari sebuah riset lapangan menuju platform solusi logistik.</p>
        
        <div className="flex flex-col md:flex-row items-stretch gap-12 text-left">
           {/* Kiri: Teks Proses */}
           <div className="flex-1 space-y-4">
             <h3 className="text-lg font-black text-[#bd3232] mb-4">Proses Development</h3>
             <p className="text-xs font-medium text-slate-700 leading-relaxed">
               Perjalanan aplikasi ini dimulai dari sebuah observasi sistem informasi di tahun 2026. Tidak sekadar membangun aplikasi, tim developer CargoKu melakukan riset langsung di wilayah Yogyakarta, mewawancarai pemilik usaha kecil yang kesulitan memantau ongkos kirim dan manajemen resi secara real-time.
             </p>
             <p className="text-xs font-medium text-slate-700 leading-relaxed">
               Berbekal data wawancara tersebut, CargoKu Lite di-develop dengan memprioritaskan fitur antarmuka yang bersih (clean UI), alur pembuatan pesanan yang cepat, serta transparansi tarif. Setiap kode yang kami tulis bertujuan untuk menjawab keresahan nyata di lapangan.
             </p>
           </div>

           {/* Kanan: Kotak Abu Vertikal */}
           <div className="w-full md:w-64 h-64 bg-slate-200/60 rounded-2xl shrink-0"></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-8 text-center border-t border-slate-200">
        <p className="text-xs font-bold text-slate-400">© 2026 CargoKu Lite Indonesia. All Rights Reserved.</p>
      </footer>

    </div>
  );
}