import { SetMetadata } from '@nestjs/common';

//  مفهوم الCustom Decorators
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
