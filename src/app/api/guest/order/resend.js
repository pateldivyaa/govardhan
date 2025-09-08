
// pages/api/guest/order/resend.js
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send SMS function
async function sendSMS(phoneNumber, otp) {
  if (process.env.SMS_PROVIDER === 'console') {
    console.log(`SMS to ${phoneNumber}: Your OTP is ${otp}. Valid for 10 minutes.`);
    return { success: true };
  }
  return { success: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId' });
    }

    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');
    const otpsCollection = db.collection('otps');

    // Find the order
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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

    // Send SMS
    await sendSMS(order.mobile, newOtp);

    res.status(200).json({ message: 'OTP resent successfully' });

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}