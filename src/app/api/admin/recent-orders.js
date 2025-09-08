// pages/api/admin/recent-orders.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');

    // Fetch all orders, sorted by creation date (newest first)
    const orders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform data to match your frontend expectations
    const formattedOrders = orders.map(order => ({
      _id: order._id.toString(),
      customerName: order.customerName,
      mobile: order.mobile,
      tableNumber: order.tableNumber,
      items: order.items,
      totalValue: order.totalValue,
      status: order.status,
      paymentStatus: order.paymentStatus || 'unpaid',
      isPaid: order.isPaid || false,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt?.toISOString() || order.createdAt.toISOString()
    }));

    res.status(200).json(formattedOrders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


