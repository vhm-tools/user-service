import env from '@environments';
import { NodeEnv } from '@enums';
import { LogLevel } from '@nestjs/common';

export const isProduction = env.NODE_ENV === NodeEnv.PRODUCTION;
export const getEnv = (): NodeEnv | undefined => env.NODE_ENV as NodeEnv;

export const getLogsLevel = (): LogLevel[] => {
  if (env.NODE_ENV === NodeEnv.PRODUCTION) {
    return ['log', 'error', 'warn'];
  }

  return ['log', 'error', 'warn', 'debug', 'verbose'];
};
