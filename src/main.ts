import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this is to filter elements that are passed through the body which are not in our dto
      forbidNonWhitelisted: true, // this is to throw an error if there is any extra element passed through the body.
      transform: true, // this is to transform data types of the request body. (for example, if we pass a number in the body, it will be transformed to a number.)
      transformOptions: { enableImplicitConversion: true }, // this is to enable implicit conversion of data types. (for example, if we pass a string in the body, it will be transformed to a number.)
    }),
  ); // we use this pipe for validation of data in request body. ( while using dto classes in controller methods and we need to class-validator and class-transformer in order to use it)

  const config = new DocumentBuilder()
    .setTitle('Glow Sphere API')
    .setDescription('Swaggers makes my API sphere glow :)')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/api-docs', app, document);

  app.enableCors(
    { origin: '*' }, // : { origin: 'portal.marakiet.com' }, // this is for production
  );

  await app.listen(5000);
}
bootstrap();
