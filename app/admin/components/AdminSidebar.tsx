'use client';

import React from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    if (window.confirm('Apakah kamu yakin ingin keluar?')) {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-pink-100 flex flex-col h-full shrink-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-pink-50">
        <a href="/" className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-2xl">trophy</span>
          Joki Uma Admin
        </a>
      </div>

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        <a 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
            pathname === '/admin/dashboard' ? 'bg-pink-50 text-primary' : 'text-slate-500 hover:bg-pink-50 hover:text-primary'
          }`} 
          href="/admin/dashboard"
        >
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span>Dashboard</span>
        </a>
        
        <a 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
            pathname === '/admin/pesanan' ? 'bg-pink-50 text-primary' : 'text-slate-500 hover:bg-pink-50 hover:text-primary'
          }`} 
          href="/admin/pesanan"
        >
          <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
          <span>Pesanan</span>
        </a>
      </nav>

      <div className="p-4 border-t border-pink-50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
