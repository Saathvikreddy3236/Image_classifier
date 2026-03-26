const { annotationsToCsv } = require("../utils/csv");
const { setObjectCount } = require("../models/fileModel");
const {
  listAnnotationsByFile,
  createAnnotation,
  replaceAnnotations,
  deleteAnnotation,
  exportProjectAnnotations
} = require("../models/annotationModel");

async function listByFile(req, res, next) {
  try {
    const annotations = await listAnnotationsByFile(req.params.fileId);
    res.json({ annotations });
  } catch (error) {
    next(error);
  }
}

async function addAnnotation(req, res, next) {
  try {
    const annotations = await createAnnotation(req.body.class_id, req.body.fileId, req.body.coordinates);
    await setObjectCount(req.body.fileId, annotations.length);
    res.status(201).json({ annotations });
  } catch (error) {
    next(error);
  }
}

async function autosave(req, res, next) {
  try {
    const annotations = await replaceAnnotations(req.params.fileId, req.body.annotations || []);
    await setObjectCount(req.params.fileId, annotations.length);
    res.json({ annotations, message: "Autosaved" });
  } catch (error) {
    next(error);
  }
}

async function removeAnnotation(req, res, next) {
  try {
    const annotations = await deleteAnnotation(req.params.fileId, req.params.classId, req.params.index);
    await setObjectCount(req.params.fileId, annotations.length);
    res.json({ annotations });
  } catch (error) {
    next(error);
  }
}

async function exportCsv(req, res, next) {
  try {
    const rows = await exportProjectAnnotations(req.params.projectId);
    const csv = annotationsToCsv(rows);
    const summary = {
      annotationCount: rows.length,
      fileCount: new Set(rows.map((row) => row.file_id)).size,
      classCount: new Set(rows.map((row) => row.class_id)).size
    };

    if (req.query.download === "true") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="project-${req.params.projectId}-annotations.csv"`);
      return res.send(csv);
    }

    res.json({ rows, summary });
  } catch (error) {
    next(error);
  }
}

module.exports = { listByFile, addAnnotation, autosave, removeAnnotation, exportCsv };
