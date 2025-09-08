/ pages/api/guest/order/verify.js
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderId, otp } = req.body;

    if (!orderId || !otp) {
      return res.status(400).json({ message: 'Missing orderId or OTP' });
    }

    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');
    const otpsCollection = db.collection('otps');

    // Find OTP record
    const otpRecord = await otpsCollection.findOne({
      orderId,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update order status to confirmed
    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status: 'confirmed',
          updatedAt: new Date()
        }
      }
    );

    // Mark OTP as verified
    await otpsCollection.updateOne(
      { _id: otpRecord._id },
      {
        $set: {
          verified: true,
          verifiedAt: new Date()
        }
      }
    );

    res.status(200).json({ message: 'Order confirmed successfully' });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}