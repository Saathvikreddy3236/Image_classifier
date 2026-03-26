const express = require("express");
const { listProjects, addProject, getProject } = require("../controllers/projectController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);
router.get("/", listProjects);
router.post("/", addProject);
router.get("/:projectId", getProject);

module.exports = router;
