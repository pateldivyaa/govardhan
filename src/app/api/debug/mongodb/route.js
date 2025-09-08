// src/app/api/debug/mongodb/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('=== MONGODB DEBUG SESSION ===');
    
    // Check MongoDB connection status
    const connectionStatus = {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections)
    };
    
    console.log('MongoDB Connection:', connectionStatus);
    
    // Get all reservations with full details
    const allReservations = await Reservation.find({}).lean();
    console.log(`Total documents in reservations collection: ${allReservations.length}`);
    
    // Group by verification status
    const verifiedReservations = allReservations.filter(r => r.isVerified);
    const unverifiedReservations = allReservations.filter(r => !r.isVerified);
    
    console.log(`Verified: ${verifiedReservations.length}, Unverified: ${unverifiedReservations.length}`);
    
    // Group by status
    const statusCounts = allReservations.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    
    // Group by date
    const dateCounts = allReservations.reduce((acc, r) => {
      acc[r.date] = (acc[r.date] || 0) + 1;
      return acc;
    }, {});
    
    // Get sample data
    const sampleReservations = allReservations.slice(0, 5).map(r => ({
      _id: r._id,
      name: r.name,
      mobile: r.mobile,
      date: r.date,
      time: r.time,
      numberOfGuests: r.numberOfGuests,
      isVerified: r.isVerified,
      status: r.status,
      createdAt: r.createdAt,
      hasOTP: !!r.otp
    }));
    
    // Get recent reservations
    const recentReservations = await Reservation.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name mobile date time isVerified status createdAt')
      .lean();
    
    // Check for today's reservations with different date formats
    const today = new Date();
    const todayIST = new Date(today.getTime() + (5.5 * 60 * 60 * 1000));
    const todayStr = todayIST.toISOString().split('T')[0];
    const todayUTCStr = today.toISOString().split('T')[0];
    
    const todayReservationsIST = allReservations.filter(r => r.date === todayStr);
    const todayReservationsUTC = allReservations.filter(r => r.date === todayUTCStr);
    
    const debugReport = {
      timestamp: new Date().toISOString(),
      connection: {
        status: connectionStatus.readyState === 1 ? 'Connected' : 'Disconnected',
        database: connectionStatus.name,
        host: connectionStatus.host,
        collections: connectionStatus.collections
      },
      database: {
        mongoUri: process.env.MONGODB_URI ? 'Configured' : 'Not configured',
        totalDocuments: allReservations.length,
        verifiedDocuments: verifiedReservations.length,
        unverifiedDocuments: unverifiedReservations.length
      },
      statusBreakdown: statusCounts,
      dateBreakdown: dateCounts,
      dateAnalysis: {
        todayIST: todayStr,
        todayUTC: todayUTCStr,
        todayReservationsIST: todayReservationsIST.length,
        todayReservationsUTC: todayReservationsUTC.length,
        uniqueDates: Object.keys(dateCounts).sort(),
        dateRange: {
          earliest: allReservations.length > 0 ? Math.min(...allReservations.map(r => new Date(r.date).getTime())) : null,
          latest: allReservations.length > 0 ? Math.max(...allReservations.map(r => new Date(r.date).getTime())) : null
        }
      },
      sampleData: sampleReservations,
      recentReservations: recentReservations.map(r => ({
        ...r,
        createdAt: r.createdAt?.toISOString(),
        timeAgo: r.createdAt ? `${Math.floor((Date.now() - r.createdAt.getTime()) / (1000 * 60))} minutes ago` : 'Unknown'
      })),
      recommendations: []
    };
    
    // Add recommendations based on findings
    if (allReservations.length === 0) {
      debugReport.recommendations.push("No reservations found in database. Make sure you're connected to the correct MongoDB Atlas cluster.");
    } else if (verifiedReservations.length === 0 && unverifiedReservations.length > 0) {
      debugReport.recommendations.push(`Found ${unverifiedReservations.length} unverified reservations. These won't show in admin panel. Check OTP verification process.`);
    } else if (todayReservationsIST.length === 0 && todayReservationsUTC.length === 0) {
      debugReport.recommendations.push("No reservations for today found. Try creating a test reservation or check date formatting.");
    }
    
    if (Object.keys(dateCounts).length > 0) {
      debugReport.recommendations.push(`Dates in database: ${Object.keys(dateCounts).sort().slice(0, 3).join(', ')}${Object.keys(dateCounts).length > 3 ? '...' : ''}`);
    }
    
    console.log('Debug Report Generated:', debugReport);
    console.log('=== END DEBUG SESSION ===');
    
    return Response.json({
      success: true,
      debug: debugReport,
      message: 'Database debug information retrieved successfully'
    });

  } catch (error) {
    console.error('MongoDB Debug Error:', error);
    
    return Response.json({
      success: false,
      error: {
        message: error.message,
        type: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      debug: {
        mongoUri: process.env.MONGODB_URI ? 'Configured' : 'Not configured',
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}