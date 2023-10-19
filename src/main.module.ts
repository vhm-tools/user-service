import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from '@infra-common/middlewares';
import { HttpExceptionFilter } from '@infra-common/filters';
import { TransformInterceptor } from '@infra-common/interceptors';
import { MongooseConfigService } from '@infra-common/configs';
import { AuthGuard, ValidationPipe } from '@common';
import {
  AuthModule,
  HealthModule,
  NotificationModule,
  TemplateModule,
} from '@modules';

const modules = [HealthModule, AuthModule, NotificationModule, TemplateModule];

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    ...modules,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
