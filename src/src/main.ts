import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as exphbs from 'express-handlebars';
import * as cookieParser from 'cookie-parser';
import { HandlebarsHelpers } from './handlebars-helper/handlebars-helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({});

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

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
      },
    }),
  );

  app.use(cookieParser());
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
