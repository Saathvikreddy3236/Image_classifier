const db = require("../config/db");

async function createFile(folderId, fileName, fileUrl) {
  const result = await db.query(
    "INSERT INTO files (folder_id, object_count, file_name, file_url) VALUES ($1, 0, $2, $3) RETURNING *",
    [folderId, fileName, fileUrl]
  );
  return result.rows[0];
}

async function getFilesByFolder(folderId) {
  const result = await db.query("SELECT * FROM files WHERE folder_id = $1 ORDER BY file_id DESC", [folderId]);
  return result.rows;
}

async function getFileById(fileId) {
  const result = await db.query("SELECT * FROM files WHERE file_id = $1", [fileId]);
  return result.rows[0];
}

async function setObjectCount(fileId, count) {
  await db.query("UPDATE files SET object_count = $1 WHERE file_id = $2", [count, fileId]);
}

module.exports = { createFile, getFilesByFolder, getFileById, setObjectCount };
