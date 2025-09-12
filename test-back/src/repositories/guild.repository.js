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

  // 유저정보 삭제
  async deleteUser(id) {
    const conn = await pool.getConnection();
    const query = `DELETE FROM users WHERE id = ?;`;
    await conn.query(query, [id]);
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

  // 공성전 점수 삭제
  async deleteSiege(id) {
    const conn = await pool.getConnection();
    const query = `DELETE FROM user_siege WHERE id = ?;`;
    await conn.query(query, [id]);
    conn.release();
  }

  // 공성전 점수 대시보드
  async selectSiegeSummaryDashboard(std_dt) {
    const conn = await pool.getConnection();
    const query = `SELECT COALESCE(MAX(COALESCE(score, 0)), 0) as high_score
                        , COALESCE(MIN(CASE WHEN score = 0 THEN 99999999 ELSE COALESCE(score, 99999999) END), 0) as row_score
                        , COUNT(CASE WHEN score = 0 THEN NULL ELSE score END) as played
                        , COUNT(DISTINCT user_id) as players
                        , COALESCE(SUM(COALESCE(score, 0)), 0) as total_score
                        , (SELECT COALESCE(SUM(COALESCE(score, 0)), 0)
                             FROM user_siege
                            WHERE std_date = DATE_FORMAT(DATE_ADD(DATE(?), INTERVAL -7 DAY), '%Y%m%d')) as pre_total_score
                     FROM user_siege
                    WHERE std_date = ?`;
    const rows = await conn.query(query, [std_dt, std_dt]);

    const result = rows.map(row => ({
      high_score: row.high_score.toString(),
      row_score: row.row_score.toString(),
      played: row.played.toString(),
      players: row.players.toString(),
      total_score: row.total_score.toString(),
      pre_total_score: row.pre_total_score.toString(),
      diff_score: (row.total_score - row.pre_total_score).toString(),
    }));

    conn.release();
    return result;
  }

  // 공성전 점수 리스트
  async selectSiegeSummaryList(std_dt) {
    const conn = await pool.getConnection();
    const query = `SELECT u.username
                        , u.lv
                        , COALESCE(pre.score, 0) as pre_score
                        , COALESCE(s.score, 0) as cur_score
                        , CASE WHEN s.score IS NULL THEN 0
                               WHEN COALESCE(s.score, 0) - COALESCE(pre.score, 0) = COALESCE(s.score, 0) THEN 0
                               ELSE COALESCE(s.score, 0) - COALESCE(pre.score, 0)
                           END AS diff_score
                        , (SELECT COUNT(1)
                             FROM user_siege
                            WHERE std_date BETWEEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL WEEKDAY(NOW()) DAY), '%Y%m%d')
                                               AND DATE_FORMAT(DATE_ADD(DATE_SUB(DATE(NOW()), INTERVAL WEEKDAY(DATE(NOW())) DAY), INTERVAL 6 DAY), '%Y%m%d')
                              AND score = 0
                              AND user_id = u.id) AS no_play
                     FROM users u
                     LEFT JOIN user_siege s
                       ON (s.std_date = ?
                          AND u.id = s.user_id)
                     LEFT JOIN user_siege pre
                       ON (pre.std_date = DATE_FORMAT(DATE_ADD(DATE(?), INTERVAL -7 DAY), '%Y%m%d')
                           AND u.id = pre.user_id)
                    ORDER BY s.score DESC, u.username`;
    const rows = await conn.query(query, [std_dt, std_dt]);

    const result = rows.map(row => ({
      ...row,
      lv: row.lv?.toString(),
      pre_score: row.pre_score?.toString(),
      cur_score: row.cur_score?.toString(),
      diff_score: row.diff_score?.toString(),
      no_play: row.no_play?.toString()
    }));

    conn.release();
    return result;
  }
}

module.exports = new GuildRepository();