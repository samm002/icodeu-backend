import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetTokens = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      accessToken: request.cookies['access_token'],
      refreshToken: request.cookies['refresh_token'],
    };
  },
);
