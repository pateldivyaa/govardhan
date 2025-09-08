"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Search } from "lucide-react";
import { toast } from "react-toastify";

interface ApiOrder {
  _id: string;
  customerName: string;
  items: Array<{
    item: string;
    quantity: number;
    price: number;
    _id: string;
  }>;
  totalValue: number;
  status: string;
  createdAt: string;
  paymentStatus?: string;
  isPaid?: boolean;
  mobile?: string;
  tableNumber?: number;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("confirmed"); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Manage Orders - Govardhan Thal";
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/recent-orders");
      const ordersData = await response.json();
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredOrders = sortedOrders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.mobile && order.mobile.includes(searchTerm)) ||
      (order.tableNumber &&
        order.tableNumber.toString().includes(searchTerm));

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      let endpoint = "";

      if (newStatus === "confirmed") {
        endpoint = `/api/admin/orders/${orderId}/status`;
      } else if (newStatus === "delivered") {
        endpoint = `/api/admin/order/${orderId}/complete`;
      } else if (
        newStatus === "preparing" ||
        newStatus === "out for delivery"
      ) {
        endpoint = `/api/admin/orders/${orderId}/status`;
      }

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order marked as ${newStatus}`);
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleMarkAsPaid = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/order/${orderId}/paid`, {
        method: "PATCH",
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? { ...order, paymentStatus: "paid", isPaid: true }
              : order
          )
        );
        toast.success("Payment recorded successfully");
      } else {
        throw new Error("Failed to mark as paid");
      }
    } catch (error) {
      console.error("Failed to mark order as paid:", error);
      toast.error("Failed to mark order as paid");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isOrderPaid = (order: ApiOrder) => {
    return order.paymentStatus === "paid" || order.isPaid;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
          <p className="text-gray-500">View and manage all customer orders</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out for delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredOrders.length > 0 ? (
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
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.substring(0, 6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        {order.mobile && (
                          <p className="text-xs text-gray-400">
                            Phone: {order.mobile}
                          </p>
                        )}
                        {order.tableNumber && (
                          <p className="text-xs text-gray-400">
                            Table: {order.tableNumber}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs">
                        <p className="truncate">
                          {order.items
                            .map(
                              (item) => `${item.item} (${item.quantity})`
                            )
                            .join(", ")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.items.length} items
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{order.totalValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "preparing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "out for delivery"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "delivered"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isOrderPaid(order)
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isOrderPaid(order) ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {order.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "confirmed")
                            }
                            className="px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors text-xs"
                          >
                            Confirm
                          </button>
                        )}

                        {order.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "preparing")
                            }
                            className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors text-xs"
                          >
                            Preparing
                          </button>
                        )}

                        {order.status === "preparing" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                order._id,
                                "out for delivery"
                              )
                            }
                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-xs"
                          >
                            Out for Delivery
                          </button>
                        )}

                        {order.status === "out for delivery" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "delivered")
                            }
                            className="px-2 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors text-xs"
                          >
                            Delivered
                          </button>
                        )}

                        {!isOrderPaid(order) && (
                          <button
                            onClick={() => handleMarkAsPaid(order._id)}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          >
                            <DollarSign size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No orders found</p>
            <p className="text-sm text-gray-400">
              {searchTerm || filterStatus !== "all"
                ? "Try changing your search or filters"
                : "Orders will appear here as customers place them"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
