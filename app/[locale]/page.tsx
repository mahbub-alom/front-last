"use client";
import { useTranslations } from "next-intl";
import Hero1 from "@/components/Hero1";
import FeaturedPackages from "@/components/FeaturedPackages";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <div className="bg-[#F1F1F1]">
      <Hero1 />
      <FeaturedPackages />
      <WhyChooseUs />
    </div>
  );
}
