'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  category?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('uma_joki_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('uma_joki_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prev) => {
      const existingItemIndex = prev.findIndex((i) => i.id === item.id);
      if (existingItemIndex !== -1) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }
      return [...prev, { ...item, quantity }];
    });
    
    setAddedItemName(item.name);
    setShowPopup(true);
    
    // Auto hide popup after 2 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce((total, item) => {
    const numericPrice = parseFloat(item.price.replace(/[^\d]/g, ''));
    return total + ((isNaN(numericPrice) ? 0 : numericPrice) * item.quantity);
  }, 0);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, itemCount }}>
      {children}
      
      {/* Custom Pop-up Overlay */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-xl text-white p-8 rounded-[2.5rem] flex flex-col items-center justify-center animate-pop-in shadow-2xl border border-white/10 w-64 h-64 text-center">
            <div className="w-20 h-20 min-w-20 min-h-20 bg-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(74,222,128,0.4)]">
              <span 
                className="material-symbols-outlined text-white" 
                style={{ fontSize: "48px", fontWeight: "bold" }}
              >
                check
              </span>
            </div>
            <p className="text-lg font-black leading-tight">{addedItemName}</p>
            <p className="text-sm mt-2 opacity-80 tracking-widest font-bold">Berhasil ditambahkan</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.5); }
          20% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
