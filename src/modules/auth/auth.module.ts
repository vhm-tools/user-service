import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { GithubStrategy, JwtRefreshStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  User,
  UserSchema,
  OAuthProfile,
  OAuthProfileSchema,
} from '@database/mongo/schemas';
import env from '@environments';

/**
 * Jwt ref: https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
 */

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: OAuthProfile.name, schema: OAuthProfileSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: env.AUTH_SECRET,
      signOptions: {
        expiresIn: +env.ACCESS_TOKEN_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
