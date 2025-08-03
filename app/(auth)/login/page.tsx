// app/(auth)/login/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Jika sudah login, redirect ke halaman utama
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>
        <form>
          {/* Kamu bisa tambahkan form login dengan email/password di sini */}
          {/* Untuk saat ini, kita gunakan tombol login dengan provider */}
          <Button type="button">Login dengan GitHub</Button>
        </form>
      </div>
    </div>
  );
}
