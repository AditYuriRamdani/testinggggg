// src/lib/validators/movie.ts
import { z } from "zod";

export const movieFormSchema = z.object({
  title: z.string().min(1, { message: "Judul film harus diisi." }),
  posterUrl: z.string().url({ message: "URL poster tidak valid." }),
  director: z.string().min(1, { message: "Nama sutradara harus diisi." }),
  cast: z.string().min(1, { message: "Nama pemeran harus diisi." }),
  synopsis: z.string().min(10, { message: "Sinopsis minimal 10 karakter." }),
  duration: z.coerce
    .number()
    .min(1, { message: "Durasi harus lebih dari 0 menit." }),
  releaseDate: z.string().min(1, { message: "Tanggal rilis harus diisi." }),
  rating: z.string().min(1, { message: "Rating harus diisi." }),
  isShowing: z.boolean().optional(),
});

export type MovieFormValues = z.infer<typeof movieFormSchema>;
