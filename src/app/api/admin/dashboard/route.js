// src/app/api/admin/dashboard/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');
    const reservationsCollection = db.collection('reservations');

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get today's orders
    const todayOrders = await ordersCollection.countDocuments({
      type: 'guest_order',
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    // Get today's revenue
    const todayRevenueResult = await ordersCollection.aggregate([
      {
        $match: {
          type: 'guest_order',
          status: { $in: ['confirmed', 'preparing', 'out for delivery', 'delivered'] },
          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalValue' }
        }
      }
    ]).toArray();

    const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].revenue : 0;

    // Get pending orders
    const pendingOrders = await ordersCollection.countDocuments({
      type: 'guest_order',
      status: 'pending'
    });

    // Get active orders (confirmed, preparing, out for delivery)
    const activeOrders = await ordersCollection.countDocuments({
      type: 'guest_order',
      status: { $in: ['confirmed', 'preparing', 'out for delivery'] }
    });

    // Get recent orders
    const recentOrders = await ordersCollection.find({
      type: 'guest_order'
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

    return Response.json({
      todayOrders,
      todayRevenue: parseFloat(todayRevenue.toFixed(2)),
      pendingOrders,
      activeOrders,
      recentOrders: recentOrders.map(order => ({
        _id: order._id.toString(),
        customerName: order.customerName,
        totalValue: order.totalValue,
        status: order.status,
        createdAt: order.createdAt
      })),
      success: true
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return Response.json({
      todayOrders: 0,
      todayRevenue: 0,
      pendingOrders: 0,
      activeOrders: 0,
      recentOrders: [],
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
}