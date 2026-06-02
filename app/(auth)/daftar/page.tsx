// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function DaftarPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex bg-white">
      
      {/* SISI KIRI: Banner Promosi (Hanya muncul di Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-orange-500 via-orange-400 to-red-500 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-max hover:opacity-80 transition-opacity">
            <div className="relative w-12 h-12 bg-white rounded-xl p-1 shadow-lg">
              <Image src="/logo.png" alt="Logo CargoKu" fill className="object-contain p-1" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">CargoKu <span className="text-orange-100">Lite</span></span>
          </Link>
        </div>

        <div className="relative z-10 text-white mb-20">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Mulai Langkah Baru<br/>Bersama Kami.
          </h1>
          <p className="text-orange-50 text-lg max-w-md leading-relaxed">
            Bergabunglah sekarang dan kembangkan bisnis UMKM-mu dengan jangkauan pengiriman ke seluruh Nusantara. Nikmati diskon hingga 40%!
          </p>
        </div>

        <div className="relative z-10 text-orange-100 text-sm font-medium">
          &copy; {new Date().getFullYear()} CargoKu Lite Indonesia.
        </div>
      </div>

      {/* SISI KANAN: Form Daftar */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        
        {/* Logo khusus tampilan Mobile */}
        <div className="md:hidden absolute top-6 left-6 flex items-center gap-2">
          <Link href="/" className="relative w-10 h-10 block">
            <Image src="/logo.png" alt="Logo CargoKu" fill className="object-contain" />
          </Link>
        </div>

        <div className="w-full max-w-md mt-16 md:mt-0 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Gabung Dashboard</h2>
          <p className="text-slate-500 text-sm mb-8">Isi data kamu untuk menikmati <span className="font-bold text-orange-600">DISKON s/d 40%</span></p>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex gap-1"><span className="text-red-500">*</span> Nomor Handphone</label>
              <div className="flex border border-slate-300 rounded-xl overflow-hidden focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition-all bg-white">
                <span className="bg-slate-50 px-4 py-3.5 text-slate-600 border-r border-slate-300 font-medium">+62</span>
                <input
                  type="text"
                  placeholder="(8) 000-0000"
                  className="w-full p-3.5 text-sm md:text-base outline-none placeholder-slate-400 text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex gap-1"><span className="text-red-500">*</span> Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="w-full border border-slate-300 rounded-xl p-3.5 pr-12 text-sm md:text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all placeholder-slate-400 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs md:text-sm text-slate-500 py-2">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div> Minimal 1 huruf kapital</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div> Minimal 1 angka</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div> Minimal 1 huruf kecil</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div> Minimal 8 karakter</div>
            </div>

            <label className="flex items-start gap-3 mt-4 cursor-pointer group">
              <input type="checkbox" className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer" />
              <span className="text-sm text-slate-600 leading-relaxed">
                Dengan mendaftar, kamu setuju dengan <a href="#" className="font-bold text-teal-600 hover:underline">Syarat & Ketentuan serta Privacy Policy</a> yang ada di PT. CargoKu Ekspedisi Indonesia.
              </span>
            </label>

            <button
              type="button"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all mt-6"
            >
              Daftar Sekarang
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-10">
            Sudah punya akun? 
            <Link href="/login" className="font-bold text-teal-600 hover:text-teal-700 transition-colors ml-1">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}