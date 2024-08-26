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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Blog } from '@prisma/client';

import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { GetUser } from '../common/decorators';
import { CkEditorResponse, ResponsePayload } from '../common/interfaces';
import { storage } from '../common/utils';
import { ResponseStatus } from 'src/common/enums';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

// Blogs route is still under testing, no guard applied
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  // CKEditor Route
  @Get('ckeditor')
  @Render('blogs/create-blog')
  createCkeditorBlog() {
    return { content: 'ckeditor' };
  }

  @Get('ckeditor/all')
  @Render('blogs/view-all-blog')
  async viewAllCkeditorBlog() {
    const blogs = await this.blogService.getAllBlog();
    return { blogs };
  }

  @Get('ckeditor/:id')
  @Render('blogs/view-blog')
  async viewCkeditorBlog(@Param('id', ParseIntPipe) blogId: number) {
    const blog = await this.blogService.getBlogById(blogId);
    return { blog };
  }

  @Get('ckeditor/:id/edit')
  @Render('blogs/update-blog')
  async updateCkeditorBlog(@Param('id', ParseIntPipe) blogId: number) {
    const blog = await this.blogService.viewCkeditorBlog(blogId);
    return { id: blogId, blog };
  }

  // Upload image test route
  @Get('upload-image')
  @Render('upload-image')
  uploadImageView() {
    return { content: 'ckeditor' };
  }

  // Blog route
  @Get()
  async getAllBlog(): Promise<ResponsePayload<Blog[]>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get All Blog`,
      data: await this.blogService.getAllBlog(),
    };
  }

  @Get(':id')
  async getBlogById(
    @Param('id', ParseIntPipe) blogId: number,
  ): Promise<ResponsePayload<Blog>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get Blog by id ${blogId}`,
      data: await this.blogService.getBlogById(blogId),
    };
  }

  @FormDataRequest()
  @Post()
  async createBlogById(
    userId: number,
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
      throw new Error('Failed to upload file');
    }
  }
}
