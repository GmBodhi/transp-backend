import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/user.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_REFRESH_SECRET') ||
        'default-refresh-secret-key',
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    // Validate token version for rotation support
    const isValid = this.authService.validateTokenVersion(
      payload.sub,
      payload.tokenVersion,
    );

    if (!isValid) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
      tokenVersion: payload.tokenVersion,
    };
  }
}
