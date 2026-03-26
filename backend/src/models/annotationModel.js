const db = require("../config/db");

async function listAnnotationsByFile(fileId) {
  const result = await db.query(
    "SELECT class_id, file_id, coordinates FROM objects WHERE file_id = $1 ORDER BY class_id ASC",
    [fileId]
  );
  return result.rows;
}

async function createAnnotation(classId, fileId, coordinates) {
  await db.query(
    "INSERT INTO objects (class_id, file_id, coordinates) VALUES ($1, $2, $3::jsonb)",
    [classId, fileId, JSON.stringify(coordinates)]
  );
  return listAnnotationsByFile(fileId);
}

async function replaceAnnotations(fileId, annotations) {
  await db.query("DELETE FROM objects WHERE file_id = $1", [fileId]);
  for (const item of annotations) {
    await db.query(
      "INSERT INTO objects (class_id, file_id, coordinates) VALUES ($1, $2, $3::jsonb)",
      [item.class_id, fileId, JSON.stringify(item.coordinates)]
    );
  }
  return listAnnotationsByFile(fileId);
}

async function deleteAnnotation(fileId, classId, index) {
  const current = await listAnnotationsByFile(fileId);
  const filtered = current.filter((annotation, annotationIndex) => {
    return !(annotation.class_id === Number(classId) && annotationIndex === Number(index));
  });
  return replaceAnnotations(fileId, filtered);
}

async function exportProjectAnnotations(projectId) {
  const result = await db.query(
    `SELECT f.file_name,
            f.object_count,
            c.classname AS class_name,
            (o.coordinates->>'x')::numeric AS x_min,
            (o.coordinates->>'y')::numeric AS y_min,
            (o.coordinates->>'width')::numeric AS width,
            (o.coordinates->>'height')::numeric AS height
     FROM objects o
     JOIN files f ON f.file_id = o.file_id
     JOIN classes c ON c.class_id = o.class_id
     JOIN project p ON p.folder_id = f.folder_id
     WHERE p.project_id = $1
     ORDER BY f.file_name ASC`,
    [projectId]
  );
  return result.rows;
}

module.exports = {
  listAnnotationsByFile,
  createAnnotation,
  replaceAnnotations,
  deleteAnnotation,
  exportProjectAnnotations
};
