import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GenericRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request;
  },
);

export const GetUser = createParamDecorator(
  (data: any | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
