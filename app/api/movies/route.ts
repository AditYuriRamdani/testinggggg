import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { movies } from "@/lib/db/schema";
import { movieFormSchema } from "@/lib/validators/movie";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import slugify from "slugify";

// Fungsi pengecekan admin yang sudah diperbarui
const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  // Memeriksa berdasarkan 'role', bukan 'email'
  return session?.user?.role === "admin";
};

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }
    const body = await req.json();
    const validatedData = movieFormSchema.parse(body);
    const movieSlug = slugify(validatedData.title, {
      lower: true,
      strict: true,
    });

    // Cek apakah slug sudah ada
    const existingMovie = await db.query.movies.findFirst({
      where: eq(movies.slug, movieSlug),
    });

    if (existingMovie) {
      return NextResponse.json(
        { message: "Judul film ini sudah ada." },
        { status: 409 }
      );
    }

    const newMovie = await db
      .insert(movies)
      .values({
        ...validatedData,
        slug: movieSlug,
      })
      .returning();
    return NextResponse.json(newMovie[0], { status: 201 });
  } catch (error) {
    console.error("FAILED TO ADD MOVIE:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Gagal menambah film", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Gagal menambah film", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }
    const { id, ...data } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "ID Film dibutuhkan" },
        { status: 400 }
      );
    }

    const validatedData = movieFormSchema.parse(data);
    const updatedMovie = await db
      .update(movies)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(movies.id, id))
      .returning();

    if (updatedMovie.length === 0) {
      return NextResponse.json(
        { message: "Film tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedMovie[0]);
  } catch (error) {
    console.error("FAILED TO UPDATE MOVIE:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Gagal memperbarui film", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Gagal memperbarui film", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "ID Film dibutuhkan" },
        { status: 400 }
      );
    }

    const deletedMovie = await db
      .delete(movies)
      .where(eq(movies.id, id))
      .returning();

    if (deletedMovie.length === 0) {
      return NextResponse.json(
        { message: "Film tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Film berhasil dihapus" });
  } catch (error) {
    console.error("FAILED TO DELETE MOVIE:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Gagal menghapus film", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Gagal menghapus film", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allMovies = await db.select().from(movies);
    return NextResponse.json(allMovies);
  } catch (error) {
    console.error("FAILED TO FETCH MOVIES:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Gagal mengambil data film", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Gagal mengambil data film", error },
      { status: 500 }
    );
  }
}
