import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/api/uploads',
  });

  // Enable CORS with environment-specific options
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
    ].filter(Boolean), // Removes undefined/null if FRONTEND_URL isn't set
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // optional: strips unwanted properties
      forbidNonWhitelisted: false, // optional: avoids throwing if extra fields are passed
    }),
  );

  // Apply global transform interceptor for standardized response format
  app.useGlobalInterceptors(new TransformInterceptor());
  
  
  // Swagger configuration for non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Tasty Trail - API Documentation')    
      .setDescription('The MM Tasty -> prepared by Next IT Myanmar.')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Cuisines', 'Cuisine management endpoints')
      .addTag('currency', 'Currency rate management endpoints')
      .addTag('Newsletter', 'Newsletter subscription management endpoints')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customCssUrl: 'https://fonts.googleapis.com/css2?family=Poppins&display=swap',
      customCss: `
        * {
          font-family: 'Poppins', sans-serif !important;
        }
          .topbar{
          display: none;
          }
          .info{
              background: #FFEB3B;
              padding: 27px;
              border-radius: 14px;
          }
      `,
    });
  }

  // Use environment port or default to 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
