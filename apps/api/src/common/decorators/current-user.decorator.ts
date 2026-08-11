import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestUser {
  userId: string;
  phone: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: RequestUser }>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
