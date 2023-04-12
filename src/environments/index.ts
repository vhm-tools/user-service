import * as dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  NODE_ENV,
  API_VERSION,
  REQ_LOGGING,
  DB_LOGGING,
  CORS_ORIGINS,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

if (NODE_ENV && !['test', 'production', 'development'].includes(NODE_ENV)) {
  throw new Error('NODE_ENV must be either test, production or development');
}

if (!CORS_ORIGINS) {
  throw new Error('CORS_ORIGINS is not define');
}

if (!PORT) {
  throw new Error('PORT is not define');
}

if (!POSTGRES_HOST || !POSTGRES_PORT || !POSTGRES_DB) {
  throw new Error('POSTGRES config is not define');
}

export default {
  PORT,
  NODE_ENV,
  API_VERSION,
  DB_LOGGING,
  REQ_LOGGING,
  CORS_ORIGINS,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
};
