"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Clock, Users, Star, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { TicketSelectionSection } from "@/components/TicketSelectionSection";

interface Package {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  image: string;
  features: string[];
  availability: number;
}

export default function PackageDetailsPage() {
  return (
    <div>
      <TicketSelectionSection />
    </div>
  );
}
