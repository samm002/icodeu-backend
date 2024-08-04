import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon from 'argon2';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto';
import { Role } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtPayload, Tokens } from '../common/interfaces';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: CreateUserDto): Promise<Tokens> {
    const userRole = await this.prisma.role.findUnique({
      where: {
        name: Role.USER,
      },
    });

    if (!userRole) throw new BadRequestException('User role not found');

    const roleId = userRole.id;
    const password = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password,
          roleId,
        },
      });

      const tokens = await this.signToken(user.id, user.email);

      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `Email : "${dto.email}" has already been registered`,
          );
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user)
      throw new NotFoundException(
        `Invalid credential, no user found with email : ${dto.email}`,
      );

    const passwordMatches = await argon.verify(user.password, dto.password);

    if (!passwordMatches)
      throw new BadRequestException(
        "Invalid credential, password didn't match!",
      );

    const tokens = await this.signToken(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async signToken(userId: number, email: string): Promise<Tokens> {
    const atSecret = this.config.get('JWT_AT_SECRET');
    const rtSecret = this.config.get('JWT_RT_SECRET');
    const expiresIn = this.config.get('JWT_AT_EXPIRE');

    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: atSecret,
        expiresIn: expiresIn,
      }),
      this.jwt.signAsync(payload, {
        secret: rtSecret,
        expiresIn: 60 * 60 * 12 * 7, // 1 week
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('User not found');

    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches)
      throw new ForbiddenException('Refresh token not matched');

    const tokens = await this.signToken(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });
  }
}
