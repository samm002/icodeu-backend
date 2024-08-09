import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateBlogDto, UpdateBlogDto } from './dto';
import { CommonService } from '../common/common.service';
import { PrismaService } from '../prisma/prisma.service';
import { Blog } from '@prisma/client';

@Injectable()
export class BlogsService {
  constructor(
    private prisma: PrismaService,
    private common: CommonService,
  ) {}

  async getAllBlog(): Promise<Blog[]> {
    const blogs = await this.prisma.blog.findMany();

    return blogs;
  }

  async getBlogById(blogId: number): Promise<Blog> {
    const blog = await this.findBlogById(blogId);

    return blog;
  }

  async createBlog(userId: number = 1, dto: CreateBlogDto): Promise<Blog> {
    const blog = await this.prisma.blog.create({
      data: {
        title: dto.title,
        content: dto.content,
        author: userId,
      },
    });

    return blog;
  }

  async updateBlogById(userId: number = 1, blogId: number, dto: UpdateBlogDto): Promise<Blog> {
    await this.findBlogById(blogId);

    return await this.prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBlogById(userId: number = 1, blogId: number): Promise<Blog> {
    await this.findBlogById(blogId);

    return await this.prisma.blog.delete({
      where: {
        id: blogId,
      },
    });
  }

  // handling local file upload
  // async upload(file: Express.Multer.File) {
  //   try {
  //     return {
  //       originalname: file.originalname,
  //       filename: file.filename,
  //       size: file.size,
  //       mimetype: file.mimetype,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async viewCkeditorBlog(blogId: number): Promise<Blog> {
    const blog = await this.findBlogById(blogId);

    return blog;
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    try {
      const result = await this.common.uploadFile(file, 'blogs');
      return result;
    } catch (error) {
      console.error({ error });
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  private async findBlogById(blogId: number): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!blog)
      throw new NotFoundException(`Blog with id : ${blogId} not found`);

    return blog;
  }
}
