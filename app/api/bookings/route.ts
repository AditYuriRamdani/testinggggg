// app/api/bookings/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db/db";
import { bookings, showtimes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // 1. Pastikan pengguna sudah login
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // 2. Ambil data dari body permintaan
    const { showtimeId, numberOfTickets } = await req.json();
    if (!showtimeId || !numberOfTickets || numberOfTickets <= 0) {
      return NextResponse.json(
        { message: "Data tidak valid." },
        { status: 400 }
      );
    }

    // 3. Ambil detail jadwal tayang untuk mendapatkan harga
    const showtime = await db.query.showtimes.findFirst({
      where: eq(showtimes.id, showtimeId),
    });

    if (!showtime) {
      return NextResponse.json(
        { message: "Jadwal tayang tidak ditemukan." },
        { status: 404 }
      );
    }

    // 4. Hitung total harga
    const totalPrice = showtime.price * numberOfTickets;

    // 5. Simpan pesanan ke database
    const newBooking = await db
      .insert(bookings)
      .values({
        userId: session.user.id,
        showtimeId: showtimeId,
        numberOfTickets: numberOfTickets,
        totalPrice: totalPrice,
        status: "confirmed", // Langsung konfirmasi untuk saat ini
      })
      .returning();

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error) {
    console.error("BOOKING_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat pesanan." },
      { status: 500 }
    );
  }
}
