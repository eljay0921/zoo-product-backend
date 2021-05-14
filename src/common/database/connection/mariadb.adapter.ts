import { DBOutput } from 'src/common/dtos/output.dto';
import { DB_HOST, DB_PSWD, DB_USER } from '../constants/mariadb.constants';
const mariadb = require('mariadb');

export const getDatabaseName = (userId: string): string => {
  return `ProductManage_${userId}`;
};

export const sendQuery = async (query: string): Promise<DBOutput> => {
  console.log('[# connect] :', query.substring(0, 50));
  const conn = await mariadb.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PSWD,
    multipleStatements: true,
  });

  try {
    const result = await conn.query(query);
    return {
      ok: true,
      result: JSON.parse(JSON.stringify(result)),
    };
  } catch (error) {
    console.log('[# Error] mariadb.adapter => sendQuery :', error);
    return {
      ok: false,
      error,
    };
  } finally {
    if (conn) {
      conn.close();
      console.log('[# closed]');
    }
  }
};