import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as os from 'os';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  corsList,
  expiresAccessToken,
  expiresRefreshToken,
  msecToMinute,
  msecToSecond, startDisplay
} from './configs/appConfigs';

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || corsList.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle(startDisplay.setTitle)
    .setDescription(startDisplay.setDescription)
    .setVersion(startDisplay.setVersion)
    .addTag(startDisplay.addTag)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.NODE_PORT);

  console.log(`\nServer is running on: ${await app.getUrl()}`);
  console.log('\nCounts of processors:', os.cpus().length);
  console.log('\nCORS List:', JSON.stringify(corsList, null, 2));
  console.log(
    `\nTokens expires:\n  access = ${msecToSecond(
      expiresAccessToken,
    )}s (${msecToMinute(expiresAccessToken)}m)\n  refresh: ${msecToSecond(
      expiresRefreshToken,
    )}s (${msecToMinute(expiresRefreshToken)}m)`,
  );
}

bootstrap();
