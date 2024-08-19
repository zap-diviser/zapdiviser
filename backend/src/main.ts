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
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import yaml from 'yaml';
import { writeFile } from 'fs/promises';

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
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
      rawBody: true,
      bodyParser: true,
    },
  );

  const apiConfig = new DocumentBuilder()
    .setTitle("Zapdiviser")
    .setDescription("API para o Zapdiviser")
    .setVersion("1.0")
    .build();

  let document = SwaggerModule.createDocument(app, apiConfig);

  const yamlDocument = yaml.stringify(document);

  await writeFile('openapi.yaml', yamlDocument);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('preParsing', (request, reply, payload, done) => {
      if (
        ['POST', 'DELETE'].includes(request.method) &&
        request.headers['content-type'] == 'application/json' &&
        request.headers['content-length'] == '0'
      ) {
        delete request.headers['content-type'];
      }

      done();
    });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  configBullBoard(app);
  configSwagger(app);

  await app.listen(8000, '0.0.0.0');
}

bootstrap();
