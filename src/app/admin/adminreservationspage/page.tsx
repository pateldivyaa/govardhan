"use client";

import React, { useEffect, useState } from 'react';
import { Search, Calendar, Users, Phone, Clock, MapPin, MessageSquare, RefreshCw, AlertCircle, Database, CheckCircle } from 'lucide-react';

interface ApiReservation {
  _id: string;
  name: string;
  mobile: string;
  time: string;
  numberOfGuests: number;
  date: string;
  specialRequest?: string;
  status: string;
  createdAt: string;
  formattedDate?: string;
  formattedTime?: string;
}

interface ApiResponse {
  success: boolean;
  data: ApiReservation[];
  message?: string;
  count?: number;
  filter?: string;
}

interface StatsData {
  totalReservations: number;
  todayReservations: number;
  tomorrowReservations: number;
  totalGuests: number;
  todayGuests: number;
}

const AdminReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalReservations: 0,
    todayReservations: 0,
    tomorrowReservations: 0,
    totalGuests: 0,
    todayGuests: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    document.title = 'Manage Reservations - Govardhan Thal';
    fetchReservations();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [filterDate]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data.overview);
      } else {
        console.error('Stats API error:', result.message);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (filterDate !== 'all') {
        params.append('date', filterDate);
      }
      
      const endpoint = '/api/admin/today-reservations';
      const url = `${endpoint}?${params.toString()}`;
      
      console.log('Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        const reservationsData = result.data || [];
        setReservations(reservationsData);
        console.log(`Loaded ${reservationsData.length} reservations for ${filterDate}`);
      } else {
        throw new Error(result.message || 'Failed to fetch reservations');
      }
      
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load reservations';
      setError(errorMessage);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/today-reservations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId,
          status: newStatus
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchReservations();
        await fetchStats();
        alert('Reservation status updated successfully!');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to update reservation:', error);
      alert(`Failed to update reservation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (!reservation) return false;
    
    const matchesSearch = 
      (reservation.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reservation.mobile || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.time.localeCompare(b.time);
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const formatDisplayTime = (timeString: string) => {
    try {
      if (!timeString) return '';
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  const filterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'week', label: 'This Week' },
    { value: 'all', label: 'All Reservations' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-3"></div>
          Loading reservations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-lg text-red-600 mb-2">Error Loading Reservations</p>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={fetchReservations}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Reservations</h1>
          <p className="text-gray-500">View and manage all table reservations</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 w-full sm:w-64"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button 
            onClick={fetchReservations}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Total Reservations</p>
              <h3 className="text-2xl font-bold">{stats.totalReservations}</h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar size={24} className="text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 text-sm">All time</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Today's Reservations</p>
              <h3 className="text-2xl font-bold">{stats.todayReservations}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-blue-600 text-sm">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Tomorrow's Reservations</p>
              <h3 className="text-2xl font-bold">{stats.tomorrowReservations}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MapPin size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-purple-600 text-sm">Upcoming</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Total Guests Today</p>
              <h3 className="text-2xl font-bold">{stats.todayGuests}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-green-600 text-sm">Expected today</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Database className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Database Status:</strong> Connected to MongoDB Atlas
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Found {reservations.length} reservations for {filterDate === 'today' ? "today" : 
               filterDate === 'tomorrow' ? "tomorrow" :
               filterDate === 'week' ? "this week" : "all dates"}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </div>

      {sortedReservations.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-orange-600 text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {filterDate === 'today' ? "Today's Reservations" : 
               filterDate === 'tomorrow' ? "Tomorrow's Reservations" :
               filterDate === 'week' ? "This Week's Reservations" : 
               "All Reservations"}
            </h2>
            <span className="bg-orange-500 px-3 py-1 rounded-full text-sm">
              {sortedReservations.length} reservations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReservations.map(reservation => (
                  <tr key={reservation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.formattedDate || formatDisplayDate(reservation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.formattedTime || formatDisplayTime(reservation.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      <div className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        {reservation.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Phone size={16} className="mr-2 text-gray-400" />
                        {reservation.mobile || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-gray-400" />
                        {reservation.numberOfGuests || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reservation.status || 'pending')}`}>
                        {(reservation.status || 'pending').charAt(0).toUpperCase() + (reservation.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {reservation.specialRequest ? (
                        <div className="flex items-center" title={reservation.specialRequest}>
                          <MessageSquare size={16} className="mr-2 text-gray-400" />
                          {reservation.specialRequest}
                        </div>
                      ) : (
                        <span className="text-gray-300">No special requests</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select 
                        value={reservation.status || 'pending'}
                        onChange={(e) => updateReservationStatus(reservation._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">
            {searchTerm ? 'No reservations found matching your search' : 
             filterDate === 'today' ? 'No reservations for today' :
             filterDate === 'tomorrow' ? 'No reservations for tomorrow' :
             filterDate === 'week' ? 'No reservations this week' :
             'No reservations found'}
          </p>
          <p className="text-sm text-gray-400">
            {searchTerm 
              ? 'Try changing your search terms or date filter' 
              : 'Reservations will appear here as customers make them'}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-sm"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReservationsPage;