import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'), // Adjust the path to your public folder
      renderPath: 'public',
    }),
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
