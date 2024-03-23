import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import configSwagger from './common/config/swagger';
import { HttpExceptionFilter } from './common/exceptions/HttpExceptionFilter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import configSwagger from './common/config/swagger';
import './common/commands/create-database';
import configBullBoard from './common/config/bull-board';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  configBullBoard(app);
  configSwagger(app);

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
