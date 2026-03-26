const db = require("../config/db");

async function findUserByName(name) {
  const result = await db.query("SELECT * FROM \"user\" WHERE name = $1 LIMIT 1", [name]);
  return result.rows[0];
}

async function createUser(name) {
  const result = await db.query(
    "INSERT INTO \"user\" (name) VALUES ($1) RETURNING user_id, name",
    [name]
  );
  return result.rows[0];
}

module.exports = { findUserByName, createUser };
