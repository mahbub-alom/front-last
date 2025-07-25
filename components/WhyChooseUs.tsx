import { Award, Clock, HeartHandshake, Shield } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description:
        "Your payments and personal information are protected with industry-standard security.",
    },
    {
      icon: Clock,
      title: "Quick Booking",
      description:
        "Book your dream vacation in just 2-3 seconds with our streamlined process.",
    },
    {
      icon: Award,
      title: "Best Prices",
      description:
        "We offer competitive prices and amazing deals on all our travel packages.",
    },
    {
      icon: HeartHandshake,
      title: "24/7 Support",
      description:
        "Our dedicated support team is available round the clock to assist you.",
    },
  ];

  return (
    <section className="bg-[#F1F1F1] py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-[#1E1E1E] text-3xl md:text-4xl">
            Why Choose BUS & BOAT PARIS?
          </h2>
          <p className="mx-auto max-w-2xl text-[#6C757D] text-lg">
            We&apos;re committed to providing you with the best travel
            experience possible. Here&apos;s what makes us different.
          </p>
        </div>

        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg hover:shadow-xl p-6 rounded-xl text-center transition-shadow duration-300"
            >
              <div className="inline-flex justify-center items-center bg-[#0077B6] bg-opacity-10 mb-4 rounded-full w-16 h-16">
                <feature.icon className="w-8 h-8 text-[#0077B6]" />
              </div>
              <h3 className="mb-3 font-bold text-[#1E1E1E] text-xl">
                {feature.title}
              </h3>
              <p className="text-[#6C757D]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
