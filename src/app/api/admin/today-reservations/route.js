// src/app/api/admin/today-reservations/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get('date') || 'today';
    
    let query = { isVerified: true };
    
    // Get current date in multiple formats for comparison
    const currentDate = new Date();
    
    // IST timezone handling
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(currentDate.getTime() + istOffset);
    const todayIST = istDate.toISOString().split('T')[0];
    
    // Also get UTC date for comparison
    const todayUTC = currentDate.toISOString().split('T')[0];
    
    console.log('=== RESERVATION FETCH DEBUG ===');
    console.log('Current UTC Date:', currentDate.toISOString());
    console.log('Current IST Date:', istDate.toISOString());
    console.log('Today IST (YYYY-MM-DD):', todayIST);
    console.log('Today UTC (YYYY-MM-DD):', todayUTC);
    console.log('Date Filter:', dateFilter);
    
    // First, let's see ALL reservations in database for debugging
    const allReservations = await Reservation.find({}).select('date isVerified status createdAt').lean();
    console.log('All reservations in database:', allReservations.length);
    console.log('Sample reservations:', allReservations.slice(0, 5));
    
    // Count verified vs unverified
    const verifiedCount = await Reservation.countDocuments({ isVerified: true });
    const unverifiedCount = await Reservation.countDocuments({ isVerified: false });
    console.log('Verified reservations:', verifiedCount);
    console.log('Unverified reservations:', unverifiedCount);
    
    // Date filtering with both IST and UTC for wider coverage
    if (dateFilter === 'today') {
      // Try both IST and UTC dates
      query.$or = [
        { date: todayIST },
        { date: todayUTC }
      ];
      // Still require verification
      query.isVerified = true;
      
      console.log('Today query:', JSON.stringify(query));
    } else if (dateFilter === 'tomorrow') {
      const tomorrowIST = new Date(istDate);
      tomorrowIST.setDate(tomorrowIST.getDate() + 1);
      const tomorrowUTC = new Date(currentDate);
      tomorrowUTC.setDate(tomorrowUTC.getDate() + 1);
      
      query.$or = [
        { date: tomorrowIST.toISOString().split('T')[0] },
        { date: tomorrowUTC.toISOString().split('T')[0] }
      ];
      console.log('Tomorrow query:', JSON.stringify(query));
    } else if (dateFilter === 'week') {
      const weekFromNowIST = new Date(istDate);
      weekFromNowIST.setDate(istDate.getDate() + 7);
      
      query.date = {
        $gte: todayIST,
        $lte: weekFromNowIST.toISOString().split('T')[0]
      };
      console.log('Week query:', JSON.stringify(query));
    } else if (dateFilter === 'all') {
      // For 'all', just show verified reservations
      query = { isVerified: true };
      console.log('All query:', JSON.stringify(query));
    }
    
    // Also try a fallback query with just verification status
    let reservations = await Reservation.find(query)
      .select('name mobile time numberOfGuests specialRequest date status createdAt isVerified')
      .sort({ date: 1, time: 1 })
      .lean();

    console.log(`Found ${reservations.length} reservations with main query`);
    
    // If no reservations found and it's a date-specific query, try fallback
    if (reservations.length === 0 && dateFilter !== 'all') {
      console.log('No reservations found with date filter, trying fallback...');
      
      // Fallback: get all verified reservations and filter client-side
      const allVerifiedReservations = await Reservation.find({ isVerified: true })
        .select('name mobile time numberOfGuests specialRequest date status createdAt isVerified')
        .sort({ date: 1, time: 1 })
        .lean();
      
      console.log(`Found ${allVerifiedReservations.length} total verified reservations`);
      console.log('Dates in verified reservations:', allVerifiedReservations.map(r => r.date));
      
      // If still no verified reservations, let's check unverified ones too
      if (allVerifiedReservations.length === 0) {
        console.log('No verified reservations found, checking all reservations...');
        const allReservationsDetailed = await Reservation.find({})
          .select('name mobile time numberOfGuests specialRequest date status createdAt isVerified')
          .sort({ createdAt: -1 })
          .lean();
        
        console.log('All reservations (including unverified):', allReservationsDetailed.length);
        
        // For debugging, let's return unverified reservations too but mark them
        reservations = allReservationsDetailed.map(r => ({
          ...r,
          _debug_unverified: !r.isVerified
        }));
      } else {
        reservations = allVerifiedReservations;
      }
    }

    // Add formatted fields to each reservation
    const formattedReservations = reservations.map(reservation => ({
      ...reservation,
      formattedDate: (() => {
        try {
          const date = new Date(reservation.date);
          return date.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } catch (error) {
          console.error('Date formatting error:', error);
          return reservation.date;
        }
      })(),
      formattedTime: (() => {
        try {
          if (!reservation.time) return '';
          const [hours, minutes] = reservation.time.split(':');
          const date = new Date();
          date.setHours(parseInt(hours), parseInt(minutes));
          return date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });
        } catch (error) {
          console.error('Time formatting error:', error);
          return reservation.time || '';
        }
      })(),
      formattedCreatedAt: new Date(reservation.createdAt).toLocaleString('en-IN')
    }));

    console.log(`Returning ${formattedReservations.length} formatted reservations`);
    console.log('=== END DEBUG ===');

    return Response.json({
      success: true,
      data: formattedReservations,
      count: formattedReservations.length,
      filter: dateFilter,
      debug: {
        queryUsed: query,
        currentIST: todayIST,
        currentUTC: todayUTC,
        totalInDB: allReservations.length,
        verifiedInDB: verifiedCount,
        unverifiedInDB: unverifiedCount,
        datesInDB: [...new Set(allReservations.map(r => r.date))],
        mongoConnectionString: process.env.MONGODB_URI ? 'Connected' : 'Not configured'
      }
    });

  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch reservations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Update reservation status (keeping existing functionality)
export async function PATCH(request) {
  try {
    await dbConnect();
    
    const { reservationId, status } = await request.json();
    
    if (!reservationId || !status) {
      return Response.json({
        success: false,
        message: 'Reservation ID and status are required'
      }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return Response.json({
        success: false,
        message: 'Invalid status'
      }, { status: 400 });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return Response.json({
        success: false,
        message: 'Reservation not found'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Reservation status updated successfully',
      data: updatedReservation
    });

  } catch (error) {
    console.error('Failed to update reservation:', error);
    return Response.json({
      success: false,
      message: 'Failed to update reservation'
    }, { status: 500 });
  }
}