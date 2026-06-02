import Link from "next/link";
import { LayoutDashboard, Package, Users, Settings, LogOut } from "lucide-react";

export default function SidebarAdmin() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-teal-700 tracking-tight">CargoKu<span className="text-gray-400">Lite</span></h2>
      </div>
      
      <nav className="flex-1 space-y-2">
        <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 bg-teal-50 text-teal-700 rounded-xl font-semibold">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="#" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl">
          <Package size={20} /> Data Pesanan
        </Link>
        <Link href="#" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl">
          <Users size={20} /> Pelanggan
        </Link>
      </nav>

      <div className="pt-6 border-t">
        <Link href="/" className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium">
          <LogOut size={20} /> Logout
        </Link>
      </div>
    </aside>
  );
}