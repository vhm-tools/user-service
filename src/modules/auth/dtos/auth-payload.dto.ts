import { UserRole } from '@database/enums';
import { User } from '@database/mongo/schemas';
import { PartialType, PickType } from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthPayload {
  sub: Types.ObjectId;
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
