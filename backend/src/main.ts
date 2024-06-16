import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import configSwagger from './common/config/swagger';
import { HttpExceptionFilter } from './common/exceptions/HttpExceptionFilter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import configSwagger from './common/config/swagger';
import './common/commands/create-database';
import configBullBoard from './common/config/bull-board';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import Promise from 'bluebird';
import * as bodyParser from 'body-parser';

process.on('unhandledRejection', (e) => {
  console.log(e);
});

process.on('unhandledException', (e) => {
  console.log(e);
});

// @ts-expect-error promise type
globalThis.Promise = Promise;
// @ts-expect-error promise type
global.Promise.config({ longStackTraces: true });

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
    bufferLogs: true,
    rawBody: true,
    bodyParser: true,
  });
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  configBullBoard(app);
  configSwagger(app);

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
