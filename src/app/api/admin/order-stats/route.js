// src/app/api/admin/order-stats/route.js
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // week, month, year

    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get orders in time period
    const ordersInPeriod = await ordersCollection.find({
      type: 'guest_order',
      createdAt: {
        $gte: startDate,
        $lte: now
      }
    }).toArray();

    // Calculate statistics
    const totalOrders = ordersInPeriod.length;
    const totalRevenue = ordersInPeriod
      .filter(order => ['confirmed', 'preparing', 'out for delivery', 'delivered'].includes(order.status))
      .reduce((sum, order) => sum + order.totalValue, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group by status
    const statusBreakdown = ordersInPeriod.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Get daily breakdown for charts
    const dailyStats = [];
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil((now - startDate) / msPerDay);

    for (let i = 0; i < days; i++) {
      const dayStart = new Date(startDate.getTime() + i * msPerDay);
      const dayEnd = new Date(dayStart.getTime() + msPerDay);
      
      const dayOrders = ordersInPeriod.filter(order => 
        order.createdAt >= dayStart && order.createdAt < dayEnd
      );

      const dayRevenue = dayOrders
        .filter(order => ['confirmed', 'preparing', 'out for delivery', 'delivered'].includes(order.status))
        .reduce((sum, order) => sum + order.totalValue, 0);

      dailyStats.push({
        date: dayStart.toISOString().split('T')[0],
        orders: dayOrders.length,
        revenue: parseFloat(dayRevenue.toFixed(2))
      });
    }

    return Response.json({
      period,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      statusBreakdown,
      dailyStats,
      success: true
    });

  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return Response.json({
      period: 'week',
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      statusBreakdown: {},
      dailyStats: [],
      success: false,
      error: 'Failed to fetch order statistics'
    });
  }
}