"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Link from "next/link";

interface MovieActionsProps {
  movieId: number;
  slug: string;
}

export function MovieActions({ movieId, slug }: MovieActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus film ini?")) {
      return;
    }

    try {
      const response = await fetch("/api/movies", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: movieId }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus film.");
      }

      toast.success("Film berhasil dihapus.");
      router.refresh(); // Memuat ulang data di halaman
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-x-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/dashboard/movies/${slug}/edit`}>Edit</Link>
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        Hapus
      </Button>
    </div>
  );
}
