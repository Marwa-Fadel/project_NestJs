import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

// مفهوم الCustom Decorators
// request.user is populated by JwtStrategy once the JwtAuthGuard validates the token
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (userId === undefined) {
      throw new UnauthorizedException('Missing authenticated user.');
    }

    return userId;
  },
);
