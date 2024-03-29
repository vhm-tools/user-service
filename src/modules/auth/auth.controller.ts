import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GithubOAuthGuard, JwtRefreshGuard, Public } from '@common';
import { Response } from 'express';
import {
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IResponseType } from '@infra-common/interfaces';
import env from '@environments';
import { AuthService } from './auth.service';
import { AuthRequestPayload } from './dtos';
import { MESSAGE_CODE } from '@infra-common/constants';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('github')
  @Public()
  @UseGuards(GithubOAuthGuard)
  github(): void {
    return;
  }

  @Get('github/callback')
  @Public()
  @UseGuards(GithubOAuthGuard)
  @Redirect(`${env.CLIENT_URL}/admin`, HttpStatus.FOUND)
  @ApiExcludeEndpoint()
  async githubCallback(
    @Req() { user, headers }: AuthRequestPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { accessToken, refreshToken } = await this.authService.login(
      user,
      headers,
    );
    this.authService.setAuthCookies(res, accessToken, refreshToken);
  }

  @Get('refresh-token')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refreshToken(
    @Req() { user, headers }: AuthRequestPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken } = await this.authService.login(user, headers);
    this.authService.setAuthCookies(res, accessToken);
  }

  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  logout(
    @Res({ passthrough: true }) res: Response,
    @Req() { user }: AuthRequestPayload,
  ): Promise<void> {
    return this.authService.logout(res, user);
  }

  @Get('check')
  @ApiExcludeEndpoint()
  checkAuth(
    @Req() { isAuthenticated }: AuthRequestPayload,
  ): IResponseType<{ isAuthenticated: boolean }> {
    return { data: { isAuthenticated }, code: MESSAGE_CODE.SUCCESS };
  }
}
