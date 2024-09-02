import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { S3Module } from './s3/s3.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { BlogsModule } from './blogs/blogs.module';
import { PriceDetailsModule } from './price-details/price-details.module';
import { ProductsModule } from './products/products.module';
import { RolesModule } from './roles/roles.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    NestjsFormDataModule,
    PrismaModule,
    S3Module,
    UsersModule,
    RolesModule,
    AuthenticationModule,
    AdminModule,
    ProductsModule,
    ServicesModule,
    BlogsModule,
    CommonModule,
    PriceDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
