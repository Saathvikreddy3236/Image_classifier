const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("../middleware/authMiddleware");
const { uploadFolder } = require("../controllers/folderController");

const router = express.Router();
const uploadRoot = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
  }
});

const upload = multer({ storage });

router.use(authenticate);
router.post("/upload", upload.array("images", 100), uploadFolder);

module.exports = router;
