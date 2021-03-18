import { Injectable, NestMiddleware } from '@nestjs/common';
import { getConnection, createConnection, ConnectionOptions } from 'typeorm';

@Injectable()
export class DatabaseMiddleware implements NestMiddleware {
  public static DBName = 'zooprdnm';
  async use(req: any, res: any, next: () => void) {
    const databaseName = req.headers[DatabaseMiddleware.DBName];
    const connection: ConnectionOptions = {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mmaria',
      database: databaseName,
      name: databaseName,
      synchronize: false,
      logging: false,
      entities: [
        'dist/**/entities/*.entity{.ts,.js}',
        'src/**/entities/*.entity{.ts}',
      ],
    };

    try {
      getConnection(connection.name);
    } catch (error) {
      await createConnection(connection);
    }

    next();
  }
}
