import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload, SessionTokens } from '../../common/interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_AT_SECRET'),
    });
  }

  private static extractJWT(req: SessionTokens): string | null {
    if (req.session && req.session.access_token) {
      return req.session.access_token;
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
        refreshToken: {
          not: null,
        },
      },
      include: {
        role: true,
      },
    });

    if (!user) throw new UnauthorizedException();

    delete user.password;

    return user;
  }
}
