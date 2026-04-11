import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash } from "react-icons/fi";
import { BsCloudArrowDown } from "react-icons/bs";
import toast from "react-hot-toast";

export default function ManageProducts() {
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
        "http://localhost:3000/api/admin/categories"
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
        `http://localhost:3000/api/admin/products?${query}`,
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
      <div className="w-full h-full bg-white rounded-3xl shadow !p-6 overflow-hidden">

        <h2 className="text-2xl font-bold !mb-6">Manage Products</h2>
        <div className="flex gap-3 !mb-6 flex-wrap">


          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border !p-2 rounded"
          >
            <option value="">All Categories</option>

            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* MIN PRICE */}
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border !p-2 rounded"
          />

          {/* APPLY FILTER */}
          <button
            onClick={() => {
              fetchData({
                category,
                minPrice
              });
            }
            }
            className="bg-black text-white !px-4 !py-2 rounded"
          >
            Apply Filter
          </button>

          {/* RESET */}
          <button
            onClick={() => {
              setCategory("");
              setMinPrice("");
              fetchData(); // 🔥 back to all
            }}
            className="border !px-4 !py-2 rounded"
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
                <div key={p._id} className="flex justify-between items-center border !p-4 rounded-xl">

                  <div className="flex items-center gap-4">
                    <img
                      src={p.image?.[0]}
                      className="w-14 h-14 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-500">₹{p.price}</p>
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
                      className="!p-2 border rounded hover:bg-gray-100"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="!p-2 border rounded hover:bg-gray-100"
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
        <div className="fixed !inset-0 bg-black/40 flex items-center justify-center !z-50">

          <div className="bg-white !p-6 rounded-xl w-[400px] !space-y-4">

            <h2 className="text-xl font-semibold">Edit Product</h2>

            <input
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              placeholder="Product Name"
              className="w-full border !p-2 rounded"
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
              className="w-full border !p-2 rounded"
            />

            <input
              name="oldPrice"
              value={editForm.oldPrice}
              onChange={handleEditChange}
              placeholder="Old Price"
              className="w-full border !p-2 rounded"
            />

            <input
              name="discount"
              value={editForm.discount}
              onChange={handleEditChange}
              placeholder="Discount"
              className="w-full border !p-2 rounded"
            />

            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              placeholder="Description"
              className="w-full border !p-2 rounded"
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
              className="mt-4 border-2 border-dashed border-gray-300 rounded-xl h-24 flex flex-col items-center justify-center cursor-pointer hover:border-black transition"
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