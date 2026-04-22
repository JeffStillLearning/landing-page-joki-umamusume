'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/lib/theme-provider';
import { CartProvider } from '@/lib/context/CartContext';
import { Cart } from '@/app/components/Cart';
import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  // Check if current path is an admin page or track page
  const isAdminPage = pathname?.startsWith('/admin');
  const isTrackPage = pathname === '/track';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          {children}
          {/* Only show Cart overlay on non-admin and non-track pages */}
          {!isAdminPage && !isTrackPage && <Cart />}
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
