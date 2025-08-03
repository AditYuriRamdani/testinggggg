// app/booking/[slug]/page.tsx (FINAL)
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Tipe data
type Showtime = {
  id: number;
  startTime: string;
  price: number;
  theater: { name: string };
};
type MovieWithShowtimes = {
  id: number;
  title: string;
  posterUrl: string;
  synopsis: string | null;
  showtimes: Showtime[];
};

// Fungsi helper
const groupShowtimesByDate = (showtimes: Showtime[]) => {
  return showtimes.reduce((acc, showtime) => {
    const date = new Date(showtime.startTime).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);
};

export default function BookingPage({ params }: { params: { slug: string } }) {
  const [movieData, setMovieData] = useState<MovieWithShowtimes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(`/api/movies/${params.slug}`);
        if (!response.ok) {
          throw new Error("Gagal memuat data film.");
        }
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [params.slug]);

  const handleBooking = async (showtimeId: number) => {
    setIsBooking(showtimeId);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showtimeId, numberOfTickets: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memesan tiket.");
      }

      toast.success("Tiket berhasil dipesan!");
      router.push("/my-tickets"); // Akan kita buat halaman ini
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    } finally {
      setIsBooking(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">Memuat jadwal...</div>
    );
  }

  if (!movieData) {
    return (
      <div className="container mx-auto p-8 text-center">
        Film tidak ditemukan atau jadwal belum tersedia.
      </div>
    );
  }

  const groupedShowtimes = groupShowtimesByDate(movieData.showtimes);

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="md:w-1/4 flex-shrink-0">
          <img
            src={movieData.posterUrl}
            alt={movieData.title}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-3/4">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {movieData.title}
          </h1>
          <p className="text-lg text-foreground">{movieData.synopsis}</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">
        Pilih Jadwal Tayang
      </h2>

      {Object.keys(groupedShowtimes).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedShowtimes).map(([date, showtimesOnDate]) => (
            <div key={date}>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                {date}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {showtimesOnDate.map((showtime) => (
                  <Button
                    key={showtime.id}
                    variant="outline"
                    className="flex flex-col h-auto py-2 text-center"
                    onClick={() => handleBooking(showtime.id)}
                    disabled={isBooking === showtime.id}
                  >
                    {isBooking === showtime.id ? (
                      "Memproses..."
                    ) : (
                      <>
                        <span className="text-lg font-bold">
                          {new Date(showtime.startTime).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {showtime.theater.name}
                        </span>
                        <span className="text-xs">
                          Rp {showtime.price.toLocaleString("id-ID")}
                        </span>
                      </>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-muted-foreground mt-10">
          Jadwal untuk film ini belum tersedia.
        </p>
      )}
    </div>
  );
}
