import { Module } from "@nestjs/common";

import { PrismaService } from "src/services/prisma.service";
import { PackagesController } from "./packages.controller";
import { PackagesService } from "./packages.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, PrismaService, JwtService],
})
export class PackagesModule {}
