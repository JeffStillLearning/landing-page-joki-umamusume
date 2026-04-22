'use client';

import React, { useState } from 'react';
import { useOrders, useUpdateOrderProgress, useBatchCreateOrderProgress, useDeleteOrderProgress } from '@/lib/hooks/useOrders';

export default function ProsesPage() {
  const { data: orders, isLoading } = useOrders();
  const updateProgress = useUpdateOrderProgress();
  const batchCreateProgress = useBatchCreateOrderProgress();
  const deleteProgress = useDeleteOrderProgress();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [dailyQuantity, setDailyQuantity] = useState(0);
  const [trainingQuantity, setTrainingQuantity] = useState(0);

  const handleCreateProgress = async () => {
    if (!selectedOrderId) return;
    
    const items: { title: string; is_done: boolean }[] = [];

    if (dailyQuantity > 0) {
      for (let i = 1; i <= dailyQuantity; i++) {
        items.push({ title: `Daily ${i}`, is_done: false });
      }
    }

    if (trainingQuantity > 0) {
      for (let i = 1; i <= trainingQuantity; i++) {
        items.push({ title: `Training ${i}`, is_done: false });
      }
    }

    if (items.length === 0) {
      alert('Masukkan setidaknya 1 jumlah untuk Daily atau Training');
      return;
    }

    try {
      await batchCreateProgress.mutateAsync({ orderId: selectedOrderId, items });
      setShowModal(false);
      setDailyQuantity(0);
      setTrainingQuantity(0);
    } catch (error) {
      alert('Gagal membuat progres');
    }
  };

  const handleResetProgress = async (orderId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus SEMUA progres untuk pesanan ini?')) {
      try {
        await deleteProgress.mutateAsync({ orderId });
      } catch (error) {
        alert('Gagal mereset progres');
      }
    }
  };

  if (isLoading) return <div className="p-8">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Pengerjaan Pesanan</h2>
      </div>

      <div className="grid gap-6">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                  {order.orderId}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{order.customerName}</h3>
                <p className="text-sm text-slate-500">{order.customerContact}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {!order.progress || order.progress.length === 0 ? (
                  <button
                    onClick={() => {
                      if (order.status === 'menunggu_konfirmasi') {
                        alert('Harap ubah status pesanan menjadi "Proses" terlebih dahulu di menu Pesanan sebelum menambah progres.');
                        return;
                      }
                      setSelectedOrderId(order.id);
                      setShowModal(true);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                      order.status === 'proses' 
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Tambah Progres
                  </button>
                ) : (
                  <button
                    onClick={() => handleResetProgress(order.id)}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-sm">delete_sweep</span>
                    Reset Progres
                  </button>
                )}
              </div>
            </div>

            {/* Checklist Section */}
            {order.progress && order.progress.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {order.progress.map((item) => (
                  <label
                    key={item.id}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                      item.isDone 
                        ? 'bg-green-50 border-green-500 text-green-700' 
                        : 'bg-white border-slate-100 hover:border-primary text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={item.isDone}
                      onChange={() => updateProgress.mutate({ id: item.id, isDone: !item.isDone })}
                    />
                    <span className={`material-symbols-outlined mb-2 transition-transform group-active:scale-90 ${
                      item.isDone ? 'text-green-500' : 'text-slate-300'
                    }`}>
                      {item.isDone ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className="text-xs font-bold text-center">{item.title}</span>
                  </label>
                ))}
              </div>
            )}
            
            {!order.progress || order.progress.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                <p className="text-sm text-slate-400">Belum ada progres yang dibuat</p>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${(order.progress.filter(p => p.isDone).length / order.progress.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {order.progress.filter(p => p.isDone).length}/{order.progress.length} Selesai
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Tambah Progres */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Buat Progres Baru</h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                    Jumlah Daily
                  </label>
                  <input
                    type="number"
                    value={dailyQuantity}
                    onChange={(e) => setDailyQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    placeholder="Contoh: 5"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
                    Jumlah Training
                  </label>
                  <input
                    type="number"
                    value={trainingQuantity}
                    onChange={(e) => setTrainingQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    placeholder="Contoh: 10"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setDailyQuantity(0);
                    setTrainingQuantity(0);
                  }}
                  className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateProgress}
                  disabled={batchCreateProgress.isPending || (dailyQuantity === 0 && trainingQuantity === 0)}
                  className="flex-1 py-3 font-bold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none"
                >
                  {batchCreateProgress.isPending ? 'Memproses...' : 'Buat Progres'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
