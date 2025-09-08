// src/app/api/admin/total-orders/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');

    // Get total orders count
    const totalOrders = await ordersCollection.countDocuments({
      type: 'guest_order'
    });

    // Get orders by status
    const ordersByStatus = await ordersCollection.aggregate([
      { $match: { type: 'guest_order' } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get total revenue
    const revenueResult = await ordersCollection.aggregate([
      { 
        $match: { 
          type: 'guest_order',
          status: { $in: ['confirmed', 'preparing', 'out for delivery', 'delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalValue' }
        }
      }
    ]).toArray();

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get paid orders count
    const paidOrders = await ordersCollection.countDocuments({
      type: 'guest_order',
      $or: [
        { paymentStatus: 'paid' },
        { isPaid: true }
      ]
    });

    // Format status counts
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      'out for delivery': 0,
      delivered: 0,
      cancelled: 0
    };

    ordersByStatus.forEach(item => {
      if (statusCounts.hasOwnProperty(item._id)) {
        statusCounts[item._id] = item.count;
      }
    });

    return Response.json({
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      paidOrders,
      unpaidOrders: totalOrders - paidOrders,
      statusCounts,
      success: true
    });

  } catch (error) {
    console.error('Error fetching total orders:', error);
    return Response.json({
      totalOrders: 0,
      totalRevenue: '0.00',
      paidOrders: 0,
      unpaidOrders: 0,
      statusCounts: {
        pending: 0,
        confirmed: 0,
        preparing: 0,
        'out for delivery': 0,
        delivered: 0,
        cancelled: 0
      },
      success: false,
      error: 'Failed to fetch orders data'
    });
  }
}