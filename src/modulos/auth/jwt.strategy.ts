import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      audience: 'https://api.prometeo',
      issuer: 'https://dev-xrdraegerperu.us.auth0.com/',

      algorithms: ['RS256'],

      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          'https://dev-xrdraegerperu.us.auth0.com/.well-known/jwks.json',
      }),
    });
  }

  validate(payload: any) {
    return {
      usuarioId: payload.sub,
      email: payload.email,
      nombre: payload.name,
    };
  }
}