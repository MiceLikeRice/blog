const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

// 创建一个存储引擎并配置上传目录
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname,"..","resources","images");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// 创建一个 multer 实例
const upload = multer({ storage: storage });

// 通过 POST 请求处理图片上传
router.post("/uploadImage", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = req.file.originalname;

  res.status(200).json({ message: "File uploaded successfully.", fileName: filePath });
});
// 下载文件
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "resources", "images", filename);

  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: "File not found" });
    }
  });
});
module.exports = router;
