import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimeoutGlobalInterceptor } from './common/interceptors/timeout-global-interceptor';
import { urlencoded, json } from 'express';
import { DatabaseGuard } from './common/guards/database.guard';
import { DatabaseMiddleware } from './common/middlewares/database.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(new DatabaseMiddleware().use);
  // app.useGlobalGuards(new DatabaseGuard());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalInterceptors(new TimeoutGlobalInterceptor());

  await app.listen(3000);
}
bootstrap();
