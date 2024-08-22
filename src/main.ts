import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { join } from 'path';
import * as passport from 'passport';
import * as methodOverride from 'method-override';

import { AppModule } from './app.module';
import { closeRedisClient, redisStore } from './common/utils';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.setGlobalPrefix('/api/v1', { exclude: ['admin(.*)'] });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: Number(process.env.SESSION_EXPIRE) },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(methodOverride('_method'));

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('IcodeU Endpoint Test')
    .setDescription('IcodeU Endpoint Testing')
    .setVersion('1.0')
    .addTag('icodeu')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  console.log(`API is running on: ${await app.getUrl()}`);

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received.');
    await closeRedisClient();
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received.');
    await closeRedisClient();
    await app.close();
    process.exit(0);
  });
}

bootstrap();
