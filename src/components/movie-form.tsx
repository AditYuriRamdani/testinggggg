"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { movieFormSchema, MovieFormValues } from "@/lib/validators/movie";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { movies } from "@/lib/db/schema";

type Movie = typeof movies.$inferSelect;

interface MovieFormProps {
  initialData?: Movie | null;
}

export function MovieForm({ initialData }: MovieFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          cast: initialData.cast ?? "",
          director: initialData.director ?? "",
          rating: initialData.rating ?? "",
          releaseDate: initialData.releaseDate ?? "",
          synopsis: initialData.synopsis ?? "",
          isShowing: initialData.isShowing ?? true, // Perbaikan di sini
        }
      : {
          title: "",
          posterUrl: "",
          director: "",
          cast: "",
          synopsis: "",
          duration: 0,
          releaseDate: "",
          rating: "",
          isShowing: true,
        },
  });

  const onSubmit = async (data: MovieFormValues) => {
    setIsLoading(true);
    try {
      const url = "/api/movies";
      const method = initialData ? "PUT" : "POST";
      const body = initialData
        ? JSON.stringify({ ...data, id: initialData.id })
        : JSON.stringify(data);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(
          initialData ? "Gagal memperbarui film." : "Gagal menambah film."
        );
      }

      toast.success(
        initialData ? "Film berhasil diperbarui!" : "Film berhasil ditambahkan!"
      );
      router.push("/dashboard/movies");
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* FormField untuk title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Film</FormLabel>
              <FormControl>
                <Input placeholder="Avatar: The Last Airbender" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FormField untuk posterUrl */}
        <FormField
          control={form.control}
          name="posterUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Poster</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/poster.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FormField untuk director */}
        <FormField
          control={form.control}
          name="director"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sutradara</FormLabel>
              <FormControl>
                <Input placeholder="Steven Spielberg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FormField untuk cast */}
        <FormField
          control={form.control}
          name="cast"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pemeran</FormLabel>
              <FormControl>
                <Textarea placeholder="Nama A, Nama B, Nama C" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FormField untuk synopsis */}
        <FormField
          control={form.control}
          name="synopsis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sinopsis</FormLabel>
              <FormControl>
                <Textarea placeholder="Sinopsis film..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FormField untuk duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durasi (menit)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="120"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value, 10) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FormField untuk releaseDate */}
        <FormField
          control={form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Rilis</FormLabel>
              <FormControl>
                <Input type="text" placeholder="2025-01-01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FormField untuk rating */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input type="text" placeholder="SU / PG-13" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FormField untuk isShowing */}
        <FormField
          control={form.control}
          name="isShowing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Sedang Tayang</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Menyimpan..."
            : initialData
            ? "Simpan Perubahan"
            : "Tambah Film"}
        </Button>
      </form>
    </Form>
  );
}
