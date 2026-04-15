import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function Home() {
  const { dark } = useTheme();
  const [open, setOpen] = useState(null);

  const faqs = [
    { q: "Do you provide warranty?", a: "Yes, all products come with official warranty." },
    { q: "Do you offer installation?", a: "Yes, installation services are available." },
    { q: "Can I visit showroom?", a: "Yes, you are always welcome to visit our store." },
  ];
  const reviews = [
    {
      name: "Rahul Sharma",
      image: "https://i.pravatar.cc/100?img=1",
      rating: 5,
      text: "Amazing service and genuine products!",
    },
    {
      name: "Priya Patel",
      image: "https://i.pravatar.cc/100?img=2",
      rating: 4,
      text: "Best showroom experience.",
    },
    {
      name: "Amit Verma",
      image: "https://i.pravatar.cc/100?img=3",
      rating: 5,
      text: "Highly recommended store!",
    },
  ];


  return (
    <div className={`${dark ? "bg-black text-white" : "bg-white text-black"}`}>
      <Navbar />

      {/* 🔥 HERO SECTION */}
      <div className="relative h-screen flex items-center justify-center text-center overflow-hidden">

        {/* VIDEO */}
        <video autoPlay muted loop className="absolute w-full h-full object-cover">
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* OVERLAY GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>

        {/* CONTENT */}
        <div className="relative z-10 !px-6 max-w-4xl">
          <h1 className="text-5xl text-white md:text-7xl font-bold !mb-6 leading-tight">
            Elevate Your <br /> Home Experience
          </h1>

          <p className="text-lg md:text-xl text-gray-300 !mb-10">
            Premium electronics crafted for modern living.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button className="!px-6 !py-3 rounded-full bg-white text-black hover:scale-105 transition">
              Explore Products
            </button>

            <button className="!px-6 !py-3 rounded-full border border-white text-white hover:bg-white hover:text-black transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 TRUST / STATS */}
      <div className="!px-6 md:!px-16 !py-20 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "500+", l: "Products" },
            { v: "1K+", l: "Customers" },
            { v: "20+", l: "Brands" },
            { v: "5+", l: "Years Experience" },
          ].map((item, i) => (
            <div key={i}>
              <h2 className="text-3xl font-bold">{item.v}</h2>
              <p className="text-gray-500">{item.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 REVIEWS (GLASS UI) */}
      <div className="!py-20 overflow-hidden">
        <h2 className="text-3xl font-bold text-center !mb-12">
          Customer Reviews
        </h2>

        <div className="overflow-hidden w-full relative">

          <div className="marquee gap-6">

            {[...reviews, ...reviews, ...reviews, ...reviews].map((r, i) => (
              <div
                key={i}
                className={`min-w-[300px] max-w-[300px] !p-6 rounded-2xl ${dark
                    ? "bg-white/5 border border-white/10"
                    : "bg-black/5 border border-black/10"
                  } backdrop-blur-lg`}
              >
                <div className="flex items-center gap-3 !mb-4">
                  <img src={r.image} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">{r.name}</p>
                    <div className="text-yellow-400 text-sm">
                      {"★".repeat(r.rating)}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-400">
                  {r.text}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* 🔥 FAQ (MODERN ACCORDION) */}
      <div className="!px-6 md:!px-16 !py-20 flex flex-col items-center">

        {/* 🔥 HEADING */}
        <h2 className="text-3xl font-bold text-center !mb-12">
          FAQs
        </h2>

        {/* 🔥 FAQ CONTAINER */}
        <div className="w-full max-w-2xl space-y-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl !mt-2 border transition ${dark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
                }`}
            >
              {/* QUESTION */}
              <div
                onClick={() => setOpen(open === i ? null : i)}
                className="flex justify-between items-center cursor-pointer !p-5"
              >
                <span className="font-medium">{item.q}</span>

                {/* ICON */}
                <span className="text-xl transition">
                  {open === i ? "−" : "+"}
                </span>
              </div>

              {/* ANSWER */}
              {open === i && (
                <div className="!px-5 !pb-5 text-gray-500">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 CONTACT (MODERN CARD) */}
      <div className="!px-6 md:!px-16 !py-20 flex justify-center">
        <div
          className={`w-full max-w-xl !p-8 ${dark ? "" : "bg-white text-black"
            }`}
        >
          <h2 className="text-2xl font-bold text-center !mb-6">
            Contact Us
          </h2>

          <form className="space-y-4">
            <input className={`w-full !p-3 !mt-3 rounded-lg border ${dark?"placeholder:text-white border-[#ffffff4a]":"placeholder:text-black border-black"}`} placeholder="Name" />
            <input className={`w-full !p-3 !mt-3 rounded-lg border ${dark?"placeholder:text-white border-[#ffffff4a]":"placeholder:text-black border-black"}`} placeholder="Email" />
            <textarea className={`w-full !p-3 !mt-3 rounded-lg border ${dark?"placeholder:text-white border-[#ffffff4a]":"placeholder:text-black border-black"}`} rows="4" placeholder="Message"></textarea>

            <button className={`w-full !py-3 ${dark ? "bg-white text-black" : "bg-black text-white"} rounded-lg hover:scale-105 transition`}>
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* 🔥 FOOTER */}
      <div className="text-center !py-6 border-t border-gray-200 dark:border-white/10">
        © 2026 Mayur Electronics
      </div>
    </div>
  );
}