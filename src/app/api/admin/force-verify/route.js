// src/app/api/admin/force-verify/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function POST() {
  try {
    await dbConnect();
    
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

    return Response.json({
      success: true,
      message: `Verified ${result.modifiedCount} reservations`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}