import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this is to filter elements that are passed through the body which are not in our dto
    }),
  ); // we use this pipe for validation of data in request body. ( while using dto classes in controller methods and we need to class-validator and class-transformer in order to use it)
  const config = new DocumentBuilder()
    .setTitle('Glow Sphere API')
    .setDescription('Swaggers makes my API sphere glow :)')
    .setVersion('1.0')
    .addTag('bookmarks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
