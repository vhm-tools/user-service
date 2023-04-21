import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';
import env from '@environments';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: env.GITHUB_CALLBACK_URL,
      scope: ['read:user', 'user:email'],
    });
  }

  async validate(accessToken: string, _: string, profile: any, done: any) {
    const result = await this.authService.validateGithub({
      accessToken,
      profile,
    });

    // You can customize the validation logic here
    done(null, result);
  }
}
