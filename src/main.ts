import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimeoutGlobalInterceptor } from './common/interceptors/timeout-global-interceptor';
import { urlencoded, json } from 'express';
import * as morgan from 'morgan';
import { DatabaseGuard } from './common/guards/database.guard';
import { DatabaseMiddleware } from './common/middlewares/database.middleware';
import { ValidationPipe } from '@nestjs/common';

const fs = require('fs');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(new DatabaseMiddleware().use);
  // app.useGlobalGuards(new DatabaseGuard());

  morgan.token('body', (req, res) => JSON.stringify(req.body));
  morgan.token('headers', (req, res) => JSON.stringify(req.headers));
  app.use(morgan(':method :url :response-time :headers :body', { 
    skip: ((req, res) => res.statusCode < 400) ,
    stream: fs.createWriteStream('./failed.log', {flags: 'a'})
  }));

  app.useGlobalPipes(new ValidationPipe());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalInterceptors(new TimeoutGlobalInterceptor());

  await app.listen(3000);
}
bootstrap();
