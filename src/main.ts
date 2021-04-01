import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseGuard } from './common/guards/database.guard';
import { TimeoutGlobalInterceptor } from './common/interceptors/timeout-global-interceptor';
import { DatabaseMiddleware } from './common/middlewares/database.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new DatabaseMiddleware().use);
  app.useGlobalGuards(new DatabaseGuard());
  app.useGlobalInterceptors(new TimeoutGlobalInterceptor());

  await app.listen(3000);
}
bootstrap();
