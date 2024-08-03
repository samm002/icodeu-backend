import { User } from "@prisma/client";

export interface UserRole extends User {
  role: {
    name: string;
  };
}