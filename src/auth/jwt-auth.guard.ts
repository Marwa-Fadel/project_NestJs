import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guards
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
