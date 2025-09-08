// src/app/api/admin/orders/[orderId]/status/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
  try {
    const { orderId } = params;
    const { status } = await request.json();

    if (!status) {
      return Response.json({ message: 'Status is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return Response.json({ message: 'Invalid status' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('restaurant');
    const ordersCollection = db.collection('orders');

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ message: 'Order not found' }, { status: 404 });
    }

    return Response.json({ message: 'Order status updated successfully' });

  } catch (error) {
    console.error('Error updating order status:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}