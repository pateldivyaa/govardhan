"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('govardhanthal_admin_authenticated');
    router.push('/admin/adminloginpage'); 
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">Govardhan Thal Admin</h1>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
