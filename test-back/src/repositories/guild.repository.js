const pool = require('../db/db');
const { log, utils } = require('../utils/utils');

class GuildRepository {
  // 유저정보 조회
  async getUserList() {
    const conn = await pool.getConnection();
    let query = `SELECT u.id,
                        u.username,
                        u.lv,
                        u.remarks
                   FROM users u
                  WHERE 1=1
                  ORDER BY username ASC`;

    const rows = await conn.query(query);
    conn.release();
    return rows;
  }

  // 유저정보 조회 (공성전)
  async getUserListSiege(searchOptions) {
    const conn = await pool.getConnection();
    let query = `SELECT u.id,
                        u.username,
                        u.lv,
                        s.remarks,
                        DAYNAME(DATE(?)) AS dayofweek,
                        s.score
                   FROM users u
                   LEFT JOIN user_siege s
                          ON u.id = s.user_id
                         AND s.std_date = DATE_ADD(DATE(?), INTERVAL -7 DAY)
                  WHERE 1=1
                    AND NOT EXISTS (SELECT 1
                                      FROM user_siege
                                     WHERE user_id = u.id
                                       AND std_date = ?)
                  ORDER BY username ASC`;

    const rows = await conn.query(query, [searchOptions?.stdDate, searchOptions?.stdDate, searchOptions?.stdDate]);
    conn.release();
    return rows;
  }

  // 유저정보 저장
  async saveUser(user) {
    const conn = await pool.getConnection();
    const query = `INSERT INTO users (username, lv, remarks)
                   VALUES (?, ?, ?)
                   ON DUPLICATE KEY UPDATE
                      lv = IF(VALUES(lv) IS NOT NULL, VALUES(lv), lv),
                      remarks = IF(VALUES(remarks) IS NOT NULL, VALUES(remarks), remarks),
                      updated_at = CURRENT_TIMESTAMP;
                  `;
    await conn.query(query, [user.username, user.lv, user.remarks]);
    conn.release();
  }

  // 공성전 점수 저장
  async saveSiege(user) {
    const conn = await pool.getConnection();
    const query = `INSERT INTO user_siege (user_id, std_date, score, remarks)
                   VALUES (?, ?, ?, ?)
                   ON DUPLICATE KEY UPDATE
                      score = IF(VALUES(score) IS NOT NULL, VALUES(score), score),
                      remarks = IF(VALUES(remarks) IS NOT NULL, VALUES(remarks), remarks),
                      updated_at = CURRENT_TIMESTAMP;
                  `;
    await conn.query(query, [user.userId, user.stdDate, user.score, user.remarks]);
    conn.release();
  }
}

module.exports = new GuildRepository();