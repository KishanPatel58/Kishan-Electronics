const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/admin.controller");
const verifyAdmin = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");
const uploadToImageKit = require("../middleware/imageUpload");

// Admin Auth
adminRouter.post("/login", adminController.loginAdmin);
adminRouter.get("/logout", verifyAdmin, adminController.logoutAdmin);
adminRouter.post("/verify-otp", adminController.verifyOTP);
adminRouter.get("/profile", verifyAdmin, adminController.getAdminDetails);

// Product Management
adminRouter.post("/add-product", verifyAdmin, upload.array("image", 5), adminController.uploadProduct);
adminRouter.put("/update-product/:id", verifyAdmin, upload.array("image", 5), adminController.updateProduct);
adminRouter.delete("/delete-product/:id", verifyAdmin, adminController.deleteProduct);
adminRouter.get("/public/products", adminController.getAllProducts);
adminRouter.delete("/delete-image/:id", verifyAdmin, adminController.deleteSingleImage);
adminRouter.post("/add-category", verifyAdmin, adminController.addCategory);
adminRouter.get("/public/categories", adminController.getCategories);
adminRouter.post(
  "/upload-profile",
  verifyAdmin,
  upload.single("image"),
  uploadToImageKit,
  adminController.uploadProfileImage
);
module.exports = adminRouter;