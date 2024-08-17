import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, RtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
