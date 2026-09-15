import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// مفهوم الCustom Decorators
export const CurrentUserRole = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.role;
  },
);
