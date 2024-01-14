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
import { runInCluster } from '@utils';
import {
  getLogsLevel,
  isDevelopment,
  isProduction,
} from '@infra-common/helpers';

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
  }

  app.enableCors({
    origin: isProduction ? env.CORS_ORIGINS?.split('|') : env.CLIENT_URL,
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: 'health/(.*)',
        method: RequestMethod.GET,
      },
    ],
  });

  if (isDevelopment) {
    setupSwagger(app);
  }
  await app.listen(env.PORT);

  Logger.log(`🚀  Server is listening on port ${env.PORT}`, 'Bootstrap');
}

runInCluster(bootstrap);
