import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import env from '@environments';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  AuthPayload,
  GithubPayload,
  LoginInfoPayload,
  TokenResponse,
} from './dtos';
import { OAuthProfile, User } from '@entities';
import { UserAgent } from '@interfaces-db';
import { UserStatus } from '@enums-db';
import { isProduction } from '@share-libs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OAuthProfile)
    private oauthProfileRepository: Repository<OAuthProfile>,
    private jwtService: JwtService,
  ) {}

  async validateGithub(payload: GithubPayload): Promise<AuthPayload> {
    const { accessToken, profile } = payload;
    const { username, displayName, emails, photos, provider } = profile;

    const email = emails[0].value;
    const avatar = photos.length ? photos[0].value : '';

    /**
     * Return user if exists
     */
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'role'],
    });

    if (user) {
      const oauthProfile = await this.oauthProfileRepository.findOneBy({
        userId: user.id,
      });

      if (!oauthProfile) {
        await this.oauthProfileRepository.save({
          provider,
          accessToken,
          userId: user.id,
        });
      }

      return {
        sub: user.id,
        role: user.role,
      };
    }

    /**
     * Create new user & oauth profile
     */
    let firstName = '';
    let lastName = '';

    if (displayName) {
      firstName = displayName.split(' ').slice(0, -1).join(' ');
      lastName = displayName.split(' ').slice(-1).join(' ');
    }

    const newUser = await this.userRepository.save({
      username,
      firstName,
      lastName,
      email,
      avatar,
      status: UserStatus.ACTIVE,
    });

    await this.oauthProfileRepository.save({
      provider,
      accessToken,
      userId: newUser.id,
    });

    return {
      sub: newUser.id,
      role: newUser.role,
    };
  }

  async login(payload: AuthPayload, headers: any): Promise<TokenResponse> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'lastLogin', 'userAgent'],
    });

    if (!user) {
      throw new BadRequestException('User is not found');
    }

    const userAgentHeader = headers['user-agent'];
    const uaParser = new UAParser(userAgentHeader);
    const { getOS, getDevice, getBrowser } = uaParser;

    const userAgent: UserAgent = userAgentHeader
      ? {
          os: getOS().name,
          device: getDevice().model,
          browser: getBrowser().name,
        }
      : {};

    const { accessToken, refreshToken } = this.generateToken(payload, true);

    // User is not login yet
    if (user.lastLogin) {
      const userLastLogin = new Date(user.lastLogin).getTime();
      const expireTime = new Date(
        userLastLogin + +env.ACCESS_TOKEN_EXPIRES_IN * 1000,
      ).getTime();
      const currentTime = new Date().getTime();

      // if (currentTime < expireTime) {
      //   const exceptionMsg =
      //     JSON.stringify(user.userAgent) === JSON.stringify(userAgent)
      //       ? 'You are already logged in on this device'
      //       : 'You are already logged in on another device';

      //   throw new BadRequestException(exceptionMsg);
      // }

      if (currentTime > expireTime) {
        await this.setInfoLogin({
          id: payload.sub,
          lastLogin: new Date(),
          refreshToken,
          userAgent,
        });
      }
    } else {
      await this.setInfoLogin({
        id: payload.sub,
        lastLogin: new Date(),
        refreshToken,
        userAgent,
      });
    }

    return { accessToken, refreshToken };
  }

  async logout(res: Response, payload: AuthPayload): Promise<void> {
    await this.userRepository.update(
      { id: payload.sub },
      { lastLogin: null, userAgent: null, refreshToken: null },
    );

    this.clearTokenCookies(res);
  }

  setInfoLogin(payload: LoginInfoPayload): Promise<UpdateResult> {
    const { id, ...info } = payload;
    if (info.refreshToken) {
      const salt = bcrypt.genSaltSync();
      info.refreshToken = bcrypt.hashSync(info.refreshToken, salt);
    }
    return this.userRepository.update({ id }, info);
  }

  async validateRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<AuthPayload> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      select: ['id', 'role', 'refreshToken'],
    });

    if (!user.refreshToken) {
      throw new BadRequestException('User not have refresh token');
    }
    const isMatching = bcrypt.compareSync(refreshToken, user.refreshToken);

    if (!isMatching) {
      throw new BadRequestException('Refresh token invalid');
    }

    return {
      sub: user.id,
      role: user.role,
    };
  }

  generateToken(payload: AuthPayload, hasRefreshToken = false): TokenResponse {
    const accessToken = this.jwtService.sign(payload, {
      secret: env.AUTH_SECRET,
    });
    if (hasRefreshToken) {
      const refreshToken = this.jwtService.sign(payload, {
        secret: env.REFRESH_TOKEN_SECRET,
        expiresIn: +env.REFRESH_TOKEN_EXPIRES_IN,
      });
      return { accessToken, refreshToken };
    }
    return { accessToken };
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken?: string,
    isRedirect?: boolean,
  ): void {
    res.cookie(env.COOKIE_TOKEN_NAME, accessToken, {
      httpOnly: true,
      secure: isProduction,
      signed: true,
      maxAge: +env.ACCESS_TOKEN_EXPIRES_IN * 1000,
      sameSite: isProduction ? 'lax' : 'strict',
    });

    if (refreshToken) {
      res.cookie(env.COOKIE_REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: +env.REFRESH_TOKEN_EXPIRES_IN * 1000,
        sameSite: isProduction ? 'lax' : 'strict',
      });
    }

    if (isRedirect) {
      res.redirect(`${env.CLIENT_URL}/admin`);
    }
  }

  clearTokenCookies(res: Response): void {
    res.clearCookie(env.COOKIE_TOKEN_NAME, {
      httpOnly: true,
      secure: isProduction,
      signed: true,
      sameSite: isProduction ? 'lax' : 'strict',
    });
    res.clearCookie(env.COOKIE_REFRESH_TOKEN_NAME, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : 'strict',
    });
  }
}
