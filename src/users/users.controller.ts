import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ResponseStatus } from '../common/enums';
import { JwtGuard } from '../common/guards/jwt.at.guard';
import { ResponsePayload, UserData } from '../common/interfaces';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async showProfile(@GetUser() user: User): Promise<ResponsePayload<UserData>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Show Profile`,
      data: await this.usersService.showProfile(user),
    };
  }

  @Patch('profile')
  async editProfile(
    @GetUser('id') userId: number,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponsePayload<UserData>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Show Profile`,
      data: await this.usersService.editProfile(userId, dto),
    };
  }
}
