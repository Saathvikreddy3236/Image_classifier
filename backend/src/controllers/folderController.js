const fs = require("fs");
const path = require("path");
const AppError = require("../utils/appError");
const { createFolder, updateFolderPrimaryFile } = require("../models/folderModel");
const { createFile } = require("../models/fileModel");
const { getProjectById, linkFolderToProject } = require("../models/projectModel");

async function uploadFolder(req, res, next) {
  try {
    const { projectId } = req.body;
    const project = await getProjectById(projectId, req.user.user_id);
    if (!project) {
      throw new AppError("Project not found.", 404);
    }

    if (!req.files?.length) {
      throw new AppError("At least one image is required.");
    }

    const uploadRoot = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadRoot)) {
      fs.mkdirSync(uploadRoot, { recursive: true });
    }

    const folder = await createFolder(req.files[0].originalname);
    const createdFiles = [];

    for (const file of req.files) {
      const fileUrl = `/uploads/${file.filename}`;
      const created = await createFile(folder.folder_id, file.originalname, fileUrl);
      createdFiles.push(created);
    }

    if (createdFiles[0]) {
      await updateFolderPrimaryFile(folder.folder_id, createdFiles[0].file_id);
    }

    await linkFolderToProject(projectId, folder.folder_id);
    res.status(201).json({ folder, files: createdFiles });
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadFolder };
