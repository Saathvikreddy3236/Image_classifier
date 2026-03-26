const AppError = require("../utils/appError");
const { getFilesByFolder } = require("../models/fileModel");
const { createProject, getProjectsByUser, getProjectById } = require("../models/projectModel");

async function listProjects(req, res, next) {
  try {
    const projects = await getProjectsByUser(req.user.user_id);
    res.json({ projects });
  } catch (error) {
    next(error);
  }
}

async function addProject(req, res, next) {
  try {
    const projectName = req.body.projectName?.trim();
    if (!projectName) {
      throw new AppError("Project name is required.");
    }

    const project = await createProject(req.user.user_id, projectName);
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await getProjectById(req.params.projectId, req.user.user_id);
    if (!project) {
      throw new AppError("Project not found.", 404);
    }

    const files = project.folder_id ? await getFilesByFolder(project.folder_id) : [];
    const normalizedFiles = files.map((file) => ({
      ...file,
      file_url: `${req.protocol}://${req.get("host")}${file.file_url}`
    }));
    res.json({ project, files: normalizedFiles });
  } catch (error) {
    next(error);
  }
}

module.exports = { listProjects, addProject, getProject };
