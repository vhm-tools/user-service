import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseLogger, SnakeCaseNamingStrategy } from '@infra-common/helpers';
import env from '@environments';

const {
  DB_LOGGING,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} = env;

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: +POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [`dist/**/entities/*.entity{.ts,.js}`],
  namingStrategy: new SnakeCaseNamingStrategy(),
  migrationsTableName: '__migrations',
  migrations: [`dist/**/migrations/*.ts`, `migrations/*.ts`],
  logger: new DatabaseLogger(),
  logging: DB_LOGGING === 'true',
};

export default new DataSource(dataSourceOptions);
