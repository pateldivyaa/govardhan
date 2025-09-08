"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { menuCategories } from "@/data/menu";
import { toast } from "react-toastify";
import MenuCard from "@/components/MenuCard";

const MenuPage: React.FC = () => {
  const { menu, cart, removeFromCart, updateCartItemQuantity } = useAppContext();
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "Menu - Govardhan Thal";
    }
  }, []);

  const filteredItems = menu.filter((item) => item.category === activeCategory);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    router.push("/customer/OrderConfirmationPage");
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        }}
      >
        <div className="absolute inset-0 bg-opacity-50"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Our Menu</h1>
          <p className="text-lg text-yellow-300 mb-4 gujarati-font">અમારું મેનુ</p>
          <p className="text-white">Experience the authentic flavors of Gujarat</p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-center text-sm text-yellow-800">
          Please note: The images displayed alongside our menu items are for illustration and reference purposes only. Actual dishes may vary in appearance. We appreciate your understanding. Thank you!
        </div>


        <div className="mb-10 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {menuCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${activeCategory === category.id
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-100"
                  }`}
              >
                <span>{category.name}</span>
                <span className="ml-1 text-xs gujarati-font">
                  ({category.gujaratiName})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {menuCategories.find((c) => c.id === activeCategory)?.name}
          </h2>
          <p className="text-xl gujarati-font text-orange-600">
            {menuCategories.find((c) => c.id === activeCategory)?.gujaratiName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-all z-20 flex items-center gap-2"
        >
          <ShoppingBag size={20} />
          <span className="font-semibold">{cart.length}</span>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black ${isCartOpen ? "opacity-40" : "opacity-0 pointer-events-none"
          } transition-opacity duration-300`}
        onClick={() => setIsCartOpen(false)}
      ></div>


      <div
        className={`fixed right-0 top-0 bottom-0 w-full md:w-1/3 bg-white shadow-xl z-50 transform ${isCartOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-2">
                Add items from the menu to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex border-b border-gray-100 pb-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name.english}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{item.name.english}</h4>
                      <span className="font-bold text-orange-600">${item.price}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateCartItemQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 bg-gray-100 rounded-l hover:bg-gray-200 transition-colors"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="px-3 py-1 bg-gray-50">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateCartItemQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 bg-gray-100 rounded-r hover:bg-gray-200 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Subtotal:</span>
            <span className="font-bold">${cartTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-md flex items-center justify-center gap-2 ${cart.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
              } transition-colors`}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
