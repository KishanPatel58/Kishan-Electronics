const imagekit = require("../config/imagekit");

const uploadToImageKit = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 🔥 MEMORY STORAGE → buffer use
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    });

    // 🔥 overwrite req.file
    req.file = {
      url: result.url,
      fileId: result.fileId,
    };

    next();

  } catch (err) {
    console.log("IMAGEKIT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = uploadToImageKit;