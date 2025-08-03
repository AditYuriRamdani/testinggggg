import { db } from "../../../../src/lib/db/db";
import { Button } from "../../../../src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import Link from "next/link";
import { MovieActions } from "../../../../src/components/movie-actions";
import { movies } from "../../../../src/lib/db/schema";
import { desc } from "drizzle-orm";

// Definisikan tipe Movie secara eksplisit
type Movie = typeof movies.$inferSelect;

export default async function MoviesDashboardPage() {
  const movieList = await db.query.movies.findMany({
    // Beri tipe eksplisit pada parameter orderBy
    orderBy: (moviesTable, { desc }) => [desc(moviesTable.createdAt)],
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
              // Beri tipe eksplisit pada parameter map
              movieList.map((movie: Movie) => (
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
