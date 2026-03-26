const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const {
  listByFile,
  addAnnotation,
  autosave,
  removeAnnotation,
  exportCsv,
  exportClassesTxt
} = require("../controllers/annotationController");

const router = express.Router();

router.use(authenticate);
router.get("/file/:fileId", listByFile);
router.post("/", addAnnotation);
router.put("/file/:fileId/autosave", autosave);
router.delete("/file/:fileId/:classId/:index", removeAnnotation);
router.get("/export/:projectId", exportCsv);
router.get("/export/:projectId/classes", exportClassesTxt);

module.exports = router;
