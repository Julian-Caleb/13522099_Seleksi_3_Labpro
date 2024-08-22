import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as exphbs from 'express-handlebars';
import * as cookieParser from 'cookie-parser';
import { HandlebarsHelpers } from './handlebars-helper/handlebars-helper';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({});

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  const config = new DocumentBuilder()
    .setTitle('Film Catalogue\'s API')
    .setDescription('List of all API Endpoints made for the Film Catalogue app.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  
  app.engine(
    'hbs',
    exphbs.engine({
      extname: 'hbs',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views', 'partials'),
      helpers: {
        eq: HandlebarsHelpers.eq,
        gt: HandlebarsHelpers.gt,
        lt: HandlebarsHelpers.lt,
        add: HandlebarsHelpers.add,
        subtract: HandlebarsHelpers.subtract,
        range: HandlebarsHelpers.range,
        not: HandlebarsHelpers.not,
      },
    }),
  );

  app.use(cookieParser());
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
