import { SetMetadata } from "@nestjs/common";
import { Roles as RoleNames } from "@prisma/client";

export const ROLES_KEY = "roles";
export const ROles = (...roles: RoleNames[]) => SetMetadata(ROLES_KEY, roles);
