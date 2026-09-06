import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

// مفهوم الCustom Decorators
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    const rawUserId = request.headers['user-id'];

    if (!rawUserId) {
      throw new UnauthorizedException('Missing "user-id" header (simulated auth).');
    }

    const userId = Number(rawUserId);
    if (Number.isNaN(userId)) {
      throw new UnauthorizedException('"user-id" header must be a number.');
    }

    return userId;
  },
);
