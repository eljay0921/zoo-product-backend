import { Injectable, NestMiddleware } from '@nestjs/common';
import { getConnection, createConnection, ConnectionOptions } from 'typeorm';

@Injectable()
export class DatabaseMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {

    const userId = req.headers['user-id'];
    if (userId) {
      const databaseName = `ProductManage_${req.headers['user-id']}`;
      const connection: ConnectionOptions = {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'mmaria',
        database: databaseName,
        name: databaseName,
        synchronize: true,
        logging: false,
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
