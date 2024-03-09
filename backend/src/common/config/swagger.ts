import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function configSwagger(app: any) {
  // if (process.env.NODE_ENV !== 'development') return;

  const configSwagger = new DocumentBuilder()
    .setTitle('Documentação API Zapdiviser')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger, {});
  SwaggerModule.setup('api', app, document);
}
