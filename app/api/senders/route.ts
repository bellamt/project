import { prisma } from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    const where: Prisma.PengirimWhereInput | undefined = q
      ? {
          OR: [
            { nama_pengirim: { contains: q, mode: "insensitive" } },
            { no_telepon: { contains: q, mode: "insensitive" } },
            { alamat: { contains: q, mode: "insensitive" } },
            { kecamatan: { contains: q, mode: "insensitive" } },
            { kode_pos: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined;

    const senders = await prisma.pengirim.findMany({
      where,
      orderBy: [{ is_utama: "desc" }, { id: "desc" }],
    });

    return NextResponse.json(senders);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data pengirim" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nama_pengirim = String(body?.nama_pengirim || body?.name || "").trim();
    const no_telepon = String(body?.no_telepon || body?.phone || "").trim();
    const alamat = String(body?.alamat || body?.address || "").trim();
    const kecamatan = String(body?.kecamatan || "").trim();
    const kode_pos = String(body?.kode_pos || "").trim();
    const is_utama = Boolean(body?.is_utama);

    if (!nama_pengirim || !no_telepon || !alamat || !kecamatan || !kode_pos) {
      return NextResponse.json(
        { error: "Nama, telepon, alamat, kecamatan, dan kode pos wajib diisi" },
        { status: 400 }
      );
    }

    const sender = await prisma.$transaction(async (tx) => {
      if (is_utama) {
        await tx.pengirim.updateMany({ data: { is_utama: false } });
      }
      return tx.pengirim.create({
        data: { nama_pengirim, no_telepon, alamat, kecamatan, kode_pos, is_utama },
      });
    });

    return NextResponse.json(sender, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah data pengirim" }, { status: 500 });
  }
}
