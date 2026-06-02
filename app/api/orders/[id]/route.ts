import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

const ORDER_STATUSES = [
  "INPUT",
  "PICK-UP",
  "PROSES",
  "DALAM PENGIRIMAN",
  "SAMPAI TUJUAN",
  "PENDING",
  "SELESAI",
  "GAGAL",
];

const parseId = (id: string) => {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const parseNumber = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeStatus = (value: unknown) => {
  if (!value) return undefined;
  const status = String(value).trim().toUpperCase();
  return ORDER_STATUSES.includes(status) ? status : undefined;
};

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = parseId(id);
    if (!orderId) {
      return NextResponse.json({ error: "ID pesanan tidak valid" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, pengirim: true, penerima: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil detail pesanan" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = parseId(id);
    if (!orderId) {
      return NextResponse.json({ error: "ID pesanan tidak valid" }, { status: 400 });
    }

    const body = await request.json();
    const data: any = {};

    const status = normalizeStatus(body?.status);
    if (status) data.status = status;

    if (typeof body?.status_barang === "string" && body.status_barang.trim()) {
      data.status_barang = body.status_barang.trim().toUpperCase();
    }
    if (typeof body?.status_transaksi === "string" && body.status_transaksi.trim()) {
      data.status_transaksi = body.status_transaksi.trim().toUpperCase();
    }

    if (typeof body?.layanan === "string" && body.layanan.trim()) {
      data.layanan = body.layanan.trim().toUpperCase();
    }
    if (typeof body?.nama_barang === "string" && body.nama_barang.trim()) {
      data.nama_barang = body.nama_barang.trim();
    }
    if (typeof body?.catatan_barang === "string") {
      data.catatan_barang = body.catatan_barang.trim() || null;
    }

    const qty = parseNumber(body?.qty);
    if (qty !== undefined) data.qty = Math.max(1, qty);

    const berat_kg = parseNumber(body?.berat_kg);
    if (berat_kg !== undefined) data.berat_kg = Math.max(0.1, berat_kg);

    const total_bayar = parseNumber(body?.total_bayar);
    if (total_bayar !== undefined) data.total_bayar = Math.max(0, total_bayar);

    if (body?.tgl_pesanan) {
      const parsedDate = new Date(body.tgl_pesanan);
      if (!Number.isNaN(parsedDate.getTime())) data.tgl_pesanan = parsedDate;
    }

    const pengirimId = parseId(String(body?.pengirimId || ""));
    if (pengirimId) data.pengirim = { connect: { id: pengirimId } };

    const penerimaId = parseId(String(body?.penerimaId || ""));
    if (penerimaId) data.penerima = { connect: { id: penerimaId } };

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Tidak ada data yang diubah" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data,
      include: { user: true, pengirim: true, penerima: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Gagal mengubah pesanan" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = parseId(id);
    if (!orderId) {
      return NextResponse.json({ error: "ID pesanan tidak valid" }, { status: 400 });
    }

    await prisma.order.delete({ where: { id: orderId } });
    return NextResponse.json({ message: "Pesanan berhasil dihapus" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Gagal menghapus pesanan" }, { status: 500 });
  }
}
