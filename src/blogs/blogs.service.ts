import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async getAllBlog() {
    const blogs = await this.prisma.blog.findMany();

    return blogs;
  }

  async getBlogById(blogId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!blog)
      throw new NotFoundException(`Blog with id : ${blogId} not found`);

    return blog;
  }

  async createBlog(userId: number = 1, dto: CreateBlogDto) {
    const blog = await this.prisma.blog.create({
      data: {
        title: dto.title,
        content: dto.content,
        author: userId,
      },
    });

    return blog;
  }

  async updateBlogById(userId: number = 1, blogId: number, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        id: blogId,
        author: userId,
      },
    });

    if (!blog)
      throw new NotFoundException(`Blog with id : ${blogId} not found`);

    return this.prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBlogById(userId: number = 1, blogId: number, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        id: blogId,
        author: userId,
      },
    });

    if (!blog)
      throw new NotFoundException(`Blog with id : ${blogId} not found`);

    return this.prisma.blog.delete({
      where: {
        id: blogId,
      },
    });
  }

  async upload(file: Express.Multer.File) {
    try {
      return {
        originalname: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      throw error;
    }
  }

  async viewCkeditorBlog(blogId: number) {
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
