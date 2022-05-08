import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors();
  // Implements validation globally
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Coiffure api')
    .setDescription('This api was developped by wedevin')
    .setVersion('1.0')
    .addBearerAuth({type: 'http', scheme: 'bearer'})
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port, () => {console.info(`Àpplication listening on http://localhost:${port}/api`)});
}
bootstrap();
