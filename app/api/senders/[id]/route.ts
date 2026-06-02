import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

const parseId = (id: string) => {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const senderId = parseId(id);
    if (!senderId) {
      return NextResponse.json({ error: "ID pengirim tidak valid" }, { status: 400 });
    }

    const sender = await prisma.pengirim.findUnique({ where: { id: senderId } });
    if (!sender) {
      return NextResponse.json({ error: "Pengirim tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(sender);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data pengirim" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const senderId = parseId(id);
    if (!senderId) {
      return NextResponse.json({ error: "ID pengirim tidak valid" }, { status: 400 });
    }

    const body = await request.json();
    const data: any = {};

    if (typeof body?.nama_pengirim === "string") data.nama_pengirim = body.nama_pengirim.trim();
    if (typeof body?.name === "string") data.nama_pengirim = body.name.trim();
    if (typeof body?.no_telepon === "string") data.no_telepon = body.no_telepon.trim();
    if (typeof body?.phone === "string") data.no_telepon = body.phone.trim();
    if (typeof body?.alamat === "string") data.alamat = body.alamat.trim();
    if (typeof body?.address === "string") data.alamat = body.address.trim();
    if (typeof body?.kecamatan === "string") data.kecamatan = body.kecamatan.trim();
    if (typeof body?.kode_pos === "string") data.kode_pos = body.kode_pos.trim();
    if (typeof body?.is_utama === "boolean") data.is_utama = body.is_utama;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Tidak ada data yang diubah" }, { status: 400 });
    }

    const sender = await prisma.$transaction(async (tx) => {
      if (data.is_utama === true) {
        await tx.pengirim.updateMany({
          where: { id: { not: senderId } },
          data: { is_utama: false },
        });
      }
      return tx.pengirim.update({ where: { id: senderId }, data });
    });

    return NextResponse.json(sender);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Pengirim tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Gagal mengubah data pengirim" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const senderId = parseId(id);
    if (!senderId) {
      return NextResponse.json({ error: "ID pengirim tidak valid" }, { status: 400 });
    }

    await prisma.pengirim.delete({ where: { id: senderId } });
    return NextResponse.json({ message: "Pengirim berhasil dihapus" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Pengirim tidak ditemukan" }, { status: 404 });
    }
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Pengirim masih dipakai pada pesanan. Hapus pesanan terkait dulu." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Gagal menghapus data pengirim" }, { status: 500 });
  }
}
