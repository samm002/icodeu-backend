import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Redirect,
  Render,
  Req,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/get-role.decorator';
import { ResponseStatus } from '../common/enums';
import { JwtGuard, RolesGuard } from '../common/guards';
import { ResponsePayload, Tokens } from '../common/interfaces';
import { GetUser, Public } from 'src/common/decorators';
import { AdminLoginDto } from './dto';
import { BlogsService } from '../blogs/blogs.service';
import { ProductsService } from '../products/products.service';
import { PriceDetailsService } from '../price-details/price-details.service';
import { ServicesService } from '../services/services.service';
import { CreateUserDto, UpdateUserDto } from 'src/users/dto';
import { Role, User } from '@prisma/client';
import { RolesService } from 'src/roles/roles.service';

@UseGuards(JwtGuard, RolesGuard)
@Roles(['admin'])
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private blogService: BlogsService,
    private productService: ProductsService,
    private priceDetailService: PriceDetailsService,
    private serviceService: ServicesService,
    private roleService: RolesService,
  ) {}

  // View Handling route
  @UseGuards(JwtGuard)
  @Get('dashboards')
  @Render('dashboard/index')
  async dashboard(@Request() req) {
    const users = await this.adminService.getAllUsers();
    return { users, title: 'Dashboard' };
  }

  @Get('users')
  @Render('dashboard/users/index')
  async users() {
    const users = await this.adminService.getAllUsers();
    return { users, title: 'Users' };
  }

  @Get('products')
  @Render('dashboard/products/index')
  async products() {
    const products = await this.productService.getAllProduct();
    return { products, title: 'Products' };
  }

  @Get('services')
  @Render('dashboard/services/index')
  async services() {
    const services = await this.serviceService.getAllService();
    return { services, title: 'Services' };
  }

  @Get('blogs')
  @Render('dashboard/blogs/index')
  async blogs() {
    const blogs = await this.blogService.getAllBlog();
    return { blogs, title: 'Blogs' };
  }

  @Public()
  // Admin Authentication
  @Get('login')
  @Render('authentication/login')
  async getLogin() {
    return { title: 'Login' };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Redirect('dashboards')
  @Post('login')
  async login(@Body() dto: AdminLoginDto, @Response() res) {
    const accessToken = (await this.adminService.login(dto)).access_token;
    res.cookie('accessToken', accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: 'lax',
      httpOnly: true,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @GetUser('id') userId: number,
  ): Promise<ResponsePayload<string>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: 'Admin Logged Out',
      data: await this.adminService.logout(userId),
    };
  }

  // Admin Control

  // User
  @Get('users/:id')
  async getUserById(userId: number): Promise<ResponsePayload<User>> {
    try {
      return {
        status: ResponseStatus.SUCCESS,
        message: `Create User`,
        data: await this.adminService.getUserById(userId),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('users')
  async createUser(
    dto: CreateUserDto,
    roleName: string,
  ): Promise<ResponsePayload<User>> {
    try {
      return {
        status: ResponseStatus.SUCCESS,
        message: `Create User`,
        data: await this.adminService.createUser(dto, roleName),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('users/:id')
  async updateUser(
    userId: number,
    dto: UpdateUserDto,
    roleName: string,
  ): Promise<ResponsePayload<User>> {
    try {
      return {
        status: ResponseStatus.SUCCESS,
        message: `Update User`,
        data: await this.adminService.updateUser(userId, roleName, dto),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('users/:id')
  async deleteUser(userId: number): Promise<ResponsePayload<User>> {
    try {
      return {
        status: ResponseStatus.SUCCESS,
        message: `Update User`,
        data: await this.adminService.deleteUser(userId),
      };
    } catch (error) {
      throw error;
    }
  }

  // Role
  // CRUD logic in Role Service
  // Further Admin Control for role
  @Get('roles')
  async getAllUserRole(): Promise<ResponsePayload<Role[]>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get All Role`,
      data: await this.roleService.getAllRole(),
    };
  }

  @Get('roles/:id')
  async getUserByRole(@Param('id', ParseIntPipe) roleId: number) {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get Role by id ${roleId}`,
      data: await this.roleService.getRoleById(roleId),
    };
  }

  // plan :
  // Admin bisa ganti role user melalui dashboard langsung
  @Patch('users/:id/role')
  async updateUserRole() {}
}
