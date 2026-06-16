import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Áp dụng Global Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Áp dụng ValidationPipe toàn cục
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('AI Mô Phỏng Backend API')
    .setDescription('Tài liệu API cho hệ thống AI Mô Phỏng')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger is available at: http://localhost:${port}/api`);
}
bootstrap();
