const pool = require('../db/db');
const { log } = require('../utils/utils');

class GuildRepository {
  // 유저정보 조회
  async getUserList(searchOptions) {
    const conn = await pool.getConnection();
    let query = `SELECT id,
                        username,
                        level,
                        remarks
                   FROM users
                  WHERE 1=1
                 ORDER BY username ASC`;

    const rows = await conn.query(query);
    conn.release();
    return rows;
  }

  // 유저정보 저장
  async saveUser(user) {
    const conn = await pool.getConnection();
    const query = `INSERT INTO users (username, level, remarks)
                   VALUES (?, ?, ?)
                   ON DUPLICATE KEY UPDATE
                      level = IF(VALUES(level) IS NOT NULL, VALUES(level), level),
                      remarks = IF(VALUES(remarks) IS NOT NULL, VALUES(remarks), remarks),
                      updated_at = CURRENT_TIMESTAMP;
                  `;
    await conn.query(query, [user.username, user.level, user.remarks]);
    conn.release();
  }
}

module.exports = new GuildRepository();