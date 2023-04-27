import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeCaseNamingStrategy } from '@utils';
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
  entities: [`${__dirname}/databases/**/entities/*.entity{.ts,.js}`],
  namingStrategy: new SnakeCaseNamingStrategy(),
  migrationsTableName: '__migrations',
  migrations: ['migrations/*.ts'],
  logging: DB_LOGGING === 'true',
};

export default new DataSource(dataSourceOptions);
