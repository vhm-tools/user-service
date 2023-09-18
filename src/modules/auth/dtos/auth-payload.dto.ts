import { User } from '@entities';
import { UserRole } from '@enums-db';
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
}

export class LoginInfoPayload extends PartialType(
  PickType(User, ['id', 'refreshToken', 'lastLogin', 'userAgent'] as const),
) {}
