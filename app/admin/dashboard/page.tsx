'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Package, 
  DollarSign, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Mail,
  LogOut,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Booking {
  _id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  numberOfPassengers: number;
  totalAmount: number;
  paymentStatus: string;
  paymentId: string;
  ticketId: {
    title: string;
    location: string;
  };
  createdAt: string;
}

interface Ticket {
  _id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  availability: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalPackages: 0,
    pendingBookings: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
    }
  };

  const fetchData = async () => {
    try {
      const [bookingsRes, ticketsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/tickets')
      ]);

      const bookingsData = await bookingsRes.json();
      const ticketsData = await ticketsRes.json();

      setBookings(bookingsData.bookings || []);
      setTickets(ticketsData.tickets || []);

      // Calculate stats
      const totalBookings = bookingsData.bookings?.length || 0;
      const totalRevenue = bookingsData.bookings?.reduce((sum: number, booking: Booking) => 
        booking.paymentStatus === 'completed' ? sum + booking.totalAmount : sum, 0) || 0;
      const totalPackages = ticketsData.tickets?.length || 0;
      const pendingBookings = bookingsData.bookings?.filter((booking: Booking) => 
        booking.paymentStatus === 'pending').length || 0;

      setStats({
        totalBookings,
        totalRevenue,
        totalPackages,
        pendingBookings,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const resendEmail = async (bookingId: string) => {
    try {
      const response = await fetch('/api/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      if (response.ok) {
        alert('Email resent successfully!');
      } else {
        alert('Failed to resend email');
      }
    } catch (error) {
      alert('Error resending email');
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
        alert('Package deleted successfully!');
      } else {
        alert('Failed to delete package');
      }
    } catch (error) {
      alert('Error deleting package');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-[#F1F1F1] min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-[#0077B6] border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-4 text-[#6C757D]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F1F1] min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <h1 className="font-bold text-[#1E1E1E] text-2xl">OrbitHike Admin</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-[#6C757D] hover:text-[#D00000] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-4 mb-8">
          <div className="bg-white shadow-lg p-6 rounded-xl">
            <div className="flex items-center">
              <div className="bg-[#0077B6] bg-opacity-10 p-3 rounded-full">
                <Users className="w-6 h-6 text-[#0077B6]" />
              </div>
              <div className="ml-4">
                <p className="text-[#6C757D] text-sm">Total Bookings</p>
                <p className="font-bold text-[#1E1E1E] text-2xl">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl">
            <div className="flex items-center">
              <div className="bg-[#38B000] bg-opacity-10 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-[#38B000]" />
              </div>
              <div className="ml-4">
                <p className="text-[#6C757D] text-sm">Total Revenue</p>
                <p className="font-bold text-[#1E1E1E] text-2xl">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl">
            <div className="flex items-center">
              <div className="bg-[#00B4D8] bg-opacity-10 p-3 rounded-full">
                <Package className="w-6 h-6 text-[#00B4D8]" />
              </div>
              <div className="ml-4">
                <p className="text-[#6C757D] text-sm">Total Packages</p>
                <p className="font-bold text-[#1E1E1E] text-2xl">{stats.totalPackages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl">
            <div className="flex items-center">
              <div className="bg-[#D00000] bg-opacity-10 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-[#D00000]" />
              </div>
              <div className="ml-4">
                <p className="text-[#6C757D] text-sm">Pending Bookings</p>
                <p className="font-bold text-[#1E1E1E] text-2xl">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-lg mb-8 rounded-xl">
          <div className="border-gray-200 border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'bookings', label: 'Bookings', icon: Users },
                { id: 'packages', label: 'Packages', icon: Package },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[#0077B6] text-[#0077B6]'
                      : 'border-transparent text-[#6C757D] hover:text-[#1E1E1E] hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="mb-6 font-bold text-[#1E1E1E] text-xl">Recent Activity</h2>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="flex justify-between items-center bg-[#F1F1F1] p-4 rounded-lg">
                      <div>
                        <p className="font-medium text-[#1E1E1E]">{booking.customerName}</p>
                        <p className="text-[#6C757D] text-sm">
                          Booked {booking.ticketId.title} - ${booking.totalAmount}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {booking.paymentStatus === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-[#38B000]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#D00000]" />
                        )}
                        <span className="text-[#6C757D] text-sm">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="mb-6 font-bold text-[#1E1E1E] text-xl">All Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="divide-y divide-gray-200 min-w-full">
                    <thead className="bg-[#F1F1F1]">
                      <tr>
                        <th className="px-6 py-3 font-medium text-[#6C757D] text-xs text-left uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 font-medium text-[#6C757D] text-xs text-left uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-6 py-3 font-medium text-[#6C757D] text-xs text-left uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 font-medium text-[#6C757D] text-xs text-left uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 font-medium text-[#6C757D] text-xs text-left uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-[#1E1E1E] text-sm">
                                {booking.customerName}
                              </div>
                              <div className="text-[#6C757D] text-sm">
                                {booking.customerEmail}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-[#1E1E1E] text-sm">{booking.ticketId.title}</div>
                            <div className="text-[#6C757D] text-sm">{booking.ticketId.location}</div>
                          </td>
                          <td className="px-6 py-4 text-[#1E1E1E] text-sm whitespace-nowrap">
                            ${booking.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.paymentStatus === 'completed'
                                ? 'bg-[#38B000] bg-opacity-10 text-[#38B000]'
                                : 'bg-[#D00000] bg-opacity-10 text-[#D00000]'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-sm whitespace-nowrap">
                            <button
                              onClick={() => resendEmail(booking.bookingId)}
                              className="flex items-center space-x-1 text-[#0077B6] hover:text-[#005a8b]"
                            >
                              <Mail className="w-4 h-4" />
                              <span>Resend</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-[#1E1E1E] text-xl">Travel Packages</h2>
                  <button
                    onClick={() => router.push('/admin/packages/new')}
                    className="flex items-center space-x-2 bg-[#0077B6] hover:bg-[#005a8b] px-4 py-2 rounded-lg text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Package</span>
                  </button>
                </div>
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {tickets.map((ticket) => (
                    <div key={ticket._id} className="bg-white p-6 border rounded-xl">
                      <h3 className="mb-2 font-bold text-[#1E1E1E] text-lg">{ticket.title}</h3>
                      <p className="mb-4 text-[#6C757D]">{ticket.location}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-[#0077B6] text-2xl">${ticket.price}</span>
                        <span className="text-[#6C757D] text-sm">{ticket.availability} available</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/packages/edit/${ticket._id}`)}
                          className="flex flex-1 justify-center items-center space-x-1 bg-[#00B4D8] hover:bg-[#0096c7] px-3 py-2 rounded-lg text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteTicket(ticket._id)}
                          className="flex flex-1 justify-center items-center space-x-1 bg-[#D00000] hover:bg-[#b30000] px-3 py-2 rounded-lg text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}