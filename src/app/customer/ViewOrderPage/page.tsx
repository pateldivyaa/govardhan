"use client"; 

import React, { useEffect, useState } from "react";
import { ClipboardList, ShoppingBag, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const ViewOrderPage: React.FC = () => {
  const { orders, currentOrder } = useAppContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");

  useEffect(() => {
    document.title = "My Orders - Govardhan Thal";
  }, []);

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

  const getStatusColor = (status: string) => {
    if (status === "ready") return "text-green-600";
    if (status === "pending") return "text-yellow-600";
    return "text-gray-600";
  };

  const getStatusIcon = (status: string) => {
    if (status === "ready") return <CheckCircle size={18} className="text-green-600" />;
    if (status === "pending") return <Clock size={18} className="text-yellow-600" />;
    return null;
  };

  return (
    <div className="bg-orange-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

          <div className="flex mb-6">
            <button
              onClick={() => setActiveTab("current")}
              className={`py-2 px-4 font-medium ${
                activeTab === "current"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Current Order
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-2 px-4 font-medium ${
                activeTab === "history"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Order History
            </button>
          </div>


          {activeTab === "current" && (
            <div>
              {currentOrder ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold">
                          Order #{currentOrder.id.substring(0, 6)}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Placed on {formatDate(currentOrder.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(currentOrder.status)}
                        <span className={`font-medium ${getStatusColor(currentOrder.status)}`}>
                          {currentOrder.status === "ready" ? "Ready for pickup" : "Preparing"}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <h3 className="font-semibold mb-2">Items:</h3>
                      <div className="space-y-2">
                        {currentOrder.items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <p>
                              {item.name.english}{" "}
                              <span className="text-gray-500">x{item.quantity}</span>
                            </p>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-orange-600">
                        ${currentOrder.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                      <div>
                        <p>
                          <span className="text-gray-500">Name:</span> {currentOrder.customerName}
                        </p>
                        <p>
                          <span className="text-gray-500">Table:</span> {currentOrder.tableNumber}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`py-1 px-3 rounded-full text-sm ${
                            currentOrder.isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {currentOrder.isPaid ? "Paid" : "Payment Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">No Current Order</h2>
                  <p className="text-gray-500 mb-6">
                    You don't have any ongoing orders right now.
                  </p>
                  <button
                    onClick={() => router.push("/customer/menu")}
                    className="py-2 px-6 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Order Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-xl font-bold">Order #{order.id.substring(0, 6)}</h2>
                            <p className="text-sm text-gray-500">Placed on {formatDate(order.timestamp)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`font-medium ${getStatusColor(order.status)}`}>
                              {order.status === "ready" ? "Ready for pickup" : "Preparing"}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-4">
                          <h3 className="font-semibold mb-2">Items:</h3>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between">
                                <p>
                                  {item.name.english} <span className="text-gray-500">x{item.quantity}</span>
                                </p>
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="text-xl font-bold text-orange-600">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                          <div>
                            <p><span className="text-gray-500">Name:</span> {order.customerName}</p>
                            <p><span className="text-gray-500">Table:</span> {order.tableNumber}</p>
                          </div>
                          <div>
                            <span
                              className={`py-1 px-3 rounded-full text-sm ${
                                order.isPaid
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.isPaid ? "Paid" : "Payment Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">No Order History</h2>
                  <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                  <button
                    onClick={() => router.push("/customer/menu")}
                    className="py-2 px-6 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Order Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOrderPage;
