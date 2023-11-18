import { UserRole } from '@database/enums';
import { User } from '@database/mongo/schemas';
import { PartialType, PickType } from '@nestjs/swagger';
import { Request } from 'express';

export interface AuthPayload {
  sub: string;
  role: UserRole;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export class AuthRequestPayload extends Request {
  user: AuthPayload;
  isAuthenticated: boolean;
}

export class LoginInfoPayload extends PartialType(
  PickType(User, ['_id', 'refreshToken', 'lastLogin', 'userAgent'] as const),
) {}
