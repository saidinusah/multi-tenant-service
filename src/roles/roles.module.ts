import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { PrismaService } from "src/services/prisma.service";

@Module({
  controllers: [RolesController],
  providers: [RolesService, PrismaService],
})
export class RoleModule {}
