"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  Euro,
  Eye,
  LogOut,
  Mail,
  MoreVertical,
  Package,
  Users,
  XCircle,
  MapPinned,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface Booking {
  _id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  travelDate: string;
  totalAmount: number;
  paymentStatus: string;
  ticketId: { title: string; location: string };
  createdAt: string;
}

interface Ticket {
  _id: string;
  title: string;
  location: string;
  price: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  console.log("bookings", bookings);
  console.log("tickets", tickets);
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
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/admin");
  };

  const fetchData = async () => {
    try {
      const [bookingsRes, ticketsRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/tickets"),
      ]);
      const bookingsData = await bookingsRes.json();
      const ticketsData = await ticketsRes.json();

      setBookings(bookingsData.bookings || []);
      setTickets(ticketsData.tickets || []);

      const totalBookings = bookingsData.bookings?.length || 0;
      const totalRevenue =
        bookingsData.bookings?.reduce(
          (sum: number, booking: Booking) =>
            booking.paymentStatus === "completed"
              ? sum + booking.totalAmount
              : sum,
          0
        ) || 0;
      const totalPackages = ticketsData.tickets?.length || 0;
      const pendingBookings =
        bookingsData.bookings?.filter(
          (b: Booking) => b.paymentStatus === "pending"
        ).length || 0;

      setStats({ totalBookings, totalRevenue, totalPackages, pendingBookings });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
  };

  const handleScan = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`✅ Booking ${bookingId} marked as travel done!`);
        fetchData(); // refresh table to show updated status
      } else {
        toast.error(data.error || data.message || "Failed to mark booking");
      }
    } catch (err) {
      console.error("Scan error:", err);
      toast.error("Failed to update travel status");
    }
  };

  const resendEmail = async (bookingId: string) => {
    try {
      const res = await fetch("/api/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      if (res.ok) toast.success("Email resent successfully!");
      else toast.error("Failed to resend email");
    } catch {
      toast.error("Error resending email");
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        toast.success("Package deleted successfully!");
      } else toast.error("Failed to delete package");
    } catch {
      toast.error("Error deleting package");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-br from-[#0A0E1A] via-[#111827] to-[#1E293B] min-h-screen">
        <div className="border-[#FACC15] border-t-4 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0A0E1A] via-[#111827] to-[#1E293B] pb-8 min-h-screen font-[Inter] text-white">
      {/* Header */}
      <header className="top-0 bg-white/10 backdrop-blur-xl border-white/20 border-b">
        <div className="flex justify-between items-center px-8 py-4">
          <h1 className="font-bold text-[#FACC15] text-2xl tracking-wider">
            Bus & Boat Paris — Admin
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/10 hover:bg-[#FACC15]/20 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 text-[#FACC15]" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gap-6 grid grid-cols-1 md:grid-cols-4 mx-auto px-6 py-10 max-w-7xl"
      >
        {[
          {
            label: "Total Bookings",
            value: stats.totalBookings,
            icon: Users,
            color: "#60A5FA",
          },
          {
            label: "Total Revenue",
            value: `€${stats.totalRevenue}`,
            icon: Euro,
            color: "#34D399",
          },
          {
            label: "Total Packages",
            value: stats.totalPackages,
            icon: Package,
            color: "#FACC15",
          },
          {
            label: "Pending Bookings",
            value: stats.pendingBookings,
            icon: Calendar,
            color: "#F87171",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 shadow-xl hover:shadow-[#FACC15]/30 backdrop-blur-md p-6 border border-white/10 rounded-2xl transition-all"
          >
            <div className="flex items-center space-x-4">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${stat.color}22` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-gray-300 text-sm">{stat.label}</p>
                <h2
                  className="font-bold text-2xl"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </h2>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <div className="bg-white/10 shadow-xl backdrop-blur-lg mx-auto border border-white/10 rounded-2xl max-w-7xl overflow-hidden">
        <nav className="flex space-x-8 px-8 border-white/10 border-b">
          {[
            { id: "overview", label: "Overview", icon: Eye },
            { id: "bookings", label: "Bookings", icon: Users },
            { id: "Travel done", label: "travel-done", icon: MapPinned },
            { id: "packages", label: "Packages", icon: Package },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 font-medium text-sm tracking-wide transition ${
                activeTab === tab.id
                  ? "text-[#FACC15] border-b-2 border-[#FACC15]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {bookings.slice(0, 6).map((b) => (
                <motion.div
                  key={b._id}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-lg transition"
                >
                  <div>
                    <p className="font-semibold text-white">{b.customerName}</p>
                    <p className="text-gray-300 text-sm">
                      {b.ticketId?.title?.[locale]} — €{b.totalAmount}
                    </p>
                  </div>
                  {b.paymentStatus === "completed" ? (
                    <CheckCircle className="text-green-400" />
                  ) : (
                    <XCircle className="text-red-400" />
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="mb-2 font-bold text-white-900 text-2xl">
                    Booking Management
                  </h2>
                  <p className="text-white-600">
                    Manage and track all customer bookings
                  </p>
                </div>
                <input
                  type="text"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleScan(e.currentTarget.value); // send value to backend
                      e.currentTarget.value = ""; // clear input after scan
                    }
                  }}
                  placeholder="Scan QR here..."
                  className="bg-white/10 px-4 py-2 border border-white/20 rounded-md w-72 text-white"
                />

                <div className="flex items-center space-x-3">
                  <span className="text-white-500 text-sm">
                    {bookings.length} bookings found
                  </span>
                </div>
              </div>

              {/* Enhanced Table */}
              <div className="shadow-xs border border-white-200/60 rounded-2xl overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white-50/80 border-white-200/60 border-b">
                    <tr>
                      {[
                        "Customer",
                        "Package",
                        "Travel Date",
                        "Created Date",
                        "Amount",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 font-semibold text-white-700 text-xs text-left uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white-200/40">
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="group transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-white-900 text-sm">
                              {booking.customerName}
                            </div>
                            <div className="text-white-500 text-xs">
                              {booking.customerEmail}
                            </div>
                            <div className="font-mono text-white-400 text-xs">
                              #{booking.bookingId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-white-900 text-sm">
                            {booking?.ticketId?.title?.[locale]}
                          </div>
                          <div className="text-white-500 text-xs">
                            {booking?.numberOfPassengers} passengers (
                            {booking?.adults} adults) ({booking?.children}{" "}
                            children)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-white-900 text-sm">
                            {new Date(booking.travelDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-white-900 text-sm">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-white-900 text-sm">
                            €{booking.totalAmount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                              booking.paymentStatus === "completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {booking.paymentStatus === "completed" ? (
                              <CheckCircle className="mr-1 w-3 h-3" />
                            ) : (
                              <Clock className="mr-1 w-3 h-3" />
                            )}
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => resendEmail(booking.bookingId)}
                              className="flex items-center space-x-1.5 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium text-white-600 hover:text-blue-600 text-xs transition-colors duration-200"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Resend</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "packages" && (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
              {tickets.map((t) => (
                <motion.div
                  key={t._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/10 shadow-lg p-6 border border-white/10 rounded-xl transition"
                >
                  <h3 className="mb-2 font-bold text-[#FACC15] text-lg">
                    {t.title?.[locale]}
                  </h3>
                  <p className="mb-4 text-gray-300">{t.location}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/packages/edit/${t._id}`)
                      }
                      className="flex-1 bg-[#34D399] hover:bg-[#059669] py-2 rounded-lg font-medium text-black"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTicket(t._id)}
                      className="flex-1 bg-[#F87171] hover:bg-[#DC2626] py-2 rounded-lg font-medium text-white"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
