'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@supabase/ssr';
import type { PricingPackage } from '@/lib/db/schema';

const QUERY_KEY = ['pricing-packages'];

// Helper to map Supabase row to PricingPackage type
function mapToPricingPackage(row: any): PricingPackage {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    features: row.features,
    isPopular: row.is_popular,
    isActive: row.is_active,
    createdAt: row.created_at ? new Date(row.created_at) : null,
  };
}

// Fetch all pricing packages
export function usePricingPackages() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<PricingPackage[]> => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from('pricing_packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(mapToPricingPackage);
    },
  });
}

// Fetch all pricing packages for admin (including inactive)
export function useAllPricingPackages() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'admin'],
    queryFn: async (): Promise<PricingPackage[]> => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from('pricing_packages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(mapToPricingPackage);
    },
  });
}

// Create a new pricing package
export function useCreatePricingPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPackage: Omit<PricingPackage, 'id' | 'createdAt'>) => {
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
        name: newPackage.name,
        price: newPackage.price,
        description: newPackage.description,
        features: newPackage.features,
        is_popular: newPackage.isPopular,
        is_active: newPackage.isActive,
      };

      const { data, error } = await supabase
        .from('pricing_packages')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapToPricingPackage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

// Update a pricing package
export function useUpdatePricingPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<PricingPackage> & { id: string }) => {
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
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.features !== undefined) updateData.features = updates.features;
      if (updates.isPopular !== undefined) updateData.is_popular = updates.isPopular;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { data, error } = await supabase
        .from('pricing_packages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapToPricingPackage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

// Delete a pricing package
export function useDeletePricingPackage() {
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
        .from('pricing_packages')
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
