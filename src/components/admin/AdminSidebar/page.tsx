"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardCheck, CreditCard, CalendarDays } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname(); // current path

  const navItems = [
    { path: '/admin/adminhomepage', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/admin/adminorderspage', label: 'Orders', icon: <ClipboardCheck size={20} /> },
    { path: '/admin/adminpaymentspage', label: 'Payments', icon: <CreditCard size={20} /> },
    { path: '/admin/adminreservationspage', label: 'Reservations', icon: <CalendarDays size={20} /> },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 hidden md:block">
      <div className="p-4">
        <div className="mb-6 pt-4">
          <h2 className="text-2xl font-bold text-orange-400">Govardhan Thal</h2>
          <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
        </div>

        <nav>
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${pathname === item.path 
                      ? 'bg-orange-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'}
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
