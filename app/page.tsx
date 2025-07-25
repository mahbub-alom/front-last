// import Hero from '@/components/Hero';
import FeaturedPackages from '@/components/FeaturedPackages';
import Hero1 from '@/components/Hero1';
import WhyChooseUs from '@/components/WhyChooseUs';

export default function Home() {
  return (
    <div className="bg-[#F1F1F1]">
      {/* <Hero /> */}
      <Hero1/>
      <FeaturedPackages />
      <WhyChooseUs />
    </div>
  );
}
