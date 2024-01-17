import { database } from "../services/mysql.js";

export const Token = {
  clearAll: async function (userId) {
    const [result] = await database.pool.query(
      `
          DELETE FROM tokens 
          WHERE userId = ?
          `,
      [userId]
    );

    return result.affectedRows;
  },
  findByUserId: async function (userId) {
    const [rows] = await database.pool.query(
      `
            SELECT id, value 
            FROM tokens 
            WHERE userId = ?
      `,
      [userId]
    );

    return rows.map((item) => {
      return {
        id: item.id,
        value: item.value,
      };
    });
  },
};
