const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { getFile } = require("../controllers/fileController");

const router = express.Router();

router.use(authenticate);
router.get("/:fileId", getFile);

module.exports = router;
