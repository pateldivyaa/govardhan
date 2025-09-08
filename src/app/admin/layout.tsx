"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader/page";
import AdminSidebar from "@/components/admin/AdminSidebar/page";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/adminloginpage";

  return (
    <div className="flex min-h-screen">
      {!isLoginPage && <AdminSidebar />}

      <div className="flex-1 flex flex-col">
        {!isLoginPage && <AdminHeader />}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
