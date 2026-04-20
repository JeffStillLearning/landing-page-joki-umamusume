import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLoginGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

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

  // Check if user is authenticated and is the admin
  const adminEmail = 'adminjokigameumamusume@gmail.com'; 
  if (!session || session.user?.email !== adminEmail) {
    redirect('/login');
  }

  return <>{children}</>;
}
