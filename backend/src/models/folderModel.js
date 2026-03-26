const db = require("../config/db");

async function createFolder(fileName) {
  const result = await db.query(
    "INSERT INTO folder (file_id, file_name) VALUES (NULL, $1) RETURNING *",
    [fileName]
  );
  return result.rows[0];
}

async function updateFolderPrimaryFile(folderId, fileId) {
  const result = await db.query(
    "UPDATE folder SET file_id = $1 WHERE folder_id = $2 RETURNING *",
    [fileId, folderId]
  );
  return result.rows[0];
}

module.exports = { createFolder, updateFolderPrimaryFile };
