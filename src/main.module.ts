import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard, ValidationPipe } from '@common';
import { LoggerMiddleware } from '@infra-common/middlewares';
import { HttpExceptionFilter } from '@infra-common/filters';
import { TransformInterceptor } from '@infra-common/interceptors';
import { TypeOrmConfigService } from '@infra-common/configs';
import {
  AuthModule,
  HealthModule,
  NotificationModule,
  TemplateModule,
} from '@modules';

const modules = [HealthModule, AuthModule, NotificationModule, TemplateModule];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
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
