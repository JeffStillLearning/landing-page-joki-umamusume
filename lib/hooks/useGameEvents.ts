'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { GameEvent } from '@/lib/db/schema';

const QUERY_KEY = ['game-events'];

// Helper to map Supabase row to GameEvent type
function mapToGameEvent(row: any): GameEvent {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    eventType: row.event_type,
    price: row.price,
    priceLabel: row.price_label,
    cloudinaryId: row.cloudinary_id,
    status: row.status,
    createdAt: row.created_at ? new Date(row.created_at) : null,
  };
}

// Fetch all active game events
export function useGameEvents() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<GameEvent[]> => {
      const { data, error } = await supabase
        .from('game_events')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(mapToGameEvent);
    },
  });
}

// Fetch all game events for admin
export function useAllGameEvents() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'admin'],
    queryFn: async (): Promise<GameEvent[]> => {
      const { data, error } = await supabase
        .from('game_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(mapToGameEvent);
    },
  });
}

// Create a new game event with optional image upload
export function useCreateGameEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      imageFile,
      name,
      description,
      eventType,
      price,
      priceLabel,
      status,
    }: {
      name: string;
      description?: string;
      eventType?: string;
      price: string;
      priceLabel?: string;
      status?: string;
      imageFile?: File;
    }) => {
      let cloudinaryId: string | undefined;

      // Upload image to Cloudinary if provided
      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile);
        cloudinaryId = uploadResult.public_id;
      }

      // Map camelCase to snake_case for Supabase columns
      const insertData = {
        name,
        description,
        event_type: eventType,
        price,
        price_label: priceLabel,
        cloudinary_id: cloudinaryId,
        status: status || 'active',
      };

      // Insert event into Supabase
      const { data, error } = await supabase
        .from('game_events')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapToGameEvent(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

// Update a game event with optional image upload
export function useUpdateGameEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      imageFile,
      name,
      description,
      eventType,
      price,
      priceLabel,
      status,
      cloudinaryId: existingCloudinaryId,
    }: {
      id: string;
      imageFile?: File;
      name?: string;
      description?: string;
      eventType?: string;
      price?: string;
      priceLabel?: string;
      status?: string;
      cloudinaryId?: string | null;
    }) => {
      let cloudinaryId = existingCloudinaryId;

      // Upload new image if provided
      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile);
        cloudinaryId = uploadResult.public_id;
      }

      // Map camelCase to snake_case for Supabase columns
      const updateData: Record<string, any> = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (eventType !== undefined) updateData.event_type = eventType;
      if (price !== undefined) updateData.price = price;
      if (priceLabel !== undefined) updateData.price_label = priceLabel;
      if (status !== undefined) updateData.status = status;
      if (cloudinaryId !== undefined) updateData.cloudinary_id = cloudinaryId;

      const { data, error } = await supabase
        .from('game_events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapToGameEvent(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

// Delete a game event
export function useDeleteGameEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('game_events')
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
