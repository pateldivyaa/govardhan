// Menu types
export interface MenuItem {
  id: string;
  name: {
    english: string;
    gujarati: string;
  };
  price: number;
  category: string;
  image?: string;
  description?: string;
}

// ✅ CartItem me _id optional add kar diya
export interface CartItem extends MenuItem {
  _id?: string;
  quantity: number;
}

// Order types
export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  includeTax: boolean;
  tax: number;
  totalAmount: number;
  status: 'pending' | 'ready' | 'completed';
  isPaid: boolean;
  timestamp: string;
}

// Reservation types
export interface Reservation {
  id: string;
  customerName: string;
  phoneNumber: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  timestamp: string;
}
