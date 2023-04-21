import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, OAuthProfile } from '@entities';
import { GithubStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import env from '@environments';

/**
 * Jwt ref: https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OAuthProfile]),
    JwtModule.register({
      global: true,
      secret: env.ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: +env.ACCESS_TOKEN_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy],
})
export class AuthModule {}
