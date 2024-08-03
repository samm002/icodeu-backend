import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { GetUser } from '../common/decorators';
import { RtGuard } from '../common/guards';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("register")
  register(@Body() dto: CreateUserDto) {
    return this.authenticationService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authenticationService.login(dto);
  }

  @UseGuards(RtGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetUser('sub') userId: number, @GetUser('refreshToken') refreshToken: string) {
    return this.authenticationService.refreshTokens(userId, refreshToken);
  }
}
