/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  app.enableCors({
    origin: 'http://localhost:4200', // Allow requests from your Angular frontend development server
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Allowed request headers
    credentials: true, // Allow sending of cookies/authorization headers
  });
}
bootstrap();
