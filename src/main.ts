import { NestFactory } from '@nestjs/core';
import {
  Logger,
  RequestMethod,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { MainModule } from './main.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import env from '@environments';
import { NodeEnv } from '@enums';
import { setupSwagger } from '@configs';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.use(cookieParser(env.AUTH_SECRET));

  if (env.NODE_ENV === NodeEnv.PRODUCTION) {
    app.use(
      helmet({
        frameguard: {
          action: 'deny',
        },
        hidePoweredBy: true,
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'none'"],
            scriptSrc: ["'none'"],
            requireTrustedTypesFor: ["'script'"],
          },
        },
      }),
    );
    app.enableCors({
      origin: env.CORS_ORIGINS?.split('|'),
    });
  }

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: 'health/(.*)',
        method: RequestMethod.GET,
      },
      {
        path: 'auth/github(.*)',
        method: RequestMethod.GET,
      },
      {
        path: 'auth/logout',
        method: RequestMethod.GET,
      },
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  setupSwagger(app);

  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [env.RABBITMQ_URL],
  //     queue: env.RABBITMQ_QUEUE,
  //     prefetchCount: 1,
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });

  // await app.startAllMicroservices();
  await app.listen(env.PORT);

  Logger.log(`🚀  Server is listening on port ${env.PORT}`, 'Bootstrap');
}
bootstrap();
