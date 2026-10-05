import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();

    // Re-use sample tickets logic or delegate
    const seedModule = await import("@/app/[locale]/api/seed/route");
    return seedModule.POST();
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
