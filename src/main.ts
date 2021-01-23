import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = 3000
  await app.listen(port);
  app.enableCors();
  logger.log(`application listening on port ${port}`)
}
bootstrap();
