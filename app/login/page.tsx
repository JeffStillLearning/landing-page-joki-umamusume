'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Add the custom styles for the background patterns
const CustomStyles = () => (
  <style jsx global>{`
    .uma-pattern {
      background-image: radial-gradient(circle at 2px 2px, rgba(255, 107, 156, 0.05) 1px, transparent 0);
      background-size: 40px 40px;
    }

    .silhouette-overlay {
      background: linear-gradient(135deg, rgba(255, 248, 240, 0) 0%, rgba(255, 107, 156, 0.03) 50%, rgba(255, 248, 240, 0) 100%);
    }
  `}</style>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '', // Changed to username to match admin login
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // If user is already logged in, redirect to admin dashboard
        router.push('/admin');
      }
    };

    checkSession();
  }, [supabase, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error('Username or email is required');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.username, // Using username field as email for now
        password: formData.password,
      });

      if (error) {
        toast.error(`Login failed: ${error.message}`);
        setIsLoading(false);
        return;
      }

      // Check if the user's email matches the admin email
      const adminEmail = 'adminjokigameumamusume@gmail.com'; // Ganti dengan email Anda
      if (data.user?.email !== adminEmail) {
        toast.error('Access denied. Only admin users can access this page.');
        await supabase.auth.signOut(); // Log out the unauthorized user
        setIsLoading(false);
        return;
      }

      // Show success notification
      toast.success('Login successful! Redirecting to admin dashboard...');

      // Redirect to admin panel on successful login
      setTimeout(() => {
        router.push('/admin');
        router.refresh(); // Refresh to update the session context
      }, 1500); // Wait 1.5 seconds to show success message
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomStyles />
      <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
        {/* Subtle Background Elements */}
        <div className="fixed inset-0 pointer-events-none uma-pattern"></div>
        <div className="fixed inset-0 pointer-events-none silhouette-overlay"></div>

        {/* Main Content Container */}
        <main className="relative flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
          {/* Login Card */}
          <div className="w-full max-w-[440px] bg-white dark:bg-[#2d1a21] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-[#ff6b9c10] overflow-hidden p-8 sm:p-10">

            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20">
                <div className="size-12 text-primary">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
                  </svg>
                </div>
              </div>
              <h1 className="text-admin-header dark:text-white text-2xl font-bold tracking-tight">Admin Login</h1>
              <p className="text-admin-header/60 dark:text-white text-sm mt-2 text-center">
                Silakan masukkan kredensial Anda untuk mengakses dashboard.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-admin-header dark:text-gray-300 ml-1" htmlFor="username">Username / Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">person</span>
                  <input
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-[#3d242c] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-admin-header dark:text-white placeholder:text-gray-400"
                    id="username"
                    name="username"
                    placeholder="admin@example.com"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-admin-header dark:text-gray-300" htmlFor="password">Password</label>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">lock</span>
                  <input
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-[#3d242c] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-admin-header dark:text-white placeholder:text-gray-400"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    disabled={isLoading}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Helper Actions */}
              {/* <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    className="rounded text-primary focus:ring-primary/20 border-gray-300 dark:bg-[#3d242c]"
                    type="checkbox"
                    disabled={isLoading}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Remember me</span>
                </label>
                <Link href="#" className="text-xs font-bold text-secondary hover:underline tracking-tight">Forgot Password?</Link>
              </div> */}

              {/* Submit Button */}
              <button
                className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[18px]">autorenew</span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Security Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
              <span className="material-symbols-outlined text-white text-[16px]">verified_user</span>
              <span className="text-[10px] uppercase font-bold text-white tracking-widest">Secure Admin Gateway</span>
            </div>
          </div>

          {/* External Footer Links */}
          <div className="mt-8 flex gap-6 text-sm font-medium text-admin-header/40 dark:text-gray-600">
            {/* <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support Center</Link> */}
            {/* <Link href="/" className="hover:text-primary transition-colors">Kembali</Link> */}
          </div>
        </main>

        {/* Version Note */}
        <div className="fixed bottom-4 right-4 text-[10px] text-gray-400 font-mono">
          v2.4.0-STABLE
        </div>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
}