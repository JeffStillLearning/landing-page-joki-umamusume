'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { supabase } from '@/lib/supabase';

type CheckoutStep = 'cart' | 'form' | 'success';

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, itemCount, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderedItemsSummary, setOrderedItemsSummary] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    note: ''
  });

  // Manage History for Hardware Back / Swipe Back
  useEffect(() => {
    if (isOpen) {
      if (step === 'cart') {
        window.history.pushState({ drawer: 'open', step: 'cart' }, '');
      }

      const handlePopState = (e: PopStateEvent) => {
        if (!e.state || e.state.drawer !== 'open') {
          setIsOpen(false);
        } else if (e.state.step === 'cart') {
          setStep('cart');
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, step]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const generateOrderId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ORD-${result}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'name') {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'whatsapp') {
      filteredValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: filteredValue }));
  };

  const handleNextStep = () => {
    window.history.pushState({ drawer: 'open', step: 'form' }, '');
    setStep('form');
  };

  const resetCartUI = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('cart');
      setFormData({ name: '', whatsapp: '', note: '' });
      setOrderId('');
      setOrderedItemsSummary('');
    }, 500);
  }, []);

  const handleHeaderBack = () => {
    window.history.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) return;

    setIsSubmitting(true);
    const newOrderIdText = generateOrderId();
    setOrderId(newOrderIdText);

    // Simpan ringkasan paket sebelum keranjang dikosongkan
    const summary = items.map(item => `- ${item.name} (${item.quantity}x)`).join('\n');
    setOrderedItemsSummary(summary);

    try {
      // 1. Simpan ke tabel orders (TANPA created_at, biarkan DB yang mengisi)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_id: newOrderIdText,
          customer_name: formData.name,
          customer_contact: formData.whatsapp,
          total_price: totalPrice,
          note: formData.note,
          status: 'menunggu_konfirmasi'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const internalOrderId = orderData.id;

      // 2. Simpan items ke tabel order_items (TANPA created_at)
      const orderItemsData = items.map(item => ({
        order_id: internalOrderId,
        package_name: item.name,
        price: parseFloat(item.price.replace(/[^\d]/g, '')),
        quantity: item.quantity
      }));

      await supabase.from('order_items').insert(orderItemsData);

      // 3. Simpan progress (TANPA created_at)
      const progressEntries: any[] = [];
      items.forEach(item => {
        const isDaily = item.category === 'Daily Scenario' || item.name.toLowerCase().includes('hari');
        const isTraining = item.name.toLowerCase().includes('training');
        
        if (isDaily) {
          for (let i = 1; i <= item.quantity; i++) {
            progressEntries.push({ order_id: internalOrderId, title: `Hari ${i}`, is_done: false, note: `Progress untuk ${item.name}` });
          }
        } else if (isTraining) {
          for (let i = 1; i <= item.quantity; i++) {
            progressEntries.push({ order_id: internalOrderId, title: `Training ke-${i}`, is_done: false, note: `Progress untuk ${item.name}` });
          }
        } else {
          progressEntries.push({ order_id: internalOrderId, title: `Pengerjaan: ${item.name}`, is_done: false, note: 'Pesanan sedang diproses' });
        }
      });

      if (progressEntries.length > 0) {
        await supabase.from('order_progress').insert(progressEntries);
      }

      setStep('success');
      clearCart();
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Gagal membuat pesanan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppUrl = () => {
    const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6283110123195';
    const packageList = orderedItemsSummary || items.map(item => `- ${item.name} (${item.quantity}x)`).join('\n');
    const message = `Halo Kak, saya ingin order:\n\nOrder ID: ${orderId}\nNama: ${formData.name}\nPaket:\n${packageList}\nCatatan: ${formData.note || '-'}\n\nTerima kasih!`;
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
      >
        <div className="relative">
          <span className="material-symbols-outlined !text-4xl">shopping_cart</span>
          {itemCount > 0 && (
            <span className="absolute bottom-5.5 left-4.5 bg-white text-black text-[15px] font-black min-w-[23px] h-[23px] px-1 rounded-full flex items-center justify-center shadow">
              {itemCount}
            </span>
          )}
        </div>
      </button>

      <div 
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleHeaderBack}
      ></div>

      <div 
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-96 bg-white shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex items-center gap-4">
            <button 
              onClick={handleHeaderBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center text-gray-500"
            >
              <span className="material-symbols-outlined !text-2xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                {step === 'cart' ? 'shopping_cart' : step === 'form' ? 'person' : 'check_circle'}
              </span>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 'cart' ? 'Keranjang Kamu' : step === 'form' ? 'Data Pengguna' : 'Pesanan Berhasil'}
              </h2>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            {step === 'cart' && (
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-50">
                    <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">shopping_basket</span>
                    <p className="text-gray-500 font-medium">Keranjang kamu masih kosong</p>
                    <button onClick={handleHeaderBack} className="mt-4 text-primary font-bold hover:underline">Mulai belanja</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex flex-col gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group animate-slide-in">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-grow">
                            <h4 className="font-bold text-gray-900 leading-tight">{item.name}</h4>
                            {item.category && <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{item.category}</span>}
                            <p className="text-primary font-black mt-1">{formatCurrency(parseFloat(item.price.replace(/[^\d]/g, '')) * item.quantity)}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 'form' && (
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nama Anda *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama (A-Z saja)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nomor WhatsApp *</label>
                    <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} placeholder="Masukkan nomor (0-9 saja)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Catatan (opsional)</label>
                    <textarea name="note" value={formData.note} onChange={handleInputChange} placeholder="Jelaskan detail yang diinginkan" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium resize-none" />
                  </div>
                  <div className="pt-4">
                    <button type="submit" disabled={isSubmitting || !formData.name || !formData.whatsapp} className={`w-full py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${isSubmitting || !formData.name || !formData.whatsapp ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-pink-200'}`}>
                      {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <><span>Pesan Sekarang</span><span className="material-symbols-outlined">send</span></>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'success' && (
              <div className="p-6 h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-green-500 !text-5xl font-bold">check</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Pesanan berhasil dibuat!</h3>
                <p className="text-gray-500 mb-8 font-medium">Data Anda telah kami terima.</p>
                <div className="w-full bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 mb-8">
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">Order ID Kamu</p>
                  <p className="text-3xl font-black text-primary tracking-tighter mb-4">{orderId}</p>
                </div>
                <div className="space-y-3 w-full">
                  <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="w-full py-4 px-6 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100">
                    <span className="material-symbols-outlined">chat</span>Lanjut ke WhatsApp
                  </a>
                  <button onClick={resetCartUI} className="w-full py-4 px-6 text-gray-400 font-bold hover:text-gray-600 transition-all">Tutup</button>
                </div>
              </div>
            )}
          </div>
          {/* Footer (Step 1 only) */}
          {step === 'cart' && items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-500 font-medium">Total Estimasi:</span>
                <span className="text-2xl font-black text-gray-900">{formatCurrency(totalPrice)}</span>
              </div>
              <button onClick={handleNextStep} className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-200">
                <span>Lanjutkan ke Pesanan</span><span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">Finalisasi pesanan akan dilakukan via WhatsApp</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
