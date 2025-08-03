// app/page.tsx
import { db } from "@/lib/db/db";
import { movies } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { eq } from "drizzle-orm";

export default async function Home() {
  const movieList = await db
    .select()
    .from(movies)
    .where(eq(movies.isShowing, true)); // PERBAIKAN DI SINI

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-5xl font-extrabold mb-10 text-center tracking-tight text-primary">
        Film yang Sedang Tayang
      </h1>

      {movieList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movieList.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.slug}`}>
              <Card className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-80 object-cover"
                />
                <CardContent className="p-4 relative">
                  <Badge className="absolute top-[-10px] left-4">
                    {movie.rating}
                  </Badge>
                  <CardTitle className="text-xl font-bold mt-2">
                    {movie.title}
                  </CardTitle>
                  <Button className="w-full mt-4">Pesan Tiket</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-muted-foreground mt-10">
          Belum ada film yang sedang tayang.
        </p>
      )}
    </div>
  );
}
