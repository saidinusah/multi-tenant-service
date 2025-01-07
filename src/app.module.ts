import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { OrganizationModule } from "./organizations/organization.module";
import { RoleModule } from "./roles/roles.module";
import { UserModule } from "./users/user.module";
import { BullModule } from "@nestjs/bull";
import { QueueNames } from "./utils/constants";

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: QueueNames.NOTIFICATION,
    }),

    UserModule,
    RoleModule,
    OrganizationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
