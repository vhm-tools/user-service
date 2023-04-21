import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GithubOAuthGuard, Public } from '@common';
import { Response } from 'express';
import { ApiExcludeEndpoint, ApiNoContentResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRequestPayload } from './dtos';

@Controller('auth')
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
  @ApiExcludeEndpoint()
  async githubCallback(
    @Req() { user, headers }: AuthRequestPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.login(
      user,
      headers,
    );
    this.authService.setAuthCookies(res, accessToken, refreshToken);
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
}
