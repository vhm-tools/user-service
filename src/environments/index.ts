import { NodeEnv } from '@enums';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  NODE_ENV,
  API_VERSION,
  REQ_LOGGING,
  DB_LOGGING,
  CORS_ORIGINS,
  NOTIFICATION_HOST,
  NOTIFICATION_PORT,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  COOKIE_SECRET,
  BCRYPT_SALT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  RABBITMQ_QUEUE,
  RABBITMQ_URL,
  RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD,
} = process.env;

if (NODE_ENV && !Object.values(NodeEnv).includes(NODE_ENV as NodeEnv)) {
  throw new Error('NODE_ENV must be either test, production or development');
}

if (!CORS_ORIGINS) {
  throw new Error('CORS_ORIGINS is not define');
}

if (!PORT) {
  throw new Error('PORT is not define');
}

if (!NOTIFICATION_HOST || !NOTIFICATION_PORT) {
  throw new Error('Notification config is not define');
}

if (!POSTGRES_HOST || !POSTGRES_PORT || !POSTGRES_DB) {
  throw new Error('POSTGRES config is not define');
}

if (
  !ACCESS_TOKEN_SECRET ||
  !ACCESS_TOKEN_EXPIRES_IN ||
  !REFRESH_TOKEN_EXPIRES_IN ||
  !BCRYPT_SALT
) {
  throw new Error('Access token config is not define');
}

if (!COOKIE_SECRET) {
  throw new Error('Cookie secret config is not define');
}

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
  throw new Error('Github auth config is not define');
}

if (
  !RABBITMQ_QUEUE ||
  !RABBITMQ_URL ||
  !RABBITMQ_USERNAME ||
  !RABBITMQ_PASSWORD
) {
  throw new Error('RabbitMQ config is not define');
}

export default {
  PORT,
  NODE_ENV,
  API_VERSION,
  DB_LOGGING,
  REQ_LOGGING,
  NOTIFICATION_HOST,
  NOTIFICATION_PORT,
  CORS_ORIGINS,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  COOKIE_SECRET,
  BCRYPT_SALT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  RABBITMQ_QUEUE,
  RABBITMQ_URL,
  RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD,
};
