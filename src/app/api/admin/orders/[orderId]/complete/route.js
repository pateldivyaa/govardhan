// src/app/api/admin/order/[orderId]/complete/route.js
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
          status: 'delivered',
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ message: 'Order not found' }, { status: 404 });
    }

    return Response.json({ message: 'Order marked as delivered' });

  } catch (error) {
    console.error('Error completing order:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}