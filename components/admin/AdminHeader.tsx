'use client';

import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Leader Personality Research</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
