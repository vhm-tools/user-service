import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { AuthPayload } from '../dtos';
import env from '@environments';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies['vhm_refresh_token'];
        },
      ]),
      secretOrKey: env.REFRESH_TOKEN_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AuthPayload) {
    const refreshToken = req.cookies['vhm_refresh_token'];
    return this.authService.validateRefreshToken(refreshToken, payload.id);
  }
}
