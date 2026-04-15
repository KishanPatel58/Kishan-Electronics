import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Products = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const { dark } = useTheme();

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/admin/public/products")
            .then((res) => {
                const data = res.data.products;
                setProducts(data);

                const uniqueCategories = [
                    ...new Set(data.map((p) => p.category)),
                ];

                setCategories(
                    uniqueCategories.map((c, i) => ({
                        _id: i,
                        name: c,
                    }))
                );
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className={`${dark ? "bg-black text-white" : "bg-gray-50 text-black"} min-h-screen`}>
            <Navbar />
            {/* 🔥 HERO */}
            <div className="text-center !py-16 !px-6">
                <h1 className="text-5xl font-bold !mb-4">
                    Explore Our Products
                </h1>
                <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
                    Discover categories and premium appliances for your home
                </p>
            </div>

            {/* 🔥 CATEGORY CAPSULES */}
            <div className="!px-10 !mb-16">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((c) => (
                        <div
                            key={c._id}
                            onClick={() => navigate(`/category/${c.name}`)}
                            className={`group flex items-center gap-3 !px-6 !py-3 rounded-full cursor-pointer transition ${dark
                                    ? "border border-white hover:bg-white hover:text-black"
                                    : "border border-black hover:bg-black hover:text-white"
                                }`}
                        >
                            {/* DOT + RIPPLE */}
                            <div className="ripple-container">
                                <span
                                    className={`ripple-dot ${dark
                                            ? "bg-white group-hover:bg-black"
                                            : "bg-black group-hover:bg-white"
                                        }`}
                                ></span>

                                {[1, 2, 3].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`ripple-circle ${dark
                                                ? "bg-white/40 group-hover:bg-black/40"
                                                : "bg-black/40 group-hover:bg-white/40"
                                            }`}
                                    ></span>
                                ))}
                            </div>

                            {c.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔥 PRODUCT PREVIEW GRID */}
            <div className="!px-10 !pb-20">
                <h2 className="text-2xl font-semibold !mb-8 text-center">
                    Featured Products
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.slice(0, 8).map((p) => (
                        <div
                            key={p._id}
                            onClick={() => navigate(`/category/${p.category}`)}
                            className={`group w-full !mt-2 rounded-2xl overflow-hidden cursor-pointer transition duration-300 ${dark
                                    ? "bg-gray-900 border border-gray-800"
                                    : "bg-white border border-gray-200"
                                } hover:shadow-2xl hover:-translate-y-2`}
                        >
                            {/* 🔥 IMAGE */}
                            <div className="h-48 w-full overflow-hidden bg-gray-100">
                                <img
                                    src={p.image?.[0]}
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* 🔥 CONTENT */}
                            <div className="!p-4">
                                {/* NAME */}
                                <h3 className="text-sm font-semibold leading-tight line-clamp-2 min-h-[40px]">
                                    {p.name}
                                </h3>

                                {/* PRICE */}
                                <div className="flex items-center gap-2 !mt-2">
                                    <p className="text-green-600 font-bold text-lg">
                                        ₹{p.price}
                                    </p>

                                    <p className="text-gray-400 line-through text-sm">
                                        ₹{p.oldPrice}
                                    </p>
                                </div>

                                {/* CATEGORY */}
                                <p
                                    className={`text-xs !mt-2 ${dark ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    {p.category}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Products;