// components/ItineraryTimeline.tsx
"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const itinerary = [
  "Les Invalides",
  "Musée d'Orsay",
  "Ile de la Cite",
  "Notre Dame Cathedral",
  "Hôtel de Ville",
  "Louvre Museum",
  "Place de la Concorde",
  "Grand Palais",
];

export default function Test() {
  return (
    <div className="bg-white shadow-md mx-auto p-4 rounded-xl max-w-md">
      <h2 className="mb-4 font-semibold text-lg">Paris: 1-Hour Seine Cruise</h2>

      {/* Starting Point */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center bg-orange-500 rounded-full w-5 h-5 font-bold text-white text-xs">
            G
          </div>
          <div className="bg-orange-500 mt-1 w-1 h-8"></div>
        </div>
        <div>
          <p className="font-semibold">Starting location:</p>
          <p className="text-gray-600 text-sm">7 Port de la Bourdonnais</p>
        </div>
      </div>

      {/* Itinerary Points */}
      {itinerary.map((stop, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="bg-blue-800 rounded-full w-4 h-4"></div>
            {idx !== itinerary.length - 1 && <div className="bg-orange-500 w-1 h-8"></div>}
          </div>
          <div>
            <p className="font-medium">{stop}</p>
          </div>
        </div>
      ))}

      {/* Ending Point */}
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <div className="bg-orange-500 rounded-full w-4 h-8"></div>
        </div>
        <div>
          <p className="font-semibold">Arrive back at:</p>
          <p className="text-gray-600 text-sm">7 Port de la Bourdonnais</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t text-gray-500 text-sm">
        <p>For reference only. Itineraries are subject to change.</p>
        <div className="flex justify-between items-center mt-4">
          <p>
            <span className="text-gray-400 line-through">€19</span>{" "}
            <span className="font-bold text-red-500">€17</span> per person
          </p>
          <button className="bg-blue-600 px-4 py-2 rounded-md font-semibold text-white">
            Check availability
          </button>
        </div>
      </div>
    </div>
  );
}
