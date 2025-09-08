// src/app/api/guest/reserve/verify/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { reservationId, otp } = await request.json();

    // Validation
    if (!reservationId || !otp) {
      return Response.json({
        success: false,
        message: 'Reservation ID and OTP are required'
      }, { status: 400 });
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return Response.json({
        success: false,
        message: 'Please enter a valid 6-digit OTP'
      }, { status: 400 });
    }

    // Find the reservation
    const reservation = await Reservation.findById(reservationId);
    
    if (!reservation) {
      return Response.json({
        success: false,
        message: 'Reservation not found'
      }, { status: 404 });
    }

    // Check if already verified
    if (reservation.isVerified) {
      return Response.json({
        success: false,
        message: 'Reservation is already confirmed'
      }, { status: 400 });
    }

    // Check if OTP is expired
    if (!reservation.otpExpiry || new Date() > reservation.otpExpiry) {
      return Response.json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      }, { status: 400 });
    }

    // Verify OTP
    if (reservation.otp !== otp) {
      return Response.json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      }, { status: 400 });
    }

    // Check if the reservation time slot is still available
    const conflictingReservation = await Reservation.findOne({
      _id: { $ne: reservationId },
      date: reservation.date,
      time: reservation.time,
      isVerified: true,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingReservation) {
      // Check capacity again
      const totalGuestsAtTime = await Reservation.aggregate([
        {
          $match: {
            _id: { $ne: reservation._id },
            date: reservation.date,
            time: reservation.time,
            isVerified: true,
            status: { $in: ['pending', 'confirmed'] }
          }
        },
        {
          $group: {
            _id: null,
            totalGuests: { $sum: '$numberOfGuests' }
          }
        }
      ]);

      const currentCapacity = totalGuestsAtTime[0]?.totalGuests || 0;
      const maxCapacity = 50;
      
      if (currentCapacity + reservation.numberOfGuests > maxCapacity) {
        return Response.json({
          success: false,
          message: `Sorry, this time slot is no longer available. Available capacity: ${maxCapacity - currentCapacity} guests`
        }, { status: 400 });
      }
    }

    // Mark as verified and confirmed
    reservation.isVerified = true;
    reservation.status = 'confirmed';
    reservation.otp = null; // Clear OTP for security
    reservation.otpExpiry = null;
    
    await reservation.save();

    console.log('Reservation confirmed successfully:', {
      id: reservation._id,
      name: reservation.name,
      mobile: reservation.mobile,
      date: reservation.date,
      time: reservation.time
    });

    return Response.json({
      success: true,
      message: 'Reservation confirmed successfully! We look forward to serving you.',
      data: {
        reservationId: reservation._id,
        name: reservation.name,
        date: reservation.date,
        time: reservation.time,
        numberOfGuests: reservation.numberOfGuests,
        formattedDate: new Date(reservation.date).toLocaleDateString('en-IN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
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
      }
    }, { status: 200 });

  } catch (error) {
    console.error('OTP verification error:', error);
    
    if (error.name === 'CastError' && error.path === '_id') {
      return Response.json({
        success: false,
        message: 'Invalid reservation ID'
      }, { status: 400 });
    }

    return Response.json({
      success: false,
      message: 'Server error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}