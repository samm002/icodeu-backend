import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as methodOverride from 'method-override';
import { join } from 'path';
import * as passport from 'passport';

import { AppModule } from './app.module';
import { closeRedisClient, redisStore } from './common/utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  app.setGlobalPrefix('/api/v1', { exclude: ['admin(.*)'] });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');

  app.enableCors({ credentials: true });
  app.use(
    session({
      store: redisStore,
      secret: configService.get('SESSION_SECRET'),
      cookie: { maxAge: Number(configService.get('SESSION_EXPIRE')) },
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(methodOverride('_method'));
  app.useGlobalPipes(new ValidationPipe());

  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(app.get(Reflector), {
  //     // strategy: 'excludeAll', 👈 we'll talk about this later
  //   }),
  // );

  const config = new DocumentBuilder()
    .setTitle('IcodeU API v1.0')
    .setDescription('IcodeU API v1.0 documentation')
    .setVersion('1.0')
    .addTag('icodeu')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(port, async () => {
    console.log(`API is running on: ${await app.getUrl()}`);
  });

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
