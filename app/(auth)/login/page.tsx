"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  // Tambahan state untuk menangkap input tanpa mengubah UI
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const router = useRouter(); 

  // Fungsi saat tombol Masuk dipencet
  const handleLogin = (e) => {
    e.preventDefault(); 
    
    // LOGIKA POV SESUAI PERMINTAAN
    if (identifier === "admin@cargoku.com" && password === "12") {
      localStorage.setItem("userRole", "Admin");
      router.push("/admin/dashboard"); // Berubah jadi /admin/dashboard
    } else if (identifier === "user@gmail.com" && password === "12") {
      localStorage.setItem("userRole", "Pelanggan");
      // Nanti ini kita ubah juga kalau kamu udah bikin folder /user/dashboard
      // Tapi sementara biarin lari ke admin dulu aja nggak apa-apa biar nggak error
      router.push("/user/dashboard"); 
    } else {
      alert("Email atau Password salah! \nAdmin: admin@cargoku.com \nUser: user@gmail.com \nPass: 12");
    }
  };

  return (
    <main className="min-h-screen flex bg-white">
      
      {/* SISI KIRI: Banner Promosi Hijau */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#008f7a] via-[#008f7a] to-[#006a5a] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-max hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center">
              <Image src="/logo.png" alt="Logo CargoKu" width={24} height={24} className="object-contain" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CargoKu <span className="text-teal-200">Lite</span></span>
          </Link>
        </div>

        <div className="relative z-10 text-white mb-20">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            Kelola Logistik UMKM<br/>Lebih Mudah & Cepat.
          </h1>
          <p className="text-teal-50 text-base max-w-md leading-relaxed">
            Masuk ke dashboard sekarang untuk pantau resi, cek ongkir, dan nikmati diskon pengiriman spesial setiap harinya.
          </p>
        </div>

        <div className="relative z-10 text-teal-100/70 text-xs font-medium tracking-wide">
          &copy; {new Date().getFullYear()} CargoKu Lite Indonesia.
        </div>
      </div>

      {/* SISI KANAN: Form Login Box Putih */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        
        <div className="absolute top-8 left-6 md:top-12 md:left-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#ff7300] transition-colors font-medium text-sm">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>

        <div className="w-full max-w-md mt-12 md:mt-0">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Masuk Dashboard</h2>
          <p className="text-slate-500 text-sm mb-8">Selamat datang kembali! Silakan masuk ke akun kamu.</p>

          {/* Form menggunakan onSubmit yang memanggil handleLogin */}
          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Email / No. Handphone</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan email / no. handphone"
                className="w-full border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder-slate-400 text-slate-800"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full border border-slate-200 rounded-xl p-3.5 pr-12 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder-slate-400 text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-start">
              <Link href="/lupa-password" className="text-xs font-bold text-[#ff7300] hover:text-[#e66800] transition-colors">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff7300] hover:bg-[#e66800] text-white font-bold py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 active:scale-95 transition-all mt-4"
            >
              Masuk
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-10">
            Belum punya akun? 
            <Link href="/daftar" className="font-bold text-[#ff7300] hover:text-[#e66800] transition-colors ml-1">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}