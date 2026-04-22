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

export const fetchOrders = async () => {
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
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        if (dateA !== dateB) return dateA - dateB;
        
        // Fallback: urutkan berdasarkan angka di akhir title agar stabil (misal: "Daily 1")
        const numA = parseInt(a.title.split(' ').pop()) || 0;
        const numB = parseInt(b.title.split(' ').pop()) || 0;
        return numA - numB;
      })
      .map((p: any) => ({
        id: p.id,
        orderId: p.order_id,
        title: p.title,
        isDone: p.is_done, // MAPPING PENTING: is_done -> isDone
        note: p.note,
        createdAt: p.created_at
      }))
  })) as OrderWithDetails[];
};

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    onSuccess: () => {
      // Optimistic update atau invalidate untuk memastikan UI sinkron
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useBatchCreateOrderProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, items }: { orderId: string; items: { title: string; is_done: boolean }[] }) => {
      const { data, error } = await supabase
        .from('order_progress')
        .insert(items.map(item => ({ order_id: orderId, ...item })))
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useDeleteOrderProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, orderId }: { id?: string; orderId?: string }) => {
      let query = supabase.from('order_progress').delete();
      
      if (id) {
        query = query.eq('id', id);
      } else if (orderId) {
        query = query.eq('order_id', orderId);
      } else {
        throw new Error('id or orderId must be provided');
      }

      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export const fetchOrderByOrderId = async (orderId: string) => {
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_progress (*)
    `)
    .eq('order_id', orderId)
    .single();

  if (error) throw error;
  if (!order) return null;

  return {
    id: order.id,
    orderId: order.order_id,
    customerName: order.customer_name,
    status: order.status,
    progress: (order.order_progress || [])
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        if (dateA !== dateB) return dateA - dateB;
        
        // Fallback: urutkan berdasarkan angka di akhir title agar stabil (misal: "Daily 1")
        const numA = parseInt(a.title.split(' ').pop()) || 0;
        const numB = parseInt(b.title.split(' ').pop()) || 0;
        return numA - numB;
      })
      .map((p: any) => ({
        id: p.id,
        title: p.title,
        isDone: p.is_done,
        createdAt: p.created_at
      }))
  };
};

export function useTrackOrder(orderId: string | null) {
  return useQuery({
    queryKey: ['track-order', orderId],
    queryFn: () => orderId ? fetchOrderByOrderId(orderId) : null,
    enabled: !!orderId,
    retry: false
  });
}
