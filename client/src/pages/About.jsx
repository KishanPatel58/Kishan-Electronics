import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";

export default function About() {
  const { dark } = useTheme();

  return (
    <div
      className={`min-h-screen transition ${dark ? "bg-black text-white" : "bg-gray-50 text-black"
        }`}
    >
      <Navbar />

      <div className="!px-6 md:!px-16 !py-16">

        {/* 🔥 HERO */}
        <div className="text-center max-w-3xl mx-auto !mb-20">
          <h1 className="text-5xl font-bold !mb-4">
            About Mayur Electronics
          </h1>
          <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
            Bringing modern technology and premium appliances to your home with trust and quality.
          </p>
        </div>

        {/* 🔥 ABOUT CONTENT */}
        <div className="grid md:grid-cols-2 gap-12 items-center !mb-24">

          <div>
            <h2 className="text-2xl font-semibold !mb-4">
              Who We Are
            </h2>
            <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
              Mayur Electronics is a trusted showroom offering a wide range of home appliances including TVs, refrigerators, air conditioners, and washing machines. Our goal is to provide high-quality products that enhance your everyday living.
            </p>
          </div>

          <div
            className={`rounded-2xl !p-10 shadow-lg ${dark ? "bg-gray-900" : "bg-white"
              }`}
          >
            <h3 className="text-xl font-semibold !mb-2">
              Our Mission
            </h3>
            <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
              To deliver reliable and innovative electronics that improve comfort and lifestyle.
            </p>
          </div>
        </div>

        {/* 🔥 STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 !mb-24 text-center">
          {[
            { label: "Products", value: "500+" },
            { label: "Customers", value: "1K+" },
            { label: "Brands", value: "20+" },
            { label: "Experience", value: "5+ Years" },
          ].map((item, i) => (
            <div
              key={i}
              className={`!p-6 rounded-xl ${dark ? "bg-gray-900" : "bg-white"
                } shadow hover:shadow-xl transition`}
            >
              <h2 className="text-2xl font-bold !mb-1">
                {item.value}
              </h2>
              <p className="text-sm opacity-70">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* 🔥 WHY CHOOSE US */}
        <div className="!mb-24">
          <h2 className="text-3xl font-bold text-center !mb-12">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Premium Quality Products",
              "Trusted by Customers",
              "Affordable Pricing",
            ].map((text, i) => (
              <div
                key={i}
                className={`!p-6 rounded-xl text-center ${dark ? "bg-gray-900" : "bg-white"
                  } shadow hover:shadow-2xl hover:-translate-y-1 transition`}
              >
                <p className="font-semibold">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 CTA */}
        <div
          className={`text-center !p-12 rounded-2xl ${dark ? "bg-white text-black" : "bg-black text-white"
            }`}
        >
          <h2 className="text-2xl font-bold !mb-4">
            Explore Our Products
          </h2>

          <p className="!mb-6">
            Discover the latest electronics for your home.
          </p>

          <button onClick={()=>{
            window.location.href="/products"
          }} className="!px-6 !py-3 rounded-full bg-gray-200 text-black hover:scale-105 transition">
            View Products
          </button>
        </div>

      </div>
    </div>
  );
}