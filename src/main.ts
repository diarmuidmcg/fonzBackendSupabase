import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const Logger = require('./config/Logger');
globalThis.Logger = Logger;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: '*' });

  app.useLogger(Logger);

  await app.listen(3000);
}
bootstrap();
