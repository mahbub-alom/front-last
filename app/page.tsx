import Hero from '@/components/Hero';
import FeaturedPackages from '@/components/FeaturedPackages';
import WhyChooseUs from '@/components/WhyChooseUs';

export default function Home() {
  return (
    <div className="bg-[#F1F1F1]">
      <Hero />
      <FeaturedPackages />
      <WhyChooseUs />
    </div>
  );
}
