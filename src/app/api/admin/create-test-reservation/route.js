// src/app/api/admin/create-test-reservation/route.js
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function POST() {
  try {
    await dbConnect();
    
    // Create a test reservation for today
    const today = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(today.getTime() + istOffset);
    const todayStr = istDate.toISOString().split('T')[0];
    
    // Create multiple test reservations for different times
    const testReservations = [
      {
        name: 'Raj Patel',
        mobile: '9876543210',
        date: todayStr,
        time: '19:00',
        numberOfGuests: 4,
        specialRequest: 'Window seat preferred',
        isVerified: true,
        status: 'confirmed'
      },
      {
        name: 'Priya Shah',
        mobile: '9876543211',
        date: todayStr,
        time: '20:00',
        numberOfGuests: 2,
        specialRequest: '',
        isVerified: true,
        status: 'confirmed'
      },
      {
        name: 'Amit Kumar',
        mobile: '9876543212',
        date: todayStr,
        time: '18:30',
        numberOfGuests: 6,
        specialRequest: 'Birthday celebration',
        isVerified: true,
        status: 'pending'
      }
    ];
    
    // Tomorrow's reservations
    const tomorrow = new Date(istDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    testReservations.push({
      name: 'Sneha Desai',
      mobile: '9876543213',
      date: tomorrowStr,
      time: '19:30',
      numberOfGuests: 3,
      specialRequest: 'Vegetarian only',
      isVerified: true,
      status: 'confirmed'
    });
    
    const createdReservations = [];
    
    for (const reservationData of testReservations) {
      // Check if already exists
      const existing = await Reservation.findOne({
        mobile: reservationData.mobile,
        date: reservationData.date,
        time: reservationData.time
      });
      
      if (!existing) {
        const reservation = new Reservation(reservationData);
        await reservation.save();
        createdReservations.push(reservation);
      }
    }
    
    return Response.json({
      success: true,
      message: `Created ${createdReservations.length} test reservations`,
      data: createdReservations.map(r => ({
        id: r._id,
        name: r.name,
        mobile: r.mobile,
        date: r.date,
        time: r.time,
        guests: r.numberOfGuests,
        status: r.status,
        isVerified: r.isVerified
      })),
      todayDate: todayStr,
      tomorrowDate: tomorrowStr
    });

  } catch (error) {
    console.error('Failed to create test reservations:', error);
    return Response.json({
      success: false,
      message: 'Failed to create test reservations',
      error: error.message
    }, { status: 500 });
  }
}