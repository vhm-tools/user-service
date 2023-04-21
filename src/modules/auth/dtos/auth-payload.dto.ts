import { UserRole } from '@enums';
import { Request } from 'express';

export interface AuthPayload {
  id: string;
  role: UserRole;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export class AuthRequestPayload extends Request {
  user: AuthPayload;
}
