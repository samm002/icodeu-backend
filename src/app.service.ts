import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  index(): string {
    return 'IcodeU API is Running!';
  }
}
