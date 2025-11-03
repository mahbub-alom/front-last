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
import QRScannerPanel from "@/components/QRScannerPanel";

interface Ticket {
  _id: string;
  title: Record<string, string>;
  location: string;
  price: number;
}

interface Booking {
  _id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  travelDate: string;
  totalAmount: number;
  paymentStatus: string;
  ticketId?: Ticket ;
  createdAt: string;
  travelStatus: string;
  numberOfPassengers:number;
  adults:number;
  children:number;
  
}

export default function AdminDashboard() {
  const router = useRouter();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const pendingBookings = bookings.filter(
    (b) => b?.travelStatus !== "completed"
  );
  const completedBookings = bookings.filter(
    (b) => b?.travelStatus === "completed"
  );

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalPackages: 0,
    pendingBookings: 0,
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const sortedPendingBookings = pendingBookings.sort((a, b) => {
    const diff =
      new Date(a.travelDate).getTime() - new Date(b.travelDate).getTime();
    return sortOrder === "asc" ? diff : -diff;
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) router.push("/admin");
    };

    checkAuth();
    fetchData();
  }, [router]);

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
            { id: "completed", label: "Completed", icon: MapPinned },
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
                      {/* {b.ticketId?.title?.[locale]} — €{b.totalAmount} */}
                      {(b.ticketId as Ticket)?.title?.[locale]} — €
                      {b.totalAmount}
                    </p>
                    <p className="text-white text-xs">#{b.bookingId}</p>
                  </div>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block mx-2">Payment Status :</span>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        b.paymentStatus === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {b.paymentStatus === "completed" ? (
                        <CheckCircle className="mr-1 w-3 h-3" />
                      ) : (
                        <XCircle className="text-red-400" />
                      )}
                      {b.paymentStatus}
                    </span>
                  </td>
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

                <QRScannerPanel fetchData={fetchData} />
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
                        // "Created Date",
                        "Payment Status",
                        "Travel Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 font-semibold text-white-700 text-xs text-left uppercase tracking-wider cursor-pointer select-none"
                          onClick={() => {
                            if (header === "Travel Date") {
                              // toggle sort order
                              setSortOrder(
                                sortOrder === "asc" ? "desc" : "asc"
                              );
                            }
                          }}
                        >
                          {header}
                          {header === "Travel Date" && (
                            <span className="ml-1">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white-200/40">
                    {pendingBookings.map((booking) => (
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
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-white-900 text-sm">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </td> */}

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
                          <span className="inline-flex items-center bg-amber-50 px-3 py-1.5 border border-amber-200 rounded-full font-semibold text-amber-700 text-xs">
                            <Clock className="mr-1 w-3 h-3" />
                            {booking?.travelStatus}
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

          {activeTab === "completed" && (
            <div className="space-y-6">
              <h2 className="mb-2 font-bold text-white text-2xl">
                Completed Trips
              </h2>
              <p className="text-gray-400">All bookings marked as completed</p>

              <div className="shadow-xs border border-white/20 rounded-2xl overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10 border-white/10 border-b">
                    <tr>
                      {[
                        "Customer",
                        "Package",
                        "Travel Date",
                        "Travel Status",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 font-semibold text-gray-300 text-xs text-left uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {completedBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="hover:bg-white/5 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white text-sm">
                            {booking.customerName}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {booking.customerEmail}
                          </div>
                          <div className="font-mono text-gray-500 text-xs">
                            #{booking.bookingId}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-white text-sm">
                            {booking?.ticketId?.title?.[locale]}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {booking.ticketId?.location}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center bg-green-100 px-3 py-1.5 border border-green-300 rounded-full font-semibold text-green-700 text-xs">
                            <CheckCircle className="mr-1 w-3 h-3" />{" "}
                            {booking?.travelStatus}
                          </span>
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
                        router.push(`/admin/packages/Edit/${t._id}`)
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

              <div className="flex justify-end mb-4">
                <button
                  onClick={() => router.push("/admin/packages/create")}
                  className="bg-[#FACC15] hover:bg-[#D4AF37] px-4 py-2 rounded-lg font-bold text-black"
                >
                  + Create Package
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
