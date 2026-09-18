import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // getOrThrow -> a missing JWT_SECRET fails loudly and clearly at
      // startup instead of the app limping along in a broken state
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // whatever this returns is attached to request.user
  async validate(payload: { sub: number; role: string; patientId?: number }) {
    return { userId: payload.sub, role: payload.role, patientId: payload.patientId };
  }
}
