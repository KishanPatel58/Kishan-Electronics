import { useState, useEffect } from "react";
import { addProduct } from "../services/api";
import { FiUploadCloud } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

export default function AddProduct() {
    const { dark } = useTheme();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(""); // selected
    const [newCategory, setNewCategory] = useState(""); // input field

    const handleImages = (files) => {
        const fileArray = Array.from(files);

        setImages(fileArray);

        const previewArray = fileArray.map((file) =>
            URL.createObjectURL(file)
        );

        setPreview(previewArray);
    };
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3000/api/admin/public/categories"
                );

                setCategories(res.data.categories);
            } catch (err) {
                console.log(err);
            }
        };

        fetchCategories();
    }, []);
    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            const res = await axios.post(
                "http://localhost:3000/api/admin/add-category",
                { name: newCategory },
                { withCredentials: true }
            );

            // 🔥 update dropdown instantly
            setCategories((prev) => [...prev, res.data.category]);

            setNewCategory("");

        } catch (err) {
            console.log(err.response?.data);
        }
    };
    const handleEditImage = (file) => {
        if (!file || editIndex === null) return;

        const updatedImages = [...images];
        const updatedPreview = [...preview];

        updatedImages[editIndex] = file;
        updatedPreview[editIndex] = URL.createObjectURL(file);

        setImages(updatedImages);
        setPreview(updatedPreview);
        setEditIndex(null);
    };
    const [editIndex, setEditIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [form, setForm] = useState({
        name: "",
        oldPrice: "",
        price: "",
        discount: "",
        description: "",
    });

    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDeleteImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        const updatedPreview = preview.filter((_, i) => i !== index);

        setImages(updatedImages);
        setPreview(updatedPreview);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error("Please upload product images");
            return;
        }

        const data = new FormData();

        Object.keys(form).forEach((key) => {
            data.append(key, form[key]);
        });
        data.append("category", category);
        images.forEach((img) => {
            data.append("image", img);
        });

        try {
            const res = await addProduct(data); // 🔥 IMPORTANT

            toast.success("Product Added Successfully ✅");
        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center">

            <div
                className={`w-full max-w-5xl h-[85vh] grid grid-cols-2 rounded-2xl overflow-hidden shadow-xl transition ${dark
                        ? "bg-[#111] border border-white/10"
                        : "bg-white border border-gray-200"
                    }`}
            >

                {/* LEFT - FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="!p-10 flex flex-col justify-between"
                >
                    <div className="!space-y-6">

                        <h2 className={`text-2xl font-semibold ${dark ? "text-white" : "text-black"}`}>
                            Add Product
                        </h2>

                        {/* NAME */}
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder=" "
                                className={`peer w-full border-b bg-transparent !p-2 focus:outline-none ${dark ? "border-gray-600" : "border-gray-400"
                                    }`}
                            />
                            <label
                                className={`absolute left-2 top-2 text-sm transition-all duration-200
            peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-xs
            peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs
            !px-1 ${dark
                                        ? "text-gray-400 bg-[#111]"
                                        : "text-gray-500 bg-white"
                                    }`}
                            >
                                Product Name
                            </label>
                        </div>

                        {/* CATEGORY */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add new category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className={`flex-1 !p-2 rounded border ${dark
                                        ? "bg-black border-gray-600 text-white"
                                        : "bg-white border-gray-300"
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className={`!px-4 !py-2 rounded ${dark
                                        ? "bg-white text-black"
                                        : "bg-black text-white"
                                    }`}
                            >
                                Add
                            </button>
                        </div>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`w-full !p-2 rounded border ${dark
                                    ? "bg-black border-gray-600 text-white"
                                    : "bg-white border-gray-300"
                                }`}
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* PRICE */}
                        <div className="grid grid-cols-2 !gap-4">

                            {["oldPrice", "price"].map((field, i) => (
                                <div key={i} className="relative">
                                    <input
                                        type="number"
                                        name={field}
                                        value={form[field]}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className={`peer w-full border-b bg-transparent !p-2 focus:outline-none ${dark ? "border-gray-600" : "border-gray-400"
                                            }`}
                                    />
                                    <label
                                        className={`absolute left-2 top-2 text-sm transition-all
                peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-xs
                peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs
                !px-1 ${dark ? "bg-[#111] text-gray-400" : "bg-white text-gray-500"
                                            }`}
                                    >
                                        {field === "oldPrice" ? "Old Price" : "New Price"}
                                    </label>
                                </div>
                            ))}

                        </div>

                        {/* DISCOUNT */}
                        <div className="relative">
                            <input
                                type="number"
                                name="discount"
                                value={form.discount}
                                onChange={handleChange}
                                placeholder=" "
                                className={`peer w-full border-b bg-transparent !p-2 focus:outline-none ${dark ? "border-gray-600" : "border-gray-400"
                                    }`}
                            />
                            <label
                                className={`absolute left-2 top-2 text-sm transition-all
            peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-xs
            peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs
            !px-1 ${dark ? "bg-[#111] text-gray-400" : "bg-white text-gray-500"
                                    }`}
                            >
                                Discount %
                            </label>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="relative">
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder=" "
                                rows="3"
                                className={`peer w-full border-b bg-transparent !p-2 focus:outline-none ${dark ? "border-gray-600" : "border-gray-400"
                                    }`}
                            />
                            <label
                                className={`absolute left-2 top-2 text-sm transition-all
            peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-xs
            peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs
            !px-1 ${dark ? "bg-[#111] text-gray-400" : "bg-white text-gray-500"
                                    }`}
                            >
                                Description
                            </label>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className={`w-full !py-3 !mt-6 rounded-lg transition ${dark
                                ? "bg-white text-black hover:scale-105"
                                : "bg-black text-white hover:scale-105"
                            }`}
                    >
                        Add Product
                    </button>
                </form>

                {/* RIGHT - UPLOAD */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleImages(e.dataTransfer.files);
                    }}
                    className={`flex items-center justify-center border-l !p-8 transition ${dark
                            ? "bg-black border-white/10"
                            : "bg-gray-50 border-gray-200"
                        }`}
                >
                    <div
                        className={`w-full border border-dashed ${dark? "text-white border-white":"text-black border-black"} h-full flex flex-col items-center justify-center text-center transition ${isDragging ? "scale-105" : ""
                            }`}
                    >
                        <FiUploadCloud
                            size={42}
                            className={`!mb-4 ${dark ? "text-gray-400" : "text-gray-600"
                                }`}
                        />

                        <p className="!mb-2 font-medium">
                            Drag & drop image here
                        </p>

                        <p className="text-sm opacity-60 !mb-4">
                            or click below
                        </p>

                        <input
                            type="file"
                            multiple
                            className="hidden"
                            id="upload"
                            onChange={(e) => handleImages(e.target.files)}
                        />

                        <label
                            htmlFor="upload"
                            className={`!px-4 !py-2 rounded cursor-pointer ${dark
                                    ? "bg-white text-black"
                                    : "bg-black text-white"
                                }`}
                        >
                            Browse File
                        </label>

                        {/* PREVIEW */}
                        {preview.length > 0 && (
                            <div className="w-full grid grid-cols-3 gap-3 !mt-6 !px-4">
                                {preview.map((img, index) => (
                                    <div key={index} className="relative group">

                                        <img
                                            src={img}
                                            className="h-24 w-full object-cover rounded-lg border"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditIndex(index);
                                                document.getElementById("editUpload").click();
                                            }}
                                            className="absolute top-1 right-8 bg-black text-white !p-1 rounded opacity-0 group-hover:opacity-100"
                                        >
                                            <FaPencilAlt size={12} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white !p-1 rounded opacity-0 group-hover:opacity-100"
                                        >
                                            <FaTrash size={12} />
                                        </button>

                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}