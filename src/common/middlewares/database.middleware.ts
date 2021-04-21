import { Injectable, NestMiddleware } from '@nestjs/common';
import { getConnection, createConnection, ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_PORT, DB_PSWD, DB_USER } from '../database/mariadb-constants';
import { CustomNamingStrategy } from '../typeorm/custom-naming-strategy';

@Injectable()
export class DatabaseMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const userId = req.headers['user-id'];
    if (userId) {
      const databaseName = `ProductManage_${req.headers['user-id']}`;
      const connection: ConnectionOptions = {
        type: 'mysql',
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PSWD,
        database: databaseName,
        name: databaseName,
        synchronize: true,
        logging: false,
        namingStrategy: new CustomNamingStrategy(),
        entities: [
          'dist/**/entities/*.entity{.ts,.js}',
          'src/**/entities/*.entity{.ts}',
        ],
      };

      try {
        // set graphql context 'dbname'
        req.dbname = databaseName;
        // console.log('Middleware : ', req.dbname);
        getConnection(connection.name);
      } catch (error) {
        await createConnection(connection);
      }
    } else {
      req.dbname = undefined;
    }

    next();
  }
}
