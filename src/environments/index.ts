import { NodeEnv } from '@infra-common/enums';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  NODE_ENV,
  API_VERSION,
  REQ_LOGGING,
  DB_LOGGING,
  VHM_API_KEY,
  CORS_ORIGINS,
  NOTIFICATION_HOST,
  NOTIFICATION_PORT,
  MONGODB_URI,
  MONGODB_URI_DOCKER,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST_DOCKER,
  POSTGRES_PORT_DOCKER,
  POSTGRES_DB,
  AUTH_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  COOKIE_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  COOKIE_SECRET,
  BCRYPT_SALT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  RABBITMQ_QUEUE,
  RABBITMQ_URL,
  RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD,
  RABBITMQ_URL_DOCKER,
  CLIENT_URL,
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

if (
  !POSTGRES_HOST ||
  !POSTGRES_PORT ||
  !POSTGRES_DB ||
  !POSTGRES_PORT_DOCKER ||
  !POSTGRES_HOST_DOCKER
) {
  throw new Error('POSTGRES config is not define');
}

if (!MONGODB_URI || !MONGODB_URI_DOCKER) {
  throw new Error('MongoDB config is not define');
}

if (
  !AUTH_SECRET ||
  !REFRESH_TOKEN_SECRET ||
  !ACCESS_TOKEN_EXPIRES_IN ||
  !REFRESH_TOKEN_EXPIRES_IN ||
  !BCRYPT_SALT
) {
  throw new Error('Auth token config is not define');
}

if (!COOKIE_TOKEN_NAME || !COOKIE_REFRESH_TOKEN_NAME) {
  throw new Error('Cookie name config is not define');
}

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
  throw new Error('Github auth config is not define');
}

if (
  !RABBITMQ_QUEUE ||
  !RABBITMQ_URL ||
  !RABBITMQ_USERNAME ||
  !RABBITMQ_PASSWORD ||
  !RABBITMQ_URL_DOCKER
) {
  throw new Error('RabbitMQ config is not define');
}

if (!VHM_API_KEY) {
  throw new Error('API key config is not define');
}

if (!CLIENT_URL) {
  throw new Error('Client url config is not define');
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
  VHM_API_KEY,
  MONGODB_URI,
  MONGODB_URI_DOCKER,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_HOST_DOCKER,
  POSTGRES_PORT_DOCKER,
  AUTH_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  COOKIE_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  COOKIE_SECRET,
  BCRYPT_SALT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  RABBITMQ_QUEUE,
  RABBITMQ_URL,
  RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD,
  RABBITMQ_URL_DOCKER,
  CLIENT_URL,
};
