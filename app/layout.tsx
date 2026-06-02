import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "CargoKu Lite | Pengiriman Ramah UMKM",
  description: "Sistem pengiriman ringan dan ramah untuk UMKM dan kurir freelance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} font-sans bg-slate-50 text-slate-800 antialiased min-h-screen relative overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}