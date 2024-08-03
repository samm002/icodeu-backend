import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../common/guards/jwt.at.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  showProfile(@GetUser() user: User) {
    return this.usersService.showProfile(user);
  }

  @Patch('profile')
  editProfile(@GetUser('sub') userId: number, @Body() dto: UpdateUserDto) {
    return this.usersService.editProfile(userId, dto);
  }
}
