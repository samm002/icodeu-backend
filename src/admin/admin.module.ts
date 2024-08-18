import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RolesGuard } from '../common/guards/role.guard';
import { AuthenticationModule } from '../authentication/authentication.module';
import { BlogsModule } from '../blogs/blogs.module';
import { PriceDetailsModule } from '../price-details/price-details.module';
import { ProductsModule } from '../products/products.module';
import { RolesModule } from '../roles/roles.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    AuthenticationModule,
    BlogsModule,
    PriceDetailsModule,
    ProductsModule,
    RolesModule,
    ServicesModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, RolesGuard],
})
export class AdminModule {}
