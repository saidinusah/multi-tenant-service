import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { AppExceptionFilter } from "./filters/base.filter";
import { NotificationProcessor } from "./jobs/notification.job";
import { MembersModule } from "./members/member.module";
import { RoleModule } from "./roles/roles.module";
import { UserModule } from "./users/user.module";
import { validate } from "./utils/env.validation";
import { PackagesModule } from "./packages/packages.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: process.env.REDIS_PORT as unknown as number,
      },
    }),

    UserModule,
    RoleModule,
    AuthModule,
    MembersModule,
    PackagesModule,
  ],
  controllers: [],
  providers: [
    NotificationProcessor,
    { provide: APP_FILTER, useClass: AppExceptionFilter },
  ],
})
export class AppModule {}
