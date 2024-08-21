import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Redirect,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto';
import { GetUser, Public, Roles } from '../common/decorators';
import { ResponseStatus } from '../common/enums';
import { JwtGuard, RolesGuard, RtGuard } from '../common/guards';
import { ResponsePayload } from '../common/interfaces';
import { AuthenticationService } from '../authentication/authentication.service';
import { BlogsService } from '../blogs/blogs.service';
import { ProductsService } from '../products/products.service';
import { ServicesService } from '../services/services.service';
import { CreateUserDto, UpdateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';

@UseGuards(JwtGuard, RolesGuard)
@Roles(['admin'])
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authenticationService: AuthenticationService,
    private blogService: BlogsService,
    private productService: ProductsService,
    private serviceService: ServicesService,
    private userService: UsersService,
  ) {}

  @Public()
  @Get('upload-single-image')
  @Render('dashboard/products/upload-single-image')
  async uploadSingleImage() {
    return { title: 'Upload Single Image' };
  }

  @Public()
  @Get('upload-multiple-image')
  @Render('dashboard/products/upload-multiple-image')
  async uploadMultipleImage() {
    return { title: 'Upload Single Image' };
  }

  // View Handling route
  @Get('dashboards')
  @Render('dashboard/index')
  async dashboard(@GetUser("name") name: string) {
    const users = await this.userService.getAllUser();
    return { users, title: 'Dashboard' };
  }

  // User
  @Get('users')
  @Render('dashboard/users/index')
  async getAllUsers(@GetUser("name") name: string) {
    const users = await this.userService.getAllUser();
    return { users, title: 'Users' };
  }

  @Get('users/create')
  @Render('dashboard/users/add')
  async createUserView() {
    return { title: 'Create User' };
  }

  @Get('users/:id')
  @Render('dashboard/users/show')
  async getUserById(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.userService.getUserById(userId);
    return { user, title: `User ${userId}` };
  }

  @Get('users/:id/update')
  @Render('dashboard/users/edit')
  async updateUserView(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.userService.getUserById(userId);
    return { user, title: `Update User ${userId}` };
  }

  // Product
  @Get('products')
  @Render('dashboard/products/index')
  async getAllProduct(@GetUser("name") name: string) {
    const products = await this.productService.getAllProduct();
    return { products, title: 'Products' };
  }

  @Get('products/create')
  @Render('dashboard/products/add') 
  async createProductView(@GetUser("name") name: string) {
    return { title: 'Create Product' };
  }
  
  @Get('products/:id')
  @Render('dashboard/products/show')
  async getProductById(@Param('id', ParseIntPipe) productId: number) {
    const product = await this.productService.getProductById(productId);
    return { product, title: `Product ${productId}` };
  }

  @Get('products/:id/update')
  @Render('dashboard/products/edit')
  async updateProductView(@Param('id', ParseIntPipe) productId: number) {
    const product = await this.productService.getProductById(productId);
    return { product, title: `Update Product ${productId}` };
  }

  // Service
  @Get('services')
  @Render('dashboard/services/index')
  async services(@GetUser("name") name: string) {
    const services = await this.serviceService.getAllService();
    return { services, title: 'Services' };
  }

  @Get('services/create')
  @Render('dashboard/services/index')
  async createServiceView(@GetUser("name") name: string) {
    return { title: 'Create Service' };
  }

  @Get('services/:id')
  @Render('dashboard/services/show')
  async getServiceById(@Param('id', ParseIntPipe) serviceId: number) {
    const service = await this.serviceService.getServiceById(serviceId);
    return { service, title: `Service ${serviceId}` };
  }

  @Get('services/:id/update')
  @Render('dashboard/services/edit')
  async updateServiceView(@Param('id', ParseIntPipe) serviceId: number) {
    const service = await this.serviceService.getServiceById(serviceId);
    return { service, title: `Update Service ${serviceId}` };
  }

  // Blog
  @Get('blogs')
  @Render('dashboard/blogs/index')
  async blogs(@GetUser("name") name: string) {
    const blogs = await this.blogService.getAllBlog();
    return { blogs, title: 'Blogs' };
  }

  @Get('blogs/create')
  @Render('dashboard/blogs/add')
  async createBlogView(@GetUser("name") name: string) {
    return { title: 'Create Blog' };
  }

  @Get('blogs/:id')
  @Render('dashboard/blogs/show')
  async getBlogById(@Param('id', ParseIntPipe) blogId: number) {
    const blog = await this.blogService.getBlogById(blogId);
    return { blog, title: `Blog ${blogId}` };
  }
  
  @Get('blogs/:id/update')
  @Render('dashboard/blogs/edit')
  async updateBlogView(@Param('id', ParseIntPipe) blogId: number) {
    const blog = await this.blogService.getBlogById(blogId);
    return { blog, title: `Update bBog ${blogId}` };
  }

  // Price Detail?
  // Role?

  // Admin Authentication
  @Public()
  @Get('login')
  @Render('authentication/login')
  async getLogin() {
    return { title: 'Login' };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Redirect('dashboards')
  @Post('login')
  async login(@Body() dto: AdminLoginDto, @Request() req: any) {
    const tokens = await this.adminService.login(dto);
    req.session.access_token = tokens.access_token;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @Post('refresh-token')
  async refreshTokens(
    @GetUser('sub') userId: number,
    @GetUser('refreshToken') refreshToken: string,
    @Request() req: any,
  ) {
    const tokens = await this.authenticationService.refreshTokens(
      userId,
      refreshToken,
    );

    req.session.access_token = tokens.access_token;
    req.session.refresh_token = tokens.refresh_token;

    return {
      status: ResponseStatus.SUCCESS,
      message: 'Refresh Token Success',
      data: await this.authenticationService.refreshTokens(
        userId,
        refreshToken,
      ),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @Redirect('login')
  async logout(
    @GetUser('id') userId: number,
  ): Promise<ResponsePayload<string>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: 'Admin Logged Out',
      data: await this.authenticationService.logout(userId),
    };
  }

  // Admin Control

  // User
  @Post('users')
  async createUser(
    dto: CreateUserDto,
    roleName: string,
  ): Promise<ResponsePayload<User>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Create User`,
      data: await this.userService.createUser(dto, roleName),
    };
  }

  @Patch('users/:id')
  async updateUser(
    userId: number,
    dto: UpdateUserDto,
    roleName: string,
  ): Promise<ResponsePayload<User>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Update User`,
      data: await this.userService.updateUser(userId, roleName, dto),
    };
  }

  @Delete('users/:id')
  async deleteUser(userId: number): Promise<ResponsePayload<User>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Update User`,
      data: await this.userService.deleteUser(userId),
    };
  }

  // CRUD fitur lain ambil dari controller masing-masing

  // plan :
  // Admin bisa ganti role user melalui dashboard langsung
  @Patch('users/:id/role')
  async updateUserRole() {}
}
