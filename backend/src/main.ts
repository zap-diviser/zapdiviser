import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import configSwagger from './common/config/swagger';
import { HttpExceptionFilter } from './common/exceptions/HttpExceptionFilter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import cors from 'cors';
import configSwagger from './common/config/swagger';
import './common/commands/create-database';
import configBullBoard from './common/config/bull-board';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  configBullBoard(app);
  configSwagger(app);

  app.use(
    cors({
      origin: '*',
    }),
  );

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
