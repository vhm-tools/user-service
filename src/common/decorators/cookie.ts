import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator<string>(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const signedCookies = request.signedCookies;

    if (!signedCookies) {
      return null;
    }

    return key ? signedCookies[key] : signedCookies;
  },
);
