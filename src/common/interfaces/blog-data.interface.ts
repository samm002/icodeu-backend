import { Blog, User } from '@prisma/client';

export interface BlogData extends Blog {
  author: User;
}
