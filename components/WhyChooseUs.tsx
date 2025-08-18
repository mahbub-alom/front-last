"use client";

import { Award, Clock, HeartHandshake, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your payments and personal information are protected with industry-standard security.",
      color: "bg-[#4CA1AF]/10 text-[#4CA1AF]"
    },
    {
      icon: Clock,
      title: "Quick Booking",
      description: "Book your dream vacation in just 2-3 seconds with our streamlined process.",
      color: "bg-[#FF4E50]/10 text-[#FF4E50]"
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "We offer competitive prices and amazing deals on all our travel packages.",
      color: "bg-[#FFD700]/10 text-[#FFD700]"
    },
    {
      icon: HeartHandshake,
      title: "24/7 Support",
      description: "Our dedicated support team is available round the clock to assist you.",
      color: "bg-[#134B42]/10 text-[#134B42]"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-[#F8F9FA] py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="bg-clip-text bg-gradient-to-r from-[#134B42] to-[#4CA1AF] mb-4 font-bold text-transparent text-4xl md:text-5xl">
            Why Choose BUS & BOAT PARIS?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 text-lg">
            We're committed to providing you with the best travel experience possible. Here's what makes us different.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -10 }}
              className="group relative bg-white shadow-lg hover:shadow-xl border border-gray-100 rounded-xl overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex flex-col items-center p-8 h-full text-center">
                <div className={`mb-6 rounded-2xl ${feature.color} p-4 w-16 h-16 flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                
                <h3 className="mb-3 font-bold text-gray-900 text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
                
                <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-0 group-hover:opacity-100 h-1 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}