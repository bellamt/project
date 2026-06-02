// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  LayoutDashboard, Package, MapPin, Menu, X, 
  Moon, Sun, Wallet, Search, Settings, Calculator, ChevronDown, Info, Store, LogOut, TrendingUp
} from "lucide-react";

export default function UserDashboardPage() {
  const [activeMenu, setActiveMenu] = useState("dashboard"); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const [userProfile, setUserProfile] = useState({
    nama: "Alika Kristin Malau", noHp: "6285840400040", email: "", perusahaan: "", alamat: ""
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...userProfile });
  const [orders, setOrders] = useState([
    { resi: "CGK-2004", itemName: "Gamis Syari", date: "20/4/2026", sender: "Alika Store", receiver: "Rina Marlina", status: "PROSES", service: "EXPRESS", fee: "Rp25.000" }, 
    { resi: "CGK-2006", itemName: "Skincare Serum", date: "19/4/2026", sender: "Alika Store", receiver: "Dewi Lestari", status: "SELESAI", service: "EXPRESS", fee: "Rp22.000" }, 
    { resi: "CGK-2012", itemName: "Hoodie Polos", date: "17/4/2026", sender: "Alika Store", receiver: "Indah Permatasari", status: "SELESAI", service: "ECONOMY", fee: "Rp10.000" }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOrders = await fetch('/api/orders');
        if (resOrders.ok && resOrders.headers.get('content-type')?.includes('application/json')) {
          const data = await resOrders.json();
          if (data && data.length > 0) {
            setOrders(data.map((o: any) => ({
              resi: o.no_resi, itemName: o.nama_barang || "Paket Barang Umum", date: new Date(o.tgl_pesanan).toLocaleDateString('id-ID'),
              sender: o.pengirim?.nama_pengirim || "Unknown", receiver: o.penerima?.nama_penerima || "Unknown",
              status: o.status, service: o.layanan || "REGULAR", fee: `Rp${o.total_bayar.toLocaleString('id-ID')}`
            })));
          }
        }
      } catch (err) { console.warn("API Orders error"); }
    };

    fetchData();
  }, []);

  const displayedOrders = orders.filter(o => o.sender.toLowerCase().includes("alika"));
  const totalOrdersCount = displayedOrders.length; 
  const activeOrdersCount = displayedOrders.filter(o => o.status.toUpperCase() !== "SELESAI").length;
  const completedOrdersCount = displayedOrders.filter(o => o.status.toUpperCase() === "SELESAI").length;
  const successRate = totalOrdersCount > 0 ? Math.round((completedOrdersCount / totalOrdersCount) * 100) : 0;
  const formattedSpent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(displayedOrders.reduce((sum, o) => sum + (parseInt(o.fee.replace(/\D/g, '')) || 0), 0));

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [shippingResults, setShippingResults] = useState([]);
  const [submittedRoute, setSubmittedRoute] = useState(null); 
  const mockLocations = ["Pakem, Kab. Sleman", "Depok, Kab. Sleman", "Tambun Utara, Kab. Bekasi", "Menteng, Kota Jakarta Pusat", "Cicendo, Kota Bandung"];

  const handleSaveProfile = () => { setUserProfile({ ...tempProfile }); setIsEditProfileOpen(false); };

  const handleCekOngkir = () => { 
    if (!origin || !destination || !weight) { alert("Harap isi Asal, Tujuan, dan Berat paket!"); return; }
    setSubmittedRoute({ origin, destination });
    const finalWeight = Math.ceil(Math.max(parseFloat(weight) || 1, (parseFloat(length)*parseFloat(width)*parseFloat(height))/6000 || 0)); 
    setShippingResults([
      { service: "EXPRESS", desc: "Pengiriman Super Cepat Besok Sampai", price: `Rp ${(finalWeight * 25000).toLocaleString('id-ID')}`, estimation: "1 hari" },
      { service: "REGULAR", desc: "Pengiriman Cepat & Murah", price: `Rp ${(finalWeight * 15000).toLocaleString('id-ID')}`, estimation: "2 - 4 hari" },
      { service: "ECONOMY", desc: "Pengiriman Dalam Jumlah Banyak", price: `Rp ${(finalWeight * 10000).toLocaleString('id-ID')}`, estimation: "4 - 7 hari" },
    ]);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pesanan", label: "Pesanan Saya", icon: Package },
    { id: "cek-ongkir", label: "Cek Ongkir", icon: Search },
    { id: "pengaturan", label: "Pengaturan", icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Halo, {userProfile.nama}! 👋</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-[1.5rem] border shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div>
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">PAKET SEDANG DIPROSES</p>
            <div className="flex items-baseline gap-2 mt-4"><h3 className="text-5xl font-black text-[#008f7a]">{activeOrdersCount}</h3><span className="text-xl font-bold text-slate-500">Paket</span></div>
          </div>
          <button onClick={() => setActiveMenu("pesanan")} className="mt-8 text-[#008f7a] text-sm font-bold bg-[#e6f4f2] px-6 py-3 rounded-2xl w-fit transition-colors hover:bg-teal-100">
            Lihat Daftar Paket →
          </button>
        </div>

        <div className={`p-6 rounded-[1.5rem] border shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-[#e6f4f2] text-[#008f7a]"}`}>
               <Calculator size={24} />
            </div>
            <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Cek Ongkir</h3>
            <p className="text-xs opacity-60 font-medium mt-1">Cek estimasi tarif pengiriman ke seluruh Indonesia.</p>
          </div>
          <button onClick={() => setActiveMenu("cek-ongkir")} className="mt-5 bg-[#008f7a] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-teal-700 transition-colors w-fit">
            Cek Sekarang
          </button>
        </div>

        <div className={`p-6 rounded-[1.5rem] border shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
               <MapPin size={24} />
            </div>
            <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Lacak Pesanan</h3>
            <p className="text-xs opacity-60 font-medium mt-1">Ketahui posisi paketmu saat ini dengan nomor resi.</p>
          </div>
          <div className="flex items-center gap-2 w-full mt-5">
             <input type="text" placeholder="Masukkan No. Resi..." className={`flex-1 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"}`} />
             <button onClick={() => alert("Mencari data resi...")} className="bg-[#008f7a] text-white p-2.5 rounded-xl shadow-md hover:bg-teal-700 transition-colors">
                <Search size={18}/>
             </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          <TrendingUp size={20} className="text-[#008f7a]" /> Statistik Pengirimanmu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className={`p-6 rounded-[1.5rem] border shadow-sm relative overflow-hidden flex justify-between items-start ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div>
                 <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Pesanan</p>
                 <h4 className="text-3xl font-black text-[#008f7a] mt-1">{totalOrdersCount} <span className="text-sm font-bold text-slate-400">Paket</span></h4>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-[#e6f4f2] text-[#008f7a]"}`}>
                 <Package size={20}/>
              </div>
           </div>
           
           <div className={`p-6 rounded-[1.5rem] border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="flex justify-between items-center mb-1">
                 <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Pesanan Selesai</p>
                 <span className="text-xs font-black text-[#008f7a]">{successRate}%</span>
              </div>
              <h4 className="text-3xl font-black text-[#008f7a] mt-1">{completedOrdersCount} <span className="text-sm font-bold text-slate-400">Paket</span></h4>
              <div className={`w-full rounded-full h-2 mt-3 ${isDarkMode ? "bg-slate-700" : "bg-[#e6f4f2]"}`}>
                 <div className="bg-[#008f7a] h-2 rounded-full transition-all duration-1000" style={{ width: `${successRate}%` }}></div>
              </div>
           </div>

           <div className={`p-6 rounded-[1.5rem] border shadow-sm flex justify-between items-start ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div>
                 <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Ongkos Kirim</p>
                 <h4 className={`text-2xl font-black mt-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}>{formattedSpent}</h4>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-[#e6f4f2] text-[#008f7a]"}`}>
                 <Wallet size={20}/>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderPesanan = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Pesanan Saya</h2>
      <div className={`border rounded-[1.5rem] overflow-hidden shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
         <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse whitespace-nowrap">
               <thead className={`${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-[#e2e8f0] text-slate-700"} text-[10px] font-black uppercase tracking-widest`}>
                 <tr>
                   <th className="p-5 font-bold">No. Resi</th>
                   <th className="p-5 font-bold">Nama Barang</th>
                   <th className="p-5 font-bold">Tanggal</th>
                   <th className="p-5 font-bold">Pengirim</th>
                   <th className="p-5 font-bold">Penerima</th>
                   <th className="p-5 font-bold">Layanan</th>
                   <th className="p-5 text-center font-bold">Status</th>
                 </tr>
               </thead>
               <tbody className={`${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                 {displayedOrders.length === 0 ? (
                   <tr><td colSpan="7" className="p-10 text-center font-bold opacity-50">Belum ada data pesanan.</td></tr>
                 ) : (
                   displayedOrders.map((o, idx) => {
                     let statusColor = "bg-slate-100 text-slate-600";
                     const statusUpper = o.status.toUpperCase();
                     if (statusUpper === "SELESAI") { statusColor = "bg-emerald-50 text-emerald-600"; } 
                     else if (statusUpper === "PROSES" || statusUpper === "INPUT" || statusUpper === "DALAM PENGIRIMAN") { statusColor = "bg-blue-50 text-blue-600"; } 
                     else if (statusUpper === "PICK-UP") { statusColor = "bg-amber-50 text-amber-600"; }

                     return (
                       <tr key={idx} className={`border-b last:border-0 text-sm transition-colors ${isDarkMode ? "border-slate-700 hover:bg-slate-700/50" : "border-slate-200 hover:bg-slate-50"}`}>
                         <td className="p-5 font-black text-[#008f7a] tracking-wide">{o.resi}</td>
                         <td className={`p-5 font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{o.itemName}</td>
                         <td className={`p-5 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{o.date}</td>
                         <td className={`p-5 font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-900"}`}>{o.sender}</td>
                         <td className={`p-5 font-medium ${isDarkMode ? "text-slate-300" : "text-slate-900"}`}>{o.receiver}</td>
                         <td className={`p-5 font-black ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>{o.service}</td>
                         <td className="p-5 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor}`}>{o.status}</span>
                         </td>
                       </tr>
                     );
                   })
                 )}
               </tbody>
             </table>
         </div>
      </div>
    </div>
  );

  const renderCekOngkir = () => (
    <div className="animate-in fade-in space-y-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Cek Ongkir</h2>
      <div className={`p-6 md:p-8 rounded-[1.5rem] border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           <div>
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}><span className="text-red-500">*</span> Asal Pengiriman</label>
              <div className="relative">
                 <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={`w-full appearance-none border rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}>
                    <option value="" disabled>Pilih Kecamatan/Kota/Provinsi</option>
                    {mockLocations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
                 </select>
                 <ChevronDown size={16} className="absolute right-4 top-4 opacity-50 pointer-events-none"/>
              </div>
           </div>
           <div>
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}><span className="text-red-500">*</span> Tujuan Pengiriman</label>
              <div className="relative">
                 <select value={destination} onChange={(e) => setDestination(e.target.value)} className={`w-full appearance-none border rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}>
                    <option value="" disabled>Pilih Kecamatan/Kota/Provinsi</option>
                    {mockLocations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
                 </select>
                 <ChevronDown size={16} className="absolute right-4 top-4 opacity-50 pointer-events-none"/>
              </div>
           </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           {[{l:"Berat (kg)", v:weight, s:setWeight}, {l:"P (cm)", v:length, s:setLength}, {l:"L (cm)", v:width, s:setWidth}, {l:"T (cm)", v:height, s:setHeight}].map((f, i) => (
             <input key={i} type="number" placeholder={f.l} value={f.v} onChange={(e) => f.s(e.target.value)} className={`border rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} />
           ))}
        </div>
        <button onClick={handleCekOngkir} className="w-full bg-[#008f7a] hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
           <Calculator size={20} /> Cek Harga Ongkir
        </button>
      </div>

      {shippingResults.length > 0 && submittedRoute && (
         <div className="mt-8 animate-in slide-in-from-bottom-4 space-y-6">
            <div className={`p-4 border rounded-xl flex items-start gap-3 shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
               <Info size={20} className="text-[#008f7a] shrink-0 mt-0.5" />
               <div>
                  <h4 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Informasi Tambahan</h4>
                  <p className="text-xs text-slate-500 mt-1">Tarif di aplikasi dapat berbeda sesuai dengan kesepakatan promosi & kerjasama dengan agen.</p>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {shippingResults.map((r, i) => (
               <div key={i} className={`relative p-6 pb-8 rounded-[1.5rem] border shadow-sm flex flex-col items-center text-center transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700 hover:border-[#008f7a]" : "bg-white border-slate-200 hover:border-[#008f7a]"}`}>
                  <div className="flex justify-end w-full absolute top-5 px-5 left-0">
                     <span className="bg-cyan-50 text-cyan-700 text-[10px] font-black px-3 py-1.5 rounded-md border border-cyan-100">{r.estimation}</span>
                  </div>
                  <div className="mt-8 mb-2 h-12 flex items-center justify-center">
                     <span className="text-3xl font-black italic text-[#008f7a] tracking-tighter">{r.service}</span>
                  </div>
                  <p className={`text-xs font-medium mt-1 mb-8 h-6 px-4 leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{r.desc}</p>
                  <div className="mt-auto w-full pt-4 border-t border-slate-100 dark:border-slate-700">
                     <p className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Total Tarif</p>
                     <p className={`text-2xl font-black ${isDarkMode ? "text-[#008f7a]" : "text-slate-900"}`}>{r.price}</p>
                  </div>
               </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );

  const renderPengaturan = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#001b3a]"}`}>Detail Informasi Perusahaan</h2>
      <div className={`p-8 md:p-10 rounded-[1.5rem] border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
         <div className="space-y-4">
            {[
              { l: "Nama", v: userProfile.nama || "-" },
              { l: "Nomor HP", v: userProfile.noHp || "-" },
              { l: "Email", v: userProfile.email || "-" },
              { l: "Perusahaan", v: userProfile.perusahaan || "-" },
              { l: "Alamat", v: userProfile.alamat || "-" }
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-[120px_20px_1fr] md:grid-cols-[150px_20px_1fr] items-center text-sm md:text-base">
                 <span className={`${isDarkMode ? "text-slate-400" : "text-[#004268]"} font-medium`}>{item.l}</span>
                 <span className={`${isDarkMode ? "text-slate-400" : "text-slate-900"} font-bold`}>:</span>
                 <span className={`${isDarkMode ? "text-white" : "text-slate-900"} font-bold`}>{item.v}</span>
              </div>
            ))}
         </div>
         <button onClick={() => { setTempProfile({...userProfile}); setIsEditProfileOpen(true); }} className="mt-8 px-10 py-2.5 rounded-full border-2 border-[#bd3232] text-[#bd3232] font-bold hover:bg-red-50 transition-colors text-sm bg-transparent">
           Edit
         </button>
      </div>

      {isEditProfileOpen && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-[1.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
               <div className="bg-[#008f7a] p-6 text-white flex justify-between items-center font-bold">
                  <h3>Edit Detail Informasi</h3>
                  <button onClick={() => setIsEditProfileOpen(false)}><X size={20}/></button>
               </div>
               <div className="p-8 space-y-5">
                  {[ {l:"Nama", k:"nama", t:"text"}, {l:"Nomor HP", k:"noHp", t:"text"}, {l:"Email", k:"email", t:"email"}, {l:"Perusahaan", k:"perusahaan", t:"text"}, {l:"Alamat", k:"alamat", t:"text"} ].map((f, i) => (
                    <div key={i}>
                       <label className="text-xs font-bold text-slate-500 mb-1 block">{f.l}</label>
                       <input type={f.t} value={tempProfile[f.k]} onChange={(e) => setTempProfile({...tempProfile, [f.k]: e.target.value})} className="w-full border-b-2 border-slate-200 py-2 font-bold text-slate-900 outline-none focus:border-[#008f7a] transition-colors" />
                    </div>
                  ))}
                  <div className="pt-6 flex gap-3">
                     <button onClick={() => setIsEditProfileOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Batal</button>
                     <button onClick={handleSaveProfile} className="flex-1 py-3 bg-[#008f7a] hover:bg-teal-700 text-white rounded-xl font-bold shadow-md transition-colors">Simpan Perubahan</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-slate-50"} transition-colors duration-300`}>
      <aside className={`fixed inset-y-0 left-0 z-[100] w-64 border-r transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
        <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="relative w-8 h-8 bg-white rounded-lg border shadow-sm p-1">
                <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
             </div>
             <span className={`font-black text-lg italic tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>CargoKu <span className="text-[#008f7a]">Lite</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600"><X size={24}/></button>
        </div>
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((m) => (
             <button key={m.id} onClick={() => { setActiveMenu(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm transition-all ${activeMenu === m.id ? "bg-[#008f7a] text-white shadow-lg" : (isDarkMode ? "text-slate-400 hover:bg-slate-700 hover:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")}`}>
                <m.icon size={18} /> {m.label}
             </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-50 dark:border-slate-700 space-y-3">
           <button onClick={toggleDarkMode} className={`w-full p-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase transition-all ${isDarkMode ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} Tema {isDarkMode ? "Terang" : "Gelap"}
           </button>
           <button onClick={() => { localStorage.clear(); window.location.href="/login"; }} className="w-full p-3 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase hover:bg-red-100 transition-colors">
              <LogOut size={14} /> Keluar
           </button>
        </div>
      </aside>

      {isMobileMenuOpen && (<div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden animate-in fade-in"></div>)}

      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        <header className={`h-16 border-b flex items-center justify-between md:justify-end px-6 md:px-10 shrink-0 z-10 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
           <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 rounded-xl transition-colors ${isDarkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
              <Menu size={20}/>
           </button>
           <div className="flex items-center gap-4 md:gap-6">
              <div className="text-right hidden sm:block">
                 <p className={`text-xs font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>{userProfile.nama}</p>
                 <p className="text-[9px] opacity-80 font-bold uppercase text-[#008f7a]">Pelanggan</p>
              </div>
              <div className="w-10 h-10 bg-[#008f7a] rounded-[14px] flex items-center justify-center text-white font-black text-lg shadow-md">
                 {userProfile.nama ? userProfile.nama.charAt(0).toUpperCase() : "P"}
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
           {activeMenu === "dashboard" && renderDashboard()}
           {activeMenu === "pesanan" && renderPesanan()}
           {activeMenu === "cek-ongkir" && renderCekOngkir()}
           {activeMenu === "pengaturan" && renderPengaturan()}
        </div>
      </main>
    </div>
  );
}
