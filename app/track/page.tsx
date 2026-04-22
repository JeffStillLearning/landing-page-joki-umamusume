'use client';

import React, { useState } from 'react';
import { useTrackOrder } from '@/lib/hooks/useOrders';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TrackOrderPage() {
  const [searchInput, setSearchInput] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  const { data: order, isLoading, isError } = useTrackOrder(orderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setOrderId(searchInput.trim().toUpperCase());
    }
  };

  const completedCount = order?.progress?.filter((p: { isDone: boolean }) => p.isDone).length || 0;
  const totalCount = order?.progress?.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 md:py-16 mt-20">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-3 md:mb-4 tracking-tight">
              Lacak Pesanan Anda
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-md mx-auto px-4">
              Masukkan Order ID untuk melihat progres pengerjaan joki Anda secara real-time.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10 md:mb-16">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Contoh: ORD-12345"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm text-slate-700 font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Cek Status
            </button>
          </form>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16 animate-pulse">
              <div className="inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold">Mencari data pesanan...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">error</span>
              </div>
              <p className="font-bold text-lg mb-1">Order ID Tidak Ditemukan</p>
              <p className="text-sm opacity-80">Pastikan ID yang Anda masukkan sudah benar atau hubungi Admin.</p>
            </div>
          )}

          {/* Order Details Card */}
          {order && (
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Card Header - Information */}
              <div className="bg-gradient-to-br from-primary to-pink-600 p-6 md:p-10 text-white">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                  <div className="space-y-2">
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                      Data Pesanan
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black">{order.orderId}</h2>
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="material-symbols-outlined text-sm">person</span>
                      <p className="text-sm md:text-base font-bold">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[140px]">
                    <span className="text-[10px] opacity-70 block uppercase font-black tracking-widest mb-1">Status</span>
                    <span className="text-sm md:text-base font-black flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Progress Visualizer */}
                {totalCount > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Progress Pengerjaan</p>
                        <p className="text-2xl font-black">{Math.round(progressPercent)}%</p>
                      </div>
                      <p className="text-xs font-bold bg-black/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        {completedCount} / {totalCount} Selesai
                      </p>
                    </div>
                    <div className="h-4 bg-black/10 rounded-full p-1 border border-white/10">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body - Steps */}
              <div className="p-6 md:p-10">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
                  </div>
                  Detail Checklist
                </h3>

                {totalCount === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">pending_actions</span>
                    <p className="text-slate-500 font-medium px-6">Admin belum membuat daftar progres untuk pesanan ini.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {order.progress.map((step: { id: string | number; isDone: boolean; title: string }, index: number) => (
                      <div 
                        key={step.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                          step.isDone 
                            ? 'bg-green-50/50 border-green-100' 
                            : 'bg-white border-slate-50 opacity-60'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          step.isDone ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {step.isDone ? (
                            <span className="material-symbols-outlined text-xl">check_circle</span>
                          ) : (
                            <span className="text-sm font-black">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold truncate ${step.isDone ? 'text-green-800' : 'text-slate-600'}`}>
                            {step.title}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {step.isDone ? 'Selesai' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
