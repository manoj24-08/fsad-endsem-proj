import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Toast from '../components/ui/Toast';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        showMenu={sidebarOpen}
      />
      <div className="flex">
        <Sidebar
          role="admin"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
}
