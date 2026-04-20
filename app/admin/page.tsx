import { redirect } from 'next/navigation';

export default function RootAdminPage() {
  redirect('/admin/dashboard');
}
