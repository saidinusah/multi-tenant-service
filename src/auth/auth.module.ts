import { BullModule } from "@nestjs/bull";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OTPService } from "src/services/otp.service";
import { PrismaService } from "src/services/prisma.service";
import { QueueNames } from "../utils/constants";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/users/user.module";
import { OrganizationModule } from "src/organizations/organization.module";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    OTPService,
    JwtService,
    // NotificationProcessor,
  ],
  imports: [
    CacheModule.register(),
    BullModule.registerQueue({
      name: QueueNames.NOTIFICATION,
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT as unknown as number,
      },
      defaultJobOptions: {
        attempts: 2,
        priority: 1,
        removeOnFail: true,
      },
    }),
  ],
})
export class AuthModule {}
