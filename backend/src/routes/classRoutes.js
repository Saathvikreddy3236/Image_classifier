const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { listClasses, addClass, removeClass } = require("../controllers/classController");

const router = express.Router();

router.use(authenticate);
router.get("/project/:projectId", listClasses);
router.post("/", addClass);
router.delete("/:classId", removeClass);

module.exports = router;
