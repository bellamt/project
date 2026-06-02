// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Bell, LayoutDashboard, Package, Truck, Plus, Menu, X, 
  UserCheck, Users, Moon, Sun, PackageSearch,
  Trash2, SearchIcon, ShieldCheck, LogOut, Search, 
  Calendar, Clock, ArrowRight, Wallet, CheckCircle2, AlertCircle, BarChart3, Calculator, ChevronDown
} from "lucide-react";

export default function AdminDashboardPage() {
  // ==========================================
  // STATE GLOBAL & UI
  // ==========================================
  const [activeMenu, setActiveMenu] = useState("dashboard"); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // ==========================================
  // STATE DATA: PESANAN, PENGIRIM, PENERIMA
  // ==========================================
  const [orders, setOrders] = useState([]);
  const [senders, setSenders] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editOrder, setEditOrder] = useState(null);

  const formatRupiah = (amount) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

  const mapOrderFromApi = (o: any) => ({
    id: o.id,
    resi: o.no_resi,
    itemName: o.nama_barang || "Paket Barang Umum",
    date: new Date(o.tgl_pesanan).toLocaleDateString('id-ID'),
    rawDate: o.tgl_pesanan,
    sender: o.pengirim?.nama_pengirim || "Unknown",
    senderPhone: o.pengirim?.no_telepon || "-",
    receiver: o.penerima?.nama_penerima || "Unknown",
    receiverPhone: o.penerima?.no_telepon || "-",
    status: o.status,
    service: o.layanan || "Biasa",
    fee: formatRupiah(o.total_bayar),
    totalBayar: o.total_bayar || 0,
    origin: o.kota_asal || "-",
    destination: o.kota_tujuan || "-",
    itemType: o.jenis_barang || "Umum",
    weight: o.berat_kg || 0,
    notes: o.catatan || "",
  });

  const fetchOrders = async (keyword = "") => {
    const query = keyword.trim() ? `?search=${encodeURIComponent(keyword.trim())}` : "";
    const resOrders = await fetch(`/api/orders${query}`);
    if (resOrders.ok && resOrders.headers.get('content-type')?.includes('application/json')) {
      const data = await resOrders.json();
      setOrders(data.map(mapOrderFromApi));
    }
  };

  // ==========================================
  // FETCH DATA MYSQL (API)
  // ==========================================
  useEffect(() => {
    const updateClock = () => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB");
    };
    updateClock();
    const timerId = setInterval(updateClock, 10000);

    const fetchData = async () => {
      try {
        await fetchOrders();
      } catch (err) { console.warn("API Orders error"); }

      try {
        const resS = await fetch('/api/senders');
        if (resS.ok && resS.headers.get('content-type')?.includes('application/json')) {
          const dS = await resS.json(); 
          setSenders(dS.map((item: any) => ({ id: item.id, name: item.nama_pengirim, phone: item.no_telepon, address: item.alamat, kecamatan: item.kecamatan, kode_pos: item.kode_pos, is_utama: item.is_utama })));
        }
      } catch (err) { console.warn("API Senders error"); }

      try {
        const resR = await fetch('/api/receivers');
        if (resR.ok && resR.headers.get('content-type')?.includes('application/json')) {
          const dR = await resR.json(); 
          setReceivers(dR.map((item: any) => ({ id: item.id, name: item.nama_penerima, phone: item.no_telepon, address: item.alamat, kecamatan: item.kecamatan, kode_pos: item.kode_pos })));
        }
      } catch (err) { console.warn("API Receivers error"); }
    };

    fetchData();
    return () => clearInterval(timerId);
  }, []);

  // ==========================================
  // KALKULASI STATISTIK
  // ==========================================
  const totalPaket = orders.length;
  const sedangDiproses = orders.filter(o => ["PROSES", "INPUT"].includes(o.status.toUpperCase())).length;
  const dalamPerjalanan = orders.filter(o => ["DALAM PENGIRIMAN", "PICK-UP"].includes(o.status.toUpperCase())).length;
  const selesai = orders.filter(o => o.status.toUpperCase() === "SELESAI").length;
  const gagal = orders.filter(o => o.status.toUpperCase() === "GAGAL").length; 

  const persenSelesai = totalPaket > 0 ? Math.round((selesai / totalPaket) * 100) : 0;
  const persenProses = totalPaket > 0 ? Math.round(((sedangDiproses + dalamPerjalanan) / totalPaket) * 100) : 0;
  const persenGagal = totalPaket > 0 ? Math.round((gagal / totalPaket) * 100) : 0;

  const totalPendapatan = orders.reduce((sum, o) => sum + (parseInt(o.fee.replace(/\D/g, '')) || 0), 0);
  const formattedPendapatan = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPendapatan);
  const hariIni = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  // ==========================================
  // STATE MODALS & INPUT PESANAN
  // ==========================================
  const [currentStepModal, setCurrentStepModal] = useState(1);
  const [orderSender, setOrderSender] = useState({ name: "", phone: "", address: "" });
  const [orderReceiver, setOrderReceiver] = useState({ name: "", phone: "", address: "", item: "", weight: "" });
  const [orderForm, setOrderForm] = useState({
    tgl_pesanan: new Date().toISOString().slice(0, 10),
    kota_asal: "",
    kota_tujuan: "",
    jenis_barang: "Umum",
    layanan: "Biasa",
    status: "Input",
    total_bayar: "",
    catatan: "",
  });
  const [isSelectSenderModalOpen, setIsSelectSenderModalOpen] = useState(false);
  const [isSelectReceiverModalOpen, setIsSelectReceiverModalOpen] = useState(false);
  const [selectedSenderIndexModal, setSelectedSenderIndexModal] = useState(null);
  const [selectedReceiverIndexModal, setSelectedReceiverIndexModal] = useState(null);

  const [isAddSenderModalOpen, setIsAddSenderModalOpen] = useState(false);
  const [isAddReceiverModalOpen, setIsAddReceiverModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", kecamatan: "", kode_pos: "", is_utama: false });

  const handleSaveAdminData = async (type) => {
    alert(`Data ${type} berhasil disimpan ke Database MySQL!`);
    setIsAddSenderModalOpen(false);
    setIsAddReceiverModalOpen(false);
  };

  const resetOrderForm = () => {
    setCurrentStepModal(1);
    setOrderSender({ name: "", phone: "", address: "" });
    setOrderReceiver({ name: "", phone: "", address: "", item: "", weight: "" });
    setOrderForm({
      tgl_pesanan: new Date().toISOString().slice(0, 10),
      kota_asal: "",
      kota_tujuan: "",
      jenis_barang: "Umum",
      layanan: "Biasa",
      status: "Input",
      total_bayar: "",
      catatan: "",
    });
  };

  const handleConfirmSelectSender = () => { if(selectedSenderIndexModal !== null) { setOrderSender(senders[selectedSenderIndexModal]); setIsSelectSenderModalOpen(false); } };
  const handleConfirmSelectReceiver = () => { if(selectedReceiverIndexModal !== null) { setOrderReceiver(receivers[selectedReceiverIndexModal]); setIsSelectReceiverModalOpen(false); } };
  const handleNextStep = async () => { 
    if(currentStepModal < 3) {
      setCurrentStepModal(currentStepModal + 1);
      return;
    }

    if (!orderSender.name || !orderReceiver.name || !orderReceiver.item || !orderForm.total_bayar) {
      alert("Nama pengirim, penerima, barang, dan harga pengiriman wajib diisi.");
      return;
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tgl_pesanan: orderForm.tgl_pesanan,
        nama_pengirim: orderSender.name,
        no_telepon: orderSender.phone,
        alamat_pengirim: orderSender.address,
        nama_penerima: orderReceiver.name,
        no_telepon_penerima: orderReceiver.phone,
        alamat_penerima: orderReceiver.address,
        kota_asal: orderForm.kota_asal,
        kota_tujuan: orderForm.kota_tujuan,
        nama_barang: orderReceiver.item,
        jenis_barang: orderForm.jenis_barang,
        berat_kg: orderReceiver.weight,
        total_bayar: orderForm.total_bayar,
        layanan: orderForm.layanan,
        status: orderForm.status,
        catatan: orderForm.catatan,
      }),
    });

    if (!response.ok) {
      alert("Gagal menyimpan data pengiriman ke database.");
      return;
    }

    alert("Pesanan berhasil disimpan ke database!");
    resetOrderForm();
    await fetchOrders(searchKeyword);
    setActiveMenu("pesanan");
  };

  const handleSearchOrders = async (event) => {
    event.preventDefault();
    await fetchOrders(searchKeyword);
  };

  const handleUpdateOrder = async () => {
    if (!editOrder) return;

    const response = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editOrder.id,
        status: editOrder.status,
        total_bayar: editOrder.totalBayar,
      }),
    });

    if (!response.ok) {
      alert("Gagal update data pengiriman.");
      return;
    }

    alert("Data pengiriman berhasil diupdate.");
    setEditOrder(null);
    await fetchOrders(searchKeyword);
  };

  const handleDeleteOrder = async (order) => {
    if (!confirm(`Hapus pengiriman ${order.resi}?`)) return;

    const response = await fetch(`/api/orders?id=${order.id}`, { method: 'DELETE' });
    if (!response.ok) {
      alert("Gagal hapus data pengiriman.");
      return;
    }

    await fetchOrders(searchKeyword);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pesanan", label: "Semua Pesanan", icon: Package },
    { id: "buat-pesanan", label: "Input Pesanan", icon: Plus },
    { id: "pengirim", label: "Data Pengirim", icon: UserCheck },
    { id: "penerima", label: "Data Penerima", icon: Users },
  ];

  // ========================================================
  // RENDER MODAL PILIH KONTAK
  // ========================================================
  const renderSelectModal = (isSender) => {
    const list = isSender ? senders : receivers;
    const selectedIdx = isSender ? selectedSenderIndexModal : selectedReceiverIndexModal;
    const setIdx = isSender ? setSelectedSenderIndexModal : setSelectedReceiverIndexModal;
    const close = () => isSender ? setIsSelectSenderModalOpen(false) : setIsSelectReceiverModalOpen(false);
    const confirm = isSender ? handleConfirmSelectSender : handleConfirmSelectReceiver;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
        <div className={`relative w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
          <div className={`p-6 flex items-center justify-between border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Pilih Kontak {isSender ? "Pengirim" : "Penerima"}</h3>
            <button onClick={close} className={isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}><X size={24} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className={`flex items-center gap-2 w-full px-4 py-3 rounded-xl border focus-within:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"}`}>
              <SearchIcon size={18} className="text-slate-400" />
              <input type="text" placeholder={`Cari Kontak ${isSender ? "Pengirim" : "Penerima"}...`} className={`bg-transparent border-none outline-none text-sm w-full font-bold ${isDarkMode ? "text-white placeholder-slate-600" : "text-slate-900 placeholder-slate-400"}`} />
            </div>
            <div className={`max-h-64 overflow-y-auto border rounded-xl ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
              {list.length === 0 ? <div className="p-8 text-center text-slate-400 font-bold italic">Database {isSender ? "Pengirim" : "Penerima"} Kosong. Tambah data di menu Admin.</div> : list.map((item, idx) => (
                <div key={idx} onClick={() => setIdx(idx)} className={`p-4 flex items-center gap-4 border-b last:border-0 cursor-pointer transition-colors ${selectedIdx === idx ? (isDarkMode ? 'bg-[#008f7a]/20' : 'bg-[#008f7a]/10') : (isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50')} ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedIdx === idx ? "border-[#008f7a]" : "border-slate-300"}`}>
                    {selectedIdx === idx && <div className="w-2.5 h-2.5 rounded-full bg-[#008f7a]"></div>}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.name}</div>
                    <div className="text-xs text-slate-500">{item.phone}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={confirm} className="w-full bg-[#008f7a] hover:bg-teal-700 text-white py-3.5 rounded-xl font-bold shadow-md transition-all">Gunakan Kontak Terpilih</button>
          </div>
        </div>
      </div>
    );
  };

  // ========================================================
  // RENDER MENU: DASHBOARD (LAYOUT HIJAU SESUAI GAMBAR)
  // ========================================================
  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      {/* HEADER BANNER HIJAU */}
      <div className="bg-[#008f7a] rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Selamat Datang, Administrator! 👋</h2>
          <p className="text-teal-100 mb-8 opacity-90">Pantau seluruh operasional pengiriman Anda dari satu tempat</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-teal-600/50 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border border-teal-500/30">
              <Calendar size={14} /> Hari Ini: {hariIni}
            </div>
            <div className="bg-teal-600/50 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border border-teal-500/30">
              <Clock size={14} /> Update: {currentTime}
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 4 KARTU STATISTIK ATAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className={`p-6 rounded-[1.5rem] border shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Package size={24} /></div>
            <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">+18%</span>
          </div>
          <div>
            <h3 className={`text-4xl font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>{totalPaket}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Total Pesanan Sistem</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[10px] text-slate-400">Data live</span>
            <button onClick={() => setActiveMenu("pesanan")} className="text-blue-600 text-[11px] font-bold hover:underline flex items-center gap-1">Lihat Detail <ArrowRight size={12}/></button>
          </div>
        </div>

        <div className={`p-6 rounded-[1.5rem] border shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center"><Clock size={24} /></div>
            <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Aktif</span>
          </div>
          <div>
            <h3 className={`text-4xl font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>{sedangDiproses}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Sedang Diproses</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[10px] text-slate-400">Menunggu pickup</span>
            <button onClick={() => setActiveMenu("pesanan")} className="text-amber-500 text-[11px] font-bold hover:underline flex items-center gap-1">Proses <ArrowRight size={12}/></button>
          </div>
        </div>

        <div className={`p-6 rounded-[1.5rem] border shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center"><Truck size={24} /></div>
            <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Transit</span>
          </div>
          <div>
            <h3 className={`text-4xl font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>{dalamPerjalanan}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Dalam Perjalanan</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[10px] text-slate-400">Kurir aktif</span>
            <button onClick={() => setActiveMenu("pesanan")} className="text-purple-500 text-[11px] font-bold hover:underline flex items-center gap-1">Lacak <ArrowRight size={12}/></button>
          </div>
        </div>

        <div className={`p-6 rounded-[1.5rem] border shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center"><Wallet size={24} /></div>
          </div>
          <div>
            <h3 className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>{formattedPendapatan}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Total Pendapatan</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 flex items-center gap-1"><CheckCircle2 size={10} className="text-green-500"/> Target Tercapai</span>
          </div>
        </div>
      </div>

      {/* BARIS TENGAH: ACTION CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-6 rounded-[1.5rem] border shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Plus size={24} /></div>
             <div>
                <h4 className={`font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Pesanan Baru</h4>
                <p className="text-xs text-slate-500">Input data pengiriman baru</p>
             </div>
          </div>
          <button onClick={() => setActiveMenu("buat-pesanan")} className="w-full bg-[#008f7a] text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors">
            Buat Pesanan Baru <ArrowRight size={16} />
          </button>
        </div>

        <div className={`p-6 rounded-[1.5rem] border shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Search size={24} /></div>
             <div>
                <h4 className={`font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Lacak Pesanan</h4>
                <p className="text-xs text-slate-500">Cek status via resi</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <input type="text" placeholder="Masukkan No. Resi..." className={`flex-1 border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`} />
             <button onClick={() => setActiveMenu("pesanan")} className="bg-[#008f7a] text-white p-3 rounded-xl hover:bg-teal-700 transition-colors">
                <SearchIcon size={16}/>
             </button>
          </div>
        </div>

        <div className="p-6 rounded-[1.5rem] bg-[#008f7a] text-white shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4 mb-6">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"><Calculator size={24} /></div>
             <div>
                <h4 className="font-bold">Total Ongkir</h4>
                <p className="text-xs text-teal-100">{hariIni}</p>
             </div>
          </div>
          <div className="relative z-10">
             <h3 className="text-3xl font-black mb-1">{formattedPendapatan}</h3>
             <p className="text-xs text-teal-100">{totalPaket} transaksi selesai</p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* BARIS BAWAH: STATISTIK PENGIRIMAN SISTEM */}
      <div className="pt-4">
        <h3 className={`text-lg font-bold flex items-center gap-2 mb-6 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          <BarChart3 size={20} className="text-[#008f7a]" /> Statistik Pengiriman Sistem
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className={`p-5 rounded-[1.5rem] border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
              <div className="flex justify-between items-center mb-4">
                 <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Total Paket</p>
                 <div className="w-6 h-6 bg-blue-50 text-blue-500 rounded flex items-center justify-center"><Package size={14}/></div>
              </div>
              <h4 className={`text-2xl font-black mb-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}>{totalPaket}</h4>
              <p className="text-[10px] text-slate-400">Keseluruhan resi</p>
           </div>
           <div className={`p-5 rounded-[1.5rem] border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
              <div className="flex justify-between items-center mb-4">
                 <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Selesai</p>
                 <div className="w-6 h-6 bg-green-50 text-green-500 rounded flex items-center justify-center"><CheckCircle2 size={14}/></div>
              </div>
              <h4 className={`text-2xl font-black mb-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}>{selesai}</h4>
              <p className="text-[11px] font-bold text-green-500">{persenSelesai}% <span className="text-slate-400 font-normal">Terkirim</span></p>
           </div>
           <div className={`p-5 rounded-[1.5rem] border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
              <div className="flex justify-between items-center mb-4">
                 <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Dalam Proses</p>
                 <div className="w-6 h-6 bg-amber-50 text-amber-500 rounded flex items-center justify-center"><Clock size={14}/></div>
              </div>
              <h4 className={`text-2xl font-black mb-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}>{sedangDiproses + dalamPerjalanan}</h4>
              <p className="text-[11px] font-bold text-amber-500">{persenProses}% <span className="text-slate-400 font-normal">Berjalan</span></p>
           </div>
           <div className={`p-5 rounded-[1.5rem] border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
              <div className="flex justify-between items-center mb-4">
                 <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Gagal/Retur</p>
                 <div className="w-6 h-6 bg-red-50 text-red-500 rounded flex items-center justify-center"><AlertCircle size={14}/></div>
              </div>
              <h4 className={`text-2xl font-black mb-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}>{gagal}</h4>
              <p className="text-[11px] font-bold text-red-500">{persenGagal}% <span className="text-slate-400 font-normal">Bermasalah</span></p>
           </div>
        </div>
      </div>
    </div>
  );

  // ========================================================
  // RENDER MENU: PESANAN (ASLI)
  // ========================================================
  const renderPesanan = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Manajemen Semua Pesanan</h2>
        <form onSubmit={handleSearchOrders} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border min-w-0 sm:w-96 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <SearchIcon size={18} className="text-slate-400 shrink-0" />
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Cari resi, pengirim, penerima, barang"
              className={`w-full bg-transparent outline-none text-sm font-bold ${isDarkMode ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`}
            />
          </div>
          <button type="submit" className="px-5 py-3 rounded-xl bg-[#008f7a] text-white font-bold text-sm hover:bg-teal-700 transition-colors">Cari</button>
          {searchKeyword && <button type="button" onClick={async () => { setSearchKeyword(""); await fetchOrders(); }} className={`px-5 py-3 rounded-xl font-bold text-sm ${isDarkMode ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-600"}`}>Reset</button>}
        </form>
      </div>
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
                   <th className="p-5 font-bold">Harga</th>
                   <th className="p-5 text-center font-bold">Status</th>
                   <th className="p-5 text-center font-bold">Aksi</th>
                 </tr>
               </thead>
               <tbody className={`${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                 {orders.length === 0 ? (
                   <tr><td colSpan="9" className="p-10 text-center font-bold opacity-50">Belum ada data pesanan.</td></tr>
                 ) : (
                   orders.map((o, idx) => {
                     let statusColor = "bg-slate-100 text-slate-600";
                     const statusUpper = o.status.toUpperCase();
                     if (statusUpper === "SELESAI") { statusColor = "bg-emerald-50 text-emerald-600"; } 
                     else if (["PROSES", "INPUT", "DALAM PENGIRIMAN"].includes(statusUpper)) { statusColor = "bg-blue-50 text-blue-600"; } 
                     else if (statusUpper === "PICK-UP") { statusColor = "bg-amber-50 text-amber-600"; }

                     return (
                       <tr key={idx} className={`border-b last:border-0 text-sm transition-colors ${isDarkMode ? "border-slate-700 hover:bg-slate-700/50" : "border-slate-200 hover:bg-slate-50"}`}>
                         <td className="p-5 font-black text-[#008f7a] tracking-wide">{o.resi}</td>
                         <td className={`p-5 font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{o.itemName}</td>
                         <td className={`p-5 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{o.date}</td>
                         <td className={`p-5 font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-900"}`}>{o.sender}</td>
                         <td className={`p-5 font-medium ${isDarkMode ? "text-slate-300" : "text-slate-900"}`}>{o.receiver}</td>
                         <td className={`p-5 font-black ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>{o.service}</td>
                         <td className={`p-5 font-black ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>{o.fee}</td>
                         <td className="p-5 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor}`}>{o.status}</span>
                         </td>
                         <td className="p-5">
                           <div className="flex items-center justify-center gap-2">
                             <button onClick={() => setEditOrder(o)} className="px-3 py-2 rounded-xl text-[10px] font-black uppercase bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">Edit</button>
                             <button onClick={() => handleDeleteOrder(o)} className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors" aria-label="Hapus pengiriman"><Trash2 size={16}/></button>
                           </div>
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

  // ========================================================
  // RENDER MENU: DATABASE (ASLI)
  // ========================================================
  const renderDatabase = (isSender) => {
    const dataList = isSender ? senders : receivers;
    const title = isSender ? "Pengirim" : "Penerima";
    return (
      <div className="animate-in fade-in space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Database {title}</h2>
          <button onClick={() => isSender ? setIsAddSenderModalOpen(true) : setIsAddReceiverModalOpen(true)} className="bg-[#008f7a] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-teal-700 transition-colors">+ Tambah Baru</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataList.length === 0 ? <div className="p-10 border-2 border-dashed rounded-3xl text-center text-slate-400 font-bold italic col-span-2">Belum ada data. Tambah data baru untuk menyimpan ke MySQL.</div> : dataList.map((item, idx) => (
          <div key={idx} className={`p-6 border rounded-[1.5rem] shadow-sm flex justify-between items-start ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div>
              <p className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.name}</p>
              <p className="text-sm opacity-80 text-slate-500">{item.phone}</p>
              {item.address && <p className="text-xs mt-2 text-slate-400">{item.address}</p>}
            </div>
            <button onClick={() => isSender ? setSenders(senders.filter((_,i)=>i!==idx)) : setReceivers(receivers.filter((_,i)=>i!==idx))} className="text-red-500 p-2 bg-red-50 rounded-xl dark:bg-red-900/20 hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
          </div>
        ))}</div>
      </div>
    );
  };

  // ========================================================
  // RENDER MENU: BUAT PESANAN (ASLI)
  // ========================================================
  const renderBuatPesanan = () => (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className={`flex items-center gap-4 p-4 rounded-[1.5rem] ${isDarkMode ? "bg-slate-800" : "bg-[#e6f4f2]"}`}>
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${currentStepModal >= s ? 'bg-[#008f7a] text-white' : 'bg-slate-200 text-slate-500'}`}>{s}</div>
            <div className={`flex-1 h-1 rounded-full ${currentStepModal > s ? 'bg-[#008f7a]' : 'bg-slate-200'}`}></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {currentStepModal === 1 && (
            <div className={`p-8 border rounded-[2rem] space-y-6 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="flex justify-between items-center"><h3 className={`text-xl font-bold ${isDarkMode?"text-white":"text-black"}`}>Detail Pengirim</h3><button onClick={() => setIsSelectSenderModalOpen(true)} className="text-[#008f7a] font-bold text-sm hover:underline">Pilih dari Database</button></div>
              <input placeholder="Nama Pengirim" value={orderSender.name} onChange={(e) => setOrderSender({...orderSender, name: e.target.value})} className={`w-full p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
              <input placeholder="No Telepon Pengirim" value={orderSender.phone} onChange={(e) => setOrderSender({...orderSender, phone: e.target.value})} className={`w-full p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Kota Asal" value={orderForm.kota_asal} onChange={(e) => setOrderForm({...orderForm, kota_asal: e.target.value})} className={`p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
                <input type="date" value={orderForm.tgl_pesanan} onChange={(e) => setOrderForm({...orderForm, tgl_pesanan: e.target.value})} className={`p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
              </div>
              <textarea placeholder="Alamat Lengkap" value={orderSender.address} onChange={(e) => setOrderSender({...orderSender, address: e.target.value})} className={`w-full p-4 border rounded-2xl h-32 resize-none outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
            </div>
          )}
          {currentStepModal === 2 && (
            <div className={`p-8 border rounded-[2rem] space-y-6 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="flex justify-between items-center"><h3 className={`text-xl font-bold ${isDarkMode?"text-white":"text-black"}`}>Penerima & Paket</h3><button onClick={() => setIsSelectReceiverModalOpen(true)} className="text-[#008f7a] font-bold text-sm hover:underline">Pilih dari Database</button></div>
              <input placeholder="Nama Penerima" value={orderReceiver.name} onChange={(e) => setOrderReceiver({...orderReceiver, name: e.target.value})} className={`w-full p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
              <input placeholder="No Telepon Penerima" value={orderReceiver.phone} onChange={(e) => setOrderReceiver({...orderReceiver, phone: e.target.value})} className={`w-full p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input placeholder="Kota Tujuan" value={orderForm.kota_tujuan} onChange={(e) => setOrderForm({...orderForm, kota_tujuan: e.target.value})} className={`p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
                 <input placeholder="Barang" value={orderReceiver.item} onChange={(e) => setOrderReceiver({...orderReceiver, item: e.target.value})} className={`p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
                 <input placeholder="Jenis Barang" value={orderForm.jenis_barang} onChange={(e) => setOrderForm({...orderForm, jenis_barang: e.target.value})} className={`p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
                 <input placeholder="Berat (kg)" value={orderReceiver.weight} onChange={(e) => setOrderReceiver({...orderReceiver, weight: e.target.value})} className={`p-4 border rounded-2xl outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
              </div>
              <textarea placeholder="Alamat Penerima" value={orderReceiver.address} onChange={(e) => setOrderReceiver({...orderReceiver, address: e.target.value})} className={`w-full p-4 border rounded-2xl h-24 resize-none outline-none focus:border-[#008f7a] ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`} />
            </div>
          )}
          {currentStepModal === 3 && (
            <div className={`p-8 border rounded-[2rem] text-center space-y-6 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-[#e6f4f2] border-teal-100"}`}>
              <ShieldCheck size={64} className="mx-auto text-[#008f7a]" />
              <h3 className={`text-2xl font-black italic ${isDarkMode ? "text-white" : "text-slate-900"}`}>Konfirmasi Pesanan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <select value={orderForm.layanan} onChange={(e) => setOrderForm({...orderForm, layanan: e.target.value})} className={`p-4 border rounded-2xl outline-none font-bold ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-teal-100 text-slate-900"}`}>
                  <option>Biasa</option>
                  <option>Cepat</option>
                  <option>Vvip</option>
                </select>
                <select value={orderForm.status} onChange={(e) => setOrderForm({...orderForm, status: e.target.value})} className={`p-4 border rounded-2xl outline-none font-bold ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-teal-100 text-slate-900"}`}>
                  <option>Input</option>
                  <option>Diproses</option>
                  <option>Dalam Pengiriman</option>
                  <option>Sampai Tujuan</option>
                  <option>Pending</option>
                  <option>Selesai</option>
                </select>
                <input type="number" placeholder="Harga/Tarif Pengiriman" value={orderForm.total_bayar} onChange={(e) => setOrderForm({...orderForm, total_bayar: e.target.value})} className={`p-4 border rounded-2xl outline-none font-bold ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-teal-100 text-slate-900"}`} />
              </div>
              <textarea placeholder="Deskripsi/Catatan Barang" value={orderForm.catatan} onChange={(e) => setOrderForm({...orderForm, catatan: e.target.value})} className={`w-full p-4 border rounded-2xl h-24 resize-none outline-none text-left ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-teal-100 text-slate-900"}`} />
              <div className="text-left space-y-3 font-bold text-sm px-4">
                <div className="flex justify-between text-slate-500"><span>Pengirim:</span><span className={isDarkMode ? "text-white" : "text-slate-900"}>{orderSender.name || "-"}</span></div>
                <div className="flex justify-between text-slate-500"><span>Penerima:</span><span className={isDarkMode ? "text-white" : "text-slate-900"}>{orderReceiver.name || "-"}</span></div>
                <div className="flex justify-between text-slate-500"><span>Barang:</span><span className={isDarkMode ? "text-white" : "text-slate-900"}>{orderReceiver.item || "-"}</span></div>
                <div className="flex justify-between text-slate-500"><span>Tarif:</span><span className={isDarkMode ? "text-white" : "text-slate-900"}>{formatRupiah(orderForm.total_bayar)}</span></div>
              </div>
            </div>
          )}
          <div className="flex gap-4">
             {currentStepModal > 1 && <button onClick={() => setCurrentStepModal(currentStepModal - 1)} className={`flex-1 p-4 border rounded-2xl font-bold transition-colors ${isDarkMode ? "text-slate-300 border-slate-600 hover:bg-slate-700" : "text-slate-600 border-slate-300 hover:bg-slate-50"}`}>Kembali</button>}
             <button onClick={handleNextStep} className="flex-1 p-4 bg-[#008f7a] text-white rounded-2xl font-bold shadow-lg hover:bg-teal-700 transition-colors">{currentStepModal === 3 ? 'Selesai & Simpan Data' : 'Lanjutkan'}</button>
          </div>
        </div>
        <div className={`p-8 border rounded-[2rem] h-fit ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
           <h3 className="font-bold mb-6 border-b pb-4 text-slate-400">Ringkasan Tagihan</h3>
           <div className="space-y-3 text-sm font-bold">
             <div className="flex justify-between gap-4"><span className="text-slate-400">Rute</span><span className={isDarkMode ? "text-white" : "text-slate-900"}>{orderForm.kota_asal || "-"} ke {orderForm.kota_tujuan || "-"}</span></div>
             <div className="flex justify-between gap-4"><span className="text-slate-400">Layanan</span><span className={isDarkMode ? "text-white" : "text-slate-900"}>{orderForm.layanan}</span></div>
             <div className="flex justify-between gap-4"><span className="text-slate-400">Berat</span><span className={isDarkMode ? "text-white" : "text-slate-900"}>{orderReceiver.weight || 0} kg</span></div>
             <div className="flex justify-between gap-4 border-t pt-4"><span className="text-slate-400">Tarif</span><span className="text-[#008f7a]">{formatRupiah(orderForm.total_bayar)}</span></div>
           </div>
        </div>
      </div>
    </div>
  );

  // ========================================================
  // LAYOUT UTAMA
  // ========================================================
  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-slate-50"} transition-colors duration-300`}>
      {isSelectSenderModalOpen && renderSelectModal(true)}
      {isSelectReceiverModalOpen && renderSelectModal(false)}
      
      {(isAddSenderModalOpen || isAddReceiverModalOpen) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
          <div className={`bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`}>
            <h3 className="text-xl font-black">Form {isAddSenderModalOpen ? "Pengirim" : "Penerima"} Baru</h3>
            <div className="space-y-4">
              <input placeholder="Nama Lengkap" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border-b-2 py-3 outline-none font-bold focus:border-[#008f7a] ${isDarkMode ? "bg-transparent border-slate-700 text-white" : "border-slate-100 text-slate-900"}`} />
              <input placeholder="Nomor Telepon" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full border-b-2 py-3 outline-none font-bold focus:border-[#008f7a] ${isDarkMode ? "bg-transparent border-slate-700 text-white" : "border-slate-100 text-slate-900"}`} />
              <textarea placeholder="Alamat Lengkap" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className={`w-full border-b-2 py-3 outline-none font-bold focus:border-[#008f7a] ${isDarkMode ? "bg-transparent border-slate-700 text-white" : "border-slate-100 text-slate-900"}`} rows={2} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Kecamatan" value={formData.kecamatan} onChange={(e) => setFormData({...formData, kecamatan: e.target.value})} className={`w-full border-b-2 py-3 outline-none font-bold focus:border-[#008f7a] ${isDarkMode ? "bg-transparent border-slate-700 text-white" : "border-slate-100 text-slate-900"}`} />
                <input placeholder="Kode Pos" value={formData.kode_pos} onChange={(e) => setFormData({...formData, kode_pos: e.target.value})} className={`w-full border-b-2 py-3 outline-none font-bold focus:border-[#008f7a] ${isDarkMode ? "bg-transparent border-slate-700 text-white" : "border-slate-100 text-slate-900"}`} />
              </div>
              {isAddSenderModalOpen && (
                <div className="flex items-center gap-2 mt-4 pt-2">
                  <input type="checkbox" id="is_utama" checked={formData.is_utama} onChange={(e) => setFormData({...formData, is_utama: e.target.checked})} className="w-4 h-4 accent-[#008f7a] rounded" />
                  <label htmlFor="is_utama" className="text-sm font-bold opacity-80 cursor-pointer">Jadikan Alamat Utama</label>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-4">
               <button onClick={()=>{setIsAddSenderModalOpen(false);setIsAddReceiverModalOpen(false)}} className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">Batal</button>
               <button onClick={() => handleSaveAdminData(isAddSenderModalOpen ? 'sender' : 'receiver')} className="flex-1 bg-[#008f7a] hover:bg-teal-700 text-white py-3 rounded-xl font-bold shadow-lg transition-colors">Simpan Data</button>
            </div>
          </div>
        </div>
      )}

      {editOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
          <div className={`rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6 ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">Edit Pengiriman</h3>
                <p className="text-sm font-bold text-[#008f7a] mt-1">{editOrder.resi} - {editOrder.itemName}</p>
              </div>
              <button onClick={() => setEditOrder(null)} className={isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}><X size={22}/></button>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Status Pengiriman</label>
              <select value={editOrder.status} onChange={(e) => setEditOrder({...editOrder, status: e.target.value})} className={`w-full p-4 border rounded-2xl outline-none font-bold ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
                <option>Input</option>
                <option>Diproses</option>
                <option>Dalam Pengiriman</option>
                <option>Sampai Tujuan</option>
                <option>Pending</option>
                <option>Selesai</option>
              </select>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Harga Pengiriman</label>
              <input type="number" value={editOrder.totalBayar} onChange={(e) => setEditOrder({...editOrder, totalBayar: e.target.value})} className={`w-full p-4 border rounded-2xl outline-none font-bold ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditOrder(null)} className={`flex-1 py-3 rounded-xl font-bold ${isDarkMode ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-600"}`}>Batal</button>
              <button onClick={handleUpdateOrder} className="flex-1 bg-[#008f7a] hover:bg-teal-700 text-white py-3 rounded-xl font-bold shadow-lg transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-[100] w-64 border-r transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
        <div className="p-8 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="relative w-8 h-8 bg-white rounded-lg border shadow-sm p-1">
                <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
             </div>
             <span className={`font-black text-lg italic ${isDarkMode ? "text-white" : "text-slate-900"}`}>CargoKu <span className="text-[#008f7a]">Lite</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden"><X/></button>
        </div>
        <nav className="flex-1 p-5 space-y-2">
          {menuItems.map((m) => (
             <button key={m.id} onClick={() => { setActiveMenu(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm transition-all ${activeMenu === m.id ? "bg-[#008f7a] text-white shadow-lg" : (isDarkMode ? "text-slate-400 hover:bg-slate-700 hover:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")}`}>
                <m.icon size={18} /> {m.label}
             </button>
          ))}
        </nav>
        <div className="p-6 border-t space-y-3">
           <button onClick={toggleDarkMode} className={`w-full p-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase transition-all ${isDarkMode ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} Tema {isDarkMode ? "Terang" : "Gelap"}
           </button>
           <button onClick={() => { localStorage.clear(); window.location.href="/login"; }} className="w-full p-3 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase hover:bg-red-100 transition-colors">
              <LogOut size={14} /> Keluar
           </button>
        </div>
      </aside>

      {isMobileMenuOpen && (<div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"></div>)}

      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        <header className={`h-16 border-b flex items-center justify-between md:justify-end px-6 md:px-10 shrink-0 z-10 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
           <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 rounded-xl transition-colors ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
              <Menu size={20}/>
           </button>
           <div className="flex items-center gap-4 md:gap-6">
              <div className="text-right hidden sm:block">
                 <p className={`text-xs font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Administrator</p>
                 <p className="text-[9px] opacity-80 font-bold uppercase text-[#008f7a]">Admin</p>
              </div>
              <div className="w-10 h-10 bg-[#008f7a] rounded-[14px] flex items-center justify-center text-white font-black text-lg shadow-md">A</div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
           {activeMenu === "dashboard" && renderDashboard()}
           {activeMenu === "pesanan" && renderPesanan()}
           {activeMenu === "pengirim" && renderDatabase(true)}
           {activeMenu === "penerima" && renderDatabase(false)}
           {activeMenu === "buat-pesanan" && renderBuatPesanan()}
        </div>
      </main>
    </div>
  );
}
