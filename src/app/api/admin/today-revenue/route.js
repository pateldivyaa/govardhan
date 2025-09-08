// src/app/api/admin/today-revenue/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function GET() {
  try {
    await dbConnect();
    
    // Get current date in IST timezone
    const currentDate = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(currentDate.getTime() + istOffset);
    const today = istDate.toISOString().split('T')[0];
    
    console.log('Today Revenue API - Today:', today);
    
    // Get today's confirmed/completed reservations
    const todayReservations = await Reservation.find({
      date: today,
      isVerified: true,
      status: { $in: ['confirmed', 'completed'] }
    }).select('numberOfGuests status').lean();
    
    // Calculate estimated revenue (assuming ₹500 per guest as example)
    const pricePerGuest = 500;
    let totalRevenue = 0;
    let confirmedRevenue = 0;
    let totalGuests = 0;
    
    todayReservations.forEach(reservation => {
      const guestRevenue = reservation.numberOfGuests * pricePerGuest;
      totalRevenue += guestRevenue;
      totalGuests += reservation.numberOfGuests;
      
      if (reservation.status === 'completed') {
        confirmedRevenue += guestRevenue;
      }
    });
    
    return Response.json({
      success: true,
      data: {
        totalRevenue,
        confirmedRevenue,
        pendingRevenue: totalRevenue - confirmedRevenue,
        totalGuests,
        totalReservations: todayReservations.length,
        averagePerGuest: pricePerGuest,
        date: today,
        currency: 'INR'
      }
    });

  } catch (error) {
    console.error('Failed to fetch today revenue:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch revenue data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}