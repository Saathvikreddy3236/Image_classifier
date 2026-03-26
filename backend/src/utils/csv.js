const { stringify } = require("csv-stringify/sync");

function annotationsToCsv(rows) {
  return stringify(rows, {
    header: true,
    columns: ["file_id", "class_id", "x_min", "y_min", "width", "height"]
  });
}

module.exports = { annotationsToCsv };
