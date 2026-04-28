import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT) || 10000;

  await app.listen(port, '0.0.0.0'); // 🔥 IMPORTANTE para Render

  console.log('APP RUNNING ON PORT:', port);
}

bootstrap();