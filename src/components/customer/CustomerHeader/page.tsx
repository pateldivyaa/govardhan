"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const CustomerHeader: React.FC = () => {
  const pathname = usePathname();
  const { cart } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/customer/home", label: "Home" },
    { path: "/customer/menu", label: "Menu" },
    { path: "/customer/ViewOrderPage", label: "Orders" },
    { path: "/customer/reservation", label: "Reservations" },
    { path: "/customer/about", label: "About" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container-custom py-4 mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/customer/home" className="flex items-center">
            <h1
              className={`text-2xl font-bold ${
                isScrolled ? "text-orange-600" : "text-white"
              }`}
            >
              Govardhan Thal
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`
                  ${
                    isScrolled
                      ? "text-gray-700 hover:text-orange-600"
                      : "text-white hover:text-yellow-300"
                  } 
                  ${
                    pathname === link.path ? "font-semibold" : "font-normal"
                  }
                  transition-colors duration-300
                `}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/customer/menu"
              className={`relative ${
                isScrolled ? "text-orange-600" : "text-white"
              }`}
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>

          <button
            className={`md:hidden ${
              isScrolled ? "text-orange-600" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container-custom py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`block py-2 ${
                  pathname === link.path
                    ? "text-orange-600 font-semibold"
                    : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/customer/menu"
              className="block py-2 text-gray-700 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart size={20} className="mr-2" />
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default CustomerHeader;
