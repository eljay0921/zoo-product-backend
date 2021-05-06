import { DB_HOST, DB_PSWD, DB_USER } from '../constants/mariadb.constants';
const mariadb = require('mariadb');

export const getDatabaseName = (userId: string): string => {
  return `ProductManage_${userId}`;
};

export const sendQuery = async (query: string) => {
  const conn = await mariadb.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PSWD,
    multipleStatements: true,
  });

  try {
    const result = await conn.query(query);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.log('[# Error] mariadb.adapter => sendQuery :', error);
  } finally {
    if (conn) {
      conn.close();
    }
  }
};
