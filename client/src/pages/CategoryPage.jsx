import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";

export default function CategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const { dark } = useTheme();

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/api/admin/public/products?category=${encodeURIComponent(name)}`
      )
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log(err));
  }, [name]);

  return (
    <div
      className={`min-h-screen transition duration-300 ${
        dark ? "bg-black text-white" : "bg-gray-50 text-black"
      }`}
    >
      
      <Navbar />
      <div className="!px-10 !py-10">
        <h1 className="text-3xl font-bold !mb-10 capitalize">
          {name}
        </h1>

        {/* 🔥 PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className={`rounded-xl shadow !p-4 transition hover:shadow-xl hover:-translate-y-1 ${
                dark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={p.image?.[0]}
                  className="h-44 w-full object-cover hover:scale-105 transition duration-300"
                />
              </div>

              <h3 className="!mt-3 font-semibold">{p.name}</h3>

              <div className="flex items-center gap-2 !mt-2">
                <p className="text-green-600 font-bold">
                  ₹{p.price}
                </p>
                <p className="text-gray-400 line-through text-sm">
                  ₹{p.oldPrice}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 EMPTY STATE */}
        {products.length === 0 && (
          <p className="text-center mt-10 text-gray-500">
            No products found in this category
          </p>
        )}
      </div>
    </div>
  );
}