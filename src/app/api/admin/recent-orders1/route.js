// src/app/api/admin/recent-orders/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
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

    return Response.json(formattedOrders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}