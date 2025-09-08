// src/app/api/guest/reserve/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

// Simple OTP generator function
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simple OTP sender function (for development)
async function sendOTP(mobile, otp) {
  console.log(`[SMS SERVICE] Sending OTP ${otp} to ${mobile}`);
  
  // In production, integrate with SMS service like Twilio, AWS SNS, etc.
  try {
    // TODO: Replace with actual SMS service integration
    console.log(`OTP ${otp} sent successfully to ${mobile}`);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
}

export async function POST(request) {
  try {
    console.log('=== RESERVATION API START ===');
    
    // Parse request body first
    let body;
    try {
      body = await request.json();
      console.log('Request body received:', body);
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return Response.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }
    
    const { name, mobile, date, time, numberOfGuests, specialRequest } = body;

    // Basic validation before database connection
    if (!name || !mobile || !date || !time || !numberOfGuests) {
      console.log('Basic validation failed');
      return Response.json({
        success: false,
        message: 'Please fill in all required fields',
        missingFields: {
          name: !name,
          mobile: !mobile, 
          date: !date,
          time: !time,
          numberOfGuests: !numberOfGuests
        }
      }, { status: 400 });
    }

    // Clean mobile number
    const cleanMobile = mobile.replace(/\D/g, '');
    console.log('Processing reservation for mobile:', cleanMobile);

    // Mobile validation
    if (cleanMobile.length !== 10 || !/^[6-9]/.test(cleanMobile)) {
      return Response.json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number starting with 6-9'
      }, { status: 400 });
    }

    // Date validation
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (inputDate < today) {
      return Response.json({
        success: false,
        message: 'Cannot make reservation for past dates'
      }, { status: 400 });
    }

    // Connect to database
    try {
      await dbConnect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      return Response.json({
        success: false,
        message: 'Database connection failed. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    // Check for existing active reservation
    try {
      const existingReservation = await Reservation.findOne({
        mobile: cleanMobile,
        date,
        time,
        isVerified: true,
        status: { $in: ['pending', 'confirmed'] }
      });

      if (existingReservation) {
        console.log('Duplicate reservation found:', existingReservation._id);
        return Response.json({
          success: false,
          message: 'You already have a reservation for this date and time. Please choose a different time slot.'
        }, { status: 409 });
      }
    } catch (error) {
      console.error('Error checking existing reservation:', error);
      // Continue - don't fail the entire process
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    console.log('Generated OTP for development:', process.env.NODE_ENV === 'development' ? otp : '***');

    // Try to find existing unverified reservation first
    let reservation = null;
    try {
      reservation = await Reservation.findOne({
        mobile: cleanMobile,
        date,
        time,
        isVerified: false
      });
    } catch (error) {
      console.error('Error finding existing unverified reservation:', error);
    }

    if (reservation) {
      console.log('Updating existing unverified reservation:', reservation._id);
      try {
        // Update existing reservation
        reservation.name = name.trim();
        reservation.numberOfGuests = parseInt(numberOfGuests);
        reservation.specialRequest = specialRequest ? specialRequest.trim() : '';
        reservation.otp = otp;
        reservation.otpExpiry = otpExpiry;
        reservation.status = 'pending';
        
        await reservation.save();
        console.log('Existing reservation updated successfully');
      } catch (error) {
        console.error('Error updating existing reservation:', error);
        
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message);
          return Response.json({
            success: false,
            message: 'Validation failed',
            errors: validationErrors
          }, { status: 400 });
        }
        
        return Response.json({
          success: false,
          message: 'Failed to update reservation',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
      }
    } else {
      console.log('Creating new reservation');
      try {
        // Create new reservation
        reservation = new Reservation({
          name: name.trim(),
          mobile: cleanMobile,
          date,
          time,
          numberOfGuests: parseInt(numberOfGuests),
          specialRequest: specialRequest ? specialRequest.trim() : '',
          isVerified: false,
          status: 'pending',
          otp,
          otpExpiry
        });
        
        await reservation.save();
        console.log('New reservation created:', reservation._id);
      } catch (error) {
        console.error('Error creating new reservation:', error);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
          // If duplicate key error, try to find and update the existing one
          try {
            const existingReservation = await Reservation.findOne({
              mobile: cleanMobile,
              date,
              time
            });
            
            if (existingReservation && !existingReservation.isVerified) {
              existingReservation.name = name.trim();
              existingReservation.numberOfGuests = parseInt(numberOfGuests);
              existingReservation.specialRequest = specialRequest ? specialRequest.trim() : '';
              existingReservation.otp = otp;
              existingReservation.otpExpiry = otpExpiry;
              await existingReservation.save();
              reservation = existingReservation;
              console.log('Updated duplicate reservation:', reservation._id);
            } else {
              return Response.json({
                success: false,
                message: 'You already have a confirmed reservation for this date and time.'
              }, { status: 409 });
            }
          } catch (updateError) {
            console.error('Error handling duplicate key:', updateError);
            return Response.json({
              success: false,
              message: 'Reservation conflict. Please try again.'
            }, { status: 409 });
          }
        } else if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message);
          return Response.json({
            success: false,
            message: 'Validation failed',
            errors: validationErrors
          }, { status: 400 });
        } else {
          return Response.json({
            success: false,
            message: 'Failed to create reservation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
          }, { status: 500 });
        }
      }
    }

    // Send OTP (always attempt, but don't fail if SMS fails)
    try {
      const smsResult = await sendOTP(cleanMobile, otp);
      if (!smsResult.success) {
        console.warn('SMS sending failed, but continuing...');
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      // Continue anyway for development
    }

    console.log('Reservation process completed successfully');

    return Response.json({
      success: true,
      message: 'OTP sent to your mobile number. Please verify to confirm your reservation.',
      reservationId: reservation._id.toString(),
      // Include OTP in development mode
      ...(process.env.NODE_ENV === 'development' && { 
        developmentOTP: otp,
        developmentMessage: `DEV MODE: Your OTP is ${otp}` 
      })
    }, { status: 201 });

  } catch (error) {
    console.error('=== RESERVATION API CRITICAL ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END CRITICAL ERROR ===');

    // Return appropriate error based on error type
    if (error.name === 'ValidationError') {
      return Response.json({
        success: false,
        message: 'Validation error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 400 });
    }

    if (error.code === 11000) {
      return Response.json({
        success: false,
        message: 'Duplicate reservation detected'
      }, { status: 409 });
    }

    return Response.json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    }, { status: 500 });
  }
}