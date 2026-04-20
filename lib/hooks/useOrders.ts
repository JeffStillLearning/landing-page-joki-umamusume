'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Order, OrderItem, OrderProgress } from '@/lib/db/schema';

export interface OrderWithDetails extends Order {
  items?: OrderItem[];
  progress?: Array<{
    id: string;
    orderId: string;
    title: string;
    isDone: boolean;
    note: string | null;
    createdAt: string | null;
  }>;
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      // OPTIMASI: Gunakan JOIN untuk mengambil semua data dalam SATU request
      const { data: rawOrders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          order_progress (*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Supabase fetch error:', ordersError);
        throw ordersError;
      }

      if (!rawOrders) return [];

      // Mapping data dari snake_case ke camelCase
      return rawOrders.map((order: any) => ({
        id: order.id,
        orderId: order.order_id,
        customerName: order.customer_name,
        customerContact: order.customer_contact,
        status: order.status,
        totalPrice: order.total_price,
        note: order.note,
        createdAt: order.created_at,
        items: order.order_items || [],
        progress: (order.order_progress || [])
          .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((p: any) => ({
            id: p.id,
            orderId: p.order_id,
            title: p.title,
            isDone: p.is_done, // MAPPING PENTING: is_done -> isDone
            note: p.note,
            createdAt: p.created_at
          }))
      })) as OrderWithDetails[];
    },
    staleTime: 30 * 1000, // Data dianggap segar selama 30 detik (mengurangi loading berulang)
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isDone }: { id: string; isDone: boolean }) => {
      const { data, error } = await supabase
        .from('order_progress')
        .update({ is_done: isDone })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (updatedData) => {
      // Optimistic update atau invalidate untuk memastikan UI sinkron
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
