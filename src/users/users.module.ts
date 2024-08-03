import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dto/create-user.dto';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CreateUserDto],
  exports: [CreateUserDto],
})
export class UsersModule {}
