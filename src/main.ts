import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config/dist';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(
    cookieSession({
      keys: ['radmehr'],
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //   const options = new DocumentBuilder()
  //   .setTitle('Simcart')
  //   .setDescription('Simcart back-end Application')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      // Do not allow add additional property
      whitelist: true,
    }),
  );

  const port = configService.get<number>('PORT');

  await app.listen(port);
}
bootstrap();
