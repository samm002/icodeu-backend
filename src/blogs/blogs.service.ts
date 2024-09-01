import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from '@prisma/client';

import { CreateBlogDto, ResponseBlogDto, UpdateBlogDto } from './dto';
import { CommonService } from '../common/common.service';
import { PrismaService } from '../prisma/prisma.service';
import { BlogData } from '../common/interfaces';

@Injectable()
export class BlogsService {
  constructor(
    private prisma: PrismaService,
    private common: CommonService,
  ) {}

  async getAllBlog(): Promise<ResponseBlogDto[]> {
    const blogs = await this.prisma.blog.findMany({
      include: {
        author: true,
      },
    });

    return blogs.map((blog) => new ResponseBlogDto(blog));
  }

  async getBlogById(blogId: number): Promise<ResponseBlogDto> {
    const blog = await this.findBlogById(blogId);

    return blog;
  }

  async createBlog(
    userId: number,
    dto: CreateBlogDto,
  ): Promise<ResponseBlogDto> {
    const blog = await this.prisma.blog.create({
      data: {
        title: dto.title,
        slug: this.common.generateSlug(dto.title),
        content: dto.content,
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    return new ResponseBlogDto(blog);
  }

  async updateBlogById(
    userId: number = 1,
    blogId: number,
    dto: UpdateBlogDto,
  ): Promise<Blog> {
    const blog = await this.findBlogById(blogId);

    return await this.prisma.blog.update({
      where: {
        id: blog.id,
      },
      data: {
        slug: dto.title ? this.common.generateSlug(dto.title) : blog.slug,
        ...dto,
      },
    });
  }

  async deleteBlogById(userId: number = 1, blogId: number): Promise<Blog> {
    const blog = await this.findBlogById(blogId);

    return await this.prisma.blog.delete({
      where: {
        id: blog.id,
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

  // async viewCkeditorBlog(blogId: number): Promise<BlogData> {
  //   const blog = await this.findBlogById(blogId);

  //   return blog;
  // }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    try {
      const result = await this.common.uploadFile(file, 'blogs');
      return result;
    } catch (error) {
      console.error({ error });
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  private async findBlogById(blogId: number): Promise<ResponseBlogDto> {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      include: {
        author: true,
      },
    });

    if (!blog)
      throw new NotFoundException(`Blog with id : ${blogId} not found`);

    return new ResponseBlogDto(blog);
  }
}
