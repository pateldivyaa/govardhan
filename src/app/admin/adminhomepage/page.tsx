"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Users, CreditCard, Clock } from "lucide-react";

const AdminHomePage = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [todayReservations, setTodayReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, revenueRes, recentOrdersRes, reservationsRes] =
          await Promise.all([
            fetch("/api/admin/total-orders"),
            fetch("/api/admin/today-revenue"),
            fetch("/api/admin/recent-orders"),
            fetch("/api/admin/today-reservations"),
          ]);

        const ordersData = await ordersRes.json();
        const revenueData = await revenueRes.json();
        const recentOrdersData = await recentOrdersRes.json();
        const reservationsData = await reservationsRes.json();

        setStats({
          totalOrders: ordersData.totalOrders ?? 0,
          todayRevenue: revenueData.todayRevenue ?? 0,
        });

        const confirmed = Array.isArray(recentOrdersData)
          ? recentOrdersData.filter((o) => o.status === "confirmed")
          : [];
        setRecentOrders(confirmed.slice(0, 5));

        setTodayReservations(
          Array.isArray(reservationsData) ? reservationsData : []
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">
          Welcome to Govardhan Thal Admin Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingBag size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Today's Revenue</p>
              <h3 className="text-2xl font-bold">
                ${Number(stats.todayRevenue || 0).toFixed(2)}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-green-600 text-sm">
              From {recentOrders.length} confirmed orders today
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Today's Reservations</p>
              <h3 className="text-2xl font-bold">{todayReservations.length}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Average Order Value</p>
              <h3 className="text-2xl font-bold">
                $
                {stats.totalOrders > 0
                  ? (
                      Number(stats.todayRevenue || 0) /
                      Number(stats.totalOrders || 1)
                    ).toFixed(2)
                  : "0.00"}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            href="/admin/adminorderspage"
            className="text-orange-600 hover:text-orange-800 text-sm"
          >
            View All
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{String(order._id).substring(0, 6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Array.isArray(order.items)
                        ? order.items.map((item: { item: string; quantity: number }) => `${item.quantity}x ${item.item}`).join(", ")
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${Number(order.totalValue || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No confirmed recent orders</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Today's Reservations</h2>
          <Link
            href="/admin/adminreservationspage"
            className="text-orange-600 hover:text-orange-800 text-sm"
          >
            View All
          </Link>
        </div>

        {todayReservations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayReservations.map((reservation) => (
                  <tr
                    key={reservation._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.mobile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.numberOfGuests}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reservations for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
