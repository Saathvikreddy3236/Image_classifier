const db = require("../config/db");

async function createProject(userId, projectName) {
  const result = await db.query(
    "INSERT INTO project (user_id, project_name, folder_id) VALUES ($1, $2, NULL) RETURNING *",
    [userId, projectName]
  );
  return result.rows[0];
}

async function getProjectsByUser(userId) {
  const result = await db.query("SELECT * FROM project WHERE user_id = $1 ORDER BY project_id DESC", [userId]);
  return result.rows;
}

async function getProjectById(projectId, userId) {
  const result = await db.query(
    "SELECT * FROM project WHERE project_id = $1 AND user_id = $2",
    [projectId, userId]
  );
  return result.rows[0];
}

async function linkFolderToProject(projectId, folderId) {
  const result = await db.query(
    "UPDATE project SET folder_id = $1 WHERE project_id = $2 RETURNING *",
    [folderId, projectId]
  );
  return result.rows[0];
}

module.exports = { createProject, getProjectsByUser, getProjectById, linkFolderToProject };
