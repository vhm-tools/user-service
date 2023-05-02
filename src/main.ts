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
import { setupSwagger } from '@configs';
import { getLogsLevel, isProduction, runInCluster } from '@utils';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    logger: getLogsLevel(),
  });

  app.use(cookieParser(env.AUTH_SECRET));

  if (isProduction) {
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
        path: 'auth/(.*)',
        method: RequestMethod.ALL,
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

runInCluster(bootstrap);
