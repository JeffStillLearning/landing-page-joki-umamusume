'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@supabase/ssr';
import type { Testimonial } from '@/lib/db/schema';

const QUERY_KEY = ['testimonials'];

// Helper to map Supabase row to Testimonial type
function mapToTestimonial(row: any): Testimonial {
  return {
    id: row.id,
    name: row.name,
    trainerId: null, // Removed for privacy
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at ? new Date(row.created_at) : null,
  };
}

// Fetch all testimonials function for prefetching
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Konfigurasi Supabase tidak ditemukan (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).'
    );
  }

  const supabase = createBrowserClient(url, anonKey);
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // Surface the real cause during development (the UI shows a friendly message).
    if (process.env.NODE_ENV !== 'production') {
      console.error('[testimonials] gagal fetch dari Supabase:', error);
    }
    throw new Error(error.message);
  }

  return (data || []).map(mapToTestimonial);
};

// Fetch all testimonials
export function useTestimonials() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchTestimonials,
    staleTime: 5 * 60 * 1000,
    // This machine can have flaky DNS to *.supabase.co; ride out transient
    // network failures with a few backed-off retries instead of failing on the first.
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}

// Create a new testimonial
export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTestimonial: Omit<Testimonial, 'id' | 'createdAt'>) => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(sessionError?.message || 'User session not found. Authentication required for this operation.');
      }

      // Map camelCase to snake_case for Supabase
      const insertData = {
        name: newTestimonial.name,
        rating: newTestimonial.rating,
        comment: newTestimonial.comment,
        // Exclude trainer_id for privacy
      };

      const { data, error } = await supabase
        .from('testimonials')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapToTestimonial(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

// Update a testimonial
export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Testimonial> & { id: string }) => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(sessionError?.message || 'User session not found. Authentication required for this operation.');
      }

      // Map camelCase to snake_case for Supabase
      const updateData: Record<string, any> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.comment !== undefined) updateData.comment = updates.comment;
      // Exclude trainer_id for privacy

      const { data, error } = await supabase
        .from('testimonials')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapToTestimonial(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

// Delete a testimonial
export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(sessionError?.message || 'User session not found. Authentication required for this operation.');
      }

      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
