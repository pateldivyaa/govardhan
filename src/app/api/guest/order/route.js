// src/app/api/guest/order/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      mobile, 
      tableNumber, 
      items, 
      subtotal, 
      tax, 
      total, 
      includeTax 
    } = body;

    // Validate required fields
    if (!customerName || !mobile || !tableNumber || !items || items.length === 0) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Prepare order document
    const orderDoc = {
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      tableNumber: tableNumber.trim(),
      items: items.map(item => ({
        item: item.name || item.item,
        name: item.name || item.item, // Store both for compatibility
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
        _id: item._id || item.item || new ObjectId().toString()
      })),
      subtotal: parseFloat(subtotal) || 0,
      tax: parseFloat(tax) || 0,
      total: parseFloat(total) || 0,
      totalValue: parseFloat(total) || 0, // Store both for compatibility
      includeTax: Boolean(includeTax),
      status: 'pending',
      paymentStatus: 'unpaid',
      isPaid: false,
      otp: otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      verified: false,
      type: 'guest_order', // Add type for filtering
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating order with data:', orderDoc); // Debug log

    // Insert order into database
    const result = await ordersCollection.insertOne(orderDoc);

    if (!result.insertedId) {
      throw new Error('Failed to create order in database');
    }

    console.log('Order created successfully with ID:', result.insertedId); // Debug log

    // Return success response with OTP (for demo purposes)
    return Response.json({
      success: true,
      message: 'Order created successfully',
      orderId: result.insertedId.toString(),
      otp: otp, // In production, this should be sent via SMS
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json(
      { 
        success: false,
        message: 'Failed to create order',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Alternative Pages API version (if using pages/api structure)
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

    // Validate required fields
    if (!customerName || !mobile || !tableNumber || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Prepare order document
    const orderDoc = {
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      tableNumber: tableNumber.trim(),
      items: items.map(item => ({
        item: item.name || item.item,
        name: item.name || item.item,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
        _id: item._id || item.item || new ObjectId().toString()
      })),
      subtotal: parseFloat(subtotal) || 0,
      tax: parseFloat(tax) || 0,
      total: parseFloat(total) || 0,
      totalValue: parseFloat(total) || 0,
      includeTax: Boolean(includeTax),
      status: 'pending',
      paymentStatus: 'unpaid',
      isPaid: false,
      otp: otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
      type: 'guest_order',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating order with data:', orderDoc);

    // Insert order into database
    const result = await ordersCollection.insertOne(orderDoc);

    if (!result.insertedId) {
      throw new Error('Failed to create order in database');
    }

    console.log('Order created successfully with ID:', result.insertedId);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      orderId: result.insertedId.toString(),
      otp: otp,
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create order',
      error: error.message 
    });
  }
}