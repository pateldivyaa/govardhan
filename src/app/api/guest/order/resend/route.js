// src/app/api/guest/order/resend/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return Response.json({ message: 'Missing orderId' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');
    const otpsCollection = db.collection('otps');

    // Find the order
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    
    if (!order) {
      return Response.json({ message: 'Order not found' }, { status: 404 });
    }

    const newOtp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Invalidate old OTPs
    await otpsCollection.updateMany(
      { orderId, verified: false },
      { $set: { verified: true } }
    );

    // Create new OTP
    await otpsCollection.insertOne({
      orderId,
      otp: newOtp,
      mobile: order.mobile,
      expiresAt: otpExpiry,
      verified: false,
      createdAt: new Date()
    });

    // Log OTP instead of sending SMS (for development)
    console.log(`New OTP for order ${orderId}: ${newOtp} (expires at ${otpExpiry})`);

    return Response.json({ 
      message: 'OTP resent successfully',
      otp: newOtp // Return OTP for toast display
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}