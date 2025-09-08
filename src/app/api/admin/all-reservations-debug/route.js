// src/app/api/admin/all-reservations-debug/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function GET() {
  try {
    await dbConnect();
    
    const reservations = await Reservation.find({})  // Remove isVerified filter
      .select('name mobile time numberOfGuests specialRequest date status createdAt isVerified')
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      data: reservations.map(r => ({
        ...r,
        _debugNote: r.isVerified ? 'VERIFIED' : 'NOT_VERIFIED',
        formattedDate: new Date(r.date).toLocaleDateString('en-IN'),
        formattedTime: r.time
      })),
      count: reservations.length
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}