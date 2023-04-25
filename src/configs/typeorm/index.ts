import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import env from '@environments';
import { SnakeCaseNamingStrategy } from '@utils';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: env.POSTGRES_HOST,
      port: +env.POSTGRES_PORT,
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
      entities: [`databases/**/entities/*.entity{.ts,.js}`],
      namingStrategy: new SnakeCaseNamingStrategy(),
      autoLoadEntities: true,
      synchronize: false,
      logging: env.DB_LOGGING === 'true',
    };
  }
}
