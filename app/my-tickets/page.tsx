// app/my-tickets/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Definisikan tipe data untuk booking
type Booking = {
  id: number;
  numberOfTickets: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  showtime: {
    startTime: string;
    movie: {
      title: string;
      posterUrl: string;
    };
    theater: {
      name: string;
    };
  };
};

export default function MyTicketsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings");
        if (!response.ok) {
          throw new Error("Gagal memuat data tiket.");
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Memuat tiket Anda...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Tiket Saya</h1>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <img
                  src={booking.showtime.movie.posterUrl}
                  alt={booking.showtime.movie.title}
                  className="w-full h-60 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="mb-2">
                  {booking.showtime.movie.title}
                </CardTitle>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Jadwal:</strong>{" "}
                    {new Date(booking.showtime.startTime).toLocaleString(
                      "id-ID",
                      { dateStyle: "full", timeStyle: "short" }
                    )}
                  </p>
                  <p>
                    <strong>Teater:</strong> {booking.showtime.theater.name}
                  </p>
                  <p>
                    <strong>Jumlah Tiket:</strong> {booking.numberOfTickets}
                  </p>
                  <p>
                    <strong>Total Harga:</strong> Rp{" "}
                    {booking.totalPrice.toLocaleString("id-ID")}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="font-semibold text-primary">
                      {booking.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-muted-foreground mt-10">
          Anda belum memiliki tiket.
        </p>
      )}
    </div>
  );
}
