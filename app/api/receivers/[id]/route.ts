import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

const parseId = (id: string) => {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const receiverId = parseId(id);
    if (!receiverId) {
      return NextResponse.json({ error: "ID penerima tidak valid" }, { status: 400 });
    }

    const receiver = await prisma.penerima.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return NextResponse.json({ error: "Penerima tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(receiver);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data penerima" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const receiverId = parseId(id);
    if (!receiverId) {
      return NextResponse.json({ error: "ID penerima tidak valid" }, { status: 400 });
    }

    const body = await request.json();
    const data: any = {};

    if (typeof body?.nama_penerima === "string") data.nama_penerima = body.nama_penerima.trim();
    if (typeof body?.name === "string") data.nama_penerima = body.name.trim();
    if (typeof body?.no_telepon === "string") data.no_telepon = body.no_telepon.trim();
    if (typeof body?.phone === "string") data.no_telepon = body.phone.trim();
    if (typeof body?.alamat === "string") data.alamat = body.alamat.trim();
    if (typeof body?.address === "string") data.alamat = body.address.trim();
    if (typeof body?.kecamatan === "string") data.kecamatan = body.kecamatan.trim();
    if (typeof body?.kode_pos === "string") data.kode_pos = body.kode_pos.trim();

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Tidak ada data yang diubah" }, { status: 400 });
    }

    const receiver = await prisma.penerima.update({ where: { id: receiverId }, data });
    return NextResponse.json(receiver);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Penerima tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Gagal mengubah data penerima" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const receiverId = parseId(id);
    if (!receiverId) {
      return NextResponse.json({ error: "ID penerima tidak valid" }, { status: 400 });
    }

    await prisma.penerima.delete({ where: { id: receiverId } });
    return NextResponse.json({ message: "Penerima berhasil dihapus" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Penerima tidak ditemukan" }, { status: 404 });
    }
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Penerima masih dipakai pada pesanan. Hapus pesanan terkait dulu." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Gagal menghapus data penerima" }, { status: 500 });
  }
}
