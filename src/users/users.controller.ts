import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { ResponseUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ResponseStatus } from '../common/enums';
import { JwtGuard } from '../common/guards';
import { ResponsePayload, UserWithRole } from '../common/interfaces';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async showProfile(
    @GetUser() user: UserWithRole,
  ): Promise<ResponsePayload<ResponseUserDto>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Show Profile`,
      data: await this.usersService.showProfile(user),
    };
  }

  @Patch('profile')
  async editProfile(
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponsePayload<ResponseUserDto>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Show Profile`,
      data: await this.usersService.editProfile(userId, dto),
    };
  }
}
