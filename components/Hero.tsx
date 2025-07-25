"use client";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0077B6] to-[#00B4D8] py-20 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          <h1 className="flex justify-center mb-6 font-bold text-4xl md:text-6xl">
            Discover <span className="block ms-2 text-[#00B4D8]">Paris</span>
          </h1>
          {/* <p className="opacity-90 mx-auto mb-8 max-w-3xl text-xl md:text-2xl">
            Book incredible tourism packages and create unforgettable memories
            with BUS & BOAT PARIS. Your adventure starts here!
          </p>
          <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mb-12">
            <Link
              href="/packages"
              className="flex items-center space-x-2 bg-white hover:bg-gray-100 shadow-lg px-8 py-4 rounded-lg font-semibold text-[#0077B6] transition-colors"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="hover:bg-white px-8 py-4 border-2 border-white rounded-lg font-semibold text-white hover:text-[#0077B6] transition-colors"
            >
              Learn More
            </Link>
          </div> */}

          {/* Stats */}
          {/* <div className="gap-8 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-4xl">
            <div className="flex flex-col items-center">
              <MapPin className="mb-4 w-12 h-12 text-[#00B4D8]" />
              <h3 className="mb-2 font-bold text-2xl">50+</h3>
              <p className="opacity-90">Destinations</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="mb-4 w-12 h-12 text-[#00B4D8]" />
              <h3 className="mb-2 font-bold text-2xl">10,000+</h3>
              <p className="opacity-90">Happy Travelers</p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="mb-4 w-12 h-12 text-[#00B4D8]" />
              <h3 className="mb-2 font-bold text-2xl">5+</h3>
              <p className="opacity-90">Years Experience</p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
