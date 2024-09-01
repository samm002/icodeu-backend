import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BlogData } from '../../common/interfaces';

export class ResponseBlogDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  constructor(blog: BlogData) {
    this.id = blog.id;
    this.title = blog.title;
    this.slug = blog.slug;
    this.content = blog.content;
    this.author = blog.author.name;
    this.createdAt = blog.createdAt;
    this.updatedAt = blog.updatedAt;
  }
}
