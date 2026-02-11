import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Fungsi untuk mendapatkan session di server component
export async function getSession() {
  const cookieStore = await cookies(); // ✅ WAJIB await

  const allCookies = cookieStore.getAll().map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
  }));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return allCookies;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Check if user is authenticated and is the admin
  const adminEmail = 'adminjokigameumamusume@gmail.com'; // Ganti dengan email Anda
  if (!session || session.user?.email !== adminEmail) {
    // Redirect to admin login if not authorized
    redirect('/login');
  }

  return <>{children}</>;
}