import { database } from "../services/mysql.js";

export const User = {
  /**
   * This function will add a user to the database given the data
   * @param {object} data User related data
   * @returns newly inserted id
   */
  addOne: async function (data) {
    const [fields, values] = [Object.keys(data), Object.values(data)];

    const columns = fields.join(",");
    const parameter = fields.map((_) => "?").join(",");

    const [result] = await database.pool.query(
      `
        INSERT INTO users(${columns})
        VALUES(${parameter})
      `,
      [...values]
    );

    return result?.insertId;
  },
  /**
   * This function will clear the user refresh token
   * @param {number} id user Id
   * @returns how many rows were affected for that operation
   */
  clearRefreshToken: async function (id) {
    const [result] = await database.pool.query(
      `
        UPDATE users
        set refreshToken = ''
        WHERE id = ?
      `,
      [id]
    );

    return result.affectedRows;
  },
  /**
   * This function will return a list of users from your database
   * @returns a list of users
   */
  findAll: async function () {
    const [rows] = await database.pool.query(`
          SELECT id, firstName, middleName, lastName, email, emailVerifiedAt, userName, createdAt, updatedAt 
          FROM users
        `);

    return rows.map((item) => {
      return {
        id: item.id,
        firstName: item.firstName,
        middleName: item.middleName,
        lastName: item.lastName,
        email: item.email,
        emailVerifiedAt: item.emailVerifiedAt,
        userName: item.userName,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
  },
  /**
   * This function will return users or user by that specified field
   * @param {string} fieldName is the column name for the where clause
   * @param {any} fieldValue is the value to find the user by
   * @param {boolean} all specified if all the records are needed or just the first one.
   * @returns a list of records or the first item based on what all is set
   */
  findByField: async function (fieldName, fieldValue, all = true) {
    const [rows] = await database.pool.query(
      `
          SELECT id, firstName, middleName, lastName, email, emailVerifiedAt, userName, createdAt, updatedAt 
          FROM users 
          WHERE ${fieldName} = ?
          `,
      [fieldValue]
    );

    if (all) {
      return rows.map((item) => {
        return {
          id: item.id,
          firstName: item.firstName,
          middleName: item.middleName,
          lastName: item.lastName,
          email: item.email,
          emailVerifiedAt: item.emailVerifiedAt,
          userName: item.userName,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });
    } else {
      const item = rows[0];

      if (!item) return undefined;

      return {
        id: item.id,
        firstName: item.firstName,
        middleName: item.middleName,
        lastName: item.lastName,
        email: item.email,
        emailVerifiedAt: item.emailVerifiedAt,
        userName: item.userName,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    }
  },
  /**
   * This function will return a user given the refresh token
   * @param {string} refreshToken
   * @returns a user instance
   */
  findByRefreshToken: async function (refreshToken) {
    return this.findByField("refreshToken", refreshToken, false);
  },
  /**
   * This function will return a user given the username
   * @param {string} userName
   * @returns a user instance
   */
  findByUsername: async function (userName) {
    return this.findByField("userName", userName, false);
  },
  /**
   * This function will return a user credential given the username
   * @param {string} username
   * @returns a user credentials information
   */
  findCredentials: async function (userName) {
    return this.findByUsername(userName);
  },
  /**
   * This function will return a user given it's id
   * @param {number} id user Id
   * @returns a user instance
   */
  findOne: async function (id) {
    return this.findByField("id", id);
  },
  /**
   * This function will update the user data given it's username
   * @param {string} username
   * @param {object} data to update the user with
   * @returns the number of affected rows after the update
   */
  updateByUsername: async function (username, data) {
    const user = await this.findByUsername(username);
    if (!user) return 0;
    const affectedRows = await this.updateOne(user.id, data);
    return affectedRows;
  },
  /**
   * This function will update the user given the user Id
   * @param {number} id user Id
   * @param {object} data to update the user with
   * @returns the number of affecgted rows after the update
   */
  updateOne: async function (id, data, omit = ["id", "userName", "createdAt"]) {
    const user = await this.findOne(id);

    if (!user) return 0;

    // filter the data based on the omit list
    const filteredData = Object.keys(data)
      .filter((key) => !omit.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    //check to see if we have anything to filter
    if (Object.keys(filteredData).length == 0) return 0;

    const [fields, values] = [
      Object.keys(filteredData),
      Object.values(filteredData),
    ];
    const sqlUpdateFragment = fields.map((field) => `${field} = ?`).join(",");

    const [result] = await database.pool.query(
      `
      UPDATE users
      SET ${sqlUpdateFragment}
      WHERE id = ?
    `,
      [...values, id]
    );
    return result.affectedRows;
  },
};
