// src/app/api/admin/verify-existing-reservations/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function POST() {
  try {
    await dbConnect();
    
    // First, let's see what we have
    const allReservations = await Reservation.find({}).lean();
    const unverifiedReservations = await Reservation.find({ isVerified: false }).lean();
    
    console.log(`Total reservations: ${allReservations.length}`);
    console.log(`Unverified reservations: ${unverifiedReservations.length}`);
    
    if (unverifiedReservations.length === 0) {
      return Response.json({
        success: true,
        message: 'No unverified reservations found to verify',
        data: {
          totalReservations: allReservations.length,
          alreadyVerified: allReservations.filter(r => r.isVerified).length,
          unverified: 0
        }
      });
    }
    
    // Verify all unverified reservations
    const result = await Reservation.updateMany(
      { isVerified: false },
      { 
        $set: { 
          isVerified: true,
          status: 'confirmed',
          otp: null,
          otpExpiry: null
        }
      }
    );
    
    // Get the updated reservations to show what was verified
    const newlyVerified = await Reservation.find({
      _id: { $in: unverifiedReservations.map(r => r._id) }
    }).select('name mobile date time numberOfGuests status isVerified').lean();
    
    console.log(`Verified ${result.modifiedCount} reservations`);
    
    return Response.json({
      success: true,
      message: `Successfully verified ${result.modifiedCount} existing reservations`,
      data: {
        modifiedCount: result.modifiedCount,
        verifiedReservations: newlyVerified.map(r => ({
          id: r._id,
          name: r.name,
          mobile: r.mobile,
          date: r.date,
          time: r.time,
          guests: r.numberOfGuests,
          status: r.status,
          nowVerified: r.isVerified
        })),
        totalNowVerified: allReservations.length
      }
    });

  } catch (error) {
    console.error('Failed to verify existing reservations:', error);
    return Response.json({
      success: false,
      message: 'Failed to verify existing reservations',
      error: error.message
    }, { status: 500 });
  }
}