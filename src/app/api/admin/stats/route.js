// src/app/api/admin/stats/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function GET() {
  try {
    await dbConnect();
    
    // Get current date in IST timezone
    const currentDate = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(currentDate.getTime() + istOffset);
    const todayIST = istDate.toISOString().split('T')[0];
    const todayUTC = currentDate.toISOString().split('T')[0];
    
    const tomorrow = new Date(istDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    console.log('Stats API - Today IST:', todayIST, 'Today UTC:', todayUTC, 'Tomorrow:', tomorrowStr);
    
    // Debug: Check what's actually in database
    const allReservations = await Reservation.find({}).select('date isVerified status numberOfGuests createdAt').lean();
    const verifiedReservations = await Reservation.find({ isVerified: true }).select('date status numberOfGuests').lean();
    
    console.log('=== STATS DEBUG ===');
    console.log('Total reservations in DB:', allReservations.length);
    console.log('Verified reservations in DB:', verifiedReservations.length);
    console.log('All dates in DB:', [...new Set(allReservations.map(r => r.date))]);
    console.log('Verified dates:', [...new Set(verifiedReservations.map(r => r.date))]);
    
    // Get various statistics with flexible date matching
    const [
      totalReservations,
      todayReservations,
      tomorrowReservations,
      totalGuests,
      todayGuests,
      statusCounts,
      recentReservations
    ] = await Promise.all([
      // Total verified reservations
      Reservation.countDocuments({ isVerified: true }),
      
      // Today's reservations (try both IST and UTC dates)
      Reservation.countDocuments({ 
        $and: [
          { isVerified: true },
          { $or: [{ date: todayIST }, { date: todayUTC }] }
        ]
      }),
      
      // Tomorrow's reservations
      Reservation.countDocuments({ date: tomorrowStr, isVerified: true }),
      
      // Total guests from verified reservations
      Reservation.aggregate([
        { $match: { isVerified: true } },
        { $group: { _id: null, total: { $sum: '$numberOfGuests' } } }
      ]),
      
      // Today's guests (flexible date matching)
      Reservation.aggregate([
        { 
          $match: { 
            $and: [
              { isVerified: true },
              { $or: [{ date: todayIST }, { date: todayUTC }] }
            ]
          }
        },
        { $group: { _id: null, total: { $sum: '$numberOfGuests' } } }
      ]),
      
      // Status distribution
      Reservation.aggregate([
        { $match: { isVerified: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // Recent reservations (last 10 verified ones)
      Reservation.find({ isVerified: true })
        .select('name mobile date time numberOfGuests createdAt status')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
    ]);

    // If no verified reservations, let's also check unverified ones for debugging
    let debugInfo = {
      currentIST: todayIST,
      currentUTC: todayUTC,
      allDatesInDB: [...new Set(allReservations.map(r => r.date))],
      verifiedDatesInDB: [...new Set(verifiedReservations.map(r => r.date))],
      timezone: 'Asia/Kolkata',
      totalInDB: allReservations.length,
      verifiedInDB: verifiedReservations.length,
      mongoConnectionString: process.env.MONGODB_URI ? 'Connected to Atlas' : 'Not configured'
    };

    // If no verified data but there are unverified reservations, include that info
    if (totalReservations === 0 && allReservations.length > 0) {
      const unverifiedStats = {
        unverifiedReservations: allReservations.length,
        unverifiedDates: [...new Set(allReservations.map(r => r.date))],
        unverifiedToday: allReservations.filter(r => 
          (r.date === todayIST || r.date === todayUTC) && !r.isVerified
        ).length
      };
      debugInfo = { ...debugInfo, ...unverifiedStats };
    }

    console.log('Stats results:', {
      total: totalReservations,
      today: todayReservations,
      tomorrow: tomorrowReservations,
      todayGuests: todayGuests[0]?.total || 0
    });

    const statsData = {
      overview: {
        totalReservations,
        todayReservations,
        tomorrowReservations,
        totalGuests: totalGuests[0]?.total || 0,
        todayGuests: todayGuests[0]?.total || 0
      },
      statusDistribution: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentReservations: recentReservations.map(res => ({
        ...res,
        formattedDate: new Date(res.date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        }),
        formattedTime: (() => {
          try {
            const [hours, minutes] = res.time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            });
          } catch (error) {
            return res.time;
          }
        })()
      })),
      debug: debugInfo
    };

    console.log('=== END STATS DEBUG ===');

    return Response.json({
      success: true,
      data: statsData
    });

  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}