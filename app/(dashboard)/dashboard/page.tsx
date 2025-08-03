// app/(dashboard)/dashboard/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // TODO: Implementasi role check untuk memastikan user adalah admin
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Manajemen Film</h2>
          <p className="text-gray-600 mb-6">
            Kelola daftar film yang sedang tayang atau akan tayang di bioskop.
          </p>
          <Link href="/dashboard/movies">
            <Button>Lihat Film</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
