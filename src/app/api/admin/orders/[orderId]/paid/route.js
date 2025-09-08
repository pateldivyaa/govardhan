// src/app/api/admin/order/[orderId]/paid/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
  try {
    const { orderId } = params;

    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentStatus: 'paid',
          isPaid: true,
          paidAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ message: 'Order not found' }, { status: 404 });
    }

    return Response.json({ message: 'Payment recorded successfully' });

  } catch (error) {
    console.error('Error marking order as paid:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}