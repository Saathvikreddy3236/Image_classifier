const { stringify } = require("csv-stringify/sync");

function annotationsToCsv(rows) {
  return stringify(rows, {
    header: true,
    columns: ["file_name", "object_count", "class_name", "x_min", "y_min", "width", "height"]
  });
}

module.exports = { annotationsToCsv };
