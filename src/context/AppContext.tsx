import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, CartItem, Order, Reservation } from '../types';
import { menuItems } from '../data/menu'; 

interface AppContextType {
  menu: MenuItem[];
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  currentOrder: Order | null;
  orders: Order[];
  createOrder: (
    customerName: string,
    phoneNumber: string,
    tableNumber: string,
    subtotal: number,
    includeTax: boolean
  ) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  markOrderAsReady: (orderId: string) => Promise<void>;
  markOrderAsPaid: (orderId: string) => Promise<void>;

  reservations: Reservation[];
  createReservation: (
    name: string,
    phone: string,
    date: string,
    time: string,
    guests: number,
    notes: string
  ) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // ✅ Load static menu items on mount
  useEffect(() => {
    setMenu(menuItems);
  }, []);

  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Dummy order/reservation functions (replace with actual logic or API if needed)
  const createOrder = async (
    customerName: string,
    phoneNumber: string,
    tableNumber: string,
    subtotal: number,
    includeTax: boolean
  ) => {
    const tax = includeTax ? subtotal * 0.1 : 0;
    const totalAmount = subtotal + tax;

    const newOrder: Order = {
      id: `${Date.now()}`,
      customerName,
      phoneNumber,
      tableNumber,
      items: cart,
      subtotal,
      includeTax,
      tax,
      totalAmount,
      status: 'pending',
      isPaid: false,
      timestamp: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const markOrderAsReady = async (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'ready' } : order
      )
    );
  };

  const markOrderAsPaid = async (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, isPaid: true } : order
      )
    );
  };

  const createReservation = async (
    name: string,
    phone: string,
    date: string,
    time: string,
    guests: number,
    notes: string
  ) => {
    const newReservation: Reservation = {
      id: `${Date.now()}`,
      customerName: name,
      phoneNumber: phone,
      date,
      time,
      guests,
      notes,
      timestamp: new Date().toISOString()
    };

    setReservations(prev => [...prev, newReservation]);
  };

  const contextValue: AppContextType = {
    menu,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    currentOrder,
    orders,
    createOrder,
    getOrderById,
    markOrderAsReady,
    markOrderAsPaid,
    reservations,
    createReservation
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
