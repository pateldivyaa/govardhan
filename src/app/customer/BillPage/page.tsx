"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Printer, Home, Clock } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

export default function BillPage() {
  const { currentOrder } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!currentOrder) {
      router.push("/customer/home");
    }
    document.title = "Bill - Govardhan Thal";
  }, [currentOrder, router]);

  if (!currentOrder) return null;

  const preparationTime = Math.floor(Math.random() * 16) + 15;

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

  return (
    <div className="bg-orange-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-orange-600 p-6 text-white text-center">
            <h1 className="text-3xl font-bold mb-1">Thank You!</h1>
            <p className="text-orange-200">
              Your order has been placed successfully
            </p>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Govardhan Thal</h2>
                <p className="text-sm text-gray-500">
                  470 Serangoon Road, Singapore 218143
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Order #: {currentOrder.id.substring(0, 6)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(currentOrder.timestamp)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Customer Information:
              </h3>
              <p>
                <span className="text-gray-500">Name:</span>{" "}
                {currentOrder.customerName}
              </p>
              <p>
                <span className="text-gray-500">Phone:</span>{" "}
                {currentOrder.phoneNumber}
              </p>
              <p>
                <span className="text-gray-500">Table:</span>{" "}
                {currentOrder.tableNumber}
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <h3 className="font-semibold text-gray-700 mb-4">Order Details:</h3>
              <div className="space-y-3">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p>
                        {item.name.english}{" "}
                        <span className="text-gray-500">x{item.quantity}</span>
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ${currentOrder.subtotal.toFixed(2)}
                </span>
              </div>
              {currentOrder.includeTax && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-medium">${currentOrder.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-xl font-bold text-orange-600">
                  ${currentOrder.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg mb-8 flex items-start">
              <Clock className="text-orange-500 mr-3 mt-1" size={24} />
              <div>
                <p className="font-semibold">Estimated Preparation Time:</p>
                <p className="text-gray-700">{preparationTime} minutes</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-600">
                Thank you for dining with us, {currentOrder.customerName}!
              </p>
              <p className="text-gray-600">
                We hope you enjoy your authentic Gujarati meal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="py-2 px-6 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Printer size={18} />
                <span>Print Bill</span>
              </button>

              <button
                onClick={() => router.push("/customer/home")}
                className="py-2 px-6 bg-orange-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
              >
                <Home size={18} />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
