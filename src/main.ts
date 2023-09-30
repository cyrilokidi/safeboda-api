import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors();
  const docConfig = new DocumentBuilder()
    .setTitle('Safeboda Coding Challenge API')
    .setDescription('Safeboda Coding Challenge API Documentation.')
    .setVersion('1.0.0')
    .setContact(
      'Cyril Okidi',
      'https://github.com/cyrilokidi',
      'okidicyril@gmail.com',
    )
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
