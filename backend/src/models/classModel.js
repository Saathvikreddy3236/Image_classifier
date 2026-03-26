const db = require("../config/db");

async function getClassesByProject(projectId) {
  const result = await db.query(
    "SELECT project_id, class_id, className FROM classes WHERE project_id = $1 ORDER BY class_id ASC",
    [projectId]
  );
  return result.rows;
}

async function createClass(projectId, className) {
  const result = await db.query(
    "INSERT INTO classes (project_id, className) VALUES ($1, $2) RETURNING *",
    [projectId, className]
  );
  return result.rows[0];
}

async function deleteClass(projectId, classId) {
  await db.query("DELETE FROM classes WHERE project_id = $1 AND class_id = $2", [projectId, classId]);
}

module.exports = { getClassesByProject, createClass, deleteClass };
