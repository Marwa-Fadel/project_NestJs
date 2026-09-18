import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// مفهوم الCustom Decorators
// Patient.id is embedded in the JWT at login (see AuthService.signToken).
// ADMIN accounts have no linked Patient profile, so this can be undefined
// for them - callers that allow ADMIN access must handle that themselves.
export const CurrentPatientId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.patientId;
  },
);
