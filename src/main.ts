import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('');

  const port = Number(process.env.PORT) || 10000;

  await app.listen(port);

  console.log('APP RUNNING ON PORT:', port);
}

bootstrap();