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
  travelStatus: string;
  ticketId: { title: string; location: string };
}

export default function QRScannerPanel({ fetchData }: QRScannerPanelProps) {
  const [bookingIdInput, setBookingIdInput] = useState("");
  const [scannedBooking, setScannedBooking] = useState<Booking | null>(null);
  const locale = useLocale();

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when component mounts or after reset
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Step 1: Fetch booking details
const handleScanInput = async (id: string) => {
  if (!id) return;

  try {
    const res = await fetch(`/api/bookings/${id}`);
    const data = await res.json();

    if (res.ok) {
      setScannedBooking(data.booking);
    } else {
      toast.error(data.error || "Booking not found");
      setScannedBooking(null);
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch booking");
    setScannedBooking(null);
  }
};

  // Step 2: Mark booking as completed
  const handleMarkCompleted = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "PATCH" });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Booking marked as completed!`);
        fetchData();
        // Reset for next scan
        setScannedBooking(null);
        setBookingIdInput("");
        inputRef.current?.focus(); // auto-focus for next scan
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Input for QR scanner or manual typing */}
<input
  type="text"
  value={bookingIdInput}
  placeholder="Scan or enter Booking ID"
  className="px-3 py-2 rounded-lg text-black"
  autoFocus
  onChange={(e) => {
    const value = e.target.value;
    setBookingIdInput(value);

    // auto fetch if user types or scanner fills
    if (value) handleScanInput(value);
    else setScannedBooking(null);
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" && bookingIdInput) {
      // Mark as completed
      handleUpdateTravelStatus(bookingIdInput);
    }
  }}
/>


      {/* Show scanned booking */}
      {scannedBooking && (
        <div className="bg-white/10 p-4 border border-white/20 rounded-xl">
          <h3 className="mb-2 font-bold text-white">Booking Details</h3>
          <p className="text-gray-300">
            Customer: {scannedBooking.customerName}
          </p>
          <p className="text-gray-300">Email: {scannedBooking.customerEmail}</p>
          <p className="text-gray-300">
            Package: {scannedBooking.ticketId?.title?.[locale]} — €
            {scannedBooking.totalAmount}
          </p>
          <p className="text-gray-300">
            Travel Date:{" "}
            {new Date(scannedBooking.travelDate).toLocaleDateString()}
          </p>
          <p className="text-gray-300">
            Payment Status: {scannedBooking.paymentStatus}
          </p>
          <p className="text-gray-300">
            Travel Status: {scannedBooking.travelStatus}
          </p>

          <button
            className="bg-[#FACC15] mt-2 px-4 py-2 rounded-lg font-semibold text-black"
            onClick={() => handleMarkCompleted(scannedBooking.bookingId)}
          >
            Mark as Completed
          </button>
        </div>
      )}
    </div>
  );
}
