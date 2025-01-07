import { Module } from "@nestjs/common";
import { OTPService } from "src/services/otp.service";
import { PrismaService } from "src/services/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CacheModule } from "@nestjs/cache-manager";
import { JwtService } from "@nestjs/jwt";
import { BullModule } from "@nestjs/bull";
import { QueueNames } from "../utils/constants";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, OTPService, JwtService],
  imports: [
    CacheModule.register(),
    BullModule.registerQueue({
      name: QueueNames.NOTIFICATION,
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
  ],
})
export class AuthModule {}
