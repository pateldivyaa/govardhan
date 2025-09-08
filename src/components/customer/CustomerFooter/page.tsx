"use client";

import { MapPin, Phone, Clock, Mail } from "lucide-react";

const CustomerFooter: React.FC = () => {
  return (
    <footer className="bg-orange-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Govardhan Thal</h3>
            <p className="text-orange-200 mb-2 gujarati-font">ગોવર્ધન થાળ</p>
            <p className="mb-4">Experience the authentic taste of Gujarat</p>
            <div className="flex items-center mb-2">
              <MapPin size={18} className="mr-2 text-orange-300" />
              <p>470 Serangoon Road, Singapore 218143</p>
            </div>
            <div className="flex items-center mb-2">
              <Phone size={18} className="mr-2 text-orange-300" />
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="flex items-center">
              <Mail size={18} className="mr-2 text-orange-300" />
              <p>info@govardhanthal.com</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
            <div className="flex items-start mb-2">
              <Clock size={18} className="mr-2 mt-1 text-orange-300" />
              <div>
                <p className="font-semibold">Every Day</p>
                <p>8 AM to 11 PM</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-orange-200 mb-2">
                We serve authentic Gujarati cuisine prepared with love and
                tradition
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/customer/home"
                  className="hover:text-orange-300 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/customer/menu"
                  className="hover:text-orange-300 transition-colors"
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="/customer/about"
                  className="hover:text-orange-300 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/customer/reservation"
                  className="hover:text-orange-300 transition-colors"
                >
                  Table Reservation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-orange-800 my-6" />

        <div className="text-center">
          <p>
            &copy; {new Date().getFullYear()} Govardhan Thal. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
