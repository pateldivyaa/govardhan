"use client";

import React from "react";
import Link from "next/link";
import { Utensils, Users } from "lucide-react";

const EntryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="h-screen relative flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="container-custom text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Govardhan Thal
          </h1>
          <p className="text-xl text-yellow-300 mb-8 gujarati-font">
            ગોવર્ધન થાળ
          </p>
          <p className="text-xl text-white mb-12">
            Authentic Gujarati Cuisine
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link
              href="/customer/home"
              className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 w-64"
            >
              <div className="flex items-center justify-center gap-3">
                <Utensils
                  size={24}
                  className="transition-transform group-hover:rotate-12"
                />
                <span className="text-xl font-semibold">Customer</span>
              </div>
              <p className="text-sm mt-1 opacity-80">
                Order food or reserve tables
              </p>
            </Link>

            <Link
              href="/admin/adminloginpage"
              className="group bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 w-64"
            >
              <div className="flex items-center justify-center gap-3">
                <Users
                  size={24}
                  className="transition-transform group-hover:rotate-12"
                />
                <span className="text-xl font-semibold">Admin</span>
              </div>
              <p className="text-sm mt-1 opacity-80">
                Manage orders and reservations
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-orange-900 text-white py-4 text-center">
        <p>© 2025 Govardhan Thal. All rights reserved.</p>
        <p className="text-sm mt-1">470 Serangoon Road, Singapore 218143</p>
      </div>
    </div>
  );
};

export default EntryPage;
