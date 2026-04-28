import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  const port = process.env.PORT || 10000;

  await app.init();
  server.listen(port, '0.0.0.0', () => {
    console.log('APP RUNNING ON PORT:', port);
  });
}

bootstrap();