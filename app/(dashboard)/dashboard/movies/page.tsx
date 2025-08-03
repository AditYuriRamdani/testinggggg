import { db } from "@/lib/db/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { MovieActions } from "@/components/movie-actions";

export default async function MoviesDashboardPage() {
  const movieList = await db.query.movies.findMany({
    orderBy: (movies, { desc }) => [desc(movies.createdAt)],
  });

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Manajemen Film</h1>
        <Button asChild>
          <Link href="/dashboard/movies/add">Tambah Film</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Poster</TableHead>
              <TableHead>Judul Film</TableHead>
              <TableHead>Durasi (menit)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movieList.length > 0 ? (
              movieList.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-16 h-auto rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell>{movie.duration}</TableCell>
                  <TableCell>
                    {movie.isShowing ? "Sedang Tayang" : "Akan Datang"}
                  </TableCell>
                  <TableCell className="text-right">
                    <MovieActions movieId={movie.id} slug={movie.slug} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Belum ada film.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
