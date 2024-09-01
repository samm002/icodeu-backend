import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Blog, User } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

import { BlogsService } from './blogs.service';
import { CreateBlogDto, ResponseBlogDto, UpdateBlogDto } from './dto';
import { GetUser, Public, Roles } from '../common/decorators';
import { ResponseStatus, Role } from '../common/enums';
import { JwtGuard, RolesGuard } from '../common/guards';
import { CkEditorResponse, ResponsePayload } from '../common/interfaces';
import { storage } from '../common/utils';

@UseGuards(JwtGuard, RolesGuard)
@Roles([Role.ADMIN, Role.COPYWRITER])
@Controller('blogs')
export class BlogsController {
  constructor(private blogService: BlogsService) {}

  @Get()
  async getAllBlog(): Promise<ResponsePayload<ResponseBlogDto[]>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get All Blog`,
      data: await this.blogService.getAllBlog(),
    };
  }

  @Get(':id')
  async getBlogById(
    @Param('id', ParseIntPipe) blogId: number,
  ): Promise<ResponsePayload<ResponseBlogDto>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get Blog by id ${blogId}`,
      data: await this.blogService.getBlogById(blogId),
    };
  }

  @FormDataRequest()
  @Post()
  async createBlogById(
    @GetUser('id') userId: number,
    @Body() dto: CreateBlogDto,
    @Res() res: Response,
  ): Promise<void> {
    const blog = await this.blogService.createBlog(userId, dto);
    res.redirect(`/admin/blogs/${blog.id}`);
  }

  @FormDataRequest()
  @Patch(':id')
  async updateBlogById(
    userId: number,
    @Param('id', ParseIntPipe) blogId: number,
    @Body() dto: UpdateBlogDto,
    @Res() res: Response,
  ): Promise<void> {
    const blog = await this.blogService.updateBlogById(userId, blogId, dto);
    res.redirect(`/admin/blogs/${blog.id}`);
  }

  @Delete(':id')
  async deleteBlogById(
    userId: number,
    @Param('id', ParseIntPipe) blogId: number,
    @Res() res: Response,
  ): Promise<void> {
    await this.blogService.deleteBlogById(userId, blogId);
    res.redirect(`/admin/blogs`);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('upload', { storage }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CkEditorResponse> {
    try {
      const result = await this.blogService.uploadFile(file);
      return {
        filename: file.originalname,
        uploaded: 1,
        url: result.url,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload file, detail : ${error.message ?? error} `);
    }
  }
}
