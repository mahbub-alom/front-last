"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

export default function QRScannerPanel({ fetchData }: { fetchData: () => void }) {
  const [bookingId, setBookingId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // Auto focus on mount (scanner ready)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async () => {
    const id = bookingId.trim();
    if (!id) return toast.error("Please scan or enter a booking ID");

    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "PATCH" });
      const data = await res.json();

      if (res.ok) {
        toast.success(`✅ Booking marked as travel Completed`);
        setBookingId("");
        fetchData(); // refresh table
      } else {
        toast.error(data.error || "Booking not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update travel status");
    } finally {
      setLoading(false);
      // re-focus automatically after every scan
      inputRef.current?.focus();
    }
  };

  return (
    <div className="space-y-3 bg-white/10 p-6 border border-white/20 rounded-xl">
      <h2 className="font-bold text-[#FACC15] text-xl">QR Scanner</h2>
      <p className="text-gray-400 text-sm">
        Scan a ticket or manually enter a booking ID below:
      </p>

      <div className="flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="Scan or type booking ID"
          className="flex-1 bg-white/5 px-4 py-2 rounded-lg focus:outline-none focus:ring-[#FACC15] focus:ring-2 text-white"
          disabled={loading}
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className={`font-semibold px-4 py-2 rounded-lg transition ${
            loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-[#FACC15] text-black hover:bg-[#EAB308]"
          }`}
        >
          {loading ? "Updating..." : "Mark Done"}
        </button>
      </div>
    </div>
  );
}
