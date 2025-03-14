import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { NotificationProcessor } from "./jobs/notification.job";
import { RoleModule } from "./roles/roles.module";
import { UserModule } from "./users/user.module";
import { validate } from "./utils/env.validation";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { AppExceptionFilter } from "./filters/base.filter";
import { MembersModule } from "./members/member.module";
import { SubscriptionModule } from "./subscriptions/subscriptions.module";
import { AuthGuard } from "./auth/guards/auth.guard";

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
    SubscriptionModule,
  ],
  controllers: [],
  providers: [
    NotificationProcessor,
    // { provide: APP_FILTER, useClass: AppExceptionFilter },
  ],
})
export class AppModule {}
