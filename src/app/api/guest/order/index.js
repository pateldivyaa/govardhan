// pages/api/guest/order/index.js
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send SMS function (console log for development)
async function sendSMS(phoneNumber, otp) {
  if (process.env.SMS_PROVIDER === 'console') {
    console.log(`SMS to ${phoneNumber}: Your OTP is ${otp}. Valid for 10 minutes.`);
    return { success: true };
  }
  // Add other SMS providers like Twilio, etc. here if needed
  return { success: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      customerName,
      mobile,
      tableNumber,
      items,
      subtotal,
      tax,
      total,
      includeTax
    } = req.body;

    // Validation
    if (!customerName || !mobile || !tableNumber || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const client = await clientPromise;
    const db = client.db('restaurant'); // Your database name
    const ordersCollection = db.collection('orders');
    const otpsCollection = db.collection('otps');

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create order document
    const orderDoc = {
      customerName,
      mobile,
      tableNumber: parseInt(tableNumber),
      items: items.map(item => ({
        item: item.item,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        _id: new ObjectId()
      })),
      subtotal,
      tax,
      totalValue: total,
      includeTax,
      status: 'pending', // Will be 'confirmed' after OTP verification
      paymentStatus: 'unpaid',
      isPaid: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert order
    const orderResult = await ordersCollection.insertOne(orderDoc);
    const orderId = orderResult.insertedId.toString();

    // Store OTP
    await otpsCollection.insertOne({
      orderId,
      otp,
      mobile,
      expiresAt: otpExpiry,
      verified: false,
      createdAt: new Date()
    });

    // Send SMS
    await sendSMS(mobile, otp);

    res.status(201).json({
      message: 'Order created successfully. OTP sent to your mobile.',
      orderId
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// pages/api/guest/order/verify.js
export async function verifyHandler(req, res) {
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

// pages/api/guest/order/resend.js
export async function resendHandler(req, res) {
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