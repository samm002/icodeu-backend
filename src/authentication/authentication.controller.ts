import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto';
import { GetUser } from '../common/decorators';
import { ResponseStatus } from '../common/enums';
import { JwtGuard, RtGuard } from '../common/guards';
import { ResponsePayload, Tokens } from '../common/interfaces';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<ResponsePayload<Tokens>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: 'User Registered',
      data: await this.authenticationService.register(dto),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<ResponsePayload<Tokens>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: 'User Logged In',
      data: await this.authenticationService.login(dto),
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@GetUser('id') userId: number): Promise<ResponsePayload<string>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: 'User Logged Out',
      data: await this.authenticationService.logout(userId),
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @Post('refresh-token')
  async refreshTokens(
    @GetUser('sub') userId: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return {
      status: ResponseStatus.SUCCESS,
      message: 'Refresh Token Success',
      data: await this.authenticationService.refreshTokens(userId, refreshToken)
    };
  }
}
