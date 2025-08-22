const pool = require('../db/db');

class UserRepository {
  /*
  async saveStation(station) {
    const conn = await pool.getConnection();
    const query = `INSERT INTO subway_stations (bldn_id, bldn_nm, route, lat, lot)
                   VALUES (?, ?, ?, ?, ?)
                   ON DUPLICATE KEY UPDATE
                   bldn_id = VALUES(bldn_id),
                   bldn_nm = VALUES(bldn_nm)`;
    await conn.query(query, [station.BLDN_ID, station.BLDN_NM, station.ROUTE, station.LAT, station.LOT]);
    conn.release();
  }
  */
}

module.exports = new UserRepository();