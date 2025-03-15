import { Module } from "@nestjs/common";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";
import { PrismaService } from "src/services/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [MembersController],
  providers: [JwtService, MembersService, PrismaService],
})
export class MembersModule {}
