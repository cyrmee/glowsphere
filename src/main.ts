import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this is to filter elements that are passed through the body which are not in out dto
    }),
  ); // we use this pipe for validation of data in request body. ( while using dto classes in controller methods and we need to class-validator and class-transformer in order to use it)
  await app.listen(5000);
}
bootstrap();
