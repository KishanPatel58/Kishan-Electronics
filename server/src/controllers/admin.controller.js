const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ENV = require("../config/config");
const productModel = require("../models/product.model");
const imagekit = require("../config/imagekit");
const adminModel = require("../models/admin.model");
const BlacklistToken = require("../models/blacklist.model");
const sendEmail = require("../services/sendEmail");
const categoryModel = require("../models/category.model");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All Fields are Required!" });
    }

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid Credentials!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials!" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
    admin.otp = otp;
    admin.otpCreatedAt = new Date();
    admin.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await admin.save();

    // HTML Email Template
    const htmlTemplate = `
      <div style="max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px;font-family:Arial">
        <h2 style="text-align:center;color:#333">Admin Login OTP</h2>
        <p>Your OTP for login is:</p>
        <h1 style="text-align:center;color:#007bff">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `;

    // Send Email
    await sendEmail(admin.email, "Your OTP for Admin Login", htmlTemplate);

    // Send ONLY ONE response
    return res.status(200).json({
      message: "OTP sent to email",
      email: admin.email,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await adminModel.findOne({ email });

    if (!admin || !admin.otp) {
      return res.status(400).json({ error: "OTP not found" });
    }

    // ✅ Match OTP
    if (admin.otp !== String(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // ✅ Check expiry
    if (admin.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // ✅ Clear OTP
    admin.otp = null;
    admin.otpCreatedAt = null;
    admin.otpExpiresAt = null;
    admin.isVerified = true;
    await admin.save();

    // ✅ Generate token
    const token = jwt.sign({ adminId: admin._id }, ENV.JWT_SECRET, {
      expiresIn: "10d",
    });

    // 🔥 FINAL COOKIE FIX
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax", // 🔥 VERY IMPORTANT
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({ error: "OTP verification failed" });
  }
};
const uploadProduct = async (req, res) => {
  try {
    const files = req.files;
    const imageUrls = [];
    const imageFileIds = [];
    for (let file of files) {
      const response = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });

      imageUrls.push(response.url); // ImageKit URL
      imageFileIds.push(response.fileId); // VERY IMPORTANT
    }

    const { name, oldPrice, price, discount, description, category } = req.body;

    const product = new productModel({
      name,
      oldPrice,
      price,
      discount,
      description,
      category,
      image: imageUrls, // store URL instead of filename
      imageFileIds: imageFileIds,
    });

    await product.save();

    res.status(201).json({
      message: "Product Added Successfully",
      images: imageUrls,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding product!" });
  }
};
const getAdminDetails = async (req, res) => {
  try {
    const adminId = req.admin.adminId;
    const admin = await adminModel.findById(adminId);
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ error: "Error fetching admin details" });
  }
};
const logoutAdmin = async (req, res) => {
  try {
    const adminId = req.admin.adminId; // FIXED
    const token = req.headers.authorization.split(" ")[1];

    await BlacklistToken.create({
      token,
      reason: "logout",
    });

    const admin = await adminModel.findById(adminId);
    if (admin) {
      admin.isVerified = false;
      await admin.save();
    }

    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // =========================
    // 1. UPDATE TEXT DATA
    // =========================
    const { name, overallPrice, price, discount, description } = req.body;

    if (name) product.name = name;
    if (overallPrice) product.overallPrice = overallPrice;
    if (price) product.price = price;
    if (discount) product.discount = discount;
    if (description) product.description = description;

    // =========================
    // 2. IF NEW IMAGES PROVIDED
    // =========================
    if (req.files && req.files.length > 0) {
      // 🔥 STEP 2: Upload NEW images
      const newImageUrls = [];
      const newImageFileIds = [];

      for (let file of req.files) {
        const response = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
        });

        newImageUrls.push(response.url);
        newImageFileIds.push(response.fileId);
      }

      // 🔥 STEP 3: Replace in DB
      product.image = [...product.image, ...newImageUrls];

      product.imageFileIds = [
        ...(product.imageFileIds || []),
        ...newImageFileIds,
      ];
    }

    // =========================
    // 3. SAVE
    // =========================
    await product.save();

    return res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete images from ImageKit (parallel)
    if (product.imageFileIds && product.imageFileIds.length > 0) {
      await Promise.all(
        product.imageFileIds.map((fileId) =>
          imagekit.deleteFile(fileId).catch((err) => {
            console.log("Image delete error:", err.message);
          }),
        ),
      );
    }
    // Delete product from DB
    await productModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    let filter = {};

    // 🔥 CATEGORY FILTER
    if (category) {
      filter.category = category;
    }

    // 🔥 PRICE FILTER ONLY IF EXISTS
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    console.log("FILTER:", filter); // 🔥 DEBUG

    const products = await productModel.find(filter);

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteSingleImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { index } = req.query;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const fileId = product.imageFileIds?.[index];

    product.image.splice(index, 1);

    if (product.imageFileIds) {
      product.imageFileIds.splice(index, 1);
    }

    if (fileId) {
      await imagekit.deleteFile(fileId);
    }

    await product.save();

    return res.json({
      message: fileId
        ? "Image deleted successfully"
        : "Image removed (no fileId available)",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name required" });
    }

    const exists = await categoryModel.findOne({ name });

    if (exists) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await categoryModel.create({ name });

    res.json({ category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GET ALL CATEGORIES
const getCategories = async (req, res) => {
  const categories = await categoryModel.find();
  res.json({ categories });
};
const uploadProfileImage = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const admin = await adminModel.findByIdAndUpdate(
      adminId,
      { image: imageUrl },
      { new: true },
    );

    res.json({ admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  loginAdmin,
  uploadProduct,
  logoutAdmin,
  updateProduct,
  deleteProduct,
  getAllProducts,
  verifyOTP,
  getAdminDetails,
  deleteSingleImage,
  addCategory,
  getCategories,
  uploadProfileImage
};
