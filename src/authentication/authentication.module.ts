import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtStrategy, RtStrategy } from './strategies';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Module({
  imports: [JwtModule.register({}), CreateUserDto],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, RtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
