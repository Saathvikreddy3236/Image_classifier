const db = require("../config/db");

async function findUserByName(name) {
  const result = await db.query("SELECT * FROM \"user\" WHERE name = $1 LIMIT 1", [name]);
  return result.rows[0];
}

async function createUser(name, passwordHash) {
  const result = await db.query(
    "INSERT INTO \"user\" (name, password_hash) VALUES ($1, $2) RETURNING user_id, name",
    [name, passwordHash]
  );
  return result.rows[0];
}

module.exports = { findUserByName, createUser };
