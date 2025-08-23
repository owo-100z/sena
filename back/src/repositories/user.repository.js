const pool = require('../db/db');
const { log } = require('../utils/utils');

class UserRepository {
  // 유저정보 조회
  async getUserList(searchOptions) {
    const conn = await pool.getConnection();
    let query = `SELECT s.id,
                        u.username,
                        DAYNAME(s.std_date) AS day_of_the_week,
                        s.std_date,
                        CASE WHEN COALESCE(s.score, 0) = 0 THEN '미참여'
                             ELSE CONCAT(FORMAT(s.score, 0), '점')
                        END AS score,
                        s.remarks
                     FROM users u
                     JOIN user_siege s
                       ON u.username = s.username
                    WHERE 1=1`;
    if (searchOptions.username) {
      query += ` AND u.username = '${searchOptions.username}'`;  
    }

    if (searchOptions.fr_dt && searchOptions.to_dt) {
      query += ` AND s.std_date BETWEEN '${searchOptions.fr_dt}' AND '${searchOptions.to_dt}'`;
    } else {
      query += `
        AND s.std_date BETWEEN 
            DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)  -- 이번 주 월요일
        AND DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY)  -- 이번 주 일요일
      `;
    }
    query + `ORDER BY s.std_date DESC, u.username ASC;`;

    const rows = await conn.query(query);
    conn.release();
    return rows;
  }

  // 유저정보 저장
  async saveUser(user) {
    const conn = await pool.getConnection();
    const query = `INSERT INTO users (username, remarks)
                   VALUES (?, ?)
                   ON DUPLICATE KEY UPDATE
                      remarks = IF(VALUES(remarks) IS NOT NULL, VALUES(remarks), remarks),
                      updated_at = CURRENT_TIMESTAMP;
                  `;
    await conn.query(query, [user.username, user.remarks]);
    conn.release();
  }

  // 공성전 점수 저장
  async saveUserScore(user) {
    const conn = await pool.getConnection();
    const query = `INSERT INTO user_siege (username, std_date, score, remarks)
                   VALUES (?, ?, ?, ?)
                   ON DUPLICATE KEY UPDATE
                      score       = IF(VALUES(score) IS NOT NULL, VALUES(score), score),
                      remarks     = IF(VALUES(remarks) IS NOT NULL, VALUES(remarks), remarks),
                      updated_at  = CURRENT_TIMESTAMP;
                  `;
    await conn.query(query, [user.username, user.std_date, user.score, user.remarks]);
    conn.release();
  }

  // 공성전 점수 삭제
  async deleteUserScore(id) {
    const conn = await pool.getConnection();
    const query = `DELETE FROM user_siege WHERE id = ?;`;
    await conn.query(query, [id]);
    conn.release();
  }
}

module.exports = new UserRepository();