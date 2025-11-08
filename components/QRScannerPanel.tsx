"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

interface QRScannerPanelProps {
  fetchData: () => void; // refresh main table
}

interface Booking {
  _id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  travelDate: string;
  totalAmount: number;
  paymentStatus: string;
  photoStatus: string;
  numberOfPassengers: number;
  passengersCompleted?: number;
  ticketId: {
    title: Record<string, string>;
    location?: string;
  };
}

export default function BookingScanner({ fetchData }: QRScannerPanelProps) {
  const [bookingIdInput, setBookingIdInput] = useState("");
  const [scannedBooking, setScannedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Step 1: Fetch booking details when scanner fills input
  const handleScanInput = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/${locale}/api/bookings/${id}`);
      const data = await res.json();

      if (res.ok) {
        setScannedBooking(data.booking);
      } else {
        // toast.error(data.error || "Booking not found");
        setScannedBooking(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch booking");
      setScannedBooking(null);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Mark booking (or passenger) as completed
  const handleMarkCompleted = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/${locale}/api/bookings/${id}`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Passenger scanned successfully!");

        // Update UI dynamically
        setScannedBooking((prev) =>
          prev
            ? {
                ...prev,
                passengersCompleted: data.passengersCompleted,
                photoStatus: data.photoStatus,
                paymentStatus:
                  data.photoStatus === "completed"
                    ? "completed"
                    : prev.paymentStatus,
              }
            : null
        );

        // Refresh main bookings table
        fetchData();

        // If all passengers done, reset input for next scan
        if (data.photoStatus === "completed") {
          setTimeout(() => {
            setBookingIdInput("");
            setScannedBooking(null);
            inputRef.current?.focus();
          }, 2000);
        }
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Input for QR scanner or manual typing */}
      <input
        ref={inputRef}
        type="text"
        value={bookingIdInput}
        placeholder="Scan or enter Booking ID"
        className="px-3 py-2 rounded-lg text-black"
        autoFocus
        onChange={(e) => {
          const value = e.target.value.trim().toUpperCase();
          setBookingIdInput(value);
          if (value) handleScanInput(value);
          else setScannedBooking(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && scannedBooking) {
            handleMarkCompleted(scannedBooking.bookingId);
          }
        }}
      />

      {/* Loading state */}
      {loading && <p className="mt-2 text-gray-400 text-sm">Loading Data...</p>}

      {/* Not Found State (only show when user typed something) */}
      {!loading && bookingIdInput && !scannedBooking && (
        <p className="mt-2 text-red-400 text-sm font-medium">
          ⚠️ Data not found. Please try again.
        </p>
      )}

      {scannedBooking && (
        <div className="bg-white/10 p-4 border border-white/20 rounded-xl">
          <h3 className="mb-3 font-bold text-white text-lg">Booking Details</h3>

          <p className="text-gray-300">
            <span className="font-semibold text-white">Customer:</span>{" "}
            {scannedBooking.customerName}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Email:</span>{" "}
            {scannedBooking.customerEmail}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Package:</span>{" "}
            {scannedBooking.ticketId?.title?.[locale]} — €
            {scannedBooking.totalAmount}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Travel Date:</span>{" "}
            {new Date(scannedBooking.travelDate).toLocaleDateString()}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Payment Status:</span>{" "}
            {scannedBooking.paymentStatus}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Photo Status:</span>{" "}
            {scannedBooking.photoStatus}
          </p>
          {/* <p className="text-gray-300">
            <span className="font-semibold text-white">Passengers:</span>{" "}
            {scannedBooking.passengersCompleted || 0}/
            {scannedBooking.numberOfPassengers}
          </p> */}

          {scannedBooking.photoStatus === "pending" && (
            <button
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 mt-3 px-4 py-2 rounded-lg font-semibold text-black"
              onClick={() => handleMarkCompleted(scannedBooking.bookingId)}
            >
              Mark Passenger Done
            </button>
          )}

          {scannedBooking.photoStatus === "completed" && (
            <p className="mt-3 font-semibold text-green-400">
              ✅ All passengers scanned — Travel Completed!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
