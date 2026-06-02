import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LupaPasswordPage() {
  return (
    <main className="min-h-screen flex bg-slate-50">
      
      {/* SISI KIRI: Banner Promosi Gelap/Navy (Hanya muncul di Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-[#0f172a] p-12 flex-col justify-between relative overflow-hidden">
        
        {/* Logo CargoKu Kiri Atas */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-max hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center">
              <Image src="/logo.png" alt="Logo CargoKu" width={24} height={24} className="object-contain" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CargoKu <span className="text-teal-400">Lite</span></span>
          </Link>
        </div>

        {/* Teks Sambutan Tengah */}
        <div className="relative z-10 text-white mb-20">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            Tenang Saja,<br/>Kami Bantu Pulihkan.
          </h1>
          <p className="text-slate-300 text-base max-w-md leading-relaxed">
            Jangan khawatir jika kamu lupa password. Cukup masukkan data akunmu, dan kami akan mengirimkan link untuk meresetnya.
          </p>
        </div>

        {/* Footer Kiri Bawah */}
        <div className="relative z-10 text-slate-500 text-xs font-medium tracking-wide">
          &copy; {new Date().getFullYear()} CargoKu Lite Indonesia.
        </div>
      </div>

      {/* SISI KANAN: Form Reset Password Box Putih */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white md:rounded-l-[2rem] shadow-2xl">
        
        {/* Logo khusus tampilan Mobile (HP) */}
        <div className="md:hidden absolute top-6 left-6 flex items-center gap-2">
          <Link href="/" className="relative w-10 h-10 block">
            <Image src="/logo.png" alt="Logo CargoKu" fill className="object-contain" />
          </Link>
        </div>

        <div className="w-full max-w-md mt-16 md:mt-0">
          
          {/* Tombol Back */}
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 font-medium text-sm">
            <ArrowLeft size={16} /> Kembali ke Login
          </Link>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Reset Password</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">Masukkan email atau nomor HP yang terdaftar untuk me-reset password akun kamu.</p>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Email / No. Handphone</label>
              <input
                type="text"
                placeholder="Masukkan email / no. handphone"
                className="w-full border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-100 transition-all placeholder-slate-400 text-slate-800"
              />
            </div>

            <button
              type="button"
              className="w-full bg-[#0f172a] hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 active:scale-95 transition-all mt-4"
            >
              Kirim Link Reset
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-10">
            Butuh bantuan lain? <a href="#" className="font-bold text-slate-800 hover:underline">Hubungi CS</a>
          </p>
        </div>
      </div>
    </main>
  );
}