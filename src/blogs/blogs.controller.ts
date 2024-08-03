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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorators';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { sanitizeString } from '../common/service/sanitizeString';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

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

  @Get('upload-image')
  @Render('upload-image')
  uploadImageView() {
    return { content: 'ckeditor' };
  }

  @Get()
  getAllRole() {
    return this.blogService.getAllBlog();
  }

  @Get(':id')
  getBlogById(@Param('id', ParseIntPipe) blogId: number) {
    return this.blogService.getBlogById(blogId);
  }

  @Post()
  // async createBlog(@GetUser('sub') userId: number, dto: CreateBlogDto) {
  async createBlogById(userId: number, @Body() dto: CreateBlogDto) {
    return this.blogService.createBlog(userId, dto);
  }

  @Patch(':id')
  async updateBlogById(
    userId: number,
    @Param('id', ParseIntPipe) blogId: number,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlogById(userId, blogId, dto);
  }

  @Delete(':id')
  async deleteBlogById(
    userId: number,
    @Param('id', ParseIntPipe) blogId: number,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.deleteBlogById(userId, blogId, dto);
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('upload'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file)
  // }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('upload', {
      storage: diskStorage({
        destination: 'public/images',
        filename: (req, file, callback) => {
          const fileExtension = extname(file.originalname);
          const fileName = sanitizeString(
            basename(file.originalname, fileExtension),
          );
          callback(null, `${fileName}-${Date.now()}${fileExtension}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const url = `http://localhost:3000/public/images/${file.filename}`
    return {
      filename: file.originalname, 
      uploaded: 1, 
      url
    };
  }
}
