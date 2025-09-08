// src/app/api/admin/recent-orders/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');

    // Fetch all orders (remove type filter if orders don't have type field)
    const orders = await ordersCollection.find({})
      .sort({ createdAt: -1 }) // Most recent first
      .limit(100) // Limit for performance
      .toArray();

    console.log('Raw orders from DB:', orders); // Debug log

    // Transform orders to match expected frontend format
    const transformedOrders = orders.map(order => ({
      _id: order._id.toString(),
      customerName: order.customerName || 'N/A',
      mobile: order.mobile || order.phoneNumber || '', // Handle both field names
      tableNumber: order.tableNumber || '',
      items: order.items ? order.items.map(item => ({
        item: item.name || item.item || 'Unknown Item',
        quantity: item.quantity || 1,
        price: item.price || 0,
        _id: item._id?.toString() || item.itemId || Math.random().toString(36)
      })) : [],
      totalValue: order.total || order.totalValue || 0,
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'unpaid',
      isPaid: order.isPaid || false,
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || order.createdAt || new Date().toISOString(),
      subtotal: order.subtotal || 0,
      tax: order.tax || 0,
      includeTax: order.includeTax || false
    }));

    console.log('Transformed orders:', transformedOrders); // Debug log

    return Response.json(transformedOrders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json(
      { error: 'Failed to fetch orders', details: error.message }, 
      { status: 500 }
    );
  }
}

// Alternative version if you're using pages/api structure instead of app/api
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
      .limit(100)
      .toArray();

    console.log('Fetched orders count:', orders.length);
    console.log('Sample order:', orders[0]);

    // Transform data to match your frontend expectations
    const formattedOrders = orders.map(order => ({
      _id: order._id.toString(),
      customerName: order.customerName || 'N/A',
      mobile: order.mobile || order.phoneNumber || '',
      tableNumber: order.tableNumber || '',
      items: order.items ? order.items.map(item => ({
        item: item.name || item.item || 'Unknown Item',
        quantity: item.quantity || 1,
        price: item.price || 0,
        _id: item._id?.toString() || item.itemId || Math.random().toString(36)
      })) : [],
      totalValue: order.total || order.totalValue || 0,
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'unpaid',
      isPaid: order.isPaid || false,
      createdAt: order.createdAt ? 
        (typeof order.createdAt === 'string' ? order.createdAt : order.createdAt.toISOString()) :
        new Date().toISOString(),
      updatedAt: order.updatedAt ? 
        (typeof order.updatedAt === 'string' ? order.updatedAt : order.updatedAt.toISOString()) :
        (order.createdAt ? 
          (typeof order.createdAt === 'string' ? order.createdAt : order.createdAt.toISOString()) :
          new Date().toISOString())
    }));

    res.status(200).json(formattedOrders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}