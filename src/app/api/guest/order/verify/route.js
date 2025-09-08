/**
 * SEPARATE FILES NEEDED - Copy each section to its own file:
 * 
 * File 1: src/app/api/guest/order/verify/route.js
 * File 2: src/app/api/guest/order/resend/route.js  
 * File 3: src/app/api/admin/orders/[orderId]/status/route.js
 * File 4: src/app/api/admin/order/[orderId]/complete/route.js
 * File 5: src/app/api/admin/order/[orderId]/paid/route.js
 */

// CREATE THIS AS: src/app/api/guest/order/verify/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { orderId, otp } = await request.json();

    if (!orderId || !otp) {
      return Response.json(
        { message: 'Order ID and OTP are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');

    // Find the order
    const order = await ordersCollection.findOne({
      _id: new ObjectId(orderId)
    });

    if (!order) {
      return Response.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if OTP is expired
    if (new Date() > order.otpExpiry) {
      return Response.json(
        { message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (order.otp !== otp) {
      return Response.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Update order status to confirmed
    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          verified: true,
          status: 'confirmed',
          updatedAt: new Date()
        },
        $unset: {
          otp: "",
          otpExpiry: ""
        }
      }
    );

    return Response.json({
      success: true,
      message: 'Order verified successfully'
    });

  } catch (error) {
    console.error('Error verifying order:', error);
    return Response.json(
      { message: 'Failed to verify order' },
      { status: 500 }
    );
  }
}