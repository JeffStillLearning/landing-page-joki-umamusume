// Cloudinary Configuration
const CLOUD_NAME = 'dcnf510fm';
const UPLOAD_PRESET = 'joki uma preset';

/**
 * Upload a file to Cloudinary using unsigned upload
 * @param file - The file to upload
 * @returns The upload result including public_id
 */
export async function uploadToCloudinary(file: File): Promise<{
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload image to Cloudinary');
  }

  return response.json();
}

/**
 * Generate an optimized Cloudinary image URL with f_auto,q_auto transformations
 * @param publicId - The Cloudinary public_id of the image
 * @param options - Optional transformation options
 * @returns Optimized Cloudinary URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
  }
): string {
  const transformations = ['f_auto', 'q_auto'];

  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options?.crop) {
    transformations.push(`c_${options.crop}`);
  }

  const transformString = transformations.join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

/**
 * Delete an image from Cloudinary (requires server-side implementation with signed request)
 * Note: For security, deletion should be done via a server action or API route
 * @param publicId - The Cloudinary public_id to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // Note: Unsigned uploads cannot delete images
  // This would need to be implemented via a server action with API credentials
  console.warn('Deletion requires server-side implementation with Cloudinary API credentials');
  throw new Error('Deletion not implemented - requires server-side API with credentials');
}

export const cloudinaryConfig = {
  cloudName: CLOUD_NAME,
  uploadPreset: UPLOAD_PRESET,
};
