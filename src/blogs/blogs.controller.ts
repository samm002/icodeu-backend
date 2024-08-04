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
import * as path from 'path';
import { sanitizeString } from '../common/service/sanitizeString';
import * as fs from 'fs';

const storage = diskStorage({
  destination: (req, file, callback) => {
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }
    callback(null, tmpDir);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = sanitizeString(path.basename(file.originalname, fileExtension));
    callback(null, `${fileName}-${Date.now()}${fileExtension}`);
  },
});

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

  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('upload', {
  //     storage: diskStorage({
  //       destination: 'public/images',
  //       filename: (req, file, callback) => {
  //         console.log(file)
  //         const fileExtension = extname(file.originalname);
  //         const fileName = sanitizeString(
  //           basename(file.originalname, fileExtension),
  //         );
  //         callback(null, `${fileName}-${Date.now()}${fileExtension}`);
  //       },
  //     }),
  //   }),
  // )
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  //   const url = `http://localhost:3000/public/images/${file.filename}`
  //   return {
  //     filename: file.filename,
  //     uploaded: 1,
  //     url
  //   };
  // }

  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('upload', {
  //     storage: diskStorage({
  //       destination: (req, file, callback) => {
  //         callback(null, './tmp'); // Use a temporary directory
  //       },
  //       filename: (req, file, callback) => {
  //         const fileExtension = extname(file.originalname);
  //         const fileName = sanitizeString(
  //           basename(file.originalname, fileExtension),
  //         );
  //         callback(null, `${fileName}-${Date.now()}${fileExtension}`);
  //       },
  //     }),
  //   }),
  // )
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   try {
  //     // Read the file content
  //     const fileContent = file.buffer;

  //     // Determine the MIME type
  //     const contentType = mime.getType(file.originalname) || 'application/octet-stream';

  //     // Upload the file to S3
  //     const result = await this..uploadFile(file.originalname, fileContent, contentType);

  //     // Return the file details and URL
  //     return {
  //       filename: file.originalname,
  //       uploaded: 1,
  //       url: result.url,
  //     };
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     throw new Error('Failed to upload file');
  //   }
  // }

  @Post('upload')
  @UseInterceptors(FileInterceptor('upload', { storage }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
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
