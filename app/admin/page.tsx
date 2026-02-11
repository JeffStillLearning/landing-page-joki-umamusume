'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAllPricingPackages } from '@/lib/hooks/usePricingPackages';
import { useAllGameEvents, useCreateGameEvent } from '@/lib/hooks/useGameEvents';
import { useUpdatePricingPackage, useDeletePricingPackage, useCreatePricingPackage } from '@/lib/hooks/usePricingPackages';
import { useUpdateGameEvent, useDeleteGameEvent } from '@/lib/hooks/useGameEvents';
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/lib/hooks/useTestimonials';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import type { GameEvent, PricingPackage, Testimonial } from '@/lib/db/schema';

// Modal for creating new event
function CreateEventModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; eventType: string; price: string; priceLabel: string; imageFile?: File }) => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventType: 'Champions Meeting',
    price: '',
    priceLabel: 'Mulai dari',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      imageFile: imageFile || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Buat Event Baru</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gambar Event
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:bg-pink-50/30 transition-all"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <div className="py-8">
                  <span className="material-symbols-outlined text-4xl text-slate-400">add_photo_alternate</span>
                  <p className="text-sm text-slate-500 mt-2">Klik untuk upload gambar</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-xs text-slate-400 mt-1">Gambar akan diupload ke Cloudinary dengan optimasi otomatis</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Event</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Champions Meeting: Dirt"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
              placeholder="Deskripsi event..."
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Event</label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Champions Meeting">Champions Meeting</option>
              <option value="Legend Races">Legend Races</option>
              <option value="Event Points">Event Points</option>
              <option value="Event Special">Event Special</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Harga</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Rp 150.000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Label Harga</label>
              <input
                type="text"
                value={formData.priceLabel}
                onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Mulai dari"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-pink-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Mengupload...' : 'Simpan Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal for editing pricing package
function EditPackageModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  packageData
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PricingPackage> & { id: string }) => void;
  isSubmitting: boolean;
  packageData?: PricingPackage;
}) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: [] as string[],
    isPopular: false,
    isActive: false,
  });

  // Update form data when packageData changes
  useEffect(() => {
    if (packageData) {
      setFormData({
        name: packageData.name || '',
        price: packageData.price || '',
        description: packageData.description || '',
        features: packageData.features || [],
        isPopular: packageData.isPopular || false,
        isActive: packageData.isActive || false,
      });
    }
  }, [packageData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (packageData) {
      onSubmit({
        id: packageData.id,
        ...formData,
        features: formData.features,
        isPopular: formData.isPopular,
        isActive: formData.isActive,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Edit Paket Harga</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Paket</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Nama paket"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Harga</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Rp 150.000"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
              placeholder="Deskripsi paket..."
            />
          </div>

          {/* Features - Dynamic List Inputs */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fitur</label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={`Fitur ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:bg-red-50 flex items-center justify-center rounded-lg"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Tambahkan item lain
              </button>
            </div>
          </div>

          {/* Status toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPopular"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="isPopular" className="ml-2 text-sm font-medium text-slate-700">
                Populer
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-slate-700">
                Aktif
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-pink-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Pricing Package Row
function PackageRow({ pkg, onEdit, onDelete }: { pkg: PricingPackage, onEdit: (pkg: PricingPackage) => void, onDelete: (id: string) => void }) {
  return (
    <tr className={`hover:bg-slate-50/50 transition-colors ${pkg.isPopular ? 'bg-pink-50/10' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-slate-800">{pkg.name}</div>
          {pkg.isPopular && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full">POPULER</span>
          )}
        </div>
        <div className="text-xs text-slate-400">ID: {pkg.id.slice(0, 8)}</div>
      </td>
      <td className="px-6 py-4 font-medium text-primary">{pkg.price}</td>
      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{pkg.description}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
        }`}>
          {pkg.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onEdit(pkg)}
          className="text-slate-400 hover:text-blue-600 p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
        </button>
        <button
          onClick={() => onDelete(pkg.id)}
          className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </td>
    </tr>
  );
}

// Modal for creating new pricing package
function CreatePackageModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PricingPackage, 'id' | 'createdAt'>) => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: [] as string[],
    isPopular: false,
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      features: formData.features,
      isPopular: formData.isPopular,
      isActive: formData.isActive,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Buat Paket Harga Baru</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Paket</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Nama paket"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Harga</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Rp 150.000"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
              placeholder="Deskripsi paket..."
            />
          </div>

          {/* Features - Dynamic List Inputs */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fitur</label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={`Fitur ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:bg-red-50 flex items-center justify-center rounded-lg"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Tambahkan item lain
              </button>
            </div>
          </div>

          {/* Status toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPopular"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="isPopular" className="ml-2 text-sm font-medium text-slate-700">
                Populer
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-slate-700">
                Aktif
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-pink-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Membuat...' : 'Buat Paket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal for editing game event
function EditEventModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  eventData
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    id: string;
    name: string;
    description: string;
    eventType: string;
    price: string;
    priceLabel: string;
    status: string;
    imageFile?: File
  }) => void;
  isSubmitting: boolean;
  eventData?: GameEvent;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventType: 'Story Event',
    price: '',
    priceLabel: 'Mulai dari',
    status: 'active',
  });

  // Update form data when eventData changes
  useEffect(() => {
    if (eventData) {
      setFormData({
        name: eventData.name || '',
        description: eventData.description || '',
        eventType: eventData.eventType || 'Champions Meeting',
        price: eventData.price || '',
        priceLabel: eventData.priceLabel || 'Mulai dari',
        status: eventData.status || 'active',
      });
    }
  }, [eventData]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventData) {
      onSubmit({
        id: eventData.id,
        ...formData,
        imageFile: imageFile || undefined,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Edit Event</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gambar Event
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:bg-pink-50/30 transition-all"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
              ) : eventData?.cloudinaryId ? (
                <img
                  src={getOptimizedImageUrl(eventData.cloudinaryId, { width: 400, height: 160, crop: 'fill' })}
                  alt={eventData.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="py-8">
                  <span className="material-symbols-outlined text-4xl text-slate-400">add_photo_alternate</span>
                  <p className="text-sm text-slate-500 mt-2">Klik untuk upload gambar</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-xs text-slate-400 mt-1">Gambar akan diupload ke Cloudinary dengan optimasi otomatis</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Event</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Champions Meeting: Dirt"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
              placeholder="Deskripsi event..."
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Event</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Champions Meeting">Champions Meeting</option>
              <option value="Legend Races">Legend Races</option>
              <option value="Event Points">Event Points</option>
              <option value="Event Special">Event Special</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Harga</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Rp 150.000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Label Harga</label>
              <input
                type="text"
                name="priceLabel"
                value={formData.priceLabel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Mulai dari"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-pink-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Mengupdate...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event, onEdit, onDelete }: { event: GameEvent, onEdit: (event: GameEvent) => void, onDelete: (id: string) => void }) {
  const imageUrl = event.cloudinaryId
    ? getOptimizedImageUrl(event.cloudinaryId, { width: 400, height: 160, crop: 'fill' })
    : null;

  const gradientColors: Record<string, string> = {
    'Champions Meeting': 'from-purple-100 to-indigo-50',
    'Legend Races': 'from-pink-100 to-rose-50',
    'Event Points': 'from-green-100 to-teal-50',
    'Event Special': 'from-yellow-100 to-orange-50',
    'Lainnya': 'from-slate-100 to-slate-50',
    default: 'from-slate-100 to-slate-50',
  };

  const gradient = gradientColors[event.eventType || ''] || gradientColors.default;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <div className="h-40 bg-slate-100 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} flex items-center justify-center text-slate-400`}>
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(event)}
            className="bg-white p-1.5 rounded-lg shadow text-slate-600 hover:text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="bg-white p-1.5 rounded-lg shadow text-slate-600 hover:text-red-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800">{event.name}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
            event.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {event.status === 'active' ? 'Active' : 'Upcoming'}
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{event.description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <span className="text-xs font-semibold text-slate-400">PRICE START</span>
          <span className="text-sm font-bold text-primary">{event.price}</span>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function TableSkeleton() {
  return (
    <tbody className="animate-pulse">
      {[1, 2, 3].map((i) => (
        <tr key={i}>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
        </tr>
      ))}
    </tbody>
  );
}

function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-200"></div>
      <div className="p-5">
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

// Modal for creating new testimonial
function CreateTestimonialModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Testimonial, 'id' | 'createdAt'>) => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    trainerId: '',
    rating: 5,
    comment: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Buat Testimoni Baru</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Klien</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Nama klien"
              required
            />
          </div>

          {/* Trainer ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trainer ID (opsional)</label>
            <input
              type="text"
              name="trainerId"
              value={formData.trainerId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="ID Trainer"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Isi Komentar</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={4}
              placeholder="Komentar dari klien..."
              required
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-pink-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Membuat...' : 'Buat Testimoni'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal for editing testimonial
function EditTestimonialModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  testimonialData
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Testimonial> & { id: string }) => void;
  isSubmitting: boolean;
  testimonialData?: Testimonial;
}) {
  const [formData, setFormData] = useState({
    name: '',
    trainerId: '',
    rating: 5,
    comment: '',
  });

  // Update form data when testimonialData changes
  useEffect(() => {
    if (testimonialData) {
      setFormData({
        name: testimonialData.name || '',
        trainerId: testimonialData.trainerId || '',
        rating: testimonialData.rating || 5,
        comment: testimonialData.comment || '',
      });
    }
  }, [testimonialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testimonialData) {
      onSubmit({
        id: testimonialData.id,
        ...formData,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Edit Testimoni</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Klien</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Nama klien"
              required
            />
          </div>

          {/* Trainer ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trainer ID (opsional)</label>
            <input
              type="text"
              name="trainerId"
              value={formData.trainerId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="ID Trainer"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Isi Komentar</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={4}
              placeholder="Komentar dari klien..."
              required
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-pink-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Mengupdate...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Testimonial Row Component
function TestimonialRow({ testimonial, onEdit, onDelete }: {
  testimonial: Testimonial,
  onEdit: (testimonial: Testimonial) => void,
  onDelete: (id: string) => void
}) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-bold text-slate-800">{testimonial.name}</div>
        <div className="text-xs text-slate-400">ID: {testimonial.id.slice(0, 8)}</div>
      </td>
      <td className="px-6 py-4">
        {testimonial.trainerId || '-'}
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-sm ${
                i < (testimonial.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            >
              star
            </span>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-1">{testimonial.rating}/5</div>
      </td>
      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{testimonial.comment}</td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onEdit(testimonial)}
          className="text-slate-400 hover:text-blue-600 p-1 transition-colors cursor-pointer mr-2"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
        </button>
        <button
          onClick={() => onDelete(testimonial.id)}
          className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </td>
    </tr>
  );
}

// Testimonial Table Skeleton
function TestimonialTableSkeleton() {
  return (
    <tbody className="animate-pulse">
      {[1, 2, 3].map((i) => (
        <tr key={i}>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
        </tr>
      ))}
    </tbody>
  );
}

// Animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { 
      transform: scale(0.95);
      opacity: 0;
    }
    to { 
      transform: scale(1);
      opacity: 1;
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }
  .animate-scaleIn {
    animation: scaleIn 0.2s ease-out forwards;
  }
`;

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditPackageModalOpen, setIsEditPackageModalOpen] = useState(false);
  const [isCreatePackageModalOpen, setIsCreatePackageModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isCreateTestimonialModalOpen, setIsCreateTestimonialModalOpen] = useState(false);
  const [isEditTestimonialModalOpen, setIsEditTestimonialModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [editingEvent, setEditingEvent] = useState<GameEvent | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State untuk modal logout
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login'); // Redirect to login page after logout
      router.refresh(); // Refresh to update the session context
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true); // Tampilkan modal konfirmasi logout
  };

  const handleConfirmLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLogoutModalOpen(false); // Tutup modal
      router.push('/login'); // Redirect ke halaman login
      router.refresh(); // Refresh untuk memperbarui konteks sesi
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false); // Tutup modal tanpa logout
  };

  // Fetch data using TanStack Query
  const { data: packages, isLoading: packagesLoading } = useAllPricingPackages();
  const { data: events, isLoading: eventsLoading } = useAllGameEvents();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();

  // Mutations
  const createEventMutation = useCreateGameEvent();
  const createPackageMutation = useCreatePricingPackage();
  const updatePackageMutation = useUpdatePricingPackage();
  const deletePackageMutation = useDeletePricingPackage();
  const updateEventMutation = useUpdateGameEvent();
  const deleteEventMutation = useDeleteGameEvent();
  const createTestimonialMutation = useCreateTestimonial();
  const updateTestimonialMutation = useUpdateTestimonial();
  const deleteTestimonialMutation = useDeleteTestimonial();

  const handleCreateEvent = async (data: {
    name: string;
    description: string;
    eventType: string;
    price: string;
    priceLabel: string;
    imageFile?: File;
  }) => {
    try {
      await createEventMutation.mutateAsync({
        name: data.name,
        description: data.description,
        eventType: data.eventType,
        price: data.price,
        priceLabel: data.priceLabel,
        status: 'active',
        imageFile: data.imageFile,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Gagal membuat event. Pastikan Supabase sudah terkonfigurasi dengan benar.');
    }
  };

  const handleEditPackage = (pkg: PricingPackage) => {
    setEditingPackage(pkg);
    setIsEditPackageModalOpen(true);
  };

  const handleUpdatePackage = async (data: Partial<PricingPackage> & { id: string }) => {
    try {
      await updatePackageMutation.mutateAsync(data);
      setIsEditPackageModalOpen(false);
      setEditingPackage(null);
    } catch (error) {
      console.error('Failed to update package:', error);
      alert('Gagal mengupdate paket. Silakan coba lagi.');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      try {
        await deletePackageMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete package:', error);
        alert('Gagal menghapus paket. Silakan coba lagi.');
      }
    }
  };

  const handleEditEvent = (event: GameEvent) => {
    setEditingEvent(event);
    setIsEditEventModalOpen(true);
  };

  const handleUpdateEvent = async (data: {
    id: string;
    name: string;
    description: string;
    eventType: string;
    price: string;
    priceLabel: string;
    status: string;
    imageFile?: File
  }) => {
    try {
      await updateEventMutation.mutateAsync(data);
      setIsEditEventModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('Gagal mengupdate event. Silakan coba lagi.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try {
        await deleteEventMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Gagal menghapus event. Silakan coba lagi.');
      }
    }
  };

  const handleCreatePackage = async (data: Omit<PricingPackage, 'id' | 'createdAt'>) => {
    try {
      await createPackageMutation.mutateAsync(data);
      setIsCreatePackageModalOpen(false);
    } catch (error) {
      console.error('Failed to create package:', error);
      alert('Gagal membuat paket. Silakan coba lagi.');
    }
  };

  const handleCreateTestimonial = async (data: Omit<Testimonial, 'id' | 'createdAt'>) => {
    try {
      await createTestimonialMutation.mutateAsync(data);
      setIsCreateTestimonialModalOpen(false);
    } catch (error) {
      console.error('Failed to create testimonial:', error);
      alert('Gagal membuat testimoni. Silakan coba lagi.');
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsEditTestimonialModalOpen(true);
  };

  const handleUpdateTestimonial = async (data: Partial<Testimonial> & { id: string }) => {
    try {
      await updateTestimonialMutation.mutateAsync(data);
      setIsEditTestimonialModalOpen(false);
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Failed to update testimonial:', error);
      alert('Gagal mengupdate testimoni. Silakan coba lagi.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
      try {
        await deleteTestimonialMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete testimonial:', error);
        alert('Gagal menghapus testimoni. Silakan coba lagi.');
      }
    }
  };

  return (
    <div className="bg-background-light text-slate-800 h-screen overflow-hidden flex font-[family-name:var(--font-admin)]">
      <style>{animationStyles}</style>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-pink-100 flex flex-col h-full shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-pink-50">
          <a href="/" className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-2xl">trophy</span>
            Joki Uma Admin
          </a>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <a className="flex items-center gap-3 px-4 py-3 bg-pink-50 text-primary rounded-xl transition-colors font-medium" href="/admin">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-pink-50 hover:text-primary rounded-xl transition-colors" href="/">
            <span className="material-symbols-outlined">home</span>
            <span className="font-medium">Landing Page</span>
          </a>
        </nav>

        <div className="p-4 border-t border-pink-50">
          <button 
            onClick={handleLogoutClick}
            className="flex items-center gap-3 w-full px-4 py-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-pink-100 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">Manajemen Layanan</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Admin Utama</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Pricing Packages Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Daftar Paket Harga</h2>
                <p className="text-sm text-slate-500">Manage pricing packages currently active on the landing page.</p>
              </div>
              <button
                onClick={() => setIsCreatePackageModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all flex items-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-lg">add</span>
                Tambah Paket Baru
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Nama Paket</th>
                      <th className="px-6 py-4 font-semibold">Harga</th>
                      <th className="px-6 py-4 font-semibold">Deskripsi</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  {packagesLoading ? (
                    <TableSkeleton />
                  ) : packages && packages.length > 0 ? (
                    <tbody className="divide-y divide-slate-50">
                      {packages.map((pkg) => (
                        <PackageRow
                          key={pkg.id}
                          pkg={pkg}
                          onEdit={handleEditPackage}
                          onDelete={handleDeletePackage}
                        />
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          Belum ada paket. Tambahkan paket baru atau konfigurasi Supabase.
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </section>

          {/* Game Events Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Event Terbaru (Game Events)</h2>
                <p className="text-sm text-slate-500">Manage seasonal events displayed on the dashboard.</p>
              </div>
              {/* <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
                Buat Event Baru
              </button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsLoading ? (
                <>
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                </>
              ) : events && events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))
              ) : null}

              {/* Add New Card */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center h-full min-h-[280px] hover:border-primary hover:bg-pink-50/30 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center mb-3 shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <span className="font-medium text-slate-500 group-hover:text-primary">Tambah Event Baru</span>
              </button>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Manajemen Testimoni</h2>
                <p className="text-sm text-slate-500">Kelola testimoni pelanggan yang ditampilkan di landing page.</p>
              </div>
              <button
                onClick={() => setIsCreateTestimonialModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all flex items-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-lg">add</span>
                Tambah Testimoni Baru
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Nama Klien</th>
                      <th className="px-6 py-4 font-semibold">Trainer ID</th>
                      <th className="px-6 py-4 font-semibold">Rating</th>
                      <th className="px-6 py-4 font-semibold">Komentar</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  {testimonialsLoading ? (
                    <TestimonialTableSkeleton />
                  ) : testimonials && testimonials.length > 0 ? (
                    <tbody className="divide-y divide-slate-50">
                      {testimonials.map((testimonial) => (
                        <TestimonialRow
                          key={testimonial.id}
                          testimonial={testimonial}
                          onEdit={handleEditTestimonial}
                          onDelete={handleDeleteTestimonial}
                        />
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          Belum ada testimoni. Tambahkan testimoni baru.
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        isSubmitting={createEventMutation.isPending}
      />

      {/* Edit Package Modal */}
      <EditPackageModal
        isOpen={isEditPackageModalOpen}
        onClose={() => setIsEditPackageModalOpen(false)}
        onSubmit={handleUpdatePackage}
        isSubmitting={updatePackageMutation.isPending}
        packageData={editingPackage || undefined}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={isEditEventModalOpen}
        onClose={() => setIsEditEventModalOpen(false)}
        onSubmit={handleUpdateEvent}
        isSubmitting={updateEventMutation.isPending}
        eventData={editingEvent || undefined}
      />

      {/* Create Package Modal */}
      <CreatePackageModal
        isOpen={isCreatePackageModalOpen}
        onClose={() => setIsCreatePackageModalOpen(false)}
        onSubmit={handleCreatePackage}
        isSubmitting={createPackageMutation.isPending}
      />

      {/* Create Testimonial Modal */}
      <CreateTestimonialModal
        isOpen={isCreateTestimonialModalOpen}
        onClose={() => setIsCreateTestimonialModalOpen(false)}
        onSubmit={handleCreateTestimonial}
        isSubmitting={createTestimonialMutation.isPending}
      />

      {/* Edit Testimonial Modal */}
      <EditTestimonialModal
        isOpen={isEditTestimonialModalOpen}
        onClose={() => setIsEditTestimonialModalOpen(false)}
        onSubmit={handleUpdateTestimonial}
        isSubmitting={updateTestimonialMutation.isPending}
        testimonialData={editingTestimonial || undefined}
      />
      
      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-scaleIn">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Warning Icon */}
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <span className="text-3xl text-red-500">⚠️</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi Keluar</h3>
                <p className="text-slate-500 mb-6">
                  Apakah kamu yakin ingin mengakhiri sesi admin? Pastikan semua perubahan paket joki telah tersimpan.
                </p>
                
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleCancelLogout}
                    className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-colors cursor-pointer font-medium"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}