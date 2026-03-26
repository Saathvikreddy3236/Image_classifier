const AppError = require("../utils/appError");
const { getFileById } = require("../models/fileModel");

async function getFile(req, res, next) {
  try {
    const file = await getFileById(req.params.fileId);
    if (!file) {
      throw new AppError("File not found.", 404);
    }
    res.json({
      file: {
        ...file,
        file_url: `${req.protocol}://${req.get("host")}${file.file_url}`
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getFile };
