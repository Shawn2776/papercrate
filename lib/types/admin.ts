// lib > types > admin.ts

import { User } from "@prisma/client";

export interface AdminUserState {
  filter: string;
  page: number;
  pageSize: number;
}

export interface AdminUser extends User {
  memberships: {
    tenantId: string;
    role: string;
  }[];
}
