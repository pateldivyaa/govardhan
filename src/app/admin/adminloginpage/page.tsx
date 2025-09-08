"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";

const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const correctPassword = "admin123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (password === correctPassword) {
        localStorage.setItem("govardhanthal_admin_authenticated", "true");
        toast.success("Welcome to admin dashboard");
        router.push("/admin/adminhomepage");
      } else {
        toast.error("Invalid password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-orange-600 py-6 px-4 text-white text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-orange-200">Govardhan Thal Restaurant</p>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Lock size={28} className="text-orange-600" />
            </div>
          </div>

          <p className="text-center text-gray-600 mb-6">
            Enter your password to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 rounded-md text-white font-semibold
                ${isLoading ? "bg-orange-400" : "bg-orange-600 hover:bg-orange-700"}
                transition-colors
              `}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <a
          href="/"
          className="text-orange-600 hover:text-orange-800 transition-colors"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
};

export default AdminLoginPage;
