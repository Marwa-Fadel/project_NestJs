import { SetMetadata } from '@nestjs/common';

// 5. Custom Decorators
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
