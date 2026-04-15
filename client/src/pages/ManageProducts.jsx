import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash } from "react-icons/fi";
import { BsCloudArrowDown } from "react-icons/bs";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

export default function ManageProducts() {
  const { dark } = useTheme();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    oldPrice: "",
    discount: "",
    description: "",
  });
  const [editImages, setEditImages] = useState([]);
  const [editPreview, setEditPreview] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/admin/public/categories"
      );

      setCategories(res.data.categories);

    } catch (err) {
      toast.error("CATEGORY ERROR:", err.response?.data || err.message);
    }
  };
  const fetchData = async (filters = {}) => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );

      const query = new URLSearchParams(cleanFilters).toString();

      const res = await axios.get(
        `http://localhost:3000/api/admin/public/products?${query}`,
        { withCredentials: true }
      );

      setProducts(res.data.products);

    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/delete-product/${id}`, { withCredentials: true });
    fetchData();
  };
  const updateProduct = async () => {
    try {
      const data = new FormData();

      // text fields
      Object.keys(editForm).forEach((key) => {
        data.append(key, editForm[key]);
      });

      // images
      editImages.forEach((img) => {
        if (img instanceof File) {
          data.append("image", img);
        }
      });

      await axios.put(
        `http://localhost:3000/api/admin/update-product/${editingProduct._id}`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEditingProduct(null);
      fetchData();

    } catch (err) {
      toast.error("UPDATE ERROR:", err.response?.data);
    }
  };
  const handleDeleteImage = async (index) => {
    try {
      // 🔥 call backend
      await axios.delete(
        `http://localhost:3000/api/admin/delete-image/${editingProduct._id}`,
        {
          data: { index },
          withCredentials: true,
        }
      );

      // 🔥 update UI instantly
      const updatedImages = [...editImages];
      const updatedPreview = [...editPreview];

      updatedImages.splice(index, 1);
      updatedPreview.splice(index, 1);

      setEditImages(updatedImages);
      setEditPreview(updatedPreview);

      toast.success("Image deleted successfully!");

    } catch (err) {
      toast.error("DELETE IMAGE ERROR:", err.response?.data || err.message);
    }
  };
  const handleAddMoreImages = (files) => {
    if (!files.length) return;

    const newFiles = Array.from(files);

    const newPreviews = newFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setEditImages((prev) => [...prev, ...newFiles]);
    setEditPreview((prev) => [...prev, ...newPreviews]);
    document.getElementById("addImages").value = null;
  };
  const handleDrop = (e) => {
    e.preventDefault();
    handleAddMoreImages(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleEditImage = (file) => {
    if (!file || editIndex === null) return;

    const updatedImages = [...editImages];
    const updatedPreview = [...editPreview];

    updatedImages[editIndex] = file;
    updatedPreview[editIndex] = URL.createObjectURL(file);

    setEditImages(updatedImages);
    setEditPreview(updatedPreview);
    setEditIndex(null);
  };

  return (
    <>
      <div
        className={`w-full h-full rounded-3xl shadow !p-6 overflow-hidden transition ${dark
          ? "bg-[#111] text-white border border-white/10"
          : "bg-white text-black border border-gray-200"
          }`}
      >

        <h2 className="text-2xl font-bold !mb-6">Manage Products</h2>
        <div className="flex gap-3 !mb-6 flex-wrap">

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`!p-2 rounded border ${dark
              ? "bg-black border-gray-600 text-white"
              : "bg-white border-gray-300"
              }`}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={`!p-2 rounded border ${dark
              ? "bg-black border-gray-600 text-white"
              : "bg-white border-gray-300"
              }`}
          />

          <button
            onClick={() => fetchData({ category, minPrice })}
            className={`!px-4 !py-2 rounded ${dark
              ? "bg-white text-black"
              : "bg-black text-white"
              }`}
          >
            Apply
          </button>

          <button
            onClick={() => {
              setCategory("");
              setMinPrice("");
              fetchData();
            }}
            className={`!px-4 !py-2 rounded border ${dark
              ? "border-white/20 hover:bg-white/10"
              : "border-gray-300 hover:bg-gray-100"
              }`}
          >
            Reset
          </button>
        </div>
        {
          products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="!space-y-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className={`flex justify-between items-center !p-4 rounded-2xl transition ${dark
                    ? "bg-white/5 border border-white/10 hover:bg-white/10"
                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.image?.[0]}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm opacity-60">₹{p.price}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setEditForm({
                          name: p.name,
                          price: p.price,
                          oldPrice: p.oldPrice,
                          discount: p.discount,
                          description: p.description,
                        });
                        setEditImages(p.image || []);
                        setEditPreview(p.image || []);
                      }}
                      className={`!p-2 rounded ${dark
                        ? "border border-white/20 hover:bg-white/10"
                        : "border border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="!p-2 rounded border border-red-400 text-red-400 hover:bg-red-500/10"
                    >
                      <FiTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
      {editingProduct && (
        <div className="fixed !inset-0 bg-black/50 flex items-center justify-center !z-50">

          <div
            className={`!p-6 rounded-2xl w-[420px] !space-y-4 shadow-xl ${dark
              ? "bg-[#111] text-white border border-white/10"
              : "bg-white text-black"
              }`}
          >

            <h2 className="text-xl font-semibold">Edit Product</h2>

            <input
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              placeholder="Product Name"
              className={`w-full !p-2 rounded border ${dark
                ? "bg-black border-gray-600 text-white"
                : "bg-white border-gray-300"
                }`}
            />
            <input
              type="file"
              id="editUpload"
              className="hidden"
              multiple
              onChange={(e) => handleAddMoreImages(e.target.files)}
            />
            <input
              type="file"
              id="replaceImage"
              className="hidden"
              onChange={(e) => handleEditImage(e.target.files[0])}
            />
            <input
              type="file"
              id="addImages"
              className="hidden"
              multiple
              onChange={(e) => handleAddMoreImages(e.target.files)}
            />
            <input
              name="price"
              value={editForm.price}
              onChange={handleEditChange}
              placeholder="Price"
              className={`w-full !p-2 rounded border ${dark
                ? "bg-black border-gray-600 text-white"
                : "bg-white border-gray-300"
                }`}
            />

            <input
              name="oldPrice"
              value={editForm.oldPrice}
              onChange={handleEditChange}
              placeholder="Old Price"
              className={`w-full !p-2 rounded border ${dark
                ? "bg-black border-gray-600 text-white"
                : "bg-white border-gray-300"
                }`}
            />

            <input
              name="discount"
              value={editForm.discount}
              onChange={handleEditChange}
              placeholder="Discount"
              className={`w-full !p-2 rounded border ${dark
                ? "bg-black border-gray-600 text-white"
                : "bg-white border-gray-300"
                }`}
            />

            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              placeholder="Description"
              className={`w-full !p-2 rounded border ${dark
                ? "bg-black border-gray-600 text-white"
                : "bg-white border-gray-300"
                }`}
            />
            <div className="grid grid-cols-3 gap-4 !mt-2">
              {editPreview.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border shadow-sm"
                >

                  {/* IMAGE */}
                  <img
                    src={img}
                    className="h-24 w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">

                    <button
                      type="button"
                      onClick={() => {
                        setEditIndex(index);
                        document.getElementById("replaceImage").click();
                      }}
                      className="bg-white text-black !p-2 rounded-full shadow hover:scale-110 transition"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white !p-1 !w-[25px] !h-[25px] flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>

                  </div>

                </div>
              ))}
            </div>
            {/* ADD MORE IMAGE */}
            <div
              onClick={() => document.getElementById("editUpload").click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`mt-4 border-2 border-dashed rounded-xl h-24 flex flex-col items-center justify-center cursor-pointer transition ${dark
                  ? "border-white/20 hover:border-white"
                  : "border-gray-300 hover:border-black"
                }`}
            >
              <BsCloudArrowDown size={25} />
              <p className="text-xs text-gray-500">
                Add more images or drop here
              </p>
            </div>

            <div className="flex justify-start gap-3">
              <button
                onClick={() => setEditingProduct(null)}
                className="!px-4 !py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={updateProduct}
                className="!px-4 !py-2 bg-black text-white rounded"
              >
                Update
              </button>
              {/* IMAGE PREVIEW */}


              {/* BUTTONS */}
            </div>

            {/* <div className="flex justify-end gap-3">
              <button onClick={() => setEditingProduct(null)}>Cancel</button>
              <button onClick={updateProduct}>Update</button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}