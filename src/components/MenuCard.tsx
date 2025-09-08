"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { MenuItem } from "@/types";
import { ShoppingCart } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addToCart } = useAppContext();

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <div className="card group overflow-hidden rounded-xl shadow-md bg-white">
      <div className="h-60 overflow-hidden">
        <img
          src={
            item.image ||
            "https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          }
          alt={item.name.english}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">{item.name.english}</h3>
          <span className="text-orange-600 font-semibold">${item.price}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 gujarati-font">
          {item.name.gujarati}
        </p>

        <p className="text-gray-700 mb-4">{item.description}</p>

        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
