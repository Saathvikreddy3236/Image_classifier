const { getClassesByProject, createClass, deleteClass } = require("../models/classModel");

async function listClasses(req, res, next) {
  try {
    const classes = await getClassesByProject(req.params.projectId);
    res.json({ classes });
  } catch (error) {
    next(error);
  }
}

async function addClass(req, res, next) {
  try {
    const created = await createClass(req.body.projectId, req.body.className);
    res.status(201).json({ class: created });
  } catch (error) {
    next(error);
  }
}

async function removeClass(req, res, next) {
  try {
    await deleteClass(req.body.projectId, req.params.classId);
    res.json({ message: "Class deleted." });
  } catch (error) {
    next(error);
  }
}

module.exports = { listClasses, addClass, removeClass };
