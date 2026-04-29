import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://prometeo-frontend.onrender.com',
      'http://localhost:5173',
    ],
    credentials: true,
  });

  // 🔥 VALIDACIONES GLOBALES (PASO 3)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();