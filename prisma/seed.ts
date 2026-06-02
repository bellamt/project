import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Menyiapkan pendaratan 50 data ke database relasional Neon...');

  // 1. Bersihkan tabel dari bawah ke atas biar gak bentrok
  await prisma.order.deleteMany({});
  await prisma.penerima.deleteMany({});
  await prisma.pengirim.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Buat 1 User Admin (Karena setiap resi wajib ada Admin yang input)
  const admin = await prisma.user.create({
    data: {
      nama: "Kibolah Admin",
      email: "admin@cargoku.com",
      password: "password123",
      role: "Admin"
    }
  });

  // 3. Data Mentah (Harganya jadi angka murni, tanggalnya format YYYY-MM-DD)
  const dataDummy = [
    { resi: "CGK-8821", barang: "Kemeja Flanel", tgl: "2026-01-05", pengirim: "Alika Store", penerima: "Budi Santoso", status: "Selesai", layanan: "EXPRESS", bayar: 25000 },
    { resi: "CGK-1054", barang: "Oli Mesin 1L", tgl: "2026-01-12", pengirim: "Maju Jaya Motor", penerima: "Fajar Shidiq", status: "Selesai", layanan: "REGULER", bayar: 12000 },
    { resi: "CGK-4432", barang: "Dress Floral", tgl: "2026-01-18", pengirim: "Alika Store", penerima: "Siti Aminah", status: "Selesai", layanan: "REGULER", bayar: 15000 },
    { resi: "CGK-7721", barang: "Mouse Wireless", tgl: "2026-01-25", pengirim: "Tech Komputer", penerima: "Hadi", status: "Selesai", layanan: "EXPRESS", bayar: 30000 },
    { resi: "CGK-2099", barang: "Blouse Silk", tgl: "2026-02-02", pengirim: "Alika Store", penerima: "Dewi Lestari", status: "Selesai", layanan: "EXPRESS", bayar: 25000 },
    { resi: "CGK-5510", barang: "Panci Set", tgl: "2026-02-05", pengirim: "Dapur Cantik", penerima: "Juli", status: "Selesai", layanan: "REGULER", bayar: 45000 },
    { resi: "CGK-8834", barang: "Rok Plisket", tgl: "2026-02-10", pengirim: "Alika Store", penerima: "Agus Hermawan", status: "Selesai", layanan: "REGULER", bayar: 15000 },
    { resi: "CGK-1203", barang: "Ban Dalam", tgl: "2026-02-14", pengirim: "Maju Jaya Motor", penerima: "Guntur", status: "Selesai", layanan: "EXPRESS", bayar: 20000 },
    { resi: "CGK-3341", barang: "Hijab Pashmina", tgl: "2026-02-20", pengirim: "Alika Store", penerima: "Rini Astuti", status: "Selesai", layanan: "EXPRESS", bayar: 25000 },
    { resi: "CGK-6672", barang: "Keyboard Mekanik", tgl: "2026-02-25", pengirim: "Tech Komputer", penerima: "Irfan", status: "Selesai", layanan: "REGULER", bayar: 18000 },
    { resi: "CGK-9001", barang: "Tunik Rayon", tgl: "2026-03-01", pengirim: "Alika Store", penerima: "Eko Prasetyo", status: "Selesai", layanan: "REGULER", bayar: 15000 },
    { resi: "CGK-2219", barang: "Sepatu Sport", tgl: "2026-03-04", pengirim: "Sport Center", penerima: "Lutfi", status: "Selesai", layanan: "EXPRESS", bayar: 35000 },
    { resi: "CGK-4480", barang: "Cardigan Rajut", tgl: "2026-03-08", pengirim: "Alika Store", penerima: "Andi Wijaya", status: "Selesai", layanan: "EXPRESS", bayar: 25000 },
    { resi: "CGK-5591", barang: "Casing HP", tgl: "2026-03-10", pengirim: "Gadget Holic", penerima: "Kiki", status: "Selesai", layanan: "REGULER", bayar: 10000 },
    { resi: "CGK-1123", barang: "Sweater Oversize", tgl: "2026-03-12", pengirim: "Alika Store", penerima: "Ibu Ratna", status: "Selesai", layanan: "REGULER", bayar: 15000 },
    { resi: "CGK-8802", barang: "Lampu LED 10W", tgl: "2026-03-15", pengirim: "Terang Jaya", penerima: "Nana", status: "Selesai", layanan: "EXPRESS", bayar: 22000 },
    { resi: "CGK-3345", barang: "Celana Kulot", tgl: "2026-03-18", pengirim: "Alika Store", penerima: "Rian Pratama", status: "Selesai", layanan: "EXPRESS", bayar: 25000 },
    { resi: "CGK-7711", barang: "Tas Ransel", tgl: "2026-03-20", pengirim: "Fashion Pria", penerima: "Mono", status: "Selesai", layanan: "REGULER", bayar: 15000 },
    { resi: "CGK-6623", barang: "Jaket Denim", tgl: "2026-03-22", pengirim: "Alika Store", penerima: "Dedi Suherman", status: "Proses", layanan: "REGULER", bayar: 15000 },
    { resi: "CGK-9904", barang: "Monitor 24 Inch", tgl: "2026-03-24", pengirim: "Tech Komputer", penerima: "Qori", status: "Selesai", layanan: "EXPRESS", bayar: 65000 },
    { resi: "CGK-2112", barang: "Kaos Polos", tgl: "2026-03-25", pengirim: "Alika Store", penerima: "Linda Sari", status: "Proses", layanan: "EXPRESS", bayar: 25000 },
    { resi: "CGK-5534", barang: "Kabel Data", tgl: "2026-03-26", pengirim: "Gadget Holic", penerima: "Opi", status: "Selesai", layanan: "REGULER", bayar: 8000 },
    { resi: "CGK-7745", barang: "Hoodie Zipper", tgl: "2026-03-27", pengirim: "Alika Store", penerima: "Bayu Segara", status: "Proses", layanan: "REGULER", bayar: 15000 },
    { resi: "CGK-1029", barang: "Setrika Uap", tgl: "2026-03-28", pengirim: "Elektronik Murah", penerima: "Raka", status: "Selesai", layanan: "REGULER", bayar: 20000 },
    { resi: "CGK-3398", barang: "Vest Rajut", tgl: "2026-03-29", pengirim: "Alika Store", penerima: "Maya Putri", status: "Proses", layanan: "EXPRESS", bayar: 25000 },
    { resi: "CGK-8822", barang: "Buku Novel", tgl: "2026-03-30", pengirim: "Toko Buku Ilmu", penerima: "Tio", status: "Selesai", layanan: "EXPRESS", bayar: 18000 },
    { resi: "CGK-4412", barang: "Joger Pants", tgl: "2026-03-31", pengirim: "Alika Store", penerima: "Hendra Kurnia", status: "Proses", layanan: "REGULER", bayar: 15000 },
    { resi: "CGK-6610", barang: "Botol Minum", tgl: "2026-01-15", pengirim: "Houseware Kita", penerima: "Sari", status: "Selesai", layanan: "REGULER", bayar: 10000 },
    { resi: "CGK-9912", barang: "Mukenah Silk", tgl: "2026-02-22", pengirim: "Alika Store", penerima: "Anisa Rahma", status: "Selesai", layanan: "EXPRESS", bayar: 25000 },
    { resi: "CGK-2101", barang: "Headset", tgl: "2026-03-05", pengirim: "Tech Komputer", penerima: "Ujang", status: "Selesai", layanan: "EXPRESS", bayar: 40000 }
  ];

  // Nambah sisa 20 data otomatis biar pas 50
  for (let i = 31; i <= 50; i++) {
    dataDummy.push({
      resi: `CGK-90${i}`,
      barang: "Barang Campuran",
      tgl: "2026-03-20",
      pengirim: i % 2 === 0 ? "Alika Store" : "Maju Jaya Motor",
      penerima: `Penerima Ke-${i}`,
      status: "Selesai",
      layanan: "REGULER",
      bayar: 15000
    });
  }

  // 4. Proses Masukin ke Database dengan Relasi
  for (const item of dataDummy) {
    await prisma.order.create({
      data: {
        no_resi: item.resi,
        tgl_pesanan: new Date(item.tgl), // Otomatis jadi DateTime
        status: item.status,
        status_barang: "DIPROSES",
        status_transaksi: item.status.toUpperCase() === "SELESAI" ? "LUNAS" : "BELUM LUNAS",
        layanan: item.layanan,
        total_bayar: item.bayar, // Otomatis jadi Int
        nama_barang: item.barang,
        catatan_barang: "Data awal untuk pengujian CRUDS",
        qty: 1, // Wajib diisi sesuai schema kamu
        berat_kg: 1.0, // Wajib diisi sesuai schema kamu
        
        // Relasi ke User
        user: { connect: { id: admin.id } },
        
        // Bikin & Relasi ke Pengirim
        pengirim: {
          create: {
            nama_pengirim: item.pengirim,
            no_telepon: "-",
            alamat: "-",
            kecamatan: "-",
            kode_pos: "-"
          }
        },
        
        // Bikin & Relasi ke Penerima
        penerima: {
          create: {
            nama_penerima: item.penerima,
            no_telepon: "-",
            alamat: "-",
            kecamatan: "-",
            kode_pos: "-"
          }
        }
      }
    });
  }

  console.log('✅ BERHASIL BOSKU! 50 Data plus Relasi sudah terkirim!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
