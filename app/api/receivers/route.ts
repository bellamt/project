import { prisma } from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    const where: Prisma.PenerimaWhereInput | undefined = q
      ? {
          OR: [
            { nama_penerima: { contains: q, mode: "insensitive" } },
            { no_telepon: { contains: q, mode: "insensitive" } },
            { alamat: { contains: q, mode: "insensitive" } },
            { kecamatan: { contains: q, mode: "insensitive" } },
            { kode_pos: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined;

    const receivers = await prisma.penerima.findMany({
      where,
      orderBy: { id: "desc" },
    });

    return NextResponse.json(receivers);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data penerima" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nama_penerima = String(body?.nama_penerima || body?.name || "").trim();
    const no_telepon = String(body?.no_telepon || body?.phone || "").trim();
    const alamat = String(body?.alamat || body?.address || "").trim();
    const kecamatan = String(body?.kecamatan || "").trim();
    const kode_pos = String(body?.kode_pos || "").trim();

    if (!nama_penerima || !no_telepon || !alamat || !kecamatan || !kode_pos) {
      return NextResponse.json(
        { error: "Nama, telepon, alamat, kecamatan, dan kode pos wajib diisi" },
        { status: 400 }
      );
    }

    const receiver = await prisma.penerima.create({
      data: { nama_penerima, no_telepon, alamat, kecamatan, kode_pos },
    });

    return NextResponse.json(receiver, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah data penerima" }, { status: 500 });
  }
}
