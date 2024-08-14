import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const path = process.env.MONGODB_URI?.split('@')[1];
  Logger.log(`ENV: ${process.env.NODE_ENV}`, 'Init');
  Logger.log(
    `🚀 Application is running on: http://localhost:${process.env.SERVER_PORT}`,
    'Init',
  );
  Logger.log(`📦 Connected to MongoDB at: ${path}`, 'Init');
  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
