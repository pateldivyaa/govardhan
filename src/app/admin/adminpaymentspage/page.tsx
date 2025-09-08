"use client";

import React, { useEffect, useState } from 'react';
import { DollarSign, Check, Search, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  phoneNumber: string;
  items: OrderItem[];
  totalAmount: number;
  isPaid: boolean;
  timestamp: string;
  status: string;
}

const AdminPaymentsPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');

  useEffect(() => {
    document.title = 'Manage Payments - Govardhan Thal';
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/recent-orders');
      const data = await response.json();

      const transformedOrders: Order[] = data.map((order: any) => ({
        id: order._id,
        customerName: order.customerName,
        tableNumber: 'N/A',
        phoneNumber: 'N/A',
        items: order.items.map((item: any) => ({
          name: item.item,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: order.totalValue,
        isPaid: order.paymentStatus === 'paid',
        timestamp: order.createdAt,
        status: order.status
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const sortedOrders = [...orders].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment =
      filterPayment === 'all' ||
      (filterPayment === 'paid' && order.isPaid) ||
      (filterPayment === 'unpaid' && !order.isPaid);

    return matchesSearch && matchesPayment;
  });

  const totalAmount = filteredOrders.reduce((total, order) => total + order.totalAmount, 0);
  const paidAmount = filteredOrders.filter(order => order.isPaid).reduce((total, order) => total + order.totalAmount, 0);
  const unpaidAmount = filteredOrders.filter(order => !order.isPaid).reduce((total, order) => total + order.totalAmount, 0);

  const handleMarkAsPaid = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/pay`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, isPaid: true } : order
        ));
        toast.success('Payment recorded successfully');
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Payments</h1>
          <p className="text-gray-500">Track and manage all payments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Total Payments</p>
              <h3 className="text-2xl font-bold">${totalAmount.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <DollarSign size={24} className="text-gray-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 text-sm">{filteredOrders.length} orders</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Paid</p>
              <h3 className="text-2xl font-bold">${paidAmount.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Check size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-green-600 text-sm">
              {filteredOrders.filter(order => order.isPaid).length} paid orders
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Unpaid</p>
              <h3 className="text-2xl font-bold">${unpaidAmount.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar size={24} className="text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-red-600 text-sm">
              {filteredOrders.filter(order => !order.isPaid).length} unpaid orders
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td>#{order.id.substring(0, 6)}</td>
                    <td>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.phoneNumber}</p>
                      </div>
                    </td>
                    <td>{order.tableNumber}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded mr-1">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td>{formatDate(order.timestamp)}</td>
                    <td>
                      {!order.isPaid && (
                        <button
                          onClick={() => handleMarkAsPaid(order.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs"
                        >
                          Mark as Paid
                        </button>
                      )}
                      {order.isPaid && (
                        <span className="text-green-600 flex items-center">
                          <Check size={16} className="mr-1" /> Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No payments found</p>
            <p className="text-sm text-gray-400">
              {searchTerm || filterPayment !== 'all'
                ? 'Try changing your search or filters'
                : 'Payments will appear here as customers place orders'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
