import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/services/prisma.service";
import { PackagesService } from "src/subscriptions/packages.service";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";

@Module({
  controllers: [MembersController],
  providers: [JwtService, MembersService, PrismaService, PackagesService],
})
export class MembersModule {}
