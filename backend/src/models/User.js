import pkg from "bcryptjs";
const { hash, compare } = pkg;
import { query, getRow, getRows } from "../utils/database.js";

class User {
  static async create({ email, password, name }) {
    const hashedPassword = await hash(password, 12);

    const sql = `
      INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING id, email, name, created_at
    `;

    const result = await query(sql, [email, hashedPassword, name]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const sql = `
      SELECT id, email, password, name, created_at
      FROM users
      WHERE email = $1
    `;

    return await getRow(sql, [email]);
  }

  static async findById(id) {
    const sql = `
      SELECT id, email, name, created_at
      FROM users
      WHERE id = $1
    `;

    return await getRow(sql, [id]);
  }

  static async update(id, updates) {
    const allowedFields = ["name", "email"];
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const [field, value] of Object.entries(updates)) {
      if (allowedFields.includes(field)) {
        updateFields.push(`${field} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error("No valid fields to update");
    }

    values.push(id);
    const sql = `
      UPDATE users
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, email, name, created_at, updated_at
    `;

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async delete(id) {
    const sql = "DELETE FROM users WHERE id = $1 RETURNING id";
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async validatePassword(password, hashedPassword) {
    return await compare(password, hashedPassword);
  }

  static async hashPassword(password) {
    return await hash(password, 12);
  }

  static async getAll() {
    const sql = `
      SELECT id, email, name, created_at
      FROM users
      ORDER BY created_at DESC
    `;

    return await getRows(sql);
  }

  static async exists(email) {
    const sql = "SELECT 1 FROM users WHERE email = $1";
    const result = await query(sql, [email]);
    return result.rows.length > 0;
  }
}

export default User;
