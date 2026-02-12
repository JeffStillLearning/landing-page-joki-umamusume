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

// Fetch all testimonials
export function useTestimonials() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<Testimonial[]> => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(mapToTestimonial);
    },
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
