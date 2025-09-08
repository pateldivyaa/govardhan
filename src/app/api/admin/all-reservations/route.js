// src/app/api/admin/all-reservations/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    let query = { isVerified: true };
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [reservations, totalCount] = await Promise.all([
      Reservation.find(query)
        .select('name mobile time numberOfGuests specialRequest date status createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Reservation.countDocuments(query)
    ]);

    // Add formatted fields
    const formattedReservations = reservations.map(reservation => ({
      ...reservation,
      formattedDate: new Date(reservation.date).toLocaleDateString('en-IN', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      formattedTime: (() => {
        const [hours, minutes] = reservation.time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      })()
    }));

    return Response.json({
      success: true,
      data: formattedReservations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit
      },
      filters: {
        status,
        search
      }
    });

  } catch (error) {
    console.error('Failed to fetch all reservations:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch reservations'
    }, { status: 500 });
  }
}