// app/(dashboard)/dashboard/movies/[slug]/edit/page.tsx
import { db } from "@/lib/db/db";
import { movies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditMoviePage({
  params,
}: {
  params: { slug: string };
}) {
  const movie = await db.query.movies.findFirst({
    where: eq(movies.slug, params.slug),
  });

  if (!movie) {
    notFound();
  }

  // TODO: Tampilkan form edit film
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Film: {movie.title}</h1>
      <p>ID: {movie.id}</p>
      <p>Sinopsis: {movie.synopsis}</p>
      {/* Form edit akan diletakkan di sini */}
    </div>
  );
}
