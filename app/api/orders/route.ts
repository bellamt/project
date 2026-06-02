import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function generateNoResi() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CGK-${random}`;
}

function toInt(value: unknown, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toFloat(value: unknown, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function getAdminUserId() {
  const existingUser = await prisma.user.findFirst({
    where: { role: "Admin" },
    orderBy: { id: "asc" },
  });

  if (existingUser) return existingUser.id;

  const user = await prisma.user.create({
    data: {
      nama: "Admin CargoKu",
      email: `admin-${Date.now()}@cargoku.local`,
      password: "password123",
      role: "Admin",
    },
  });

  return user.id;
}

const includeOrderRelations = {
  pengirim: true,
  penerima: true,
};

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search")?.trim();

    const orders = await prisma.order.findMany({
      where: search
        ? {
            OR: [
              { no_resi: { contains: search, mode: "insensitive" } },
              { nama_barang: { contains: search, mode: "insensitive" } },
              { pengirim: { nama_pengirim: { contains: search, mode: "insensitive" } } },
              { penerima: { nama_penerima: { contains: search, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: includeOrderRelations,
      orderBy: { tgl_pesanan: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders", error);
    return NextResponse.json({ error: "Gagal ambil data pengiriman" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = await getAdminUserId();

    const order = await prisma.order.create({
      data: {
        no_resi: body.no_resi || generateNoResi(),
        tgl_pesanan: body.tgl_pesanan ? new Date(body.tgl_pesanan) : new Date(),
        status: body.status || "Input",
        layanan: body.layanan || "Biasa",
        total_bayar: toInt(body.total_bayar),
        kota_asal: body.kota_asal || "-",
        kota_tujuan: body.kota_tujuan || "-",
        jenis_barang: body.jenis_barang || "Umum",
        catatan: body.catatan || null,
        nama_barang: body.nama_barang,
        qty: toInt(body.qty, 1) || 1,
        berat_kg: toFloat(body.berat_kg, 1) || 1,
        user: { connect: { id: userId } },
        pengirim: {
          create: {
            nama_pengirim: body.nama_pengirim,
            no_telepon: body.no_telepon || "-",
            alamat: body.alamat_pengirim || "-",
            kecamatan: body.kota_asal || "-",
            kode_pos: body.kode_pos_pengirim || "-",
          },
        },
        penerima: {
          create: {
            nama_penerima: body.nama_penerima,
            no_telepon: body.no_telepon_penerima || body.no_telepon || "-",
            alamat: body.alamat_penerima || "-",
            kecamatan: body.kota_tujuan || "-",
            kode_pos: body.kode_pos_penerima || "-",
          },
        },
      },
      include: includeOrderRelations,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders", error);
    return NextResponse.json({ error: "Gagal tambah data pengiriman" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json({ error: "ID pengiriman wajib diisi" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        total_bayar: toInt(body.total_bayar),
      },
      include: includeOrderRelations,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("PATCH /api/orders", error);
    return NextResponse.json({ error: "Gagal update data pengiriman" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID pengiriman wajib diisi" }, { status: 400 });
    }

    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ message: "Data pengiriman berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/orders", error);
    return NextResponse.json({ error: "Gagal hapus data pengiriman" }, { status: 500 });
  }
}
