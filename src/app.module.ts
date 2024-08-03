import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ProductPricesModule } from './product-prices/product-prices.module';
import { ServicesModule } from './services/services.module';
import { BlogsModule } from './blogs/blogs.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'), // Adjust the path to your public folder
      renderPath: 'public'
    }),
    UsersModule,
    RolesModule,
    AuthenticationModule,
    PrismaModule,
    AdminModule,
    ProductsModule,
    ProductPricesModule,
    ServicesModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
