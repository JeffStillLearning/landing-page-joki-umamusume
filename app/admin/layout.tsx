import React from 'react';
import AdminLoginGuard from './loginadmin';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLoginGuard>
      <div className="bg-background-light text-slate-800 h-screen overflow-hidden flex font-[family-name:var(--font-admin)]">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="h-16 bg-white border-b border-pink-100 flex items-center justify-between px-8 shrink-0">
            <h1 className="text-xl font-bold text-slate-800">Manajemen Layanan</h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-700">Admin Utama</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  A
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            {children}
          </div>
        </div>
      </div>
    </AdminLoginGuard>
  );
}
