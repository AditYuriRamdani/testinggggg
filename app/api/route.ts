// app/api/movies/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { movies } from "@/lib/db/schema";
import { movieFormSchema } from "@/lib/validators/movie";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import slugify from "slugify"; // Kita akan menginstal ini

// Fungsi helper untuk memeriksa role admin
const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  // TODO: Ganti dengan logic role management yang lebih baik.
  // Untuk saat ini, kita anggap email 'admin@example.com' adalah admin.
  return session?.user?.email === "admin@example.com";
};

// POST: Menambah film baru
export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = movieFormSchema.parse(body);

    // Buat slug dari judul
    const movieSlug = slugify(validatedData.title, {
      lower: true,
      strict: true,
    });

    const newMovie = await db
      .insert(movies)
      .values({
        ...validatedData,
        slug: movieSlug,
      })
      .returning();

    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to add movie", error },
      { status: 500 }
    );
  }
}

// PUT: Mengupdate film yang sudah ada
export async function PUT(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id, ...data } = await req.json();
    const validatedData = movieFormSchema.parse(data);

    const updatedMovie = await db
      .update(movies)
      .set({
        ...validatedData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(movies.id, id))
      .returning();

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update movie", error },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus film
export async function DELETE(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const { id } = await req.json();

    await db.delete(movies).where(eq(movies.id, id));

    return NextResponse.json({ message: "Movie deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete movie", error },
      { status: 500 }
    );
  }
}

// GET: Mendapatkan daftar film (sudah ada di page.tsx, tapi kita tambahkan di API juga)
export async function GET() {
  try {
    const allMovies = await db.select().from(movies);
    return NextResponse.json(allMovies);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch movies", error },
      { status: 500 }
    );
  }
}
